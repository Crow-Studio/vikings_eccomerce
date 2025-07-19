import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductImagesProps } from "@/types";
import ImageUpload from "./ImageUpload";

export default function ProductImages({ form }: ProductImagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images *</FormLabel>
              <FormControl>
                <div>
                  <ImageUpload
                    images={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.images?.message}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>
                      Upload high-quality images of your product. The first
                      image will be used as the main image.
                    </p>
                    <p>
                      Supported formats: PNG, JPG, JPEG (max 5MB each, up to
                      6 images)
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
