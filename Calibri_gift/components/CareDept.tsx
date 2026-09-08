"use client";

import { motion } from "motion/react";
import Disclosure from "./Disclosure";
import { BotQrInline } from "./BotQr";
import { asset } from "@/lib/asset";

/**
 * «Отдел заботы Деда Мороза» — блок по её переработке сайта:
 * «чтобы декабрь прошёл спокойно как у меня».
 *
 * От её макета здесь: стикер Деда Мороза сверху, надпись-плашка, заголовок,
 * текст про сервис и четыре ориентира вместо прежних четырёх зон
 * ответственности (зоны уехали в отдельный блок «Прозрачный и управляемый
 * процесс» — components/Process.tsx).
 *
 * Сразу под блоком стоит анкета: «чтобы под этим блоком была форма анкеты
 * сразу» — поэтому строчка про «не пользуетесь мессенджерами» ведёт вниз,
 * к ней же, а не в отдельное окно.
 *
 * Секция тёплая — вторая такая на странице. Заказчица жаловалась, что сайт
 * монотонный, поэтому синие и винные секции чередуются. Переход живёт
 * внутри её отступов, см. .section-warm в globals.css.
 */

// Четыре ориентира — её текст: «нам достаточно четырёх ориентиров,
// дальше мы всё сделаем сами».
const LANDMARKS = [
  ["Количество", "сколько подарков нужно вручить"],
  ["Бюджет", "ваш диапазон — мы подстроимся"],
  ["Сроки", "дата вручения, чтобы поставить в план производства"],
  ["Место поставки", "чтобы точно рассчитать сроки доставки"],
];

// «Как происходит процесс создания индивидуальных подарков» — её текст
// со страницы каталога. Остаётся под «плюсом»: свёрнутый блок не добавляет
// высоты, а она жаловалась, что сайт долго листать. Шестой шаг — её правка
// «добавить 6 блок, что-то про бережную доставку».
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
        {/* Стикер Деда Мороза — её правка. На стикере написано «Подберу
            для вас 3 лучших варианта!», а текст ниже — как раз про то,
            что бот предложит три варианта. Фон убран скриптом
            scripts/make-sticker.mjs. */}
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
          className="mx-auto w-[190px] drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:w-[220px] md:w-[250px]"
        />

        <motion.p {...reveal} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-night-deep/30 px-5 py-2 text-xs uppercase tracking-[0.24em] text-gold">
            <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5">
              <path fill="currentColor" d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8z" />
              <path fill="currentColor" d="M19 15l.8 2.6L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.4z" />
            </svg>
            Отдел заботы Деда Мороза
          </span>
        </motion.p>

        <motion.h2
          {...reveal}
          className="mx-auto mt-5 max-w-3xl font-display text-3xl leading-tight text-cream md:text-5xl"
        >
          Чтобы декабрь прошёл <span className="glow-gold">спокойно</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Специально для наших клиентов мы создали Отдел заботы Деда Мороза —
          сервис, который берёт подбор подарков на себя. Вы отвечаете
          на несколько коротких вопросов, мы подбираем три готовых варианта
          под ваш бюджет и сроки. Коммерческое предложение — за два рабочих
          дня, без лишних созвонов.
        </motion.p>

        <motion.h3
          {...reveal}
          className="mx-auto mt-16 max-w-2xl font-display text-2xl leading-snug text-cream md:text-3xl"
        >
          Нам достаточно четырёх ориентиров, дальше мы всё сделаем сами
        </motion.h3>

        <ol className="mt-8 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          {LANDMARKS.map(([title, text], i) => (
            <motion.li
              key={title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 4) * 0.1 }}
              className="flex gap-4"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display font-bold text-night-deep"
                style={{ background: "linear-gradient(135deg, #f3d9a4, #e8b968)" }}
              >
                {i + 1}
              </span>
              <span>
                <strong className="block text-cream">{title}</strong>
                <span className="text-sm leading-relaxed text-muted">{text}</span>
              </span>
            </motion.li>
          ))}
        </ol>

        {/* Правка: «блок с индивидуальным подарком переделать в вопрос
            „Хотите посмотреть как собирается уникальный подарок?“ и вынести
            весь текст под + ». Тиражи брендирования отсюда уехали в раздел
            «Форматы новогодних подарков» — в её макете таблица стоит там. */}
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
          </Disclosure>
        </motion.div>

        {/* Правка: «qr кода переместить в блок чтобы декабрь прошел спокойно».
            Вторая пара QR-кодов, которая была у неё в разделе услуг, убрана —
            «вторые qr убрать». */}
        <BotQrInline />
      </div>
    </section>
  );
}
