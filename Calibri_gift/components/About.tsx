"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";
import Disclosure from "./Disclosure";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/* ————— Зачем это бизнесу: измеримый эффект (тексты заказчицы) ————— */
export function BusinessEffect() {
  const items = [
    {
      title: "Сигнал «ты в команде»",
      text:
        "Подарок говорит сотруднику: «ты важен, мы тебя ценим». Для человека это " +
        "микроподдержка, для бизнеса — вклад в стабильность.",
    },
    {
      title: "Опора в непростое время",
      text:
        "Такие сигналы особенно важны сейчас: они помогают человеку чувствовать " +
        "устойчивость компании, в которой он работает.",
    },
    {
      title: "Лояльность без повышения зарплаты",
      text:
        "Когда человек чувствует, что его ценят, он реже уходит. Это прямая " +
        "экономия: подбор, адаптация и обучение нового сотрудника стоят дорого.",
    },
    {
      title: "Точно в цель",
      text:
        "Точечный подбор: каждый сотрудник получает понятный знак внимания, " +
        "а компания — стабильную мотивированную команду.",
    },
  ];

  return (
    <section className="warm-glow relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* кикер заказчица просила сделать заметнее: «плохо читабельно,
            сразу не видно этого, акцент сделать» — теперь это плашка */}
        <motion.p {...reveal} className="text-center">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-5 py-1.5 text-xs uppercase tracking-[0.28em] text-gold">
            Зачем это бизнесу
          </span>
        </motion.p>
        <motion.h2 {...reveal} className="mt-5 text-center font-display text-3xl md:text-5xl">
          И тёплые слова, и <span className="glow-gold">измеримый эффект</span>
        </motion.h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.12 }}
              className="rounded-2xl border border-cream/10 bg-night-soft/50 p-7"
            >
              <h3 className="mb-2.5 font-display text-xl text-gold">{it.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{it.text}</p>
            </motion.div>
          ))}
        </div>

        {/* эмоциональная кода — её текст про семейные истории */}
        <motion.div
          {...reveal}
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/25 bg-night-soft/40 px-8 py-7 text-center"
        >
          <p className="font-display text-lg leading-relaxed text-cream/90 md:text-xl">
            Новогодние подарки — это про маленькие семейные истории: как ребёнок
            бежит к ёлке, как взрослые переглядываются и улыбаются, как
            появляется ощущение, что год будет добрым.{" "}
            <span className="text-gold">Именно с этой мыслью мы и делаем подарки для вас.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ————— Что внутри: наполнение и качество (слайд «100% качество») ————— */
// Логотипы поставщиков. Правка заказчицы: «давайте всё таки логотипы
// поставим?» — вместо текстовых плашек. Сначала вырезал их из рендера
// каталога, но она прислала архив с оригиналами: качество лучше, и в нём
// нашлись те четыре фабрики, которых в каталоге не было и которые до этого
// оставались текстом (Konti, Essen, Mars, Невский кондитер).
// Собирает scripts/make-suppliers.mjs.
const FACTORIES = [
  ["Красный Октябрь", "factory-krasnyy-oktyabr.webp"],
  ["РотФронт", "factory-rotfront.webp"],
  ["Бабаевский", "factory-babaevskiy.webp"],
  ["Ferrero", "factory-ferrero.webp"],
  ["Акконд", "factory-akkond.webp"],
  ["Славянка", "factory-slavyanka.webp"],
  ["Сладкий Орешек", "factory-sladkiy-oreshek.webp"],
  ["Победа", "factory-pobeda.webp"],
  ["Махеевъ", "factory-maheev.webp"],
  ["KDV", "factory-kdv.webp"],
  ["Konti", "factory-konti.webp"],
  ["Essen", "factory-essen.webp"],
  ["Mars", "factory-mars.webp"],
  ["Невский кондитер", "factory-nevskiy-konditer.webp"],
] as const;

