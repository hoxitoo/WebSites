import Hero from "@/components/Hero";
import GiftScene from "@/components/GiftScene";
import JoyBaubles from "@/components/JoyBaubles";
import { Numbers, HowItWorks, CatalogTeaser } from "@/components/Sections";
import { WhyTrust, Delivery, TrustedBy } from "@/components/About";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import Garland from "@/components/Garland";

export default function Home() {
  return (
    <main>
      <Garland />
      <Hero />
      <GiftScene />
      <JoyBaubles />
      <Numbers />
      <HowItWorks />
      <CatalogTeaser />
      <WhyTrust />
      <TrustedBy />
      <Delivery />
      <LeadForm />
      <Footer />
    </main>
  );
}
