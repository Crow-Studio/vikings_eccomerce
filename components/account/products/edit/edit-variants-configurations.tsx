import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditVariantsConfigurationsProps } from "@/types";
import TagInput from "../add/TagInput";
export default function EditVariantsConfigurations({
  form,
  hasVariants,
  fields,
  append,
  variantCombinations,
  remove,
  isUpdatingProduct,
}: EditVariantsConfigurationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hasVariants"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <div>
                <p className="font-medium">This product has variants</p>
                <p className="text-xs text-muted-foreground">
                  Enable if your product comes in different sizes, colors, etc.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isUpdatingProduct}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {hasVariants && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="variant-options">
              <AccordionTrigger>
                <span className="font-medium">Product Options</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Define options like color, size, material, etc. Each
                    combination will create a variant.
                  </p>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-sm">
                            Option {index + 1}
                          </h5>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                            disabled={isUpdatingProduct}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Input
                              placeholder="e.g., Color, Size, Material"
                              {...form.register(`variants.${index}.title`)}
                              className="text-sm"
                              disabled={isUpdatingProduct}
                            />
                            {form.formState.errors.variants?.[index]?.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  form.formState.errors.variants[index].title
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <Controller
                              control={form.control}
                              name={`variants.${index}.values`}
                              disabled={isUpdatingProduct}
                              render={({ field: { value = [], onChange } }) => (
                                <TagInput
                                  tags={Array.isArray(value) ? value : []}
                                  onChange={onChange}
                                  placeholder="Type a value and press Enter"
                                />
                              )}
                            />
                            {form.formState.errors.variants?.[index]
                              ?.values && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  form.formState.errors.variants[index].values
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ title: "", values: [] })}
                      className="w-full"
                      disabled={isUpdatingProduct}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            {variantCombinations.length > 0 && (
              <AccordionItem value="generated-variants">
                <AccordionTrigger>
                  <span className="font-medium">
                    Generated Variants ({variantCombinations.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Configure pricing and inventory for each variant
                      combination.
                    </p>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {variantCombinations.map((combo, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">
                              {combo.name}
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(combo.attributes).map(
                                ([key, value]) => (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {key}: {value}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs font-medium">
                                Price
                              </label>
                              <Input
                                placeholder={`${form.watch("price")} (base)`}
                                {...form.register(
                                  `generatedVariants.${index}.price`
                                )}
                                disabled={isUpdatingProduct}
                                className="text-sm"
                                type="number"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">SKU</label>
                              <Input
                                placeholder="SKU-001"
                                {...form.register(
                                  `generatedVariants.${index}.sku`
                                )}
                                disabled={isUpdatingProduct}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">
                                Stock
                              </label>
                              <Input
                                placeholder="0"
                                type="number"
                                {...form.register(
                                  `generatedVariants.${index}.inventory`
                                )}
                                disabled={isUpdatingProduct}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
