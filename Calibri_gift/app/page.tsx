import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import KidsStrip from "@/components/KidsStrip";
import { Numbers } from "@/components/Sections";
import Process from "@/components/Process";
import CareDept from "@/components/CareDept";
import LeadForm from "@/components/LeadForm";
import WhyBusiness from "@/components/WhyBusiness";
import Filling from "@/components/Filling";
import Banner11 from "@/components/Banner11";
import Formats from "@/components/Formats";
import Contacts from "@/components/Contacts";
import GiftScene from "@/components/GiftScene";
import Footer from "@/components/Footer";
import Garland from "@/components/Garland";

/**
 * Порядок секций — по её переработке сайта (сентябрь 2026): она прислала
 * готовый HTML-макет и отметила по блокам, чей вариант оставить.
 *
 * • шапка и первый экран — её («нравится моя верхушка сайта»); фон наш
 *   («фон нравится текущий, можно оставить текущий»);
 * • «Как выглядит радость» — наша лента, плюс её десять новых фото;
 * • «О компании» с цифрами — её вариант, с надписью над цифрами;
 * • «Прозрачный и управляемый процесс» — её блок вместо наших «Как
 *   рождается забота» и «Почему нам доверяют»;
 * • «Чтобы декабрь прошёл спокойно» — её, и сразу под ним анкета:
 *   «чтобы под этим блоком была форма анкеты сразу»; кнопка «Получить
 *   индивидуальное предложение» в шапке и первом экране ведёт туда же;
 * • «Зачем это бизнесу» — её блок вместо нашего «измеримого эффекта»;
 * • логотипы фабрик — наши: «логотипы как у Андрея»;
 * • «Форматы новогодних подарков» — её раздел: каталог по запросу,
 *   листалка разворотов, шесть форматов, таблица брендирования.
 *   Вторая пара QR-кодов оттуда убрана — «вторые qr убрать»;
 * • «Обсудим ваш новогодний заказ» и доставка — её блоки;
 * • сцена с коробкой осталась и стоит после доставки: «после доставки
 *   коробку оставить».
 *
 * Что было в прежней версии и ушло вместе с переработкой (её структура
 * короче): «Как рождается забота», «3 вместо 200», «Что это даёт бизнесу»,
 * «Почему нам доверяют», отдельные блоки тизера каталога и разворотов.
 * Всё это есть в git — тег pre-redesign-2026-09-08 и ветка
 * backup/pre-redesign-2026-09-08.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Garland />
        <Hero />
        <KidsStrip />
        <Numbers />
        <Process />
        <CareDept />
        <LeadForm />
        <WhyBusiness />
        <Filling />
        <Banner11 />
        <Formats />
        <Contacts />
        <GiftScene />
        <Footer />
      </main>
    </>
  );
}
