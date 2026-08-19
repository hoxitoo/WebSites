"use client";

import { motion, useReducedMotion } from "motion/react";
import Snow from "./Snow";
import Magnetic from "./Magnetic";
import CatalogRequest from "./CatalogRequest";
import { asset } from "@/lib/asset";

// текст заголовка и подзаголовка — дословно по правке заказчицы
const lines = ["Вы дарите самое важное —", "заботу и внимание"];

// Меню в шапке — правка «вверху сайта о нас, доставка и т.д. шапкой».
// Ведёт к разделам этой же страницы (id стоят на секциях).
const NAV = [
  { label: "О нас", href: "#about" },
  { label: "Каталог", href: "#catalog" },
  { label: "Отдел заботы", href: "#care" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакты", href: "#contacts" },
] as const;

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

      {/* Правка заказчицы: «контакты нужно и сверху и снизу». Раньше сверху
          был только телефон, и на телефоне он вообще прятался — она этого
          не увидела. Теперь полоса с обоими номерами, почтой и мессенджерами
          стоит самой первой строкой и видна на любом экране. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 border-b border-cream/10 bg-night-deep/45 px-4 py-2.5 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[0.78rem] text-cream/80 sm:gap-x-6 sm:text-sm">
          <a href="tel:+78612506551" className="transition-colors hover:text-gold">
            8 (861) 250-65-51
          </a>
          <a href="tel:+79882461551" className="transition-colors hover:text-gold">
            8 (988) 246-15-51
          </a>
          <a
            href="mailto:info@kolibri-ug.ru"
            className="transition-colors hover:text-gold"
          >
            info@kolibri-ug.ru
          </a>
          {/* WhatsApp убран с сайта по правке заказчицы */}
          <span className="hidden text-cream/25 sm:inline">·</span>
          <a
            href="https://telegram.me/+f0vDIlkA2yY3ODIy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            Telegram
          </a>
        </div>
      </motion.div>

      {/* шапка */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-wrap items-center justify-between gap-y-3 px-6 py-5 md:px-12 md:py-6"
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

        {/* Правка заказчицы: «вверху сайта о нас, доставка и т.д. шапкой».
            Меню ведёт к разделам страницы. На узком экране логотип и кнопка
            занимают первую строку, а меню переносится под них — не в скролл
            в сторону, а в две строки: так ни один пункт не спрятан. */}
        <nav
          aria-label="Разделы сайта"
          className="order-3 w-full lg:order-none lg:w-auto"
        >
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/85 lg:flex-nowrap lg:gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors duration-200 hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* номер стоит строкой выше, в полосе контактов — здесь не дублируем */}
        <CatalogRequest className="cursor-pointer whitespace-nowrap rounded-full border border-gold/40 px-5 py-2 text-sm text-gold transition-colors duration-200 hover:bg-gold/10">
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
            ваших пожеланий.
            {/* правка заказчицы: подчёркнутое — на новую строку */}
            <span className="mt-3 block text-gold/90">
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
                className="inline-block btn-ribbon rounded-full px-7 py-4 font-medium"
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
