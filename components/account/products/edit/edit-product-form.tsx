"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { editProductFormSchema } from "@/types/products/form";
import { generateSKU, generateVariantCombinations } from "@/lib/product";
import { Category } from "@/database/schema";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Link from "next/link";
import EditGeneralInformation from "./edit-general-information";
import EditProductSettings from "./edit-product-settings";
import EditVariantsConfigurations from "./edit-variants-configurations";
import EditProductImages from "./edit-product-images";
import { toast } from "sonner";

interface EditProductFormProps {
  categories: Category[];
  product: Product;
}

export default function EditProductForm({
  categories,
  product,
}: EditProductFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof editProductFormSchema>>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      visibility: product.visibility || "active",
      category: product.category_id || "",
      images:
        product.images.map((img) => ({
          id: img.id,
          preview: img.url,
          file: undefined,
        })) || [],
      hasVariants: product.has_variants || false,
      variants: [],
      generatedVariants: [],
    },
  });

  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  useEffect(() => {
    if (
      product.has_variants &&
      product.variants &&
      product.variants.length > 0
    ) {
      const existingVariants = product.variants.map((variant) => ({
        title: variant.title,
        values: variant.generatedVariants.map((value) => value.name),
      }));
      form.setValue("variants", existingVariants);
      form.setValue("hasVariants", true);

      const existingGeneratedVariants = product.variants.flatMap((variant) =>
        variant.generatedVariants.map((value) => ({
          name: value.name,
          price: value.price?.toString() || "",
          sku: value.sku || "",
          inventory: value.inventory?.toString() || "",
          attributes: { [variant.title]: value.name },
        }))
      );
      form.setValue("generatedVariants", existingGeneratedVariants);
    }
  }, [product, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const hasVariants = form.watch("hasVariants");
  const variants = form.watch("variants") || [];
  const variantCombinations = generateVariantCombinations(variants);

  useEffect(() => {
    if (hasVariants) {
      const newGeneratedVariants = variantCombinations.map((combo) => {
        const existing = form
          .getValues("generatedVariants")
          ?.find(
            (gv) =>
              JSON.stringify(gv.attributes) === JSON.stringify(combo.attributes)
          );
        return {
          name: combo.name,
          price: existing?.price || "",
          sku:
            existing?.sku || generateSKU(form.watch("name"), combo.attributes),
          inventory: existing?.inventory || "",
          attributes: combo.attributes,
        };
      });
      form.setValue("generatedVariants", newGeneratedVariants);
    }
  }, [variantCombinations.length, hasVariants, form, variantCombinations]);

  async function onSubmit(values: z.infer<typeof editProductFormSchema>) {
    setIsUpdatingProduct(true);

    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("category", values.category);
      formData.append("description", values.description || "");
      formData.append("visibility", values.visibility);
      formData.append("hasVariants", values.hasVariants.toString());

      if (
        hasVariants &&
        values.generatedVariants &&
        values.generatedVariants.length > 0
      ) {
        const grouped: Record<
          string,
          { name: string; price: string; sku: string; inventory: number }[]
        > = {};

        values.generatedVariants.forEach((variant) => {
          Object.entries(variant.attributes).forEach(
            ([attrName, attrValue]) => {
              if (!grouped[attrName]) grouped[attrName] = [];
              grouped[attrName].push({
                name: attrValue,
                price: variant.price ? variant.price : values.price,
                sku: variant.sku!,
                inventory: variant.inventory ? parseInt(variant.inventory) : 0,
              });
            }
          );
        });

        const processedVariants = Object.entries(grouped).map(
          ([title, values]) => ({
            title,
            values,
          })
        );

        formData.append("variants", JSON.stringify(processedVariants));
      } else {
        formData.append("variants", JSON.stringify([]));
      }

      const imagesForJson: any[] = [];
      let fileIndex = 0;

      for (const image of values.images) {
        if (image.file instanceof File) {
          formData.append(`image_file_${fileIndex}`, image.file);
          imagesForJson.push({ isNew: true, fileIndex });
          fileIndex++;
        } else {
          imagesForJson.push({
            id: image.id,
            preview: image.preview,
            isNew: false,
          });
        }
      }

      formData.append("images", JSON.stringify(imagesForJson));

      const response = await fetch(`/api/account/products/${product.id}/edit`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.errorMessage) {
        setIsUpdatingProduct(false);
        return toast.error(data.errorMessage || "Failed to update product", {
          position: "top-center",
        });
      }

      setIsUpdatingProduct(false);
      form.reset();
      toast.success(data.message || "Product updated successfully", {
        position: "top-center",
      });
      router.refresh();
      return router.push("/account/products/all");
    } catch (error) {
      setIsUpdatingProduct(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
        {
          position: "top-center",
        }
      );
    }
  }

  return (
    <Form {...form}>
      <div className="grid gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link href="/account/products/all">
              <ChevronLeft />
            </Link>
            <h2 className="text-2xl font-bold">Edit Product</h2>
          </div>
          <Button
            type="submit"
            size="sm"
            className="cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isUpdatingProduct}
          >
            {isUpdatingProduct && <Loader2 className="size-4 animate-spin" />}
            Update Product
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-3 lg:gap-5">
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-2">
            <EditGeneralInformation
              form={form}
              isUpdatingProduct={isUpdatingProduct}
            />
            <EditProductSettings
              categories={categories}
              form={form}
              isUpdatingProduct={isUpdatingProduct}
            />
          </div>
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-3">
            <EditVariantsConfigurations
              form={form}
              hasVariants={hasVariants}
              fields={fields}
              append={append}
              variantCombinations={variantCombinations}
              remove={remove}
              isUpdatingProduct={isUpdatingProduct}
            />
            <EditProductImages
              form={form}
              isUpdatingProduct={isUpdatingProduct}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}
