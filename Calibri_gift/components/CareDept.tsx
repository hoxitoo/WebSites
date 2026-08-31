"use client";

import { motion } from "motion/react";
import Disclosure from "./Disclosure";
import { BotQrInline } from "./BotQr";
import { asset } from "@/lib/asset";

/**
 * «Отдел заботы Деда Мороза» и зоны ответственности.
 *
 * Правка заказчицы: «служба заботы Деда Мороза — как-то хочется, чтобы про
 * неё больше было и понятней». Содержание перенесено с третьей страницы
 * её каталога: зоны ответственности + текст про чат-бот и подбор трёх
 * вариантов, КП за два рабочих дня.
 *
 * Секция тёплая — вторая такая на странице. Заказчица жаловалась, что сайт
 * монотонный и «блоки эти» одинаковые, поэтому синие и винные секции
 * чередуются. Раньше эти секции были светлыми бежевыми, но переход
 * от тёмно-синего к светлому неизбежно проходил через грязно-серую
 * середину — см. комментарий к палитре в globals.css.
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
// Шестой шаг — её правка: в сетке пустовала шестая клетка, и она обвела её
// с подписью «добавить 6 блок, что-то про бережную доставку». Заодно это
// честный финал процесса: подарок не заканчивается производством.
const STEPS = [
  ["Бриф", "Задаём много вопросов и заполняем бриф — по нему и работаем."],
  ["Концепции", "Предлагаем несколько концепций: что-то отбрасываем, что-то дополняем."],
  ["Дизайн", "Несколько вариантов дизайна, доработка, согласование — и договор."],
  ["Расчёт", "Считаем окончательное наполнение и стоимость по выбранной концепции."],
  ["Производство", "Утверждённый дизайн и комплектацию запускаем в производство."],
  [
    "Бережная доставка",
    "Собираем в надёжную гофротару, мягкие игрушки — в дополнительной упаковке. " +
      "Везём своим автопарком к дате, закреплённой в договоре.",
  ],
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
    <section id="care" className="section-warm relative overflow-hidden py-44 text-center">
      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
          Отдел заботы Деда Мороза
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-cream md:text-5xl"
        >
          Чтобы декабрь прошёл{" "}
          <span className="glow-gold">спокойно</span>
        </motion.h2>
        {/* «Мы бережно относимся к времени наших клиентов» стоит в первом экране —
            здесь не повторяем: она жаловалась на однообразие страницы */}
        <motion.p {...reveal} className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Отдел заботы и его чат-бот берут подбор на себя. Ответьте на несколько
          коротких вопросов, и мы предложим три лучших варианта под ваш бюджет,
          сроки и пожелания. Коммерческое предложение подготовим за два рабочих
          дня — и только то, что реально можем сделать и поставить вовремя.
        </motion.p>

        {/* Стикер Деда Мороза — её правка, она отметила это место на скриншоте.
            Встал ровно по смыслу: на стикере написано «Подберу для вас
            3 лучших варианта!», а абзац выше — как раз про то, что бот
            предложит три варианта. Лёгкий наклон и покачивание, чтобы
            читался наклейкой, а не картинкой в рамке. Фон у него убран
            скриптом scripts/make-sticker.mjs. */}
        <motion.img
          src={asset("/brand/santa-sticker.webp")}
          alt="Дед Мороз: «Подберу для вас 3 лучших варианта!»"
          width={640}
          height={637}
          loading="lazy"
          draggable={false}
          initial={{ opacity: 0, y: 24, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -4 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 w-[210px] drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:w-[250px] md:w-[290px]"
        />

        <motion.p {...reveal} className="mt-14 text-xs uppercase tracking-[0.3em] text-gold/85">
          Наши зоны ответственности
        </motion.p>
        <motion.p {...reveal} className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Чтобы у вас был прозрачный и управляемый процесс
        </motion.p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          {ZONES.map((z, i) => (
            <motion.div
              key={z.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.1 }}
              className="rounded-2xl border border-cream/10 bg-warm-soft/60 p-6 shadow-[0_10px_36px_rgba(0,0,0,0.25)]"
            >
              <h3 className="font-display text-xl text-gold md:text-2xl">{z.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{z.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Правка: «блок с индивидуальным подарком переделать в вопрос
            „Хотите посмотреть как собирается уникальный подарок?“ и вынести
            весь текст под + ». Внутри — шаги и тиражи брендирования. */}
        <motion.div {...reveal} className="mt-14">
          <Disclosure question="Хотите посмотреть, как собирается уникальный подарок?">
            <div className="grid gap-x-8 gap-y-8 text-left sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map(([title, text], i) => (
                <div key={title} className="border-t-2 border-gold/25 pt-4">
                  <p className="font-display text-3xl leading-none text-gold/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-gold md:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-cream/10 bg-warm-deep/50 p-6 text-left md:p-8">
              <p className="text-center text-xs uppercase tracking-[0.24em] text-gold/85">
                Ваш логотип на подарке
              </p>
              <dl className="mt-5 divide-y divide-cream/10">
                {BRANDING.map(([what, qty]) => (
                  <div key={what} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-base text-cream/90">{what}</dt>
                    <dd className="whitespace-nowrap text-base font-semibold text-gold">
                      {qty}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Disclosure>
        </motion.div>

        {/* Правка: «qr кода переместить в блок чтобы декабрь прошел спокойно» */}
        <BotQrInline />
      </div>
    </section>
  );
}
