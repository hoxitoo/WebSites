"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Magnetic from "./Magnetic";
import Lightbox, { type Shot } from "./Lightbox";
import CatalogRequest from "./CatalogRequest";
import { asset } from "@/lib/asset";

/* ————— Анимированный счётчик (поддерживает дробные, напр. 99,9) ————— */
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
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="glow-gold tabular-nums">
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
export function Numbers() {
  const items = [
    { to: 11, suffix: "", decimals: 0, label: "лет выстраиваем систему, которая стабильно работает в декабре" },
    { to: 99.9, suffix: " %", decimals: 1, label: "отгрузок точно в срок — результат отлаженных процессов, а не случайность" },
    { to: 1000, suffix: "+", decimals: 0, label: "постоянных клиентов, 85% из них с нами больше 9 лет" },
  ];
  return (
    <section className="warm-glow relative mx-auto max-w-6xl px-6 py-28 md:px-12">
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

/* ————— Как это работает ————— */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Несколько вопросов в чат-боте",
      text: "Отвечаете на короткие вопросы — мы понимаем задачу, бюджет и сроки. Пара минут.",
    },
    {
      n: "02",
      title: "3 готовых варианта",
      text: "Вместо каталога из 200 позиций — три смысловые линейки под ваш запрос. Вы добавляете фирменные детали.",
    },
    {
      n: "03",
      title: "Фиксируем и реализуем",
      text: "Наполнение не меняем без вашего подтверждения. Контроль качества и отгрузка точно в срок.",
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

// названия и порядок — по правке заказчицы; фото собраны из её каталога
// скриптом scripts/extract-catalog.mjs
const BOXES = [
  { label: "Наборы", file: "tile-nabory.webp", hue: "#22375c",
    alt: "Новогодний подарочный набор: коробка со сладостями, игрушки-овечки и открытка" },
  { label: "Картонная упаковка", file: "tile-karton.webp", hue: "#2b4470",
    alt: "Подарок в картонной упаковке с новогодним рисунком" },
  { label: "Текстильная упаковка", file: "tile-tekstil.webp", hue: "#1e3557",
    alt: "Мягкая игрушка-овечка — подарок в текстильной упаковке" },
  { label: "Комбинированная упаковка", file: "tile-kombi.webp", hue: "#2a3d63",
    alt: "Подарок в комбинированной упаковке — туба с новогодним рисунком" },
  { label: "Премиум упаковка", file: "tile-premium.webp", hue: "#3a2b52",
    alt: "Премиальный подарочный набор в упаковке-матрёшке" },
] as const;

export function CatalogTeaser() {
  const [shot, setShot] = useState<Shot | null>(null);
  const boxes = BOXES;
  return (
    <section className="warm-glow relative py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.h2 {...reveal} className="font-display text-3xl md:text-5xl">
          Каталог — <span className="glow-gold">по личному запросу</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Мы не выкладываем каталог в открытый доступ: каждое предложение собираем
          под компанию. Оставьте почту — и Отдел заботы пришлёт каталог и
          персональное коммерческое предложение.
        </motion.p>

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-5">
          {boxes.map((b, i) => (
            <motion.button
              key={b.label}
              type="button"
              onClick={() =>
                setShot({ src: asset(`/catalog/${b.file}`), alt: b.alt, caption: b.label })
              }
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              // пятая плитка нечётная — на узких экранах растягиваем её
              // на всю строку, иначе висит сиротой сбоку
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-cream/10 p-4 text-center transition-colors duration-300 hover:border-gold/45 ${
                i === boxes.length - 1 ? "col-span-2 lg:col-span-1" : ""
              }`}
              style={{
                background: `linear-gradient(160deg, ${b.hue} 0%, #16233d 120%)`,
              }}
            >
              {/* фото товара на светлой подложке — как карточка в каталоге */}
              <span className="mb-4 block overflow-hidden rounded-xl bg-cream">
                <img
                  src={asset(`/catalog/${b.file}`)}
                  alt={b.alt}
                  loading="lazy"
                  className="mx-auto h-36 w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.06] md:h-40"
                />
              </span>
              {/* трекинг на узких экранах меньше: «КОМБИНИРОВАННАЯ» не влезала */}
              <span className="block break-words text-xs uppercase leading-relaxed tracking-[0.07em] text-cream/85 group-hover:text-gold md:tracking-[0.14em]">
                {b.label}
              </span>
              <span className="mt-1 block text-[0.65rem] text-muted/70 transition-colors group-hover:text-gold/70">
                нажмите, чтобы увеличить
              </span>
            </motion.button>
          ))}
        </div>

        <Lightbox shot={shot} onClose={() => setShot(null)} />

        <motion.div {...reveal} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a
                href="#lead"
                className="inline-block rounded-full bg-bordeaux px-7 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)]"
              >
                Получить индивидуальное предложение
              </a>
            </Magnetic>
            <CatalogRequest className="cursor-pointer rounded-full border border-gold/50 px-7 py-4 font-medium text-gold transition-colors duration-300 hover:bg-gold/10">
              Получить каталог на почту
            </CatalogRequest>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
