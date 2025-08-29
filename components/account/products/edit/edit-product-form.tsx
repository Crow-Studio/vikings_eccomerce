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
import {
  editProductAction,
} from "@/app/account/products/add/action";
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

  const [isUpdatingProduct, setIsAddingProduct] = useState(false);

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
    setIsAddingProduct(true);
    const processedData = {
      ...values,
      price: values.price ? parseFloat(values.price.toString()) : 0,
      variants: hasVariants
        ? (() => {
            const grouped: Record<
              string,
              { name: string; price: string; sku: string; inventory: number }[]
            > = {};
            values.generatedVariants?.forEach((variant) => {
              Object.entries(variant.attributes).forEach(
                ([attrName, attrValue]) => {
                  if (!grouped[attrName]) grouped[attrName] = [];
                  grouped[attrName].push({
                    name: attrValue,
                    price: variant.price ? variant.price : values.price,
                    sku: variant.sku!,
                    inventory: variant.inventory
                      ? parseInt(variant.inventory)
                      : 0,
                  });
                }
              );
            });
            return Object.entries(grouped).map(([title, values]) => ({
              title,
              values,
            }));
          })()
        : null,
      id: product.id,
    };

    console.log("processedData", processedData);

    const { message, errorMessage } = await editProductAction(processedData);

    if (errorMessage) {
      setIsAddingProduct(false);
      return toast.error(errorMessage, {
        position: "top-center",
      });
    }

    setIsAddingProduct(false);
    form.reset();
    toast.success(message, {
      position: "top-center",
    });
    router.refresh();

    return router.push("/account/products/all");
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
