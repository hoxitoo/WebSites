import type { Metadata } from "next";
import { Playfair_Display, Manrope, Caveat } from "next/font/google";
import CursorSnow from "@/components/CursorSnow";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Рукописный шрифт — только для подписи «С теплом, команда волшебников»
// над сценой с коробкой (правка «переместить текст»: в её макете подпись
// рукописная). Один начертание, кириллица.
const caveat = Caveat({
  subsets: ["cyrillic", "latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["500"],
});

// на GitHub Pages сайт живёт в подкаталоге /WebSites — OG-путь строим
// абсолютным от SITE, иначе "/gift/og.jpg" резолвится мимо подкаталога
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // тексты повторяют новый заголовок сайта — это же видно в превью ссылки,
  // когда её отправляют в мессенджер, и в поиске
  title: "Колибри — новогодние подарки, которые говорят о заботе",
  description:
    "Торговая компания «Колибри» — корпоративные новогодние подарки для сотрудников и их детей. Вы дарите самое важное — заботу и внимание.",
  openGraph: {
    title: "Колибри — вы дарите самое важное: заботу и внимание",
    description:
      "Корпоративные новогодние подарки для команд от 300 человек. 11 лет на рынке, 1000+ компаний.",
    images: [{ url: `${SITE}/gift/og.jpg`, width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="antialiased">
        {children}
        <CursorSnow />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Торговая компания «Колибри»",
              description:
                "Корпоративные новогодние подарки для сотрудников и их детей. 11 лет на рынке, 1000+ компаний-клиентов.",
              slogan: "Вы дарите самое важное — заботу и внимание.",
            }),
          }}
        />
      </body>
    </html>
  );
}
