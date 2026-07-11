import Hero from "@/components/Hero";
import GiftScene from "@/components/GiftScene";
import { Numbers, HowItWorks, CatalogTeaser } from "@/components/Sections";
import { WhyTrust, Delivery } from "@/components/About";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import Garland from "@/components/Garland";

export default function Home() {
  return (
    <main>
      <Garland />
      <Hero />
      <GiftScene />
      <Numbers />
      <HowItWorks />
      <CatalogTeaser />
      <WhyTrust />
      <Delivery />
      <LeadForm />
      <Footer />
    </main>
  );
}
