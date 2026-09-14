"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «А внутри — только лучшее»: наполнение и логотипы фабрик.
 *
 * Логотипы — в нашем виде: на скриншоте переработки она отметила именно
 * наш вариант — «логотипы как у Андрея».
 *
 * Финальная правка: четыре пункта над логотипами были плашками со
 * звёздочкой и длинной фразой. Она заменила их у себя на карточки с
 * круглой золотой иконкой, коротким заголовком и пояснением — «вот так
 * нужно». Тексты её, дословно.
 *
 * Раньше этот блок жил в components/About.tsx вместе с пятью другими
 * секциями — прежний файл целиком есть в git, тег pre-redesign-2026-09-08.
 */

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const POINTS = [
  {
    title: "Всегда свежий состав",
    text: "Проверяем срок годности каждой партии.",
    // календарь с галочкой
    path: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Закупаем напрямую у фабрик",
    text: "Без посредников и переплат.",
    // фабрика
    path: (
      <>
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1" />
        <path d="M12 18h1" />
        <path d="M7 18h1" />
      </>
    ),
  },
  {
    title: "Контроль качества",
    text: "Проверяем комплектность и целостность упаковки.",
    // лупа с галочкой
    path: (
      <>
        <path d="m8 11 2 2 4-4" />
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  {
    title: "Богатое разнообразие",
    text: "Конфеты, печенье и шоколад в каждом наборе.",
    // конфета
    path: (
      <>
        <path d="m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z" />
        <path d="M14 6.5v10" />
        <path d="M10 7.5v10" />
        <path d="m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1" />
        <path d="m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1" />
      </>
    ),
  },
];

// Логотипы поставщиков. Правка заказчицы: «давайте всё таки логотипы
// поставим?» — вместо текстовых плашек. Сначала вырезал их из рендера
// каталога, но она прислала архив с оригиналами: качество лучше, и в нём
// нашлись те четыре фабрики, которых в каталоге не было и которые до этого
// оставались текстом (Konti, Essen, Mars, Невский кондитер). Raffaello она
// прислала отдельно позже — «добавить в логотипы этот, пропустили»; стоит
// рядом с Ferrero, это их бренд. Пятнадцать логотипов — ровно три ряда
// по пять на широком экране.
// Собирает scripts/make-suppliers.mjs.
const FACTORIES = [
  ["Красный Октябрь", "factory-krasnyy-oktyabr.webp"],
  ["РотФронт", "factory-rotfront.webp"],
  ["Бабаевский", "factory-babaevskiy.webp"],
  ["Ferrero", "factory-ferrero.webp"],
  ["Raffaello", "factory-raffaello.webp"],
  ["Акконд", "factory-akkond.webp"],
  ["Славянка", "factory-slavyanka.webp"],
  ["Сладкий Орешек", "factory-sladkiy-oreshek.webp"],
  ["Победа", "factory-pobeda.webp"],
  ["Махеевъ", "factory-maheev.webp"],
  ["KDV", "factory-kdv.webp"],
  ["Konti", "factory-konti.webp"],
  ["Essen", "factory-essen.webp"],
  ["Mars", "factory-mars.webp"],
  ["Невский кондитер", "factory-nevskiy-konditer.webp"],
] as const;

export default function Filling() {
  return (
    <section className="section-band relative py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.p {...reveal}>
          <span className="eyebrow-pill">А внутри — только лучшее</span>
        </motion.p>
        <motion.h2 {...reveal} className="mt-5 font-display text-3xl md:text-5xl">
          {/* финальная правка: вторая половина — с новой строки, для симметрии */}
          {/* пробел перед переносом — иначе поисковик читает «сладостямипроверенных» */}
          Наполняем подарки сладостями{" "}
          <br />
          <span className="glow-gold">проверенных фабрик</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Прямые закупки и дистрибьюторские договоры с известными
          кондитерскими брендами — тем, что дети и взрослые действительно
          любят. Никаких случайных составов.
        </motion.p>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.12 }}
              className="rounded-2xl border border-cream/10 bg-night-soft/50 px-6 py-7 transition-colors duration-300 hover:border-gold/35"
            >
              <span
                aria-hidden
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-night-deep"
                style={{ background: "linear-gradient(135deg, #f3d9a4, #e8b968)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {p.path}
                </svg>
              </span>
              <h3 className="font-display text-xl text-gold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal} className="mt-16">
          <span className="eyebrow-pill">Традиционное наполнение конфетами</span>
        </motion.p>
        {/* логотипы на светлых плашках — как в каталоге; на тёмном фоне
            фирменные цвета фабрик иначе теряются */}
        <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {FACTORIES.map(([name, file], i) => (
            <motion.div
              key={file}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 5) * 0.08 }}
              className="flex h-20 items-center justify-center rounded-xl bg-cream px-3 py-2 shadow-[0_10px_30px_rgba(8,14,30,0.35)] md:h-24"
            >
              <img
                src={asset(`/brand/${file}`)}
                alt={name}
                width={420}
                height={220}
                loading="lazy"
                className="max-h-14 w-auto max-w-full object-contain md:max-h-16"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
