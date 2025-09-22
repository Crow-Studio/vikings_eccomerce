import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProductSettingsProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditCategorySelector from "./edit-category-selector";
export default function EditProductSettings({ form, categories, isUpdatingProduct }: EditProductSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2">
                <FormLabel>Visibility Status *</FormLabel>
                <FormControl>
                  <div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isUpdatingProduct}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <p>
                  Active products are visible to customers. Inactive products
                  are hidden.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <FormControl>
                <div>
                  <EditCategorySelector
                    value={field.value}
                    onChange={field.onChange}
                    categories={categories}
                    isUpdatingProduct={isUpdatingProduct}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>
                      Select an existing category or add a new one using the +
                      button.
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
  );
}
