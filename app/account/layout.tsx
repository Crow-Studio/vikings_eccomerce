import NavigationWrapper from "@/components/account/navigations/navigation-wrapper";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="[--header-height:calc(--spacing(14))]">
      <NavigationWrapper>{children}</NavigationWrapper>
    </main>
  );
}
