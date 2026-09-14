"use client";

import { motion } from "motion/react";

/**
 * Лента «Создаём подарки 11 лет».
 *
 * Финальные правки:
 *  • «как будто фраза „Создаём подарки 11 лет“ просится ниже, тут же» —
 *    лента больше не отдельная секция между логотипами и услугами,
 *    а стоит внутри раздела «Форматы новогодних подарков»
 *    (components/Formats.tsx); затем «под услуги» — под надписью
 *    «Услуги и продукция», между ней и заголовком раздела;
 *  • «у Клода — верхняя кнопка оранжевая меньше, сделайте так же» —
 *    из широкой ленты во всю колонку стала компактной плашкой, а после
 *    «сделать эту плашку чуть меньше» — ещё на ступень меньше;
 *  • «все оранжевые плашки двигаются и переливаются» — общий класс
 *    .ribbon-plate с бликом, см. globals.css.
 */
export default function Banner11() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center"
    >
      <div className="ribbon-plate inline-flex flex-col items-center gap-0.5 rounded-[1.5rem] px-5 py-2.5 text-center sm:rounded-full sm:px-8">
        <p className="font-display text-base font-bold leading-tight md:text-lg">
          Создаём подарки 11 лет
        </p>
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/85 md:text-[0.62rem]">
          Наша задача — ваш безупречный новогодний подарок!
        </p>
      </div>
    </motion.div>
  );
}
