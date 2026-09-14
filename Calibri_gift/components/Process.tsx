"use client";

import { motion } from "motion/react";

/**
 * «Прозрачный процесс — от подбора подарка до доставки».
 *
 * Финальная правка: текст блока заменён её текстом «у Клода» — надпись
 * «Как мы работаем», новый заголовок и абзац, и шесть карточек вместо
 * четырёх: добавились «Документы для закупки» и «Безналичная оплата».
 * Для B2B это не мелочь — закупщику и бухгалтерии эти два пункта нужны
 * до того, как они вообще начнут разговор.
 *
 * Нижний отступ меньше верхнего: «здесь можно сделать короче расстояние» —
 * она отметила пустоту между карточками и стикером Деда Мороза ниже.
 */

const CARDS = [
  {
    title: "Качество и свежесть",
    text:
      "Работаем напрямую с производителями. Контролируем состав, сроки годности " +
      "и качество продукции при комплектации подарков.",
    // щит с галочкой
    path: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Подбор под ваш бюджет",
    text:
      "Предложим несколько вариантов под нужную стоимость, количество и формат — " +
      "от массовых корпоративных подарков до премиальных наборов.",
    // пазл
    path: (
      <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
    ),
  },
  {
    title: "Брендирование",
    text:
      "Адаптируем упаковку под фирменный стиль вашей компании: логотип, " +
      "поздравление и индивидуальное оформление.",
    // подарочная коробка с бантом
    path: (
      <>
        <path d="M12 7v14m8-10v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m3.5-4a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
        <rect x="3" y="7" width="18" height="4" rx="1" />
      </>
    ),
  },
  {
    title: "Доставка в согласованный срок",
    text:
      "Планируем логистику заранее и контролируем отгрузку. Собственный автопарк " +
      "помогает нам управлять сроками доставки.",
    // фургон
    path: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </>
    ),
  },
  {
    title: "Документы для закупки",
    text:
      "Работаем с юридическими лицами по договору. Предоставляем необходимый " +
      "комплект документов для закупки и бухгалтерии.",
    // документ
    path: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </>
    ),
  },
  {
    title: "Безналичная оплата",
    text:
      "Работаем по договору с НДС 22% — оплата по безналу, полный пакет " +
      "закрывающих документов для бухгалтерии.",
    // здание банка
    path: (
      <>
        <path d="M3 22h18" />
        <path d="M6 18v-7" />
        <path d="M10 18v-7" />
        <path d="M14 18v-7" />
        <path d="M18 18v-7" />
        <path d="M12 2 20 7H4z" />
      </>
    ),
  },
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Process() {
  return (
    <section className="section-vignette relative pb-12 pt-24 md:pb-14 md:pt-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.p {...reveal} className="text-center">
          <span className="eyebrow-pill">Как мы работаем</span>
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-5 max-w-4xl text-center font-display text-3xl leading-tight md:text-5xl"
        >
          Прозрачный процесс —{" "}
          <span className="candle-sweep">от подбора подарка до доставки</span>
        </motion.h2>
        <motion.p
          {...reveal}
          className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted"
        >
          Берём на себя весь процесс подготовки корпоративных новогодних подарков:
          подберём решение под ваш бюджет и задачу, согласуем состав и упаковку,
          организуем брендирование и доставку. Стоимость и сроки фиксируем
          заранее. Вы понимаете, что происходит с заказом на каждом этапе.
        </motion.p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.article
              key={c.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.1 }}
              className="rounded-2xl border border-cream/10 bg-night-soft/50 p-7 transition-colors duration-300 hover:border-gold/35"
            >
              <span
                aria-hidden
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-night-deep"
                style={{ background: "linear-gradient(135deg, #f3d9a4, #e8b968)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {c.path}
                </svg>
              </span>
              <h3 className="font-display text-xl text-cream">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
