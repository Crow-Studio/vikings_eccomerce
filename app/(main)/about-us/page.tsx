import { Metadata } from 'next';
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Newsletter from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: 'About Us - Vikings Kenya Power Traders | Quality Tools & Equipment',
  description: 'Learn about Vikings Kenya Power Traders - your trusted source for professional tools, equipment, and quality products since 2005. Discover why thousands of customers choose us.',
  keywords: 'about vikings kenya, power tools kenya, professional equipment, quality tools, trusted suppliers kenya, vikings power traders',
  openGraph: {
    title: 'About Us - Vikings Kenya Power Traders',
    description: 'Learn about Vikings Kenya Power Traders - your trusted source for professional tools, equipment, and quality products since 2005.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Vikings Kenya Power Traders',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Vikings Kenya Power Traders',
    description: 'Learn about Vikings Kenya Power Traders - your trusted source for professional tools, equipment, and quality products since 2005.',
  },
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function AboutUsPage() {
  return (
    <main>
      <WhyChooseUs />
      <Newsletter />
    </main>
  );
}