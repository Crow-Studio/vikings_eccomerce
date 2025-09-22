"use server"
import { db, eq, tables } from "@/database";
import { UserRole, Visibility } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult, EditedProcessedProductData, ProcessedProductData } from "@/types";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";
import * as Minio from "minio";
import crypto from "crypto";
import sharp from "sharp";

// MinIO Configuration
const minioEndpoint = process.env.MINIO_ENDPOINT as string;
const bucket = process.env.MINIO_BUCKET as string

console.log(minioEndpoint, bucket)

const minioClient = new Minio.Client({
  endPoint: minioEndpoint,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Optimized image configuration to reduce payload sizes
interface SizeConfig {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality: number;
  fit: 'cover' | 'inside' | 'contain' | 'fill' | 'outside';
}

const IMAGE_OPTIMIZATION_CONFIG = {
  sizes: {
    thumbnail: { width: 300, height: 300, quality: 75, fit: 'cover' as const },
    medium: { width: 600, height: 600, quality: 80, fit: 'cover' as const },
    large: { width: 1200, height: 1200, quality: 85, fit: 'inside' as const },
    original: { maxWidth: 1600, maxHeight: 1600, quality: 85, fit: 'inside' as const } // Reduced from 2000px
  } as Record<string, SizeConfig>,
  supportedFormats: ['jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff', 'gif'],
  outputFormat: 'webp' as const,
  maxFileSize: 5 * 1024 * 1024, // Reduced to 5MB per file
  maxTotalSize: 25 * 1024 * 1024, // 25MB total per request
  maxImages: 6, // Reduced from unlimited to 6 images per request
  compression: {
    webp: {
      quality: 75, // Reduced quality for better compression
      effort: 4,   // Reduced effort for faster processing
      progressive: true,
      nearLossless: false,
    },
    jpeg: {
      quality: 80, // Reduced quality
      progressive: true,
      mozjpeg: true,
    }
  }
};

interface OptimizedImageResult {
  buffer: Buffer;
  contentType: string;
  key: string;
  url: string;
  size: number;
  width: number;
  height: number;
}

// Enhanced validation function
function validateImageUpload(files: { file: File }[]): string | null {
  if (files.length > IMAGE_OPTIMIZATION_CONFIG.maxImages) {
    return `Too many images. Maximum ${IMAGE_OPTIMIZATION_CONFIG.maxImages} images allowed per request.`;
  }

  const totalSize = files.reduce((sum, { file }) => sum + file.size, 0);
  if (totalSize > IMAGE_OPTIMIZATION_CONFIG.maxTotalSize) {
    const maxMB = Math.round(IMAGE_OPTIMIZATION_CONFIG.maxTotalSize / (1024 * 1024));
    return `Total file size too large. Maximum ${maxMB}MB allowed per request.`;
  }

  for (const { file } of files) {
    if (file.size > IMAGE_OPTIMIZATION_CONFIG.maxFileSize) {
      const maxMB = Math.round(IMAGE_OPTIMIZATION_CONFIG.maxFileSize / (1024 * 1024));
      return `File ${file.name} is too large. Maximum ${maxMB}MB per file.`;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !IMAGE_OPTIMIZATION_CONFIG.supportedFormats.includes(fileExtension)) {
      return `Unsupported image format: ${fileExtension}. Supported formats: ${IMAGE_OPTIMIZATION_CONFIG.supportedFormats.join(', ')}`;
    }
  }

  return null;
}

// Enhanced image optimization function with better error handling
async function optimizeImage(
  file: File,
  size: keyof typeof IMAGE_OPTIMIZATION_CONFIG.sizes,
  productId: string,
  index: number = 0
): Promise<OptimizedImageResult> {
  console.log(`Optimizing ${file.name} for size: ${size}`);

  const config = IMAGE_OPTIMIZATION_CONFIG.sizes[size];
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Additional validation
  if (inputBuffer.length === 0) {
    throw new Error(`File ${file.name} appears to be empty`);
  }

  let sharpInstance = sharp(inputBuffer);

  try {
    // Get and validate metadata
    const metadata = await sharpInstance.metadata();
    console.log(`Original: ${metadata.width}x${metadata.height}, format: ${metadata.format}, size: ${Math.round(inputBuffer.length / 1024)}KB`);

    if (!metadata.width || !metadata.height) {
      throw new Error(`Invalid image dimensions for ${file.name}`);
    }

    // Skip processing if image is already smaller than target
    const needsProcessing = size === 'original' 
      ? (metadata.width > (config.maxWidth || 1600) || metadata.height > (config.maxHeight || 1600))
      : (metadata.width > (config.width || 600) || metadata.height > (config.height || 600));

    if (!needsProcessing && size !== 'thumbnail' && size !== 'medium') {
      // For small images, just convert format without resizing
      sharpInstance = sharp(inputBuffer);
    } else {
      // Apply transformations based on size
      if (size === 'original') {
        const needsResize = metadata.width > (config.maxWidth || 1600) || metadata.height > (config.maxHeight || 1600);
        if (needsResize) {
          sharpInstance = sharpInstance.resize(config.maxWidth, config.maxHeight, {
            fit: config.fit,
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          });
        }
      } else {
        // For specific sizes, resize with the configured fit strategy
        sharpInstance = sharpInstance.resize(config.width, config.height, {
          fit: config.fit,
          position: 'center',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });
      }
    }

    // Apply light sharpening only for resized images
    if (needsProcessing) {
      sharpInstance = sharpInstance.sharpen({ sigma: 0.5, m1: 0.8, m2: 3 });
    }

    // Convert to optimized format
    let optimizedBuffer: Buffer;
    let contentType: string;

    if (IMAGE_OPTIMIZATION_CONFIG.outputFormat === 'webp') {
      optimizedBuffer = await sharpInstance
        .webp(IMAGE_OPTIMIZATION_CONFIG.compression.webp)
        .toBuffer();
      contentType = 'image/webp';
    } else {
      optimizedBuffer = await sharpInstance
        .jpeg(IMAGE_OPTIMIZATION_CONFIG.compression.jpeg)
        .toBuffer();
      contentType = 'image/jpeg';
    }

    // Get final dimensions
    const finalMetadata = await sharp(optimizedBuffer).metadata();
    const sizeReduction = Math.round((inputBuffer.length - optimizedBuffer.length) / inputBuffer.length * 100);
    
    console.log(
      `Optimized ${file.name}: ${Math.round(inputBuffer.length/1024)}KB → ${Math.round(optimizedBuffer.length/1024)}KB ` +
      `(${sizeReduction}% reduction), dimensions: ${finalMetadata.width}x${finalMetadata.height}`
    );

    // Generate unique key with timestamp for cache busting
    const timestamp = Date.now();
    const extension = IMAGE_OPTIMIZATION_CONFIG.outputFormat;
    const key = `products/${productId}/${size}/${timestamp}-${index}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const url = `https://${minioEndpoint}/${bucket}/${key}`;

    return {
      buffer: optimizedBuffer,
      contentType,
      key,
      url,
      size: optimizedBuffer.length,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
    };

  } catch (sharpError) {
    console.error(`Sharp processing error for ${file.name}:`, sharpError);
    throw new Error(`Failed to process image ${file.name}: ${sharpError instanceof Error ? sharpError.message : 'Image processing failed'}`);
  }
}

// Optimized batch processing with sequential uploads to reduce memory pressure
async function processAndUploadImages(
  files: { file: File }[],
  productId: string
): Promise<Array<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}>> {
  console.log(`Processing ${files.length} images for product ${productId}`);

  if (files.length === 0) {
    return [];
  }

  // Validate total upload size
  const validationError = validateImageUpload(files);
  if (validationError) {
    throw new Error(validationError);
  }

  const results = [];

  // Process images sequentially to reduce memory pressure and avoid timeouts
  for (let index = 0; index < files.length; index++) {
    const { file } = files[index];
    console.log(`Processing image ${index + 1}/${files.length}: ${file.name} (${Math.round(file.size / 1024)}KB)`);

    try {
      // Process all sizes sequentially instead of concurrently to reduce memory usage
      console.log(`  Creating thumbnail...`);
      const thumbnail = await optimizeImage(file, 'thumbnail', productId, index);
      
      console.log(`  Creating medium size...`);
      const medium = await optimizeImage(file, 'medium', productId, index);
      
      console.log(`  Creating large size...`);
      const large = await optimizeImage(file, 'large', productId, index);
      
      console.log(`  Creating original size...`);
      const original = await optimizeImage(file, 'original', productId, index);

      // Upload all sizes with proper headers
      console.log(`  Uploading all sizes...`);
      const sizesToUpload = [
        { data: thumbnail, size: 'thumbnail' },
        { data: medium, size: 'medium' },
        { data: large, size: 'large' },
        { data: original, size: 'original' },
      ];

      // Upload sequentially to avoid overwhelming the server
      for (const { data, size } of sizesToUpload) {
        const metadata = {
          'Content-Type': data.contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Disposition': 'inline',
          'X-Image-Size': size,
          'X-Original-Name': file.name,
        };

        await minioClient.putObject(
          bucket,
          data.key,
          data.buffer,
          data.buffer.length,
          metadata
        );
      }

      console.log(`  Image ${index + 1} uploaded successfully in all sizes`);

      results.push({
        thumbnail: thumbnail.url,
        medium: medium.url,
        large: large.url,
        original: original.url,
      });

    } catch (error) {
      console.error(`Error processing image ${index + 1} (${file.name}):`, error);
      throw new Error(`Failed to process image ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`All ${results.length} images processed and uploaded successfully`);
  return results;
}

// Helper to extract MinIO object key from URL
function extractMinIOKey(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    if (pathname.startsWith(`/${bucket}/`)) {
      return pathname.slice(bucket.length + 2);
    }
    return null;
  } catch {
    return null;
  }
}

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function createNewCategoryAction(category: string): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null };
  }

  if (!category || category.trim() === "") {
    return { errorMessage: "Category name cannot be empty", message: null };
  }

  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can create categories", message: null };
  }

  try {
    await db.insert(tables.category).values({
      name: category.trim(),
    });

    if (clientIP !== null) {
      ipBucket.consume(clientIP, 1);
    }

    return { message: "Category added successfully", errorMessage: null };
  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to create category",
      message: null,
    };
  }
}

export async function addNewProductAction(data: ProcessedProductData): Promise<ActionResult> {
  console.log('Starting addNewProductAction with data:', {
    name: data.name,
    price: data.price,
    category: data.category,
    hasVariants: data.hasVariants,
    imagesCount: Array.isArray(data.images) ? data.images.length : 0,
    variantsCount: Array.isArray(data.variants) ? data.variants.length : 0
  });

  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can add products", message: null };
  }

  // Validate images before processing
  if (Array.isArray(data.images) && data.images.length > 0) {
    const validationError = validateImageUpload(data.images);
    if (validationError) {
      return { errorMessage: validationError, message: null };
    }
  }

  let createdProductId: string | null = null;

  try {
    if (clientIP !== null) {
      ipBucket.consume(clientIP, 1);
    }

    const price = data.price ? parseFloat(data.price.toString()) : 0;
    if (isNaN(price) || price < 0) {
      return { errorMessage: "Invalid price", message: null };
    }

    // Create product
    console.log('Creating product in database...');
    const [product] = await db.insert(tables.product).values({
      name: data.name,
      price: price.toFixed(2),
      category_id: data.category,
      description: data.description,
      visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
      has_variants: data.hasVariants,
    }).returning();

    createdProductId = product.id;
    console.log('Product created with ID:', createdProductId);

    // Handle variants
    if (data.hasVariants && Array.isArray(data.variants) && data.variants.length > 0) {
      console.log('Processing variants...');

      const variantsData = data.variants.map((variant) => ({
        product_id: product.id,
        title: variant.title,
      }));

      const insertedVariants = await db
        .insert(tables.variants)
        .values(variantsData)
        .returning();

      const generatedVariantsData = insertedVariants.flatMap((variant) => {
        const matchingInput = data.variants!.find((v) => v.title === variant.title);
        if (!matchingInput || !Array.isArray(matchingInput.values)) return [];

        return matchingInput.values.map((value) => ({
          variant_id: variant.id,
          name: value.name,
          price: value.price,
          sku: value.sku,
          inventory: value.inventory ?? 0,
        }));
      });

      if (generatedVariantsData.length > 0) {
        await db.insert(tables.generatedVariants).values(generatedVariantsData);
      }
    }

    // Handle optimized image uploads
    if (Array.isArray(data.images) && data.images.length > 0) {
      console.log('Processing and optimizing images...');

      try {
        const optimizedImages = await processAndUploadImages(data.images, product.id);

        // Store image URLs using the new JSON schema
        const imageData = optimizedImages.map((urls, index) => ({
          product_id: product.id,
          url: urls.original, // Primary URL for backward compatibility
          urls: {
            thumbnail: urls.thumbnail,
            medium: urls.medium,
            large: urls.large,
            original: urls.original,
          },
          alt_text: `${data.name} - Image ${index + 1}`,
        }));

        await db.insert(tables.images).values(imageData);
        console.log('Optimized image records inserted');

      } catch (imageError) {
        console.error('Error processing images:', imageError);
        throw imageError;
      }
    }

    const imageCount = data.images?.length || 0;
    return {
      message: `Product "${data.name}" added successfully${imageCount > 0 ? ` with ${imageCount} optimized images` : ''}`,
      errorMessage: null,
    };

  } catch (error) {
    console.error('Error in addNewProductAction:', error);

    // Cleanup on error
    if (createdProductId !== null) {
      try {
        await db.delete(tables.product).where(eq(tables.product.id, createdProductId));
        console.log('Product cleanup completed');
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }

    return {
      errorMessage: error instanceof Error ? error.message : "Failed to add product",
      message: null,
    };
  }
}

// Enhanced edit function with better image handling
export async function editProductAction(data: EditedProcessedProductData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can edit products", message: null };
  }

  // Validate new images if any
  if (Array.isArray(data.images)) {
    const newFiles = data.images
      .filter((i): i is { file: File; id: string; preview: string } => i.file instanceof File)
      .map(item => ({ file: item.file }));
    
    if (newFiles.length > 0) {
      const validationError = validateImageUpload(newFiles);
      if (validationError) {
        return { errorMessage: validationError, message: null };
      }
    }
  }

  try {
    if (clientIP !== null) ipBucket.consume(clientIP, 1);

    const priceNum = Number.isFinite(data.price) ? Number(data.price) : NaN;
    if (isNaN(priceNum) || priceNum < 0) {
      return { errorMessage: "Invalid price", message: null };
    }

    await db.transaction(async (tx) => {
      // Update product
      await tx
        .update(tables.product)
        .set({
          name: data.name,
          price: priceNum.toFixed(2),
          category_id: data.category,
          description: data.description,
          visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
          has_variants: data.hasVariants,
        })
        .where(eq(tables.product.id, data.id));

      // Handle variants
      if (data.hasVariants) {
        await tx.delete(tables.variants).where(eq(tables.variants.product_id, data.id));

        if (Array.isArray(data.variants) && data.variants.length > 0) {
          const toInsert = data.variants.map((v) => ({
            product_id: data.id,
            title: v.title,
          }));

          const inserted = await tx
            .insert(tables.variants)
            .values(toInsert)
            .returning({ id: tables.variants.id, title: tables.variants.title });

          const genRows = inserted.flatMap((iv) => {
            const src = data.variants!.find((v) => v.title === iv.title);
            if (!src) return [];

            return src.values.map((val) => ({
              variant_id: iv.id,
              name: val.name,
              price: Number(val.price).toFixed(2),
              sku: val.sku,
              inventory: Number.isFinite(val.inventory) ? val.inventory : 0,
            }));
          });

          if (genRows.length > 0) {
            await tx.insert(tables.generatedVariants).values(genRows);
          }
        }
      } else {
        await tx.delete(tables.variants).where(eq(tables.variants.product_id, data.id));
      }

      // Handle images with new schema
      if (Array.isArray(data.images)) {
        const current = await tx
          .select({
            id: tables.images.id,
            url: tables.images.url,
            urls: tables.images.urls
          })
          .from(tables.images)
          .where(eq(tables.images.product_id, data.id));

        const currentById = new Map(current.map((i) => [i.id, i]));
        const currentByUrl = new Map(current.map((i) => [i.url, i]));
        const keepIds = new Set<string>();

        // Identify images to keep
        for (const img of data.images) {
          if (!img.file) {
            if (img.id && currentById.has(img.id)) {
              keepIds.add(img.id);
            } else if (img.preview && currentByUrl.has(img.preview)) {
              keepIds.add(currentByUrl.get(img.preview)!.id);
            }
          }
        }

        // Delete removed images from database and MinIO
        const toDelete = current.filter((i) => !keepIds.has(i.id));
        if (toDelete.length > 0) {
          await tx.delete(tables.images).where(inArray(tables.images.id, toDelete.map((i) => i.id)));

          // Delete from MinIO
          const deletePromises = toDelete.flatMap((img) => {
            const urls = img.urls as any;
            const allUrls = [
              img.url,
              urls?.thumbnail,
              urls?.medium,
              urls?.large,
              urls?.original
            ].filter(Boolean);

            return allUrls.map(async (url) => {
              const key = extractMinIOKey(url);
              if (key) {
                try {
                  await minioClient.removeObject(bucket, key);
                } catch (error) {
                  console.warn(`Could not delete ${key}:`, error);
                }
              }
            });
          });

          await Promise.allSettled(deletePromises);
        }

        // Process new files
        const newFiles = data.images
          .filter((i): i is { file: File; id: string; preview: string } =>
            i.file instanceof File
          )
          .map(item => ({ file: item.file }));

        if (newFiles.length > 0) {
          console.log('Processing new images for edit...');
          const optimizedImages = await processAndUploadImages(newFiles, data.id);

          const rows = optimizedImages.map((urls, index) => ({
            product_id: data.id,
            url: urls.original,
            urls: {
              thumbnail: urls.thumbnail,
              medium: urls.medium,
              large: urls.large,
              original: urls.original,
            },
            alt_text: `${data.name} - Image ${index + 1}`,
          }));

          if (rows.length > 0) {
            await tx.insert(tables.images).values(rows);
          }
        }
      }
    });

    return {
      message: "Product updated successfully",
      errorMessage: null
    };
  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to update product",
      message: null,
    };
  }
}

export async function deleteProductAction(productIds: string[]): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can delete products", message: null };
  }

  try {
    if (clientIP !== null) ipBucket.consume(clientIP, 1);

    // Get all images to delete
    const imagesToDelete = await db
      .select({
        url: tables.images.url,
        urls: tables.images.urls,
      })
      .from(tables.images)
      .where(inArray(tables.images.product_id, productIds));

    // Delete products (cascading will handle related records)
    await db.transaction(async (tx) => {
      await tx.delete(tables.product).where(inArray(tables.product.id, productIds));
    });

    // Delete images from MinIO
    if (imagesToDelete.length > 0) {
      console.log(`Deleting ${imagesToDelete.length} images from MinIO...`);

      const deletePromises = imagesToDelete.flatMap((img) => {
        const urls = img.urls as any;
        const allUrls = [
          img.url,
          urls?.thumbnail,
          urls?.medium,
          urls?.large,
          urls?.original
        ].filter(Boolean);

        return allUrls.map(async (url) => {
          const key = extractMinIOKey(url);
          if (key) {
            try {
              await minioClient.removeObject(bucket, key);
              console.log(`Deleted: ${key}`);
            } catch (error) {
              console.warn(`Could not delete: ${key}`, error);
            }
          }
        });
      });

      await Promise.allSettled(deletePromises);
    }

    return {
      message: "Products and all associated images deleted successfully",
      errorMessage: null
    };
  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to delete products",
      message: null,
    };
  }
}

// Batch upload action for handling large image sets
export async function uploadImageBatchAction(data: {
  productId: string;
  images: { file: File }[];
  batchIndex: number;
}): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null };
  }

  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can upload images", message: null };
  }

  try {
    // Validate batch
    const validationError = validateImageUpload(data.images);
    if (validationError) {
      return { errorMessage: validationError, message: null };
    }

    console.log(`Processing image batch ${data.batchIndex + 1} with ${data.images.length} images`);
    
    const optimizedImages = await processAndUploadImages(data.images, data.productId);

    // Store image URLs
    const imageData = optimizedImages.map((urls, index) => ({
      product_id: data.productId,
      url: urls.original,
      urls: {
        thumbnail: urls.thumbnail,
        medium: urls.medium,
        large: urls.large,
        original: urls.original,
      },
      alt_text: `Product Image - Batch ${data.batchIndex + 1}, Image ${index + 1}`,
    }));

    await db.insert(tables.images).values(imageData);

    return {
      message: `Batch ${data.batchIndex + 1} uploaded successfully (${data.images.length} images)`,
      errorMessage: null,
    };

  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to upload image batch",
      message: null,
    };
  }
}

// Test MinIO connection function
export async function testMinIOConnection(): Promise<ActionResult> {
  try {
    console.log('🔍 Testing MinIO connection...');

    // Test if bucket exists
    const bucketExists = await minioClient.bucketExists(bucket);
    console.log('📦 Bucket exists:', bucketExists);

    if (!bucketExists) {
      console.log('❌ Bucket does not exist');
      return {
        errorMessage: `Bucket '${bucket}' does not exist`,
        message: null,
      };
    }

    // Try to list objects (just to test connection)
    const stream = minioClient.listObjects(bucket, 'test/', false);
    let objectCount = 0;

    await new Promise((resolve, reject) => {
      stream.on('data', () => objectCount++);
      stream.on('error', reject);
      stream.on('end', resolve);
    });

    console.log('✅ MinIO connection test successful');
    return {
      message: `MinIO connection successful. Bucket exists and is accessible.`,
      errorMessage: null,
    };

  } catch (error) {
    console.error('❌ MinIO connection test failed:', error);
    return {
      errorMessage: `MinIO connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      message: null,
    };
  }
}