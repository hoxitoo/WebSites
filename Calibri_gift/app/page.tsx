import Hero from "@/components/Hero";
import GiftScene from "@/components/GiftScene";
import { Numbers, HowItWorks, CatalogTeaser } from "@/components/Sections";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <GiftScene />
      <Numbers />
      <HowItWorks />
      <CatalogTeaser />
      <LeadForm />
      <Footer />
    </main>
  );
}
