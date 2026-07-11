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

/* ————— Доставка (условия со старого сайта) ————— */
export function Delivery() {
  const regions = [
    {
      name: "Краснодар и край",
      lines: ["по городу — от 25 000 ₽", "по краю — от 35 000 ₽"],
    },
    {
      name: "Ставрополье и Крым",
      lines: ["от 50 000 ₽"],
    },
    {
      name: "Ростов-на-Дону и область",
      lines: ["по городу — от 25 000 ₽", "по области — от 50 000 ₽"],
    },
    {
      name: "Волгоград и область",
      lines: ["от 50 000 ₽"],
    },
  ];

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Доставим бережно — <span className="candle-sweep">как подарок</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted">
          Отправляем из Краснодара проверенными транспортными компаниями —
          «Деловые Линии», «ПЭК», «Автотрейдинг» — по всей России, под контролем
          наших специалистов. Надёжная брендированная гофротара, мягкие игрушки —
          в дополнительной упаковке. Привезём в удобный для вас день.
        </motion.p>

        <motion.p {...reveal} className="mt-12 text-center text-xs uppercase tracking-[0.3em] text-gold/80">
          Бесплатная доставка в пять регионов
        </motion.p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="rounded-2xl border border-gold/20 bg-night-soft/40 p-6 text-center"
            >
              <h3 className="mb-3 text-sm font-semibold text-cream">{r.name}</h3>
              {r.lines.map((l) => (
                <p key={l} className="text-sm leading-relaxed text-muted">
                  {l}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
