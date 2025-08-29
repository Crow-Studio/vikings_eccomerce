import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
// import { ConsentManagerProvider, CookieBanner, ConsentManagerDialog } from "@c15t/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import NprogressProvider from "@/providers/nprogress-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vikings E-commerce",
  description: "An e-commerce platform for tools and equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* todo: I dont think we need the cookie banner */}
        {/* <ConsentManagerProvider options={{
    					mode: 'c15t',
    					backendURL: '/api/c15t',
    					consentCategories: ['necessary', 'marketing'], // Optional: Specify which consent categories to show in the banner. 
    					ignoreGeoLocation: true, // Useful for development to always view the banner.
    				}}>
    			<CookieBanner />
    			<ConsentManagerDialog />
    		</ConsentManagerProvider> */}
        <NprogressProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
