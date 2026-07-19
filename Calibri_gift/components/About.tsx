"use client";

import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/* ————— Почему доверяют (принципы со старого сайта, сжато до 6) ————— */
export function WhyTrust() {
  const items = [
    {
      title: "Под ключ",
      text: "От идеи подарка до поставки — всю работу берём на себя.",
    },
    {
      title: "С 2015 года",
      text: "Производим и продаём корпоративные подарки оптом. Компании ЮФО возвращаются вновь и вновь.",
    },
    {
      title: "Только для бизнеса",
      text: "Работаем с юрлицами и ИП: договор поставки, оплата на расчётный счёт, НДС 20% уже в цене.",
    },
    {
      title: "Качество с документами",
      text: "Каждый подарок проходит проверку и имеет декларацию о соответствии.",
    },
    {
      title: "Под ваш бюджет",
      text: "Создаём подарки, учитывая пожелания и бюджет — без стресса и сложностей.",
    },
    {
      title: "Проверено временем",
      text: "За годы работы завоевали доверие компаний Южного федерального округа.",
    },
  ];

  return (
    <section className="section-vignette relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Забота — это ещё и <span className="glow-gold">надёжность</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted">
          ООО ТК «Колибри» — производитель корпоративных новогодних подарков.
          Работаем так, чтобы закупка прошла спокойно: понятно, по договору
          и точно в срок.
        </motion.p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.12 }}
              className="rounded-2xl border border-cream/10 bg-night-soft/50 p-7"
            >
              <h3 className="mb-2.5 font-display text-xl text-gold">{it.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Доставка (данные презентации «Колибри» NEW, июль 2026) ————— */
export function Delivery() {
  const points = [
    "Собственный парк автотранспорта и прямые договоры с транспортными компаниями",
    "Фиксированная дата поставки — производство к согласованной в договоре дате",
    "Надёжная брендированная гофротара, мягкие игрушки — в дополнительной упаковке",
  ];
  const regions = [
    { name: "ЮФО и Республика Крым", line: "бесплатно от 50 000 ₽" },
    { name: "Европейская часть России", line: "бесплатно от 100 000 ₽" },
  ];

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Доставим бережно — <span className="candle-sweep">как подарок</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted">
          Отправляем из Краснодара по всей России — под контролем наших
          специалистов и точно в срок.
        </motion.p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4">
          {points.map((p, i) => (
            <motion.div
              key={p}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-night-soft/40 px-6 py-4"
            >
              <span className="mt-0.5 text-gold">✦</span>
              <p className="text-sm leading-relaxed text-cream/85">{p}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal} className="mt-12 text-center text-xs uppercase tracking-[0.3em] text-gold/80">
          Бесплатная доставка
        </motion.p>

        <div className="mx-auto mt-6 grid max-w-3xl gap-5 sm:grid-cols-2">
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="rounded-2xl border border-gold/25 bg-night-soft/40 p-6 text-center"
            >
              <h3 className="mb-2 text-sm font-semibold text-cream">{r.name}</h3>
              <p className="font-display text-xl text-gold">{r.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Нам доверяют + благотворительность (презентация NEW) ————— */
export function TrustedBy() {
  const clients = [
    "ЛУКОЙЛ",
    "Росатом · Ростовская АЭС",
    "Россети",
    "ТАНТК им. Г. М. Бериева",
    "Роспотребнадзор",
    "Юг-Авто",
    "Сад-Гигант",
    "Морской порт Таганрога",
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
        <motion.h2 {...reveal} className="font-display text-3xl md:text-5xl">
          Нам <span className="glow-gold">доверяют</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Компании, чьи благодарственные письма мы бережно храним.
        </motion.p>

        <motion.div {...reveal} className="mt-10 flex flex-wrap justify-center gap-3">
          {clients.map((c) => (
            <span
              key={c}
              className="rounded-full border border-cream/15 bg-night-soft/50 px-5 py-2.5 text-sm text-cream/85"
            >
              {c}
            </span>
          ))}
        </motion.div>

        <motion.div
          {...reveal}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gold/25 bg-night-soft/40 px-8 py-6"
        >
          <p className="leading-relaxed text-cream/90">
            💛 С каждого проданного подарка «Колибри» оказывает
            <span className="text-gold"> благотворительную помощь</span> —
            забота в наших подарках буквально встроена в цену.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
