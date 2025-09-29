import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import sharp from "sharp";
import * as Minio from "minio";

// MinIO Configuration
export const minioEndpoint = process.env.MINIO_ENDPOINT as string;
export const bucket = process.env.MINIO_BUCKET as string


export const minioClient = new Minio.Client({
  endPoint: minioEndpoint,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}
export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}

export function extractPublicId(url: string): string | null {
  try {
    const parts = url.split("/")
    const filename = parts[parts.length - 1]
    return filename.split(".")[0]
  } catch {
    return null
  }
}

export function validateImageUpload(files: { file: File }[]): string | null {
  if (files.length > IMAGE_OPTIMIZATION_CONFIG.maxImages) {
    return `Too many images. Maximum ${IMAGE_OPTIMIZATION_CONFIG.maxImages} images allowed per request.`;
  }

  const totalSize = files.reduce((sum, { file }) => sum + (file?.size || 0), 0);
  if (totalSize > IMAGE_OPTIMIZATION_CONFIG.maxTotalSize) {
    const maxMB = Math.round(IMAGE_OPTIMIZATION_CONFIG.maxTotalSize / (1024 * 1024));
    return `Total file size too large. Maximum ${maxMB}MB allowed per request.`;
  }

  for (const { file } of files) {
    // Check if file exists and has required properties
    if (!file || !file.name || !file.size) {
      return `Invalid file data. Files must be valid File objects with name and size properties.`;
    }

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

export const IMAGE_OPTIMIZATION_CONFIG = {
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

export interface SizeConfig {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality: number;
  fit: 'cover' | 'inside' | 'contain' | 'fill' | 'outside';
}

export async function processAndUploadImages(
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

    // Additional validation for each file
    if (!file || !file.name || !file.size) {
      throw new Error(`Invalid file data at index ${index}`);
    }

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

export async function optimizeImage(
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
      `Optimized ${file.name}: ${Math.round(inputBuffer.length / 1024)}KB → ${Math.round(optimizedBuffer.length / 1024)}KB ` +
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

export interface OptimizedImageResult {
  buffer: Buffer;
  contentType: string;
  key: string;
  url: string;
  size: number;
  width: number;
  height: number;
}