import Hero from "@/components/Hero";
import GiftScene from "@/components/GiftScene";
import { Numbers, HowItWorks, CatalogTeaser } from "@/components/Sections";
import {
  Filling,
  BusinessEffect,
  HrValue,
  WhyTrust,
  Delivery,
  TrustedBy,
} from "@/components/About";
import LeadForm from "@/components/LeadForm";
import BotQr from "@/components/BotQr";
import Footer from "@/components/Footer";
import Garland from "@/components/Garland";

export default function Home() {
  return (
    <main>
      <Garland />
      <Hero />
      <GiftScene />
      <Filling />
      <BusinessEffect />
      <Numbers />
      <HrValue />
      <HowItWorks />
      <CatalogTeaser />
      <WhyTrust />
      <TrustedBy />
      <Delivery />
      <LeadForm />
      <BotQr />
      <Footer />
    </main>
  );
}
