import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/server/user";
import { X } from "lucide-react";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
interface Props {
  isUpdatingProfile: boolean;
  user: User;
  setSelectedProfileImage: Dispatch<SetStateAction<string | null>>;
  selectedProfileImage: string | null;
}
export default function ProfileAvatar({
  user,
  isUpdatingProfile,
  setSelectedProfileImage,
  selectedProfileImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, setSelectedProfileImage]);
  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedProfileImage(null);
  };
  return (
    <div className="flex shrink-0 items-center space-y-1">
      <div className="flex flex-col items-center justify-between">
        <div className="relative">
          <div className="size-14 overflow-hidden relative">
            <Image
              src={previewUrl ? previewUrl : user.avatar}
              alt={user.username}
              fill
              className="absolute inset-0 size-full rounded-full border border-purple-200 object-cover"
            />
          </div>
          {selectedProfileImage && (
            <Button
              disabled={isUpdatingProfile}
              size="icon"
              variant="destructive"
              className="absolute -right-1 -top-1 size-6 rounded-full border-2 border-background"
              aria-label="Remove image"
              onClick={() => handleRemove()}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        <Label
          htmlFor="img_profile"
          className="cursor-pointer pt-1 text-sm font-medium hover:text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={isUpdatingProfile}
            className="hidden"
          />
        </Label>
      </div>
    </div>
  );
}
