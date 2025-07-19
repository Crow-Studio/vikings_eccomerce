"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { addProductFormSchema } from "@/types/products/form";
import { generateSKU, generateVariantCombinations } from "@/lib/product";
import GeneralInformation from "./GeneralInformation";
import VariantsConfigurations from "./VariantsConfigurations";
import ProductSettings from "./ProductSettings";
import ProductImages from "./ProductImages";
import { Category } from "@/database/schema";

interface AddNewProductFormProps {
  categories: Category[];
}

export default function AddNewProductForm({
  categories,
}: AddNewProductFormProps) {
  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      visibility: "active",
      category: "",
      images: [],
      hasVariants: false,
      variants: [],
      generatedVariants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const hasVariants = form.watch("hasVariants");
  const variants = form.watch("variants") || [];

  const variantCombinations = generateVariantCombinations(variants);

  useEffect(() => {
    if (hasVariants) {
      const newGeneratedVariants = variantCombinations.map((combo) => ({
        name: combo.name,
        price: "",
        sku: generateSKU(form.watch("name"), combo.attributes),
        inventory: "",
        attributes: combo.attributes,
      }));
      form.setValue("generatedVariants", newGeneratedVariants);
    }
  }, [variantCombinations.length, hasVariants, form, variantCombinations]);

  function onSubmit(values: z.infer<typeof addProductFormSchema>) {
    console.log("Form Values:", values);

    const processedData = {
      ...values,
      price: values.price ? parseFloat(values.price.toString()) : 0,
      variants: hasVariants
        ? values.generatedVariants?.map((variant) => ({
            ...variant,
            price: variant.price,
            inventory: variant.inventory ? parseInt(variant.inventory) : 0,
          }))
        : null,
    };

    console.log("Processed Data:", processedData);
  }

  return (
    <Form {...form}>
      <div className="grid gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <Button
            type="button"
            size="sm"
            className="cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save Product
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-3 lg:gap-5">
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-2">
            <GeneralInformation form={form} />
            <ProductSettings categories={categories} form={form} />
          </div>
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-3">
            <VariantsConfigurations
              form={form}
              hasVariants={hasVariants}
              fields={fields}
              append={append}
              variantCombinations={variantCombinations}
              remove={remove}
            />
            <ProductImages form={form} />
          </div>
        </div>
      </div>
    </Form>
  );
}