export function Filling() {
  const points = [
    "Самый свежий состав — следим за сроками годности",
    "Прямые закупки на фабриках и дистрибьюторские договоры",
    "Каждый подарок проходит контроль качества",
    "Возможно производство конфет с вашим логотипом",
  ];

  return (
    <section id="about" className="section-vignette relative py-28">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.h2 {...reveal} className="font-display text-3xl md:text-5xl">
          А внутри — <span className="glow-gold">только лучшее</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Наполняем подарки сладостями проверенных фабрик — тем, что дети и
          взрослые действительно любят. Никаких случайных составов.
        </motion.p>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
          {points.map((p, i) => (
            <motion.div
              key={p}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.12 }}
              className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-night-soft/50 px-6 py-5"
            >
              <span className="mt-0.5 text-gold">✦</span>
              <p className="text-sm leading-relaxed text-cream/85">{p}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal} className="mt-16 text-xs uppercase tracking-[0.3em] text-gold/85">
          Традиционное наполнение конфетами
        </motion.p>
        {/* логотипы на светлых плашках — как в каталоге; на тёмном фоне
            фирменные цвета фабрик иначе теряются */}
        <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {FACTORIES.map(([name, file], i) => (
            <motion.div
              key={file}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 5) * 0.08 }}
              className="flex h-20 items-center justify-center rounded-xl bg-cream px-3 py-2 shadow-[0_10px_30px_rgba(8,14,30,0.35)] md:h-24"
            >
              <img
                src={asset(`/brand/${file}`)}
                alt={name}
                loading="lazy"
                className="max-h-14 w-auto max-w-full object-contain md:max-h-16"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Почему это удобно для HR (экономия времени — главный B2B-аргумент) ————— */
export function HrValue() {
  const items = [
    {
      big: "3",
      unit: "вместо 200",
      title: "Снимаем этап отбора",
      text: "Вместо каталога из 200 позиций — три готовых варианта под ваш запрос.",
    },
    {
      big: "0",
      unit: "невыполнимых",
      title: "Только реальные варианты",
      text: "Отбираем по пожеланиям, бюджету и срокам. Не можем выполнить — не берём заказ.",
    },
    {
      big: "95%",
      unit: "времени",
      title: "Экономим на согласованиях",
      text: "Вы задаёте вектор — мы подбираем точные концепции. До 95% времени на согласованиях остаётся вам.",
    },
  ];

  return (
    <section className="section-band relative py-28">
      {/* заказчица: «всегда давайте всё центрировать по центру» —
          эта секция была единственной с левым выравниванием */}
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        <motion.p {...reveal} className="kicker">
          Почему это удобно HR
        </motion.p>
        <motion.h2 {...reveal} className="mx-auto mt-3 max-w-2xl font-display text-3xl md:text-5xl">
          Декабрь <span className="candle-sweep">без лишней суеты</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
          Подбор, логистику и контроль сроков берём на себя. Ваши пожелания —
          наша реализация: вы обозначаете детали, мы отвечаем за исполнение.
        </motion.p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="rounded-2xl border border-gold/20 bg-night-soft/50 p-8"
            >
              <div className="mb-4 flex items-baseline gap-2">
                <span className="glow-gold font-display text-5xl">{it.big}</span>
                <span className="text-sm text-muted">{it.unit}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-cream">{it.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Надёжность: гарантии + HR-бренд + география (текст заказчицы) ————— */
export function WhyTrust() {
  const items = [
    {
      title: "Фиксируем цену и дату",
      text: "Цена и дата отгрузки закреплены на этапе подбора — без скрытых доплат и сюрпризов.",
    },
    {
      title: "Персональный менеджер",
      text: "Менеджер и Отдел заботы всегда на связи — от заявки до вручения.",
    },
    {
      title: "Единое решение для филиалов",
      text: "Одна концепция на все города — усиливаем HR-бренд и узнаваемость компании.",
    },
    {
      title: "Подарок как сообщение",
      text: "Это не просто коробка, а знак: «мы видим и ценим вашу семью».",
    },
    {
      title: "100+ городов России",
      text: "Единая концепция, разные точки отгрузки — удобно федеральным компаниям.",
    },
    {
      title: "Только для бизнеса",
      text:
        "Работаем с юридическими лицами: договор поставки, оплата на расчётный счёт, " +
        "УПД, электронная ТТН. НДС 22% уже в цене.",
    },
  ];

  return (
    <section className="section-vignette relative py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Забота — это ещё и <span className="glow-gold">надёжность</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted">
          Прозрачно для директора и бухгалтерии, весомо для HR-бренда:
          подарок транслирует ценности компании во всех филиалах.
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
// Доставка. Заказчица: «вообще не нравится как про транспорт — очень много,
// не поймёшь куда смотреть» + «паровоз добавим где доставка» + «всегда
// давайте всё центрировать».
//
// Поэтому: светлая «зимняя» секция (единственная светлая в тёмном сайте —
// глазу есть за что зацепиться, о чём она и просила), паровоз из каталога,
// а пять карточек-регионов заменены одной таблицей: регион слева, сумма
// справа. Пороги — из её нового макета третьей страницы каталога.
export function Delivery() {
  const regions = [
    ["Краснодар и Ростов-на-Дону", "от 25 000 ₽"],
    ["Краснодарский край", "от 35 000 ₽"],
    ["Ростовская область", "от 50 000 ₽"],
    ["Ставропольский край, Республика Крым", "от 100 000 ₽"],
    ["Волгоградская область и Волгоград", "от 100 000 ₽"],
  ];

  // Тёплая («винная») секция — цвет приходит из градиента страницы,
  // см. body и .section-warm в globals.css.
  //
  // pb больше, чем pt: снизу начинается сцена с подарком, у неё свой
  // непрозрачный фон, и переходу градиента нужно место, чтобы дойти
  // до тёмного тона до её начала — иначе на стыке видна ступенька.
  return (
    <section
      id="delivery"
      className="section-warm relative overflow-hidden py-44 text-center"
    >
      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
          Бесплатная доставка до дверей
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-cream md:text-5xl"
        >
          Доставим бережно, <span className="glow-gold">с заботой о Вас</span>{" "}
          и Вашей компании!
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Отправляем из Краснодара по всей России. Собственный автопарк и прямые
          договоры с перевозчиками — дата поставки фиксируется в договоре.
        </motion.p>

        {/* Паровоз из каталога — «паровоз добавим где доставка».
            Его собственный зимний фон совпадает по тону со светлой секцией,
            поэтому показываем панелью со скруглением, а низ растворяем. */}
        {/* Раньше секция была холодного голубого тона и совпадала с фоном
            самого рисунка. После перекраски в бежевый белёсо-голубой фон
            паровоза стал читаться как случайная плашка, поэтому кладём его
            на кремовую карточку и слегка утепляем — так это выглядит
            задуманным, а не обрезанной картинкой. */}
        <motion.div
          {...reveal}
          className="mx-auto mt-6 w-full max-w-xl overflow-hidden rounded-[2rem] bg-cream/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
        >
          <img
            src={asset("/brand/train.webp")}
            alt="Новогодний поезд с подарками"
            width={1000}
            height={879}
            loading="lazy"
            className="w-full"
            style={{ filter: "sepia(0.12) saturate(1.04)" }}
            draggable={false}
          />
        </motion.div>

        {/* Правка: «аналогично для блока с паровозом» — таблица порогов
            спрятана под + , секция стала короче */}
        <motion.div {...reveal} className="mt-4">
        <Disclosure question="Куда и от какой суммы доставляем бесплатно?">
        <div
          className="mx-auto max-w-2xl rounded-3xl border border-cream/10 bg-warm-deep/50 p-6 text-left shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-8"
        >
          <p className="text-center text-sm text-muted">
            В одну точку выгрузки — при заказе на сумму:
          </p>
          <dl className="mt-5 divide-y divide-cream/10">
            {regions.map(([name, sum]) => (
              <div key={name} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-cream/90 md:text-base">{name}</dt>
                <dd className="whitespace-nowrap font-display text-lg text-gold md:text-xl">
                  {sum}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-center text-xs leading-relaxed text-muted/75">
            В остальные регионы доставку менеджер рассчитает индивидуально.
            Занос в помещение и подъём на этаж — дополнительная услуга,
            в стоимость доставки не входят.
          </p>
        </div>
        </Disclosure>
        </motion.div>
      </div>
    </section>
  );
}

/* ————— Нам доверяют + благотворительность (презентация NEW) ————— */
// Правка заказчицы: список компаний-клиентов убран целиком
// («только оставить где-то про благотворительность»), остался её текст
// про вклад в доброе дело.
export function Charity() {
  return (
    <section className="relative py-20">
      <motion.div
        {...reveal}
        className="mx-auto max-w-3xl px-6 text-center md:px-12"
      >
        <div className="rounded-3xl border border-gold/30 bg-night-soft/45 px-7 py-9 md:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Доброе дело</p>
          <p className="mt-5 text-lg leading-relaxed text-cream/90 md:text-xl">
            Каждый подарок — это не только знак внимания семье сотрудника,
            но и вклад в доброе дело: с каждого проданного подарка ООО ТК
            «Колибри» оказывает{" "}
            <span className="text-gold">благотворительную помощь</span>{" "}
            малоимущим семьям и детским домам.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
