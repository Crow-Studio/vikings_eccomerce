import NavigationWrapper from "@/components/account/navigations/navigation-wrapper";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";
export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="[--header-height:calc(--spacing(14))]">
      <ModalProvider />
      <Toaster richColors closeButton />
      <NavigationWrapper>{children}</NavigationWrapper>
    </main>
  );
}
