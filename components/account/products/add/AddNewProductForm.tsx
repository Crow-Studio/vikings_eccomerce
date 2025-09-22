"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { addProductFormSchema } from "@/types/products/form";
import { generateSKU, generateVariantCombinations } from "@/lib/product";
import GeneralInformation from "./GeneralInformation";
import VariantsConfigurations from "./VariantsConfigurations";
import ProductSettings from "./ProductSettings";
import ProductImages from "./ProductImages";
import { Category } from "@/database/schema";
import { addNewProductAction } from "@/app/account/products/add/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
interface AddNewProductFormProps {
  categories: Category[];
}
export default function AddNewProductForm({
  categories,
}: AddNewProductFormProps) {
  const router = useRouter();
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
  const [isAddingProduct, setIsAddingProduct] = useState(false);
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
  
  async function onSubmit(values: z.infer<typeof addProductFormSchema>) {
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
    };
    const { message, errorMessage } = await addNewProductAction(processedData);
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
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <Button
            type="submit"
            size="sm"
            className="cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isAddingProduct}
          >
            {isAddingProduct && <Loader2 className="size-4 animate-spin" />}
            Save Product
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-3 lg:gap-5">
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-2">
            <GeneralInformation form={form} isAddingProduct={isAddingProduct} />
            <ProductSettings categories={categories} form={form} isAddingProduct={isAddingProduct} />
          </div>
          <div className="grid gap-y-3 self-start lg:col-span-2 2xl:col-span-3">
            <VariantsConfigurations
              form={form}
              hasVariants={hasVariants}
              fields={fields}
              append={append}
              variantCombinations={variantCombinations}
              remove={remove}
              isAddingProduct={isAddingProduct}
            />
            <ProductImages form={form} isAddingProduct={isAddingProduct} />
          </div>
        </div>
      </div>
    </Form>
  );
}
