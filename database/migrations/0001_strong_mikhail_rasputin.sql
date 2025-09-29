ALTER TABLE "products" DROP CONSTRAINT "products_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_name_unique" UNIQUE("name");