import type { Metadata } from "next";
import Link from "next/link";
import Snow from "@/components/Snow";

export const metadata: Metadata = {
  title: "Мерч и подарки к проф.праздникам — скоро | Колибри",
  description:
    "Корпоративный мерч и подарки к профессиональным праздникам для клиентов ТК «Колибри». Страница в разработке.",
  robots: { index: false }, // заготовка — откроем после новогодней кампании
};

export default function MerchPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% -10%, #16203a 0%, #0e1526 50%, #090e1a 100%)",
        }}
      />
      <Snow density={0.6} />

      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold/80">
          ТК «Колибри»
        </p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          Мерч и подарки <span className="glow-gold">круглый год</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
          Корпоративный мерч и подарки к профессиональным праздникам — для
          компаний, которые заботятся о своих людях не только в декабре.
          Раздел скоро откроется.
        </p>
        <p className="mt-3 text-sm text-muted/70">
          Уже наш клиент? Напишите менеджеру — соберём предложение раньше.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block rounded-full border border-gold/40 px-7 py-3 text-sm text-gold transition-colors duration-200 hover:bg-gold/10"
          >
            ← Новогодние подарки — на главной
          </Link>
        </div>
      </div>
    </main>
  );
}
