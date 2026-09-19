"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Lightbox, { type Shot } from "./Lightbox";
import Disclosure from "./Disclosure";
import CatalogRequest from "./CatalogRequest";
import Magnetic from "./Magnetic";
import Banner11 from "./Banner11";
import CatalogBook from "./CatalogBook";
import { asset } from "@/lib/asset";

/**
 * «Услуги и продукция» — раздел из её переработки сайта. Собирает в одном
 * месте то, что раньше было тремя блоками: тизер каталога, развороты
 * и плитки форматов.
 *
 * Что взято из её макета:
 *  • карточка «Коллекция — по личному запросу» с обложкой каталога;
 *  • «Полистайте наш каталог» — книга с эффектом перелистывания,
 *    40 страниц (components/CatalogBook.tsx, финальные правки 3);
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

// Цены по форматам — финальные правки 3: «хотим написать цены — прям как
// у Клода, добавить цена от и до и кнопочку „Оставить заявку“». Цифры —
// с её скриншота версии Клода. Для брендирования цены нет: «цена
// фиксируется в договоре».
const PRICES: Record<string, string> = {
  "format-nabory.webp": "от 1 310 до 4 220 рублей",
  "format-karton.webp": "от 380 до 2 275 рублей",
  "format-tekstil.webp": "от 915 до 3 820 рублей",
  "format-kombi.webp": "от 990 до 2 190 рублей",
  "format-premium.webp": "от 1 500 до 8 870 рублей",
  "format-brand.webp": "Цена фиксируется в договоре",
};

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Formats() {
  const [shot, setShot] = useState<Shot | null>(null);

  return (
    <section id="services" className="warm-glow relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.p {...reveal} className="text-center">
          <span className="eyebrow-pill">Услуги и продукция · Коллекция 2027</span>
        </motion.p>

        {/* лента «Создаём подарки 11 лет» — под надписью «Услуги и продукция»,
            между ней и заголовком: финальная правка «под услуги и сделать
            эту плашку чуть меньше» */}
        <div className="mt-5">
          <Banner11 />
        </div>

        <motion.h2 {...reveal} className="mt-6 text-center font-display text-3xl md:text-5xl">
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
          {/* «замена — файл от дизайнера на прозрачном фоне»: две книги
              стопкой, уже с наклоном и тенью, — поэтому без рамки и поворота */}
          <img
            src={asset("/catalog/cover-2027-books.webp")}
            alt="Каталог «Коллекция новогодних подарков 2027»"
            width={1100}
            height={731}
            loading="lazy"
            draggable={false}
            className="w-[16rem] shrink-0 transition-transform duration-300 group-hover:scale-[1.03] md:w-[19rem]"
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

        <div className="mt-20 text-center">
          <motion.p {...reveal}>
            <span className="eyebrow-pill">Коллекция 2027</span>
          </motion.p>
          <motion.h3 {...reveal} className="mt-4 font-display text-2xl md:text-4xl">
            Полистайте наш <span className="candle-sweep">каталог</span>
          </motion.h3>
          <motion.p {...reveal} className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            {/* финальная правка: «а также составы подарков — убираем вообще» */}
            Внутри — наборы, картонная, текстильная и премиум-упаковка.
            <br className="hidden sm:block" /> Это лишь малая часть каталога —
            остальное покажем по запросу.
          </motion.p>
          <motion.div {...reveal} className="mt-8">
            <CatalogBook onZoom={setShot} />
          </motion.div>
        </div>

        {/* Шесть форматов */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.1 }}
              className={
                "group flex flex-col overflow-hidden rounded-2xl border transition-colors duration-300 hover:border-gold/40 " +
                (p.accent
                  ? "border-gold/25 bg-gradient-to-br from-bordeaux-deep to-bordeaux/70"
                  : "border-cream/10 bg-night-soft/50")
              }
            >
              <span className="relative block aspect-[16/10] overflow-hidden">
                <img
                  src={asset(`/formats/${p.file}`)}
                  alt={p.alt}
                  width={628}
                  height={393}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {/* Кнопка на картинке, в правом нижнем углу — как у Клода.
                    Позиция — у обёртки, а не у самой кнопки: .btn-ribbon задаёт
                    position: relative (для бегущего блика), и это перебивало
                    absolute — кнопка вставала под картинку и обрезалась. */}
                <span className="absolute bottom-3 right-3">
                  <a
                    href="#lead"
                    className="btn-ribbon inline-block rounded-full px-4 py-2 text-xs font-semibold"
                  >
                    Оставить заявку
                  </a>
                </span>
              </span>
              {/* flex-1 + mt-auto: цена прижата к низу, в ряду карточек
                  цены стоят на одной линии при разной длине описания */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl text-gold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                <p className="mt-auto pt-5 font-display text-base font-semibold text-gold">
                  {PRICES[p.file]}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Варианты брендирования — таблицей, как в её макете */}
        <motion.div {...reveal} className="mt-14">
          <Disclosure
            question="Варианты брендирования готовых наборов"
            tone="dark"
            // последние правки: кружок с ребёнком слева от вопроса — как у
            // «Хотите посмотреть, как собирается уникальный подарок?»
            lead={
              <img
                src={asset("/catalog/circle-girl-headphones.webp")}
                alt=""
                aria-hidden
                width={240}
                height={240}
                loading="lazy"
                draggable={false}
                className="h-12 w-12 shrink-0 rounded-full ring-2 ring-gold/40 md:h-16 md:w-16"
              />
            }
          >
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
