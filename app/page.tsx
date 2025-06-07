import OurCollections from "@/components/collections/OurCollections";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <OurCollections />
      <Footer />
    </main>
  );
}
