"use client";

import { motion } from "motion/react";

/**
 * «Отдел заботы Деда Мороза» и зоны ответственности.
 *
 * Правка заказчицы: «служба заботы Деда Мороза — как-то хочется, чтобы про
 * неё больше было и понятней». Содержание перенесено с третьей страницы
 * её каталога: зоны ответственности + текст про чат-бот и подбор трёх
 * вариантов, КП за два рабочих дня.
 *
 * Секция светлая — вторая «зимняя» на странице. Заказчица жаловалась,
 * что сайт монотонный и «блоки эти» одинаковые, поэтому тёмные и светлые
 * секции чередуются.
 */

const ZONES = [
  {
    title: "Качество и свежесть",
    text: "Прямые закупки на фабриках, контроль сроков годности и состава.",
  },
  {
    title: "Подбор решений",
    text: "Индивидуальный подход под ваш бюджет и задачи.",
  },
  {
    title: "Брендирование",
    text: "Производство подарков с вашим логотипом, согласование дизайна и тиража под ваш фирменный стиль.",
  },
  {
    title: "Доставка",
    text: "Бесплатная логистика до клиента и фиксированные сроки. Гарантируем соблюдение сроков поставки товара.",
  },
];

// «Как происходит процесс создания индивидуальных подарков» — её текст
// со страницы каталога про индивидуальные корпоративные подарки.
// Стоит узкой лентой, а не сеткой карточек: она жаловалась, что сайт долгий
// и «на середине уже устали», поэтому блок добавляет смысл, но не высоту.
const STEPS = [
  ["Бриф", "Задаём много вопросов и заполняем бриф — по нему и работаем."],
  ["Концепции", "Предлагаем несколько концепций: что-то отбрасываем, что-то дополняем."],
  ["Дизайн", "Несколько вариантов дизайна, доработка, согласование — и договор."],
  ["Расчёт", "Считаем окончательное наполнение и стоимость по выбранной концепции."],
  ["Производство", "Утверждённый дизайн и комплектацию запускаем в производство."],
];

// тиражи — со страницы каталога про индивидуальные подарки
const BRANDING = [
  ["Печать логотипа на готовом дизайне", "от 300 шт."],
  ["Фирменные значки с логотипом", "от 50 шт."],
  ["Наклейки с логотипом", "от 100 шт."],
  ["Новогодние открытки", "от 100 шт."],
  ["Пряник с логотипом", "от 100 шт."],
  ["Новогодняя бирка", "от 100 шт."],
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function CareDept() {
  return (
    <section className="relative overflow-hidden py-24 text-center">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #f7f3ec 0%, #eaf1fb 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-bordeaux">
          Отдел заботы Деда Мороза
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-night-deep md:text-5xl"
        >
          Чтобы декабрь прошёл{" "}
          <span className="text-bordeaux">спокойно</span>
        </motion.h2>
        {/* «Мы бережно относимся к времени наших клиентов» стоит в первом экране —
            здесь не повторяем: она жаловалась на однообразие страницы */}
        <motion.p {...reveal} className="mx-auto mt-4 max-w-2xl leading-relaxed text-night/75">
          Отдел заботы и его чат-бот берут подбор на себя. Ответьте на несколько
          коротких вопросов, и мы предложим три лучших варианта под ваш бюджет,
          сроки и пожелания. Коммерческое предложение подготовим за два рабочих
          дня — и только то, что реально можем сделать и поставить вовремя.
        </motion.p>

        <motion.p {...reveal} className="mt-14 text-xs uppercase tracking-[0.3em] text-bordeaux">
          Наши зоны ответственности
        </motion.p>
        <motion.p {...reveal} className="mx-auto mt-3 max-w-xl text-sm text-night/70">
          Чтобы у вас был прозрачный и управляемый процесс
        </motion.p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          {ZONES.map((z, i) => (
            <motion.div
              key={z.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.1 }}
              className="rounded-2xl border border-night/10 bg-cream/85 p-6 shadow-[0_10px_36px_rgba(16,28,51,0.08)]"
            >
              <h3 className="font-display text-xl text-bordeaux md:text-2xl">{z.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-night/75">{z.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal} className="mt-14 text-xs uppercase tracking-[0.3em] text-bordeaux">
          Индивидуальный подарок — по шагам
        </motion.p>
        {/* Правка: «в этом блоке мелкий текст слишком (бриф, дизайн и т.д.)» —
            названия шагов и пояснения увеличены, номер вынесен отдельной
            крупной цифрой. Поэтому и колонок теперь три, а не пять: на пять
            текст такого размера уже не влезал. */}
        <div className="mt-8 grid gap-x-8 gap-y-8 text-left sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <motion.div
              key={title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.07 }}
              className="border-t-2 border-bordeaux/25 pt-4"
            >
              <p className="font-display text-3xl leading-none text-bordeaux/45">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-xl text-bordeaux md:text-2xl">
                {title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-night/75">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal}
          className="mx-auto mt-14 max-w-2xl rounded-3xl border border-night/10 bg-night-deep/[0.04] p-6 text-left md:p-8"
        >
          <p className="text-center text-xs uppercase tracking-[0.24em] text-bordeaux">
            Ваш логотип на подарке
          </p>
          <dl className="mt-5 divide-y divide-night/10">
            {BRANDING.map(([what, qty]) => (
              <div key={what} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-base text-night-deep">{what}</dt>
                <dd className="whitespace-nowrap text-base font-semibold text-bordeaux">{qty}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
