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
import { createUserFormSchema, CreateUserFormValues } from "@/types/users";
import { UserRole } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomerAvatarUpload from "../../customer/customer-avatar-upload";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createUserAction } from "@/app/account/settings/action";
import { PasswordInputWithChecks } from "@/components/auth/PasswordInputWithCheck";

interface Props {
  setIsCreatingNewUser: Dispatch<SetStateAction<boolean>>;
  onCloseModal: () => void;
  isCreatingNewUser: boolean;
}

export default function CreateNewUserForm({
  isCreatingNewUser,
  setIsCreatingNewUser,
  onCloseModal,
}: Props) {
  const router = useRouter();
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      avatar: null,
      role: UserRole.MODERATOR,
      password: "",
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    setIsCreatingNewUser(true);
    const { message, errorMessage } = await createUserAction(values);
    if (errorMessage) {
      setIsCreatingNewUser(false);
      return toast.error(errorMessage, {
        position: "top-center",
      });
    }
    setIsCreatingNewUser(false);
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
                  disabled={isCreatingNewUser}
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
                <Input
                  disabled={isCreatingNewUser}
                  placeholder="Doe"
                  {...field}
                />
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
                  disabled={isCreatingNewUser}
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
                disabled={isCreatingNewUser}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInputWithChecks
                  {...field}
                  disabled={isCreatingNewUser}
                />
              </FormControl>
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
                  isAddingCustomer={isCreatingNewUser}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isCreatingNewUser} type="submit" className="w-full">
          {isCreatingNewUser && <Loader2 className="animate-spin" />}
          Save User
        </Button>
      </form>
    </Form>
  );
}
