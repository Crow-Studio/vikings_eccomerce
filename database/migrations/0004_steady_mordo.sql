ALTER TABLE "images" DROP CONSTRAINT "images_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;