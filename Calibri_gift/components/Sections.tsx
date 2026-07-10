"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Magnetic from "./Magnetic";

/* ————— Анимированный счётчик ————— */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="glow-gold tabular-nums">
      {val.toLocaleString("ru-RU")}
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
export function Numbers() {
  const items = [
    { to: 11, suffix: "", label: "лет помогаем компаниям заботиться о людях" },
    { to: 1000, suffix: "+", label: "компаний доверяют нам новогоднее настроение" },
    { to: 300, suffix: "+", label: "сотрудников — команды, с которыми мы работаем" },
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 md:px-12">
      <div className="grid gap-14 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }} className="text-center">
            <div className="font-display text-6xl md:text-7xl">
              <Counter to={it.to} suffix={it.suffix} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{it.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ————— Как это работает ————— */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Вы оставляете заявку",
      text: "Коротко рассказываете о команде: сколько сотрудников и детей хотите поздравить.",
    },
    {
      n: "02",
      title: "Мы готовим личное КП",
      text: "Служба заботы подбирает варианты под ваш бюджет, упаковку и пожелания — только для вас.",
    },
    {
      n: "03",
      title: "Подарки приезжают к дате",
      text: "Организуем удобную закупку и доставку — чудо случается вовремя.",
    },
  ];
  return (
    <section className="section-vignette relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="mb-16 text-center font-display text-3xl md:text-5xl">
          Как рождается <span className="candle-sweep">забота</span>
        </motion.h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.15 }}
              className="relative rounded-2xl border border-cream/10 bg-night-soft/50 p-8"
            >
              <span className="font-display text-5xl text-bordeaux-bright/70">
                {s.n}
              </span>
              <h3 className="mt-4 mb-3 text-xl font-semibold text-cream">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Тизер каталога (без цен — намеренно) ————— */
export function CatalogTeaser() {
  const boxes = [
    { label: "Картон", hue: "#7a2438" },
    { label: "Жесть", hue: "#16203a" },
    { label: "Текстиль", hue: "#5c1a2e" },
    { label: "Наборы", hue: "#2a3752" },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.h2 {...reveal} className="font-display text-3xl md:text-5xl">
          Каталог — <span className="glow-gold">по личному запросу</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Мы не выкладываем каталог в открытый доступ: каждое предложение собираем
          под компанию. Оставьте почту — и Служба заботы пришлёт каталог и
          персональное коммерческое предложение.
        </motion.p>

        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">
          {boxes.map((b, i) => (
            <motion.div
              key={b.label}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-cream/10 p-8"
              style={{
                background: `linear-gradient(160deg, ${b.hue} 0%, #0e1526 120%)`,
              }}
            >
              {/* «размытые» силуэты подарков — интрига */}
              <div className="mx-auto mb-6 h-24 w-24 rounded-xl bg-cream/10 blur-[6px] transition-all duration-500 group-hover:blur-[3px]" />
              <p className="text-sm uppercase tracking-[0.2em] text-cream/80">{b.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal} className="mt-12">
          <Magnetic>
            <a
              href="#lead"
              className="inline-block rounded-full bg-bordeaux px-8 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)]"
            >
              Получить каталог на почту
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
