CREATE TABLE "generated_variants" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"variant_id" text NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"sku" varchar(50) NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"attributes" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "generated_variants" ADD CONSTRAINT "generated_variants_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;