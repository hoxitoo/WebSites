"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Lightbox, { type Shot } from "./Lightbox";
import Disclosure from "./Disclosure";
import CatalogRequest from "./CatalogRequest";
import Magnetic from "./Magnetic";
import { asset } from "@/lib/asset";

/**
 * «Услуги и продукция» — раздел из её переработки сайта. Собирает в одном
 * месте то, что раньше было тремя блоками: тизер каталога, развороты
 * и плитки форматов.
 *
 * Что взято из её макета:
 *  • карточка «Коллекция — по личному запросу» с обложкой каталога;
 *  • «Полистайте наш каталог» листалкой: один большой разворот, стрелки
 *    и полоска миниатюр — «полистайте каталог как у меня». Раньше все
 *    восемь разворотов лежали внахлёст на странице сразу;
 *  • шесть карточек форматов;
 *  • таблица «Варианты брендирования готовых наборов» — «варианты
 *    брендирования как у меня» (раньше это был список тиражей внутри
 *    «Отдела заботы»).
 *
 * Вторую пару QR-кодов, которая была у неё в конце раздела, не переносим:
 * «вторые qr убрать» — коды остались только в «Отделе заботы».
 *
 * Картинки карточек — без врисованных надписей: «хотим убрать надписи
 * с картинок, они местами обрезаны и всё равно текстовыми заголовками
 * дублируются». Она спрашивала, не подсветить ли подписи цветом — да,
 * заголовки карточек золотые, так они и работают подписями к кадрам.
 */

// Развороты каталога. Готовит scripts/make-spreads.mjs — он же замывает
// строки «Цена: …» и «Артикул: …»: прайс не должен попасть в открытый
// доступ, рядом же написано, что каталог мы открыто не выкладываем.
const SPREADS = [
  ["spread-6-7.webp", "6–7", "Разворот каталога: подарки в наборах"],
  ["spread-8-9.webp", "8–9", "Разворот каталога: подарки в наборах"],
  ["spread-10-11.webp", "10–11", "Разворот каталога: подарки в наборах"],
  ["spread-12-13.webp", "12–13", "Разворот каталога: подарки в наборах"],
  ["spread-18-19.webp", "18–19", "Разворот каталога: подарки в картонной упаковке"],
  ["spread-52-53.webp", "52–53", "Разворот каталога: подарки в текстильной упаковке"],
  ["spread-68-69.webp", "68–69", "Разворот каталога: подарки в премиум-упаковке"],
  ["spread-70-71.webp", "70–71", "Разворот каталога: подарки в премиум-упаковке"],
] as const;

// Шесть форматов. Картинки — её «сайт разделы» без надписей,
// готовит scripts/make-rework-assets.mjs.
const PRODUCTS = [
  {
    file: "format-nabory.webp",
    title: "Подарки в наборах",
    alt: "Новогодние подарки в наборах",
    text:
      "Готовые тематические наборы: сладости, игрушка и сувениры в фирменной " +
      "коробке — самый быстрый способ оформить заказ.",
  },
  {
    file: "format-karton.webp",
    title: "Картонная упаковка",
    alt: "Новогодние подарки в картонной упаковке",
    text:
      "Авторские коробки из микрогофрокартона с новогодним дизайном — " +
      "узнаваемая и практичная упаковка для массовых тиражей.",
  },
  {
    file: "format-tekstil.webp",
    title: "Текстильная упаковка",
    alt: "Новогодние подарки в текстильной упаковке",
    text:
      "Подарки в текстильных мешках и подушках — премиальная подача " +
      "для VIP-клиентов и партнёров компании.",
  },
  {
    file: "format-kombi.webp",
    title: "Комбинированная упаковка",
    alt: "Новогодние подарки в комбинированной упаковке",
    text: "Сочетание материалов и форматов — решение на стыке бюджета и статусности подарка.",
  },
  {
    file: "format-premium.webp",
    title: "Премиум-упаковка",
    alt: "Новогодние подарки в премиум-упаковке",
    text:
      "Индивидуальная разработка подарка под ваш бренд: от концепции " +
      "и дизайна до финальной поставки.",
  },
  {
    file: "format-brand.webp",
    title: "Брендирование логотипом",
    alt: "Брендирование новогодних подарков логотипом компании",
    accent: true,
    text:
      "Нанесение логотипа на готовые наборы: картонная упаковка " +
      "и текстильные подушки — с фиксированной ценой в договоре.",
  },
];

// Тиражи — со страницы её каталога про индивидуальные подарки
const BRANDING = [
  ["Печать логотипа", "от 300 шт.", "Картонная упаковка, текстильные подушки"],
  ["Фирменные значки", "от 50 шт.", "Текстильные игрушки"],
  ["Наклейки", "от 100 шт.", "На любой вид подарка"],
  ["Новогодние открытки", "от 100 шт.", "Вкладыш в любой вид подарка"],
  ["Пряник с логотипом", "от 100 шт.", "Вкладыш в любой вид подарка"],
  ["Новогодняя бирка", "от 100 шт.", "Подвесной элемент на подарок"],
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function CatalogFlip({ onZoom }: { onZoom: (shot: Shot) => void }) {
  const [index, setIndex] = useState(0);
  const [file, pages, alt] = SPREADS[index];
  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + SPREADS.length) % SPREADS.length);

  return (
    <div className="mt-20 text-center">
      <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
        Коллекция 2027
      </motion.p>
      <motion.h3 {...reveal} className="mt-4 font-display text-2xl md:text-4xl">
        Полистайте наш <span className="candle-sweep">каталог</span>
      </motion.h3>
      <motion.p {...reveal} className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
        Внутри — наборы, картонная, текстильная и премиум-упаковка, а также
        составы подарков.
        <br className="hidden sm:block" /> Это лишь малая часть каталога —
        остальное покажем по запросу.
      </motion.p>

      <motion.div {...reveal} className="mt-8 flex items-center justify-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Предыдущий разворот"
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => onZoom({ src: asset(`/catalog/${file}`), alt, caption: `Стр. ${pages}` })}
          className="relative w-full max-w-3xl cursor-zoom-in overflow-hidden rounded-2xl bg-cream shadow-[0_24px_60px_rgba(8,14,30,0.55)]"
        >
          {/* ключ по файлу — картинка проявляется, а не подменяется рывком */}
          <motion.img
            key={file}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={asset(`/catalog/${file}`)}
            alt={alt}
            className="block w-full"
            draggable={false}
          />
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-night-deep/75 px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide text-gold">
            Стр. {pages}
          </span>
        </button>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Следующий разворот"
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
        >
          →
        </button>
      </motion.div>

      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2.5">
        {SPREADS.map(([thumb, p], i) => (
          <button
            key={thumb}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Страницы ${p}`}
            aria-current={i === index}
            className={
              "h-11 w-16 cursor-pointer overflow-hidden rounded-md border-2 transition-opacity " +
              (i === index
                ? "border-gold opacity-100"
                : "border-transparent opacity-55 hover:opacity-85")
            }
          >
            <img
              src={asset(`/catalog/${thumb}`)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Formats() {
  const [shot, setShot] = useState<Shot | null>(null);

  return (
    <section id="services" className="warm-glow relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.p
          {...reveal}
          className="text-center text-xs uppercase tracking-[0.3em] text-gold/85"
        >
          Услуги и продукция · Коллекция 2027
        </motion.p>
        <motion.h2 {...reveal} className="mt-4 text-center font-display text-3xl md:text-5xl">
          Форматы <span className="glow-gold">новогодних подарков</span>
        </motion.h2>
        <motion.p
          {...reveal}
          className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted"
        >
          Полный каталог с готовыми идеями для вашего бизнеса — по запросу.
        </motion.p>

        {/* Каталог по личному запросу */}
        <motion.div
          {...reveal}
          className="group mt-12 flex flex-col items-center gap-8 rounded-3xl border border-cream/10 bg-night-soft/45 p-7 text-center md:flex-row md:p-9 md:text-left"
        >
          <img
            src={asset("/catalog/cover-2027.webp")}
            alt="Каталог «Коллекция новогодних подарков 2027»"
            width={1100}
            height={704}
            loading="lazy"
            draggable={false}
            className="w-[220px] shrink-0 -rotate-4 rounded-lg shadow-[0_18px_26px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.03] md:w-[260px]"
          />
          <div>
            <h3 className="font-display text-2xl text-cream md:text-3xl">
              Коллекция — по личному запросу
            </h3>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted md:mx-0">
              Каждое предложение мы собираем индивидуально под вашу компанию.
              Оставьте контакты — и мы пришлём каталог и персональное
              коммерческое предложение.
            </p>
            <CatalogRequest className="btn-ribbon mt-6 cursor-pointer rounded-full px-7 py-3.5 font-medium">
              Получить каталог
            </CatalogRequest>
          </div>
        </motion.div>

        <CatalogFlip onZoom={setShot} />

        {/* Шесть форматов */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.1 }}
              className={
                "group overflow-hidden rounded-2xl border transition-colors duration-300 hover:border-gold/40 " +
                (p.accent
                  ? "border-gold/25 bg-gradient-to-br from-bordeaux-deep to-bordeaux/70"
                  : "border-cream/10 bg-night-soft/50")
              }
            >
              <span className="block aspect-[16/10] overflow-hidden">
                <img
                  src={asset(`/formats/${p.file}`)}
                  alt={p.alt}
                  width={628}
                  height={393}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </span>
              <div className="p-6">
                <h3 className="font-display text-xl text-gold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Варианты брендирования — таблицей, как в её макете */}
        <motion.div {...reveal} className="mt-14">
          <Disclosure question="Варианты брендирования готовых наборов" tone="dark">
            <div className="overflow-x-auto rounded-2xl border border-cream/10">
              <table className="w-full min-w-[520px] border-collapse bg-night-soft/40 text-left">
                <thead>
                  <tr className="bg-night-soft/80 font-display text-cream">
                    <th className="border-b border-cream/10 px-5 py-3.5 font-semibold">
                      Вариант брендирования
                    </th>
                    <th className="border-b border-cream/10 px-5 py-3.5 font-semibold">
                      Минимальный тираж
                    </th>
                    <th className="border-b border-cream/10 px-5 py-3.5 font-semibold">
                      Куда размещается
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BRANDING.map(([what, qty, where]) => (
                    <tr key={what}>
                      <td className="border-b border-cream/10 px-5 py-3.5 text-sm text-cream/90">
                        {what}
                      </td>
                      <td className="whitespace-nowrap border-b border-cream/10 px-5 py-3.5 text-sm font-semibold text-gold">
                        {qty}
                      </td>
                      <td className="border-b border-cream/10 px-5 py-3.5 text-sm text-muted">
                        {where}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted/80">
              Тиражи указаны минимальные — поможем подобрать оптимальный вариант
              под ваш бюджет. Каталог собираем персонально под компанию:
              оставьте заявку, и мы пришлём подборку и коммерческое предложение.
            </p>
          </Disclosure>
        </motion.div>

        <motion.div {...reveal} className="mt-12 flex justify-center">
          <Magnetic>
            <a
              href="#lead"
              className="btn-ribbon inline-block rounded-full px-8 py-4 font-medium"
            >
              Получить индивидуальное предложение
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <Lightbox shot={shot} onClose={() => setShot(null)} />
    </section>
  );
}
