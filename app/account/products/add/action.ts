"use server"
import { db, eq, tables } from "@/database";
import { UserRole, Visibility } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult, EditedProcessedProductData, ProcessedProductData } from "@/types";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { inArray } from "drizzle-orm";
import { extractPublicId } from "@/lib/server/utils";
const ipBucket = new RefillingTokenBucket<string>(3, 10);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
})
export async function createNewCategoryAction(category: string): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }
  if (!category || category.trim() === "") {
    return {
      errorMessage: "Category name cannot be empty",
      message: null,
    };
  }
  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return {
      errorMessage: "Only admins can create categories",
      message: null,
    };
  }
  try {
    await db.insert(tables.category).values({
      name: category.trim(),
    });
    if (clientIP !== null) {
      ipBucket.consume(clientIP, 1);
    }
    return {
      message: 'Category added successfully',
      errorMessage: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorMessage: error.message,
        message: null,
      }
    }
    return {
      errorMessage: "Failed to create category",
      message: null,
    };
  }
}
export async function addNewProductAction(data: ProcessedProductData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }
  const { user } = await getCurrentSession();
  if (user?.role !== UserRole.ADMIN) {
    return {
      errorMessage: "Only admins can add products",
      message: null,
    };
  }
  let createdProductId: string | null = null;
  try {
    if (clientIP !== null) {
      ipBucket.consume(clientIP, 1);
    }
    const price = data.price ? parseFloat(data.price.toString()) : 0;
    if (isNaN(price) || price < 0) {
      return {
        errorMessage: "Invalid price",
        message: null,
      };
    }
    const [product] = await db.insert(tables.product).values({
      name: data.name,
      price: "" + price.toFixed(2),
      category_id: data.category,
      description: data.description,
      visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
      has_variants: data.hasVariants
    }).returning();
    createdProductId = product.id;
    if (data.hasVariants && Array.isArray(data.variants)) {
      const variantsData = data.variants.map(variant => ({
        product_id: product.id,
        title: variant.title,
      }));
      const insertedVariants = await db
        .insert(tables.variants)
        .values(variantsData)
        .returning();
      const generatedVariantsData = insertedVariants.flatMap(variant => {
        const matchingInput = data.variants!.find(v => v.title === variant.title);
        if (!matchingInput || !Array.isArray(matchingInput.values)) return [];
        return matchingInput.values.map(value => ({
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
    if (Array.isArray(data.images) && data.images.length > 0) {
      const imageUrls = await Promise.all(
        data.images.map(
          (image) =>
            new Promise<string>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                  if (error || !result) {
                    return reject(new Error(error?.message || "Image upload failed"));
                  }
                  resolve(result.secure_url);
                }
              );
              image.file.arrayBuffer()
                .then((arrayBuffer) => {
                  const buffer = Buffer.from(arrayBuffer);
                  uploadStream.end(buffer);
                })
                .catch(reject);
            })
        )
      );
      const imageData = imageUrls.map((url) => ({
        product_id: product.id,
        url,
      }));
      await db.insert(tables.images).values(imageData);
    }
    return {
      message: 'Product added successfully',
      errorMessage: null,
    };
  } catch (error) {
    if (createdProductId !== null) {
      try {
        await db.delete(tables.product).where(eq(tables.product.id, createdProductId));
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    if (error instanceof Error) {
      return {
        errorMessage: error.message,
        message: null,
      };
    }
    return {
      errorMessage: "Failed to add product",
      message: null,
    };
  }
}
export async function editProductAction(data: EditedProcessedProductData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null }
  }
  const clientIP = (await headers()).get("X-Forwarded-For")
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null }
  }
  const { user } = await getCurrentSession()
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can edit products", message: null }
  }
  try {
    if (clientIP !== null) ipBucket.consume(clientIP, 1)
    const priceNum = Number.isFinite(data.price) ? Number(data.price) : NaN
    if (isNaN(priceNum) || priceNum < 0) {
      return { errorMessage: "Invalid price", message: null }
    }
    const uploadCloudinaryBuffer = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(new Error(error?.message || "Image upload failed"))
            resolve(result.secure_url)
          }
        )
        file.arrayBuffer()
          .then(buf => stream.end(Buffer.from(buf)))
          .catch(reject)
      })
    await db.transaction(async tx => {
      await tx.update(tables.product)
        .set({
          name: data.name,
          price: priceNum.toFixed(2),
          category_id: data.category,
          description: data.description,
          visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
          has_variants: data.hasVariants,
        })
        .where(eq(tables.product.id, data.id))
      if (data.hasVariants) {
        await tx.delete(tables.variants).where(eq(tables.variants.product_id, data.id))
        if (Array.isArray(data.variants) && data.variants.length > 0) {
          const toInsert = data.variants.map(v => ({
            product_id: data.id,
            title: v.title,
          }))
          const inserted = await tx.insert(tables.variants).values(toInsert).returning({ id: tables.variants.id, title: tables.variants.title })
          const genRows = inserted.flatMap(iv => {
            const src = data.variants!.find(v => v.title === iv.title)
            if (!src) return []
            return src.values.map(val => ({
              variant_id: iv.id,
              name: val.name,
              price: Number(val.price).toFixed(2),
              sku: val.sku,
              inventory: Number.isFinite(val.inventory) ? val.inventory : 0,
            }))
          })
          if (genRows.length > 0) {
            await tx.insert(tables.generatedVariants).values(genRows)
          }
        }
      } else {
        await tx.delete(tables.variants).where(eq(tables.variants.product_id, data.id))
      }
      if (Array.isArray(data.images)) {
        const current = await tx.select({ id: tables.images.id, url: tables.images.url })
          .from(tables.images)
          .where(eq(tables.images.product_id, data.id))
        const currentById = new Map(current.map(i => [i.id, i]))
        const currentByUrl = new Map(current.map(i => [i.url, i]))
        const keepIds = new Set<string>()
        for (const img of data.images) {
          if (!img.file) {
            if (img.id && currentById.has(img.id)) {
              keepIds.add(img.id)
            } else if (img.preview && currentByUrl.has(img.preview)) {
              keepIds.add(currentByUrl.get(img.preview)!.id)
            }
          }
        }
        const toDelete = current.filter(i => !keepIds.has(i.id))
        if (toDelete.length > 0) {
          await tx.delete(tables.images).where(inArray(tables.images.id, toDelete.map(i => i.id)))
        }
        const newFiles = data.images.filter(i => i.file instanceof File)
        if (newFiles.length > 0) {
          const urls = await Promise.all(newFiles.map(i => uploadCloudinaryBuffer(i.file!)))
          const rows = urls.map(url => ({ product_id: data.id, url }))
          if (rows.length > 0) await tx.insert(tables.images).values(rows)
        }
      }
    })
    return { message: "Product updated successfully", errorMessage: null }
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message, message: null }
    }
    return { errorMessage: "Failed to update product", message: null }
  }
}
export async function deleteProductAction(productIds: string[]): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null }
  }
  const clientIP = (await headers()).get("X-Forwarded-For")
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null }
  }
  const { user } = await getCurrentSession()
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can delete products", message: null }
  }
  try {
    if (clientIP !== null) ipBucket.consume(clientIP, 1)
    const imagesToDelete = await db
      .select({ url: tables.images.url })
      .from(tables.images)
      .where(inArray(tables.images.product_id, productIds))
    await db.transaction(async tx => {
      await tx.delete(tables.product).where(inArray(tables.product.id, productIds))
    })
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (img: { url: string; }) => {
          const publicId = extractPublicId(img.url)
          if (!publicId) return Promise.resolve()
          try {
            return await cloudinary.uploader.destroy(publicId);
          } catch {
            return null;
          }
        })
      )
    }
    return { message: "Products deleted successfully", errorMessage: null }
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message, message: null }
    }
    return { errorMessage: "Failed to delete products", message: null }
  }
}
