"use client";

import { motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «Из коробки вылетают шарики, а в них — дети с наборами» (идея заказчицы).
 * Секция сразу после сцены открытия подарка: ёлочные шары на золотых нитях,
 * внутри каждого — настоящее фото ребёнка с подарком «Колибри»
 * (кадры из презентации компании). Шары «выпадают» сверху при скролле
 * и мягко покачиваются на нитях.
 */

const baubles = [
  { img: "/gift/kids/kid-1.webp", alt: "Девочка с плюшевой лошадкой у ёлки", drop: 0.0, sway: 6.2, lift: "md:mt-10" },
  { img: "/gift/kids/kid-2.webp", alt: "Девочка с игрушкой и новогодним набором", drop: 0.12, sway: 7.1, lift: "md:mt-0" },
  { img: "/gift/kids/kid-3.webp", alt: "Девочка с подарочным рюкзачком", drop: 0.24, sway: 5.6, lift: "md:mt-14" },
  { img: "/gift/kids/kid-4.webp", alt: "Девочка с Дедом Морозом и набором", drop: 0.36, sway: 6.8, lift: "md:mt-2" },
  { img: "/gift/kids/kid-5.webp", alt: "Мальчик с подушкой-звездой и подарком", drop: 0.48, sway: 7.6, lift: "md:mt-12" },
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
      initial={{ opacity: 0, y: -140 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 60, damping: 12, delay: drop }}
      className={`flex flex-col items-center ${lift}`}
    >
      {/* качание вокруг точки подвеса */}
      <motion.div
        style={{ transformOrigin: "top center" }}
        animate={reduce ? undefined : { rotate: [2.2, -2.2, 2.2] }}
        transition={{ duration: sway, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        {/* нить */}
        <div className="h-14 w-px bg-gradient-to-b from-transparent via-gold/50 to-gold/80 md:h-20" />
        {/* колпачок с колечком */}
        <div className="relative z-10 -mb-2 flex flex-col items-center">
          <div className="h-2.5 w-2.5 rounded-full border border-gold/80" />
          <div
            className="h-3 w-7 rounded-t-md"
            style={{ background: "linear-gradient(180deg, #f3d9a4, #c99a4e)" }}
          />
        </div>
        {/* шар с фото */}
        <div className="relative h-36 w-36 md:h-44 md:w-44">
          <img
            src={asset(img)}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="h-full w-full rounded-full object-cover"
          />
          {/* золотой ободок и внутренняя тень стекла */}
          <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-gold/50 shadow-[inset_0_-14px_28px_rgba(9,14,26,0.4),0_16px_40px_rgba(9,14,26,0.5)]" />
          {/* блик */}
          <div
            className="pointer-events-none absolute left-[14%] top-[8%] h-[30%] w-[22%] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,250,235,0.85) 0%, transparent 70%)",
            }}
          />
        </div>
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
          В каждом шаре — те, ради кого всё это. Настоящие фотографии: дети
          сотрудников наших клиентов и их подарки от «Колибри».
        </motion.p>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-8 md:gap-12">
          {baubles.map((b) => (
            <Bauble key={b.img} {...b} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
