import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://vikingstraders.co.ke"
  ),
  title: {
    default: "Vikings Kepower - Quality Tools & Equipment Supplier in Kenya",
    template: "%s | Vikings Kepower",
  },
  description:
    "Leading supplier of quality tools, equipment, and machinery in Kenya. Serving construction, agriculture, and industrial sectors with reliable products and exceptional service since 2020.",
  keywords: [
    "tools Kenya",
    "equipment supplier",
    "construction tools",
    "agricultural equipment",
    "industrial machinery",
    "power tools",
    "hand tools",
    "hardware store Kenya",
    "Nairobi tools",
    "quality equipment",
    "Vikings Kepower",
    "machinery supplier",
    "construction equipment",
    "farm tools",
    "workshop tools",
  ],
  authors: [{ name: "Vikings Kepower Team" }],
  creator: "Vikings Kepower",
  publisher: "Vikings Kepower",
  category: "Tools & Equipment",

  // Open Graph metadata for social media
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://vikingstraders.co.ke",
    siteName: "Vikings Kepower",
    title: "Vikings Kepower - Quality Tools & Equipment Supplier in Kenya",
    description:
      "Leading supplier of quality tools, equipment, and machinery in Kenya. Serving construction, agriculture, and industrial sectors with reliable products and exceptional service.",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@Vikings2308",
    creator: "@Vikings2308",
    title: "Vikings Kepower - Quality Tools & Equipment Supplier in Kenya",
    description:
      "Leading supplier of quality tools, equipment, and machinery in Kenya. Serving construction, agriculture, and industrial sectors.",
    images: ["/twitter-image.jpg"],
  },

  // Additional metadata
  applicationName: "Vikings Kepower",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification for search engines
  verification: {
    google: "google-site-verification-code",
    // yandex: "yandex-verification-code",
    // yahoo: "yahoo-verification-code",
  },

  // Alternate languages
  alternates: {
    canonical: "https://vikingstraders.co.ke",
    languages: {
      "en-KE": "https://vikingstraders.co.ke",
      "sw-KE": "https://vikingstraders.co.ke/sw",
    },
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Additional meta tags
  other: {
    // Business information
    "contact:phone_number": "+254721780466",
    "contact:email": "Vikingskepower@gmail.com",
    "geo.region": "KE-110", // Nairobi region code
    "geo.placename": "Nairobi, Kenya",
    "geo.position": "-1.286389;36.817223", // Nairobi coordinates
    ICBM: "-1.286389, 36.817223",

    // Business type
    "business:contact_data:locality": "Nairobi",
    "business:contact_data:region": "Nairobi County",
    "business:contact_data:country_name": "Kenya",

    // Social media profiles
    "article:publisher": "https://www.facebook.com/VikingsTraders",

    // Mobile optimization
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Vikings Kepower",

    // Theme colors
    "theme-color": "#1d62fb",
    "msapplication-TileColor": "#1d62fb",
    "msapplication-navbutton-color": "#1d62fb",

    // Additional SEO
    "revisit-after": "7 days",
    rating: "general",
    distribution: "global",
    language: "English",
    coverage: "Worldwide",
    target: "all",
    HandheldFriendly: "True",
    MobileOptimized: "320",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional SEO meta tags */}
        <link rel="canonical" href="https://vikingstraders.co.ke" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for social media domains */}
        <link rel="dns-prefetch" href="//instagram.com" />
        <link rel="dns-prefetch" href="//facebook.com" />
        <link rel="dns-prefetch" href="//twitter.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
        <link rel="dns-prefetch" href="//youtube.com" />
        <link rel="dns-prefetch" href="//tiktok.com" />

        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://vikingstraders.co.ke/#website",
                  url: "https://vikingstraders.co.ke",
                  name: "Vikings Kepower",
                  alternateName: "Vikings",
                  description:
                    "Leading supplier of quality tools, equipment, and machinery in Kenya",
                  publisher: {
                    "@id": "https://vikingstraders.co.ke/#organization",
                  },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                          "https://vikingstraders.co.ke/search?q={search_term_string}",
                      },
                      "query-input": "required name=search_term_string",
                    },
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": "https://vikingstraders.co.ke/#organization",
                  name: "Vikings Kepower",
                  alternateName: "Vikings",
                  url: "https://vikingstraders.co.ke",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://vikingstraders.co.ke/logo.png",
                    width: 512,
                    height: 512,
                  },
                  description:
                    "Leading supplier of quality tools, equipment, and machinery in Kenya. Serving construction, agriculture, and industrial sectors.",
                  foundingDate: "2020",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+254721780466",
                    contactType: "customer service",
                    availableLanguage: [
                      "English",
                      "Swahili",
                      "Luganda",
                      "Kinyarwanda",
                    ],
                    areaServed: ["KE", "UG", "TZ", "RW"],
                    hoursAvailable: {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ],
                      opens: "08:00",
                      closes: "18:00",
                    },
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "KE",
                    addressRegion: "Nairobi County",
                    addressLocality: "Nairobi",
                  },
                  sameAs: [
                    "https://instagram.com/vikings_traders_",
                    "https://www.facebook.com/VikingsTraders",
                    "https://x.com/Vikings2308",
                    "https://www.tiktok.com/@vikingstraders",
                    "https://www.youtube.com/@vikingstraders4737",
                    "https://www.linkedin.com/company/vikings-kepower",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NprogressProvider />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}