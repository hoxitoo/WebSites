"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «А внутри — только лучшее»: наполнение и логотипы фабрик.
 *
 * Блок оставлен в нашем виде намеренно: в её переработке логотипы стоят
 * мелкой сеткой по пять в ряд, но на скриншоте она отметила именно наш
 * вариант — «логотипы как у Андрея», «Андрею нужно оставить ещё к тому,
 * что я сделала».
 *
 * Раньше этот блок жил в components/About.tsx вместе с пятью другими
 * секциями. После её переработки те пять заменены её блоками
 * (Process, WhyBusiness, Formats, Contacts), поэтому файл переехал сюда
 * под своим именем. Прежний About.tsx целиком есть в git — тег
 * pre-redesign-2026-09-08.
 */

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

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
  const points = [
    "Самый свежий состав — следим за сроками годности",
    "Прямые закупки на фабриках и дистрибьюторские договоры",
    "Каждый подарок проходит контроль качества",
    "Возможно производство конфет с вашим логотипом",
  ];

  return (
    <section className="section-band relative py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
          А внутри — только лучшее
        </motion.p>
        <motion.h2 {...reveal} className="mt-4 font-display text-3xl md:text-5xl">
          Наполняем подарки сладостями{" "}
          <span className="glow-gold">проверенных фабрик</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Прямые закупки и дистрибьюторские договоры с известными
          кондитерскими брендами — тем, что дети и взрослые действительно
          любят. Никаких случайных составов.
        </motion.p>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
          {points.map((p, i) => (
            <motion.div
              key={p}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.12 }}
              className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-night-soft/50 px-6 py-5"
            >
              <span className="mt-0.5 text-gold">✦</span>
              <p className="text-sm leading-relaxed text-cream/85">{p}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal} className="mt-16 text-xs uppercase tracking-[0.3em] text-gold/85">
          Традиционное наполнение конфетами
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
