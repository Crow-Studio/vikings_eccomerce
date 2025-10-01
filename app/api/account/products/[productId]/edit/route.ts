import { UserRole, Visibility } from "@/database/schema"
import { RefillingTokenBucket } from "@/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/lib/server/request"
import { getCurrentSession } from "@/lib/server/session"
import {
    validateImageUpload,
    processAndUploadImages,
    minioClient,
    bucket,
    extractMinIOKey
} from "@/lib/server/utils"
import { db, tables } from "@/database"
import { eq, inArray } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

const ipBucket = new RefillingTokenBucket<string>(3, 10)

export async function POST(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json(
                { errorMessage: 'Product ID is required', message: null },
                { status: 400 }
            )
        }

        if (!(await globalPOSTRateLimit())) {
            return NextResponse.json(
                { errorMessage: "Too many requests", message: null },
                { status: 429 }
            )
        }

        const headersList = await headers()
        const clientIP = headersList.get("x-forwarded-for")
        if (clientIP && !ipBucket.check(clientIP, 1)) {
            return NextResponse.json(
                { errorMessage: "Too many requests", message: null },
                { status: 429 }
            )
        }

        const { user } = await getCurrentSession()
        if (user?.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { errorMessage: "Only admins can edit products", message: null },
                { status: 403 }
            )
        }

        const formData = await request.formData()

        const name = formData.get('name') as string
        const price = formData.get('price') as string
        const category = formData.get('category') as string
        const description = formData.get('description') as string
        const visibility = formData.get('visibility') as string
        const hasVariants = formData.get('hasVariants') === 'true'

        if (!name || !price || !category) {
            return NextResponse.json(
                { errorMessage: "Name, price, and category are required", message: null },
                { status: 400 }
            )
        }

        const variantsJson = formData.get('variants') as string
        const variants = variantsJson ? JSON.parse(variantsJson) : []

        const imagesJson = formData.get('images') as string
        const imagesData = imagesJson ? JSON.parse(imagesJson) : []

        const newImageFiles: { file: File }[] = []
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('image_file_') && value instanceof File && value.size > 0) {
                newImageFiles.push({ file: value })
            }
        }

        const existingImages = imagesData.filter((img: any) => !img.file && (img.id || img.preview))

        if (newImageFiles.length > 0) {
            const validationError = validateImageUpload(newImageFiles)
            if (validationError) {
                return NextResponse.json(
                    { errorMessage: validationError, message: null },
                    { status: 400 }
                )
            }
        }

        if (clientIP) {
            ipBucket.consume(clientIP, 1)
        }

        const priceNum = parseFloat(price)
        if (isNaN(priceNum) || priceNum < 0) {
            return NextResponse.json(
                { errorMessage: "Invalid price", message: null },
                { status: 400 }
            )
        }

        await db.transaction(async (tx) => {
            await tx
                .update(tables.product)
                .set({
                    name,
                    price: priceNum.toFixed(2),
                    category_id: category,
                    description,
                    visibility: visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
                    has_variants: hasVariants,
                    updated_at: new Date(),
                })
                .where(eq(tables.product.id, productId))

            // Handle variants
            if (hasVariants) {
                // Delete existing variants first
                await tx.delete(tables.variants).where(eq(tables.variants.product_id, productId))

                if (Array.isArray(variants) && variants.length > 0) {
                    const toInsert = variants.map((v: any) => ({
                        product_id: productId,
                        title: v.title,
                    }))

                    const inserted = await tx
                        .insert(tables.variants)
                        .values(toInsert)
                        .returning({ id: tables.variants.id, title: tables.variants.title })

                    const genRows = inserted.flatMap((iv) => {
                        const src = variants.find((v: any) => v.title === iv.title)
                        if (!src) return []

                        return src.values.map((val: any) => ({
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
                // Remove variants if product no longer has variants
                await tx.delete(tables.variants).where(eq(tables.variants.product_id, productId))
            }

            // Handle images
            const current = await tx
                .select({
                    id: tables.images.id,
                    url: tables.images.url,
                    urls: tables.images.urls
                })
                .from(tables.images)
                .where(eq(tables.images.product_id, productId))

            const currentById = new Map(current.map((i) => [i.id, i]))
            const currentByUrl = new Map(current.map((i) => [i.url, i]))
            const keepIds = new Set<string>()

            // Identify images to keep based on existingImages array
            for (const img of existingImages) {
                if (img.id && currentById.has(img.id)) {
                    keepIds.add(img.id)
                } else if (img.preview && currentByUrl.has(img.preview)) {
                    keepIds.add(currentByUrl.get(img.preview)!.id)
                }
            }

            // Delete removed images from database and MinIO
            const toDelete = current.filter((i) => !keepIds.has(i.id))
            if (toDelete.length > 0) {
                await tx.delete(tables.images).where(inArray(tables.images.id, toDelete.map((i) => i.id)))

                // Delete from MinIO
                const deletePromises = toDelete.flatMap((img) => {
                    const urls = img.urls as any
                    const allUrls = [
                        img.url,
                        urls?.thumbnail,
                        urls?.medium,
                        urls?.large,
                        urls?.original
                    ].filter(Boolean)

                    return allUrls.map(async (url) => {
                        const key = extractMinIOKey(url)
                        if (key) {
                            try {
                                await minioClient.removeObject(bucket, key)
                            } catch (error) {
                                console.warn(`Could not delete ${key}:`, error)
                            }
                        }
                    })
                })

                await Promise.allSettled(deletePromises)
            }

            // Process and upload new images
            if (newImageFiles.length > 0) {
                console.log('Processing new images for edit...')
                const optimizedImages = await processAndUploadImages(newImageFiles, productId)

                const rows = optimizedImages.map((urls, index) => ({
                    product_id: productId,
                    url: urls.original,
                    urls: {
                        thumbnail: urls.thumbnail,
                        medium: urls.medium,
                        large: urls.large,
                        original: urls.original,
                    },
                    alt_text: `${name} - Image ${index + 1}`,
                }))

                if (rows.length > 0) {
                    await tx.insert(tables.images).values(rows)
                }
            }
        })

        return NextResponse.json({
            message: "Product updated successfully",
            errorMessage: null
        }, { status: 200 })

    } catch (error) {
        console.error('Error in edit product:', error)
        return NextResponse.json({
            errorMessage: error instanceof Error ? error.message : "Failed to update product",
            message: null,
        }, { status: 500 })
    }
}