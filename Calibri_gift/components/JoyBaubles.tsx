"use client";

import { motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «Из коробки вылетают шары» (идея заказчицы). Секция сразу после сцены
 * открытия подарка: настоящие фирменные ёлочные шары «Колибри» (барашки
 * и дети внутри стекла) выпадают сверху при скролле и покачиваются на нитях.
 * Ассеты — реальные изображения заказчицы (фон убран).
 */

const baubles = [
  { img: "/gift/baubles/ball-1.webp", alt: "Ёлочный шар с барашками у ёлки", drop: 0.0, sway: 6.2, lift: "md:mt-10" },
  { img: "/gift/baubles/ball-3.webp", alt: "Ёлочный шар: барашек и подарок", drop: 0.12, sway: 7.1, lift: "md:mt-0" },
  { img: "/gift/baubles/ball-2.webp", alt: "Ёлочный шар с мальчиком и девочкой", drop: 0.24, sway: 5.6, lift: "md:mt-14" },
  { img: "/gift/baubles/ball-5.webp", alt: "Ёлочный шар: барашек-снегурочка", drop: 0.36, sway: 6.8, lift: "md:mt-2" },
  { img: "/gift/baubles/ball-4.webp", alt: "Ёлочный шар с детьми и подарками", drop: 0.48, sway: 7.6, lift: "md:mt-12" },
];

function Bauble({
  img,
  alt,
  drop,
  sway,
  lift,
  reduce,
}: (typeof baubles)[number] & { reduce: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -160 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 60, damping: 12, delay: drop }}
      className={`flex flex-col items-center ${lift}`}
    >
      {/* качание вокруг точки подвеса */}
      <motion.div
        style={{ transformOrigin: "top center" }}
        animate={reduce ? undefined : { rotate: [2, -2, 2] }}
        transition={{ duration: sway, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        {/* нить подвеса */}
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-gold/40 to-gold/70 md:h-16" />
        {/* сам шар (уже с бантом и колпачком в картинке) */}
        <img
          src={asset(img)}
          alt={alt}
          loading="lazy"
          draggable={false}
          className="h-40 w-40 object-contain drop-shadow-[0_18px_36px_rgba(9,14,26,0.55)] md:h-48 md:w-48"
        />
      </motion.div>
    </motion.div>
  );
}

export default function JoyBaubles() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="section-vignette relative overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl md:text-5xl"
        >
          А вот и <span className="glow-gold">сама радость</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted"
        >
          Из подарка вылетают наши фирменные ёлочные шары — с барашками,
          детьми и целым новогодним миром внутри. Такие мелочи и создают
          настоящее чудо.
        </motion.p>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-10">
          {baubles.map((b) => (
            <Bauble key={b.img} {...b} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
