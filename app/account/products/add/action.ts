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
console.log('minio-access-key', process.env.MINIO_ACCESS_KEY)
console.log('minio-secret-key', process.env.MINIO_SECRET_KEY)

const minioClient = new Minio.Client({
  endPoint: minioEndpoint,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Enhanced image optimization configuration
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
    thumbnail: { width: 300, height: 300, quality: 85, fit: 'cover' as const },
    medium: { width: 600, height: 600, quality: 90, fit: 'cover' as const },
    large: { width: 1200, height: 1200, quality: 95, fit: 'inside' as const },
    original: { maxWidth: 2000, maxHeight: 2000, quality: 95, fit: 'inside' as const }
  } as Record<string, SizeConfig>,
  supportedFormats: ['jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff', 'gif'],
  outputFormat: 'webp' as const,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  compression: {
    webp: {
      quality: 85,
      effort: 6,
      progressive: true,
      nearLossless: false,
    },
    jpeg: {
      quality: 90,
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

// Enhanced image optimization function
async function optimizeImage(
  file: File,
  size: keyof typeof IMAGE_OPTIMIZATION_CONFIG.sizes,
  productId: string,
  index: number = 0
): Promise<OptimizedImageResult> {
  console.log(`🖼️ Optimizing ${file.name} for size: ${size}`);

  const config = IMAGE_OPTIMIZATION_CONFIG.sizes[size];
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Validate file size
  if (inputBuffer.length > IMAGE_OPTIMIZATION_CONFIG.maxFileSize) {
    throw new Error(
      `Image ${file.name} is too large. Maximum size is ${IMAGE_OPTIMIZATION_CONFIG.maxFileSize / (1024 * 1024)
      }MB`
    );
  }

  // Validate file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !IMAGE_OPTIMIZATION_CONFIG.supportedFormats.includes(fileExtension)) {
    throw new Error(`Unsupported image format: ${fileExtension}`);
  }

  let sharpInstance = sharp(inputBuffer);

  // Get and validate metadata
  const metadata = await sharpInstance.metadata();
  console.log(`📐 Original: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  if (!metadata.width || !metadata.height) {
    throw new Error(`Invalid image dimensions for ${file.name}`);
  }

  // Apply transformations based on size
  if (size === 'original') {
    // For original, only resize if larger than max dimensions
    const needsResize =
      metadata.width > (config.maxWidth || 2000) ||
      metadata.height > (config.maxHeight || 2000);

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

  // Apply sharpening for better quality
  sharpInstance = sharpInstance.sharpen();

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

  const sizeReduction = ((inputBuffer.length - optimizedBuffer.length) / inputBuffer.length * 100);
  console.log(
    `✅ Optimized: ${inputBuffer.length} → ${optimizedBuffer.length} bytes ` +
    `(${sizeReduction.toFixed(1)}% reduction), dimensions: ${finalMetadata.width}x${finalMetadata.height}`
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
}

// Batch process images with improved error handling
async function processAndUploadImages(
  files: { file: File }[],
  productId: string
): Promise<Array<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}>> {
  console.log(`🚀 Processing ${files.length} images for product ${productId}`);

  if (files.length === 0) {
    return [];
  }

  const results = [];

  for (let index = 0; index < files.length; index++) {
    const { file } = files[index];
    console.log(`📸 Processing image ${index + 1}/${files.length}: ${file.name}`);

    try {
      // Process all sizes concurrently
      const [thumbnail, medium, large, original] = await Promise.all([
        optimizeImage(file, 'thumbnail', productId, index),
        optimizeImage(file, 'medium', productId, index),
        optimizeImage(file, 'large', productId, index),
        optimizeImage(file, 'original', productId, index),
      ]);

      // Upload all sizes concurrently with proper headers
      console.log(`☁️ Uploading 4 sizes for image ${index + 1}`);
      const uploadPromises = [
        { data: thumbnail, size: 'thumbnail' },
        { data: medium, size: 'medium' },
        { data: large, size: 'large' },
        { data: original, size: 'original' },
      ].map(async ({ data, size }) => {
        const metadata = {
          'Content-Type': data.contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Disposition': 'inline',
          'X-Image-Size': size,
          'X-Original-Name': file.name,
        };

        return minioClient.putObject(
          bucket,
          data.key,
          data.buffer,
          data.buffer.length,
          metadata
        );
      });

      await Promise.all(uploadPromises);

      console.log(`✅ Image ${index + 1} uploaded in all sizes`);

      results.push({
        thumbnail: thumbnail.url,
        medium: medium.url,
        large: large.url,
        original: original.url,
      });

    } catch (error) {
      console.error(`❌ Error processing image ${index + 1} (${file.name}):`, error);
      throw new Error(`Failed to process image ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`🎉 All ${results.length} images processed and uploaded successfully`);
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
  console.log('🚀 Starting addNewProductAction with data:', {
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
    console.log('📦 Creating product in database...');
    const [product] = await db.insert(tables.product).values({
      name: data.name,
      price: price.toFixed(2),
      category_id: data.category,
      description: data.description,
      visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
      has_variants: data.hasVariants,
    }).returning();

    createdProductId = product.id;
    console.log('✅ Product created with ID:', createdProductId);

    // Handle variants
    if (data.hasVariants && Array.isArray(data.variants) && data.variants.length > 0) {
      console.log('🔄 Processing variants...');

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

    // Handle optimized image uploads with new schema
    if (Array.isArray(data.images) && data.images.length > 0) {
      console.log('🖼️ Processing and optimizing images...');

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
        console.log('✅ Optimized image records inserted');

      } catch (imageError) {
        console.error('❌ Error processing images:', imageError);
        throw imageError;
      }
    }

    return {
      message: `Product added successfully with ${data.images?.length || 0} optimized images`,
      errorMessage: null,
    };

  } catch (error) {
    console.error('❌ Error in addNewProductAction:', error);

    // Cleanup on error
    if (createdProductId !== null) {
      try {
        await db.delete(tables.product).where(eq(tables.product.id, createdProductId));
        console.log('🧹 Product cleanup completed');
      } catch (cleanupError) {
        console.error("❌ Error during cleanup:", cleanupError);
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

        // Process new files - filter to only include items with valid File objects
        const newFiles = data.images
          .filter((i): i is { file: File; id: string; preview: string } =>
            i.file instanceof File
          )
          .map(item => ({ file: item.file }));

        if (newFiles.length > 0) {
          console.log('🖼️ Processing new images for edit...');
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
      message: "Product updated successfully with optimized images",
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
      console.log(`🗑️ Deleting ${imagesToDelete.length} images from MinIO...`);

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
              console.log(`✅ Deleted: ${key}`);
            } catch (error) {
              console.warn(`⚠️ Could not delete: ${key}`, error);
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