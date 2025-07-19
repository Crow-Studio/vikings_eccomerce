"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addProductFormSchema } from "@/types/products/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import TagInput from "./TagInput";

export default function AddNewProductForm() {
  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      hasVariants: false,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function onSubmit(values: z.infer<typeof addProductFormSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="flex items-center justify-between">
          <h2>Add New Product</h2>
          <Button type="submit" size="sm" className="cursor-pointer">
            Save Product
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="-mt-3 space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div>
                          <Input {...field} />
                          <div className="my-2 text-xs">
                            <p className="text-muted-foreground">
                              Give your product a short and clear title.
                            </p>
                            <p className="text-muted-foreground">
                              50-60 characters is the recommended length for
                              search engines.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div>
                          <Input {...field} />
                          <div className="my-2 text-xs">
                            <p className="text-muted-foreground">
                              Set a base price for this product.
                            </p>
                            <p className="text-muted-foreground">
                              This price applies when no variant-specific price
                              is defined.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div>
                          <Textarea maxLength={4} {...field} />
                          <div className="my-2 text-xs">
                            <p className="text-muted-foreground">
                              Give your product a detail and clear description.
                            </p>
                            <p className="text-muted-foreground">
                              50-255 characters is the recommended length for
                              search engines.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 -mt-3">
                {/* Toggle */}
                <FormField
                  control={form.control}
                  name="hasVariants"
                  render={({ field }) => (
                    <FormItem className="flex justify-between items-center">
                      <div>
                        <p>Yes, this is a product with variants</p>
                        <p className="text-xs text-muted-foreground">
                          When unchecked, we will create a default variant for
                          you.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Variant Fields */}
                {form.watch("hasVariants") && (
                  <div>
                    <h4 className="font-medium">Product options</h4>
                    <p className="text-xs text-muted-foreground">
                      Define the options for the product, e.g. color, size, etc.
                    </p>

                    <div className="space-y-4 mt-2">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                          <div className="flex flex-col gap-1 flex-1">
                            <Input
                              placeholder="Title (e.g. Color)"
                              {...form.register(`variants.${index}.title`)}
                            />
                            {form.formState.errors.variants?.[index]?.title && (
                              <p className="text-red-500 text-xs">
                                {
                                  form.formState.errors.variants[index].title
                                    ?.message
                                }
                              </p>
                            )}

                            {/* TAG INPUT */}
                            <Controller
                              control={form.control}
                              name={`variants.${index}.values`}
                              render={({ field: { value = [], onChange } }) => (
                                <TagInput
                                  tags={Array.isArray(value) ? value : []}
                                  onChange={onChange}
                                  placeholder="Enter values and press Enter"
                                />
                              )}
                            />
                            {form.formState.errors.variants?.[index]
                              ?.values && (
                              <p className="text-red-500 text-sm">
                                {
                                  form.formState.errors.variants[index].values
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ title: "", values: [] })}
                      >
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
