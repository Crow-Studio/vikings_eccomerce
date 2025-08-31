import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneralInformationProps } from "@/types";
export default function GeneralInformation({
  form,
  isAddingProduct,
}: GeneralInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <div>
                  <Input
                    {...field}
                    placeholder="Enter product name"
                    disabled={isAddingProduct}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>Give your product a short and clear title.</p>
                    <p>50-60 characters is recommended for SEO.</p>
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
              <FormLabel>Base Price *</FormLabel>
              <FormControl>
                <div>
                  <Input
                    {...field}
                    placeholder="0.00"
                    type="number"
                    min={1}
                    disabled={isAddingProduct}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>Set a base price for this product.</p>
                    <p>Variants can override this price or inherit it.</p>
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <div>
                  <Textarea
                    {...field}
                    placeholder="Describe your product..."
                    className="min-h-[100px]"
                    disabled={isAddingProduct}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>Provide a detailed and clear description.</p>
                    <p>150-300 characters is recommended for SEO.</p>
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
