import Hero from "@/components/Hero";
import GiftScene from "@/components/GiftScene";
import { Numbers, HowItWorks, CatalogTeaser } from "@/components/Sections";
import {
  Filling,
  BusinessEffect,
  HrValue,
  WhyTrust,
  Delivery,
  Charity,
} from "@/components/About";
import KidsStrip from "@/components/KidsStrip";
import Banner11 from "@/components/Banner11";
import CareDept from "@/components/CareDept";
import CatalogSpreads from "@/components/CatalogSpreads";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import Garland from "@/components/Garland";

/**
 * Порядок секций собран под правки заказчицы:
 *
 * • лента с детьми — сразу под первым экраном: «я бы это сделала в верху,
 *   очень долго листать до них», и она же заметила, что «глаз цепляет
 *   только детей на фото»;
 * • сцена с подарком, который открывается скроллом, — «перенести в самый
 *   низ перед анкетой на сайте»: она длинная, и на входе тормозила
 *   знакомство с товаром;
 * • тёмные и светлые секции чередуются, между ними красная лента «11 лет» —
 *   против монотонности: «сайт очень монотонный, блоки эти одинаковые»;
 * • светлые «зимние» секции — Отдел заботы и доставка;
 * • QR-коды больше не отдельная секция: «qr кода переместить в блок чтобы
 *   декабрь прошел спокойно» — теперь они внутри CareDept.
 */
export default function Home() {
  return (
    <main>
      <Garland />
      <Hero />
      <KidsStrip />
      <Banner11 />
      <Filling />
      <CareDept />
      <BusinessEffect />
      <Numbers />
      <CatalogTeaser />
      <CatalogSpreads />
      <HrValue />
      <HowItWorks />
      <WhyTrust />
      <Charity />
      <Delivery />
      <GiftScene />
      <LeadForm />
      <Footer />
    </main>
  );
}
