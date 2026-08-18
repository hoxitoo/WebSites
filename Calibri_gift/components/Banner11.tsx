"use client";

import { motion } from "motion/react";

/**
 * Акцентная лента «Создаём подарки 11 лет» — заказчица прислала такую
 * плашку из каталога как пример: красно-оранжевая, в отличие от остального
 * сайта. Ставим её разделителем между секциями, чтобы взгляд цеплялся
 * (жалоба «сайт монотонный, глазу негде зацепиться»).
 */
export default function Banner11() {
  return (
    <section className="relative overflow-hidden py-10">
      <motion.div
        initial={{ opacity: 0, scaleX: 0.94 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl px-6 md:px-12"
      >
        <div
          className="rounded-full px-7 py-5 text-center shadow-[0_18px_50px_rgba(122,36,56,0.35)] md:px-12"
          style={{
            background: "linear-gradient(96deg, #8f1f2e 0%, #c0392b 45%, #e8813a 100%)",
          }}
        >
          <p className="font-display text-2xl leading-tight text-cream md:text-4xl">
            Создаём подарки 11 лет
          </p>
          <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-cream/90 md:text-sm">
            Наша задача — ваш безупречный новогодний подарок!
          </p>
        </div>
      </motion.div>
    </section>
  );
}
