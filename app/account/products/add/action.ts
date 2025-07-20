"use server"

import { db, eq, tables } from "@/database";
import { UserRole, Visibility } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult, ProcessedProductData } from "@/types";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

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

        // Consume token after successful operation
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

        // add new product to the database
        const [product] = await db.insert(tables.product).values({
            name: data.name,
            price: "" + price.toFixed(2),
            category_id: data.category,
            description: data.description,
            visibility: data.visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
            has_variants: data.hasVariants
        }).returning();

        createdProductId = product.id;

        // create variants and generated variants if they exist
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

        // handle image uploads
        if (Array.isArray(data.images) && data.images.length > 0) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
                api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
            });
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
        // Cleanup: Delete the product if it was created
        if (createdProductId !== null) {
            try {
                await db.delete(tables.product).where(eq(tables.product.id, createdProductId));
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
                // Log the cleanup error but don't change the original error response
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