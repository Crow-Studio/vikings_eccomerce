"use server"

import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { bucket, minioClient } from "@/lib/server/utils";

const ipBucket = new RefillingTokenBucket<string>(3, 10)

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