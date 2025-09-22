import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
interface ImageUploadProps {
  images: Array<{
    id: string;
    file: File;
    preview: string;
  }>;
  onChange: (
    images: Array<{
      id: string;
      file: File;
      preview: string;
    }>
  ) => void;
  error?: string;
  isAddingProduct: boolean;
}
export default function ImageUpload({
  images,
  onChange,
  error,
  isAddingProduct,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 6;
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: Array<{ id: string; file: File; preview: string }> = [];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Unsupported file type: ${file.name}`, {
          position: "top-center",
        });
        return;
      }
      if (file.size > maxSize) {
        toast.error(`File too large (max ${maxSizeMB}MB): ${file.name}`, {
          position: "top-center",
        });
        return;
      }
      if (images.length + validFiles.length >= maxFiles) {
        toast.error(`Maximum of ${maxFiles} images allowed`, {
          position: "top-center",
        });
        return;
      }
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      validFiles.push({ id, file, preview });
    }
    if (validFiles.length) {
      onChange([...images, ...validFiles]);
    }
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(dragCounter + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCounter = dragCounter - 1;
    setDragCounter(newCounter);
    if (newCounter === 0) {
      setIsDragging(false);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);
    if (isAddingProduct) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const openFileDialog = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/png,image/jpeg,image/jpg";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFiles(target.files);
    };
    input.click();
  };
  const removeFile = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    onChange(updatedImages);
  };
  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-input relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors ${
          isDragging ? "bg-accent/50" : ""
        } ${images.length > 0 ? "" : "justify-center"} ${
          error ? "border-red-500" : ""
        }`}
      >
        {images.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Product Images ({images.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={images.length >= maxFiles && isAddingProduct}
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add more
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-accent relative size-[8rem] rounded-md"
                >
                  {index === 0 && (
                    <div className="absolute top-1 left-1 z-10">
                      <Badge variant="secondary" className="text-xs">
                        Main
                      </Badge>
                    </div>
                  )}
                  <Image
                    src={image.preview}
                    alt={image.file ? image.file.name : "Product Image"}
                    className="size-full rounded-[inherit] object-cover"
                    fill
                  />
                  <Button
                    type="button"
                    onClick={() => removeFile(image.id)}
                    disabled={isAddingProduct}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG or JPEG (max. {maxSizeMB}MB)
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={openFileDialog}
              disabled={isAddingProduct}
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
