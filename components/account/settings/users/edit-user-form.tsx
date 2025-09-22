import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { editUserFormSchema, EditUserFormValues } from "@/types/users";
import { UserRole } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomerAvatarUpload from "../../customer/customer-avatar-upload";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { editUserAction } from "@/app/account/settings/action";
import { User } from "@/lib/server/user";
import isEqual from "lodash/isEqual";

interface Props {
  setIsUpdatingUser: Dispatch<SetStateAction<boolean>>;
  onCloseModal: () => void;
  isUpdatingUser: boolean;
  user: User;
}

export default function EditUserForm({
  isUpdatingUser,
  setIsUpdatingUser,
  onCloseModal,
  user,
}: Props) {
  const router = useRouter();

  const defaultValues: EditUserFormValues = {
    first_name: user ? user.username.split(" ")[0] : "",
    last_name: user ? user.username.split(" ")[1] : "",
    email: user ? user.email : "",
    avatar: user ? user.avatar : null,
    role: user ? user.role : UserRole.MODERATOR,
  };

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues,
  });

  async function onSubmit(values: EditUserFormValues) {
    setIsUpdatingUser(true);
    const { message, errorMessage } = await editUserAction(values);
    if (errorMessage) {
      setIsUpdatingUser(false);
      return toast.error(errorMessage, {
        position: "top-center",
      });
    }
    setIsUpdatingUser(false);
    toast.success(message, {
      position: "top-center",
    });
    router.refresh();
    onCloseModal();
    form.reset();
  }

  const formatRoleName = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const isChanged = useMemo(() => {
    return !isEqual(form.getValues(), defaultValues);
  }, [form.watch(), defaultValues]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 -mt-4 mb-3"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  disabled={isUpdatingUser}
                  placeholder="John"
                  {...field}
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
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input disabled={isUpdatingUser} placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isUpdatingUser}
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                disabled={isUpdatingUser}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {formatRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <CustomerAvatarUpload
                  value={field.value}
                  onChange={field.onChange}
                  isAddingCustomer={isUpdatingUser}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isUpdatingUser || !isChanged}
          type="submit"
          className="w-full"
        >
          {isUpdatingUser && <Loader2 className="animate-spin" />}
          Update User
        </Button>
      </form>
    </Form>
  );
}
