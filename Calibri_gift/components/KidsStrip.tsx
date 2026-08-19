"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Lightbox, { type Shot } from "./Lightbox";
import { asset } from "@/lib/asset";

/**
 * Горизонтальная лента фотографий детей с подарками — из каталога заказчицы
 * (собрано скриптом scripts/extract-catalog.mjs).
 *
 * Листается свайпом на телефоне и стрелками на компьютере; по клику
 * фотография открывается крупно.
 */

// 16 студийных фотографий с Яндекс.Диска заказчицы — она просила поставить
// именно столько. Файлы лежат в репозитории (scripts/fetch-kids.mjs их
// скачивает и сжимает): «копии сохрани локально, чтобы если нет доступа
// к диску не сломалось». Откуда какой кадр — в public/catalog/kids-source.json.
const PHOTOS = [
  { file: "kid-01.webp", alt: "Девочка с мягкой игрушкой-овечкой и новогодним набором" },
  { file: "kid-02.webp", alt: "Девочка с набором и игрушками-барашками у ёлки" },
  { file: "kid-03.webp", alt: "Девочка с мягкой игрушкой-овечкой на руках" },
  { file: "kid-04.webp", alt: "Мальчик с новогодним набором и книгами" },
  { file: "kid-05.webp", alt: "Девочка с двумя игрушками-овечками" },
  { file: "kid-06.webp", alt: "Мальчик с подарочной сумкой" },
  { file: "kid-07.webp", alt: "Девочка с подарком в картонной коробке" },
  { file: "kid-08.webp", alt: "Девочка с картонной коробкой-домиком" },
  { file: "kid-09.webp", alt: "Девочка с подарком в картонной упаковке у ёлки" },
  { file: "kid-10.webp", alt: "Девочка с картонной коробкой с новогодним рисунком" },
  { file: "kid-11.webp", alt: "Девочка с подарочной коробкой в руках" },
  { file: "kid-12.webp", alt: "Мальчик с мягкой игрушкой-бараном" },
  { file: "kid-13.webp", alt: "Девочка с мягкой игрушкой-козочкой" },
  { file: "kid-14.webp", alt: "Девочка с мягкой игрушкой в новогоднем костюме" },
  { file: "kid-15.webp", alt: "Девочка с подарком в комбинированной упаковке" },
  { file: "kid-16.webp", alt: "Мальчик с подарочной тубой" },
] as const;

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function KidsStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // шаг = ширина карточки с отступом, но не больше видимой области
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <section className="section-band relative py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Как выглядит <span className="candle-sweep">радость</span>
        </motion.h2>
        <motion.p
          {...reveal}
          className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted"
        >
          Настоящее чудо в кадре: дети держат подарки из нашего каталога.
          Именно такую радость вы можете подарить семьям своих сотрудников.
          И это только маленькая часть нашей коллекции 2027 года.
        </motion.p>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-gold/70">
            листайте в сторону →
          </p>
          {/* стрелки нужны на компьютере, где нет свайпа */}
          <div className="hidden gap-2 md:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollBy(d)}
                aria-label={d < 0 ? "Предыдущие фото" : "Следующие фото"}
                className="cursor-pointer rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
              >
                {d < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* лента шире контейнера — прокручивается до самого края экрана */}
      <motion.div {...reveal} className="relative mt-5">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 md:px-12"
        >
          {PHOTOS.map((p) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setShot({ src: asset(`/catalog/${p.file}`), alt: p.alt })}
              className="group w-[210px] shrink-0 cursor-pointer snap-center overflow-hidden rounded-2xl border border-cream/10 bg-night-soft/40 transition-colors duration-300 hover:border-gold/45 md:w-[250px]"
            >
              <img
                src={asset(`/catalog/${p.file}`)}
                alt={p.alt}
                loading="lazy"
                className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] md:h-[330px]"
              />
            </button>
          ))}
        </div>
        {/* края растворяются в фоне, чтобы лента не обрубалась резко */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16"
          style={{ background: "linear-gradient(to right, #101c33, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16"
          style={{ background: "linear-gradient(to left, #101c33, transparent)" }}
          aria-hidden
        />
      </motion.div>

      <Lightbox shot={shot} onClose={() => setShot(null)} />
    </section>
  );
}
