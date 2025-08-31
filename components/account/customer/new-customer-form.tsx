import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomerAvatarUpload from "./customer-avatar-upload";
import * as RPNInput from "react-phone-number-input";
import PhoneFlag from "./phone/phone-flags";
import CountrySelect from "./phone/country-select";
import PhoneInput from "./phone/phone-input";
import { customerFormSchema, CustomerFormValues } from "@/types/customers";
import { CreateNewCustomerAction } from "@/app/account/customers/action";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Loader2 } from "lucide-react";
export default function NewCustomerForm() {
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const router = useRouter();
  const { onClose } = useModal();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      avatar: null,
      address: "",
      city: "",
      country: "",
    },
  });
  async function onSubmit(values: CustomerFormValues) {
    setIsAddingCustomer(true);
    const { message, errorMessage } = await CreateNewCustomerAction(values);
    if (errorMessage) {
      setIsAddingCustomer(false);
      return toast.error(errorMessage, {
        position: "top-center",
      });
    }
    setIsAddingCustomer(false);
    toast.success(message, {
      position: "top-center",
    });
    router.refresh();
    onClose();
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 -mt-4 mb-3"
      >
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isAddingCustomer}
                  placeholder="John Doe"
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
                  disabled={isAddingCustomer}
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <RPNInput.default
                  className="flex rounded-md shadow-xs"
                  international
                  flagComponent={PhoneFlag}
                  countrySelectComponent={CountrySelect}
                  inputComponent={PhoneInput}
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isAddingCustomer}
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
                  isAddingCustomer={isAddingCustomer}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  disabled={isAddingCustomer}
                  placeholder="123 Viking Street"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  disabled={isAddingCustomer}
                  placeholder="Nairobi"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  disabled={isAddingCustomer}
                  placeholder="Kenya"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isAddingCustomer} type="submit" className="w-full">
          {isAddingCustomer && <Loader2 className="animate-spin" />}
          Save Customer
        </Button>
      </form>
    </Form>
  );
}
