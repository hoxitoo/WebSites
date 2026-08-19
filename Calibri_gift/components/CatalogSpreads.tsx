"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Lightbox, { type Shot } from "./Lightbox";
import { asset } from "@/lib/asset";

/**
 * Развороты каталога — правка «каталог модель с разворотами».
 *
 * Страницы каталога лежат под небольшим наклоном, как настоящие листы:
 * блок нарочно не похож на остальные сетки — заказчица писала, что сайт
 * монотонный и «блоки эти» одинаковые. По клику страница открывается крупно.
 */

// Макеты раскрытого каталога — из её архива «правки сайт для листания
// каталога». Готовит их scripts/make-spreads.mjs: он же замывает строки
// «Цена: …» и «Артикул: …», иначе прайс оказался бы в открытом доступе,
// хотя рядом написано, что каталог мы в открытый доступ не выкладываем.
const SPREADS = [
  ["spread-6-7.webp", "Разворот каталога: подарки в наборах", "Наборы"],
  ["spread-8-9.webp", "Разворот каталога: подарки в наборах", "Наборы"],
  ["spread-10-11.webp", "Разворот каталога: подарки в наборах", "Наборы"],
  ["spread-12-13.webp", "Разворот каталога: подарки в наборах", "Наборы"],
  ["spread-18-19.webp", "Разворот каталога: подарки в картонной упаковке", "Картон"],
  ["spread-52-53.webp", "Разворот каталога: подарки в текстильной упаковке", "Текстиль"],
  ["spread-68-69.webp", "Разворот каталога: подарки в премиум-упаковке", "Премиум"],
  ["spread-70-71.webp", "Разворот каталога: подарки в премиум-упаковке", "Премиум"],
] as const;

// небольшой разворот каждой страницы — чтобы лежали «внахлёст», а не в сетке
const TILT = [-3, 2.5, -2, 3, -2.5, 2, -3.5, 2.5];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function CatalogSpreads() {
  const [shot, setShot] = useState<Shot | null>(null);

  return (
    <section className="section-band relative py-24 text-center">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
          Коллекция 2027
        </motion.p>
        <motion.h2 {...reveal} className="mt-4 font-display text-3xl md:text-5xl">
          Полистайте наш <span className="candle-sweep">каталог</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Внутри — наборы, картонная, текстильная, комбинированная и премиум-упаковка,
          а ещё составы подарков. Нажмите на страницу, чтобы рассмотреть.
        </motion.p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 md:gap-7">
          {SPREADS.map(([file, alt, label], i) => (
            <motion.button
              key={file}
              type="button"
              onClick={() => setShot({ src: asset(`/catalog/${file}`), alt, caption: label })}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              whileHover={{ rotate: 0, y: -10, scale: 1.03 }}
              style={{ rotate: TILT[i] }}
              // развороты широкие (2,3:1), поэтому плитка шире, чем была
              // у одиночных страниц — иначе страницу не рассмотреть
              className="w-[300px] cursor-pointer overflow-hidden rounded-xl border border-cream/15 bg-cream shadow-[0_18px_50px_rgba(8,14,30,0.5)] sm:w-[340px] md:w-[420px]"
            >
              <img
                src={asset(`/catalog/${file}`)}
                alt={alt}
                loading="lazy"
                className="block w-full"
                draggable={false}
              />
            </motion.button>
          ))}
        </div>

        <Lightbox shot={shot} onClose={() => setShot(null)} />
      </div>
    </section>
  );
}
