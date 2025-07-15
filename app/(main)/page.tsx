import OurCollections from "@/components/collections/OurCollections";
import Hero from "@/components/home/Hero";
import WhyChooseUs from  "@/components/home/WhyChooseUs";
import  Newsletter from  "@/components/home/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurCollections />
      <WhyChooseUs/>
      <Newsletter/>
    </main>
  );
}
