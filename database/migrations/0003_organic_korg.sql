ALTER TABLE "generated_variants" DROP CONSTRAINT "generated_variants_variant_id_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "variants" DROP CONSTRAINT "variants_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "generated_variants" ADD CONSTRAINT "generated_variants_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_variants" DROP COLUMN "attributes";--> statement-breakpoint
ALTER TABLE "variants" DROP COLUMN "values";