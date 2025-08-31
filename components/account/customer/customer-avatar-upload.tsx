import { useEffect, useState } from "react";
import { CircleUserRoundIcon, XIcon, RefreshCwIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function getRandomDicebearAvatar() {
  const seed = Math.random().toString(36).substring(2, 10);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

interface CustomerAvatarUploadProps {
  value?: string | File | null | undefined;
  onChange?: (value: string | File | null) => void;
  isAddingCustomer: boolean
}

export default function CustomerAvatarUpload({
  value,
  onChange,
  isAddingCustomer
}: CustomerAvatarUploadProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const [randomAvatar, setRandomAvatar] = useState<string | null>(null);

  useEffect(() => {
    console.log(getRandomDicebearAvatar())
    setRandomAvatar(getRandomDicebearAvatar());
  }, []);

  useEffect(() => {
    if (files[0]?.file) {
      onChange?.(files[0].file as File);
    } else if (randomAvatar && !value) {
      onChange?.(randomAvatar);
    }
  }, [files, randomAvatar, onChange, value]);

  const handleRegenerate = () => {
    const newAvatar = getRandomDicebearAvatar();
    setRandomAvatar(newAvatar);
    if (!files[0]) {
      onChange?.(newAvatar);
    }
  };

  const handleRemove = () => {
    if (files[0]) {
      removeFile(files[0].id);
    }
    onChange?.(randomAvatar || null);
  };

  let previewUrl: string | null = null;

  if (files[0]) {
    previewUrl = files[0].preview || null;
  } else if (typeof value === "string" && value) {
    previewUrl = value;
  } else if (randomAvatar) {
    previewUrl = randomAvatar;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative inline-flex">
        <Button
          type="button"
          variant="outline"
          className="relative size-16 overflow-hidden p-0 shadow-none rounded-full"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
          disabled={isAddingCustomer}
        >
          {previewUrl ? (
            <Image
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </Button>
        {(files[0] ||
          (typeof value === "string" && value !== randomAvatar)) && (
          <Button
            type="button"
            onClick={handleRemove}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
            disabled={isAddingCustomer}
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
          disabled={isAddingCustomer}
        />
      </div>

      <div className="flex items-center gap-2">
        <p
          aria-live="polite"
          role="region"
          className="text-muted-foreground text-xs"
        >
          Click the avatar to change image
        </p>
        {!files[0] && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRegenerate}
            aria-label="Regenerate avatar"
            disabled={isAddingCustomer}
          >
            <RefreshCwIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
