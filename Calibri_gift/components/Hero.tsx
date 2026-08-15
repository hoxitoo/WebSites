"use client";

import { motion, useReducedMotion } from "motion/react";
import Snow from "./Snow";
import Hummingbird from "./Hummingbird";
import Magnetic from "./Magnetic";
import { asset } from "@/lib/asset";

const lines = ["Вы дарите", "не подарок.", "Вы дарите заботу."];

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      {/* фон: зимняя ночь (тёплое зелёно-золотое свечение внизу — под бренд) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1400px 800px at 70% -10%, #3a251c 0%, #2a1a14 45%, #1b100c 100%)," +
            "radial-gradient(900px 500px at 30% 115%, rgba(196,106,44,0.28), transparent 60%)",
        }}
      />
      {/* овечка с подарком — бледная подложка под текстом */}
      <img
        src={asset("/hero-sheep.webp")}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-[0.12] md:object-right"
        draggable={false}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(27,16,12,0.55) 0%, rgba(27,16,12,0.35) 55%, #1b100c 100%)",
        }}
        aria-hidden
      />
      <Snow density={1} />

      {/* шапка */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12"
      >
        {/* оригинальный логотип на светлой плашке — тёмный текст лого читаем
            только на светлом, поэтому не кладём его на тёмный фон напрямую */}
        <a href="#" aria-label="Колибри — торговая компания" className="inline-flex">
          <span className="inline-flex items-center rounded-xl bg-cream/95 px-3 py-2 shadow-[0_6px_24px_rgba(27,16,12,0.4)]">
            <img
              src={asset("/logo-kolibri.webp")}
              alt="Торговая компания «Колибри»"
              className="h-9 w-auto md:h-10"
              draggable={false}
            />
          </span>
        </a>
        <a
          href="#lead"
          className="rounded-full border border-gold/40 px-5 py-2 text-sm text-gold transition-colors duration-200 hover:bg-gold/10"
        >
          Получить каталог
        </a>
      </motion.header>

      {/* контент */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-6 pb-20 md:grid-cols-[1.2fr_1fr] md:px-12">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 text-xs uppercase tracking-[0.3em] text-gold/80"
          >
            Новогодние корпоративные подарки · 11 лет на рынке
          </motion.p>

          <h1 className="font-display text-5xl leading-[1.08] md:text-7xl">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {i === 2 ? (
                    <>
                      Вы дарите <span className="candle-sweep">заботу</span>.
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            Подарок — это знак заботы и признания: так вы показываете, что
            цените своих сотрудников. А мы берём на себя всё: подбор, контроль
            качества, соблюдение сроков и учёт ваших пожеланий.{" "}
            <span className="text-gold/90">
              Индивидуальный подход — в основе нашей работы.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Magnetic>
              <a
                href="#lead"
                className="inline-block rounded-full bg-bordeaux px-8 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)]"
              >
                Получить каталог подарков
              </a>
            </Magnetic>
            <a
              href="#story"
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              Почему это больше, чем подарок ↓
            </a>
          </motion.div>
        </div>

        {/* колибри из света */}
        <div className="relative hidden md:block">
          <Hummingbird className="mx-auto w-full max-w-[440px]" />
        </div>
      </div>

      {/* индикатор скролла */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 0.6 } : { opacity: [0, 1, 0] }}
        transition={reduce ? { delay: 1.1, duration: 0.6 } : { delay: 1.1, duration: 2.2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted"
      >
        листайте
      </motion.div>
    </section>
  );
}
