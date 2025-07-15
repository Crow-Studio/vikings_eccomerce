
import type React from "react"
import Header  from "@/components/home/Header"
import Footer from "@/components/home/Footer"


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
