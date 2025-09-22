"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "@/lib/server/user";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
interface Props {
  user: User;
}
const formSchema = z.object({
  first_name: z
    .string()
    .min(1, "Firstname is required")
    .max(100, "Firstname must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s-'']+$/,
      "Firstname can only contain letters, spaces, hyphens, and apostrophes"
    )
    .transform((name) => name.trim()),
  last_name: z
    .string()
    .min(1, "Lastname is required")
    .max(100, "Lastname must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s-'']+$/,
      "Lastname can only contain letters, spaces, hyphens, and apostrophes"
    )
    .transform((name) => name.trim()),
});
export function UserProfileForm({ user }: Props) {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const username = user?.username?.split(" ") as string[];
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
    },
  });
  const uploadImageToCloudinary = async (image: string): Promise<string> => {
    setIsUploadingImage(true);
    const res = await fetch("/api/image/upload", {
      method: "POST",
      body: JSON.stringify({
        image,
      }),
    });
    if (!res.ok) {
      setIsUploadingImage(false);
      throw new Error(res.statusText);
    }
    setIsUploadingImage(false);
    const result = await res.json();
    return result.url;
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUpdatingProfile(true);
    try {
      let avatar: string = user ? user.avatar : "";
      if (selectedProfileImage) {
        avatar = await uploadImageToCloudinary(selectedProfileImage);
      }
      const res = await fetch(`/api/auth/admin/profile/update`, {
        method: "PATCH",
        body: JSON.stringify({
          username: `${values.first_name} ${values.last_name}`,
          image: avatar,
        }),
      });
      if (!res.ok) {
        setIsUpdatingProfile(false);
        return toast.error(res.statusText, {
          position: "top-center",
        });
      }
      router.refresh();
      setIsUpdatingProfile(false);
      setSelectedProfileImage(null);
      return toast.success(res.statusText, {
        position: "top-center",
      });
    } catch {
      setIsUpdatingProfile(false);
    }
  }
  useEffect(() => {
    if (user) {
      form.setValue("first_name", username[0]);
      form.setValue("last_name", username[1]);
    }
  }, [user, form]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3 md:max-w-2xl md:flex-row md:gap-5"
      >
        <ProfileAvatar
          user={user}
          isUpdatingProfile={isUpdatingProfile || isUploadingImage}
          setSelectedProfileImage={setSelectedProfileImage}
          selectedProfileImage={selectedProfileImage}
        />
        <div className="flex w-full flex-col gap-2 self-start md:flex-row md:items-start md:gap-3">
          <div className="flex flex-col gap-x-4 gap-y-2 md:w-full md:max-w-xl md:flex-row md:items-center">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        username.length > 0 ? username[0] : "first name"
                      }
                      {...field}
                      className="block w-full rounded-md border-[0.5px] border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-zinc-500"
                      disabled={isUpdatingProfile || isUploadingImage}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        username.length > 0 ? username[1] : "last name"
                      }
                      {...field}
                      className="block w-full rounded-md border-[0.5px] border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-zinc-500"
                      disabled={isUpdatingProfile || isUploadingImage}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {((user?.username?.split(" ")[0]?.trim() ?? "") !==
            form.watch("first_name").trim() ||
            (user?.username?.split(" ")[1]?.trim() ?? "") !==
              form.watch("last_name").trim() ||
            selectedProfileImage) && (
            <Button
              type="submit"
              className={cn(
                "w-full md:w-fit shrink-0 border-0",
                form.formState.errors.first_name ||
                  form.formState.errors.last_name
                  ? "cursor-not-allowed"
                  : "cursor-pointer",
                "self-end"
              )}
              disabled={isUpdatingProfile || isUploadingImage}
            >
              {isUpdatingProfile && <Loader2 className="animate-spin size-4" />}
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
