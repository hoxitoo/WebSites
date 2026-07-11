import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
  // до покупки домена OG-ссылки резолвятся от localhost; заменить на прод-домен
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Колибри — новогодние подарки, которые говорят о заботе",
  description:
    "Торговая компания «Колибри» — корпоративные новогодние подарки для сотрудников и их детей. Вы дарите не подарок — вы дарите заботу и признание.",
  openGraph: {
    title: "Колибри — вы дарите не подарок. Вы дарите заботу",
    description:
      "Корпоративные новогодние подарки для команд от 300 человек. 11 лет на рынке, 1000+ компаний.",
    images: [{ url: "/gift/og.jpg", width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${manrope.variable}`}>
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
              slogan: "Вы дарите не подарок. Вы дарите заботу.",
            }),
          }}
        />
      </body>
    </html>
  );
}
