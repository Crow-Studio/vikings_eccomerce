import { db, tables } from "@/database"
import { UserRole, Visibility } from "@/database/schema"
import { RefillingTokenBucket } from "@/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/lib/server/request"
import { getCurrentSession } from "@/lib/server/session"
import { processAndUploadImages, validateImageUpload } from "@/lib/server/utils"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    let createdProductId: string | null = null;

    try {
        const ipBucket = new RefillingTokenBucket<string>(3, 10)

        // Parse FormData instead of JSON
        const formData = await request.formData()

        // Extract form fields
        const name = formData.get('name') as string
        const price = formData.get('price') as string
        const category = formData.get('category') as string
        const description = formData.get('description') as string
        const visibility = formData.get('visibility') as string
        const hasVariants = formData.get('hasVariants') === 'true'

        // Parse variants if they exist
        const variantsJson = formData.get('variants') as string
        const variants = variantsJson ? JSON.parse(variantsJson) : []

        // Extract image files
        const imageFiles: { file: File }[] = []
        let imageIndex = 0
        while (formData.has(`image_${imageIndex}`)) {
            const file = formData.get(`image_${imageIndex}`) as File
            if (file && file.size > 0) {
                imageFiles.push({ file })
            }
            imageIndex++
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
                { errorMessage: "Only admins can add products", message: null },
                { status: 403 }
            )
        }

        // Validate images if present
        if (imageFiles.length > 0) {
            const validationError = validateImageUpload(imageFiles);
            if (validationError) {
                return NextResponse.json(
                    { errorMessage: validationError, message: null },
                    { status: 400 }
                );
            }
        }

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        const new_price = price ? parseFloat(price.toString()) : 0;
        if (isNaN(new_price) || new_price < 0) {
            return NextResponse.json(
                { errorMessage: "Invalid price", message: null },
                { status: 400 }
            );
        }

        const [product] = await db.insert(tables.product).values({
            name: name,
            price: new_price.toFixed(2),
            category_id: category,
            description: description,
            visibility: visibility === "active" ? Visibility.ACTIVE : Visibility.INACTIVE,
            has_variants: hasVariants,
        }).returning();

        createdProductId = product.id;
        console.log('Product created with ID:', createdProductId);

        if (hasVariants && Array.isArray(variants) && variants.length > 0) {
            console.log('Processing variants...');

            const variantsData = variants.map((variant: any) => ({
                product_id: product.id,
                title: variant.title,
            }));

            const insertedVariants = await db
                .insert(tables.variants)
                .values(variantsData)
                .returning();

            const generatedVariantsData = insertedVariants.flatMap((variant) => {
                const matchingInput = variants!.find((v: any) => v.title === variant.title);
                if (!matchingInput || !Array.isArray(matchingInput.values)) return [];

                return matchingInput.values.map((value: any) => ({
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
        if (imageFiles.length > 0) {
            console.log('Processing and optimizing images...');

            try {
                const optimizedImages = await processAndUploadImages(imageFiles, product.id);

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
                    alt_text: `${name} - Image ${index + 1}`,
                }));

                await db.insert(tables.images).values(imageData);
                console.log('Optimized image records inserted');

            } catch (imageError) {
                console.error('Error processing images:', imageError);
                throw imageError;
            }
        }

        const imageCount = imageFiles.length;
        return NextResponse.json({
            message: `Product "${name}" added successfully${imageCount > 0 ? ` with ${imageCount} optimized images` : ''}`,
            errorMessage: null,
        }, { status: 201 });

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

        return NextResponse.json({
            errorMessage: error instanceof Error ? error.message : "Failed to add product",
            message: null,
        }, { status: 500 });
    }
}