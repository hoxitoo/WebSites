"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * «Зачем это бизнесу» — по её переработке: «зачем бизнесу как у меня».
 *
 * Вместо прежних четырёх карточек с рассуждениями про лояльность и текучку
 * у неё две коротких мысли с круглыми фотографиями и следом плашка
 * «Доброе дело» — то же, что раньше стояло отдельной секцией.
 */

const CARDS = [
  {
    photo: "kid-05.webp",
    alt: "Девочка с двумя игрушками-овечками",
    title: "«Мы ценим вас»",
    text:
      "Новогодний подарок — простой и тёплый способ поблагодарить сотрудников " +
      "за их работу и внимание к компании в течение года.",
  },
  {
    photo: "kid-09.webp",
    alt: "Девочка с подарком в картонной упаковке у ёлки",
    title: "Один стандарт для всей компании",
    text:
      "Единая концепция подарков для офиса, филиалов и подразделений — " +
      "с возможностью персонализации под ваш бренд.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function WhyBusiness() {
  return (
    <section className="warm-glow relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        {/* кикер заказчица просила сделать заметнее: «плохо читабельно,
            сразу не видно этого, акцент сделать» — поэтому плашка */}
        <motion.p {...reveal}>
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-5 py-1.5 text-xs uppercase tracking-[0.28em] text-gold">
            Зачем это бизнесу
          </span>
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-5 max-w-2xl font-display text-3xl leading-tight md:text-5xl"
        >
          Забота о людях. <span className="glow-gold">Удобство для бизнеса.</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          Подарок — это больше, чем новогодняя традиция.
        </motion.p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="rounded-2xl border border-cream/10 bg-night-soft/50 p-7 transition-colors duration-300 hover:border-gold/35"
            >
              <img
                src={asset(`/catalog/${c.photo}`)}
                alt={c.alt}
                width={700}
                height={1049}
                loading="lazy"
                className="mx-auto mb-5 h-[88px] w-[88px] rounded-full border-2 border-gold/35 object-cover"
                draggable={false}
              />
              <h3 className="font-display text-xl text-gold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Её текст про благотворительность. Раньше стоял отдельной секцией,
            в её макете — плашкой сразу под этими карточками. */}
        <motion.div
          {...reveal}
          className="mx-auto mt-10 flex max-w-3xl flex-col items-start gap-5 rounded-2xl border border-gold/28 bg-gold/[0.07] px-7 py-6 text-left sm:flex-row sm:items-center"
        >
          <span
            aria-hidden
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full p-3 text-night-deep"
            style={{ background: "linear-gradient(135deg, #f3d9a4, #e8b968)" }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676a.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052a2.12 2.12 0 0 0-.004-3a2.124 2.124 0 1 0 3-3a2.124 2.124 0 0 0 3.004 0a2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0a2 2 0 0 1 0-2.828l2.823-2.762"
              />
            </svg>
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Доброе дело</p>
            <p className="mt-2 leading-relaxed text-cream/90">
              Каждый подарок — это не только знак внимания семье сотрудника,
              но и вклад в доброе дело: с каждого проданного подарка ООО ТК
              «Колибри» оказывает{" "}
              <span className="text-gold">благотворительную помощь</span>{" "}
              малоимущим семьям и детским домам.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
