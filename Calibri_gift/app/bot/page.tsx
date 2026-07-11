import type { Metadata } from "next";
import Link from "next/link";
import Snow from "@/components/Snow";

export const metadata: Metadata = {
  title: "Служба заботы Деда Мороза — выберите мессенджер",
  description:
    "Ответьте на 5 коротких вопросов — и Служба заботы Деда Мороза соберёт каталог и персональное предложение для вашей компании.",
  robots: { index: false }, // вход по QR из каталога, в поиске не нужна
};

const TG_URL = process.env.NEXT_PUBLIC_TG_BOT_URL ?? "https://t.me/kolibri_care_bot";
const MAX_URL = process.env.NEXT_PUBLIC_MAX_BOT_URL ?? "https://max.ru/";

export default function BotPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% -10%, #16203a 0%, #0e1526 50%, #090e1a 100%)," +
            "radial-gradient(800px 500px at 50% 115%, rgba(122,36,56,0.4), transparent 60%)",
        }}
      />
      <Snow density={0.8} />

      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold/80">
          ТК «Колибри» представляет
        </p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          Служба заботы <span className="glow-gold">Деда Мороза</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
          5 коротких вопросов — и мы соберём для вашей компании каталог
          и персональное предложение. Отвечать можно кнопками, это займёт
          пару минут.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={TG_URL}
            className="group rounded-2xl border border-cream/15 bg-night-soft/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-night-soft"
          >
            <span className="mb-2 block font-display text-2xl text-cream group-hover:text-gold">
              Telegram
            </span>
            <span className="text-sm text-muted">Продолжить в Telegram</span>
          </a>
          <a
            href={MAX_URL}
            className="group rounded-2xl border border-cream/15 bg-night-soft/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-night-soft"
          >
            <span className="mb-2 block font-display text-2xl text-cream group-hover:text-gold">
              MAX
            </span>
            <span className="text-sm text-muted">Продолжить в MAX</span>
          </a>
        </div>

        <p className="mt-10 text-xs text-muted/60">
          Удобнее по-старинке?{" "}
          <Link href="/#lead" className="text-gold/80 underline-offset-4 hover:underline">
            Оставьте заявку на сайте
          </Link>
        </p>
      </div>
    </main>
  );
}
