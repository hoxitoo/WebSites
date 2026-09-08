"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * Блок «О компании» с цифрами доверия.
 *
 * Раньше в этом файле жили ещё «Как рождается забота» и тизер каталога.
 * После её переработки первый заменён блоком «Прозрачный и управляемый
 * процесс» (Process.tsx), второй — разделом «Форматы новогодних подарков»
 * (Formats.tsx). Прежний файл целиком есть в git — тег
 * pre-redesign-2026-09-08.
 */

/* ————— Анимированный счётчик (поддерживает дробные, напр. 99,9) —————
 *
 * Начальное значение — сразу конечное, а не ноль. Это важно: цифры доверия
 * (11 лет, 99,9%, 1000+) попадают в исходный HTML настоящими. Раньше там
 * стояли нули, и если бы скрипты не загрузились — медленная сеть, блокировщик,
 * старый браузер, — человек увидел бы «0 лет» и «0 клиентов». Анимация
 * запускается уже поверх готовых цифр, когда блок доходит до экрана.
 */
function Counter({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to); // добиваем ровно до конечного, без хвоста округления
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    // whitespace-nowrap: «99,9 %» переносило знак процента на вторую строку
    <span ref={ref} className="glow-gold tabular-nums whitespace-nowrap">
      {val.toLocaleString("ru-RU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/* ————— Цифры ————— */
// Блок «О компании» — по её переработке: «у компании тут как у меня,
// не как у Андрея». От её макета: заголовок-надпись «О компании» над
// цифрами (раньше цифры стояли без него) и подписи по центру.
export function Numbers() {
  const items = [
    { to: 11, suffix: "", decimals: 0, label: "лет выстраиваем систему, которая стабильно работает в декабре" },
    { to: 99.9, suffix: " %", decimals: 1, label: "отгрузок точно в срок — результат отлаженных процессов, а не случайность" },
    { to: 1000, suffix: "+", decimals: 0, label: "постоянных клиентов, 85% из них с нами больше 9 лет" },
  ];
  return (
    <section id="about" className="warm-glow relative mx-auto max-w-6xl px-6 py-28 md:px-12">
      <motion.p
        {...reveal}
        className="mb-12 text-center text-lg uppercase tracking-[0.24em] text-gold"
      >
        О компании
      </motion.p>
      <div className="grid gap-14 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }} className="text-center">
            <div className="font-display text-6xl md:text-7xl">
              <Counter to={it.to} suffix={it.suffix} decimals={it.decimals} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{it.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
