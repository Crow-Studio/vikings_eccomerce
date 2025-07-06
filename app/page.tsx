import OurCollections from "@/components/collections/OurCollections";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import WhyChooseUs from  "@/components/home/WhyChooseUs";
import  Newsletter from  "@/components/home/Newsletter";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <OurCollections />
      <WhyChooseUs/>
      <Newsletter/>
      <Footer />
    </main>
  );
}
