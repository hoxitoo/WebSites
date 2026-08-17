"use client";

import { motion, useReducedMotion } from "motion/react";
import Snow from "./Snow";
import Magnetic from "./Magnetic";
import CatalogRequest from "./CatalogRequest";
import { asset } from "@/lib/asset";

// текст заголовка и подзаголовка — дословно по правке заказчицы
const lines = ["Вы дарите самое важное —", "заботу и внимание"];

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      {/* фон: зимняя ночь — заказчица вернула синюю палитру */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1400px 800px at 70% -10%, #1f2f4d 0%, #16233d 45%, #101c33 100%)," +
            "radial-gradient(900px 500px at 30% 115%, rgba(60,104,168,0.32), transparent 60%)",
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
            "linear-gradient(to bottom, rgba(8,14,30,0.55) 0%, rgba(8,14,30,0.35) 55%, #101c33 100%)",
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
        {/* «вывернутая» версия фирменного логотипа: кремово-золотая, без
            плашки — собирается из оригинала скриптом scripts/make-logo.mjs */}
        <a
          href="#"
          aria-label="Колибри — торговая компания"
          className="inline-flex transition-opacity duration-300 hover:opacity-80"
        >
          <img
            src={asset("/logo-kolibri-row.webp")}
            alt="Торговая компания «Колибри»"
            width={964}
            height={400}
            className="h-12 w-auto sm:h-14 md:h-20"
            draggable={false}
          />
        </a>
        <CatalogRequest className="cursor-pointer rounded-full border border-gold/40 px-5 py-2 text-sm text-gold transition-colors duration-200 hover:bg-gold/10">
          Получить каталог
        </CatalogRequest>
      </motion.header>

      {/* контент */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 pb-20 md:px-12">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 text-xs uppercase tracking-[0.3em] text-gold/80"
          >
            Новогодние корпоративные подарки · 11 лет на рынке
          </motion.p>

          <h1 className="font-display text-[2rem] leading-[1.12] sm:text-5xl sm:leading-[1.08] md:text-7xl">
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
                  {i === 1 ? (
                    <>
                      <span className="candle-sweep">заботу</span> и внимание
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
            className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted md:mt-7 md:text-lg"
          >
            Новогодний подарок — это проявление традиционных ценностей:
            заботы о людях, внимания к семьям сотрудников и их детям.
            <br className="hidden md:block" />{" "}
            Мы бережно относимся к времени наших клиентов, поэтому берём
            на себя всё: подбор, контроль качества, соблюдение сроков и учёт
            ваших пожеланий.{" "}
            <span className="text-gold/90">
              Индивидуальный подход — в основе нашей работы.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-7 flex flex-wrap items-center gap-4 md:mt-10 md:gap-5"
          >
            {/* Правка заказчицы: две разные кнопки. За каталогом — короткое
                окошко с контактами, за персональным КП — анкета как в боте. */}
            <Magnetic>
              <a
                href="#lead"
                className="inline-block rounded-full bg-bordeaux px-7 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)]"
              >
                Получить индивидуальное предложение
              </a>
            </Magnetic>
            <CatalogRequest className="cursor-pointer rounded-full border border-gold/50 px-7 py-4 font-medium text-gold transition-colors duration-300 hover:bg-gold/10">
              Получить каталог
            </CatalogRequest>
          </motion.div>
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
