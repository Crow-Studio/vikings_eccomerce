import type React from "react";
import Footer from "@/components/home/Footer";
import HeaderWrapper from "@/components/global/HeaderWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWrapper />
      {children}
      <Footer />
    </>
  );
}
