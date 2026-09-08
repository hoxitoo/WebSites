"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Disclosure from "./Disclosure";
import { sendLead } from "@/lib/sendLead";
import { asset } from "@/lib/asset";

/**
 * «Обсудим ваш новогодний заказ» — блок из её переработки сайта: слева
 * контакты, справа короткая форма, ниже — доставка с паровозом
 * («обсудим новогодний подарок оставить как у меня», «доставка как у меня»).
 *
 * Форма короткая намеренно: полная анкета из девяти шагов стоит выше,
 * сразу под «Отделом заботы». Здесь — три поля для тех, кто анкету
 * заполнять не хочет. Уходит в ту же Google Таблицу, что и всё остальное.
 */

type State = "idle" | "sending" | "done" | "error";

const inputCls =
  "w-full rounded-xl border border-cream/20 bg-cream/[0.06] px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-gold/60";

const PHONES = [
  ["Отдел продаж", "8 (861) 250-65-51"],
  ["Мобильный", "8 (988) 246-15-51"],
] as const;

const REGIONS = [
  ["Краснодар и Ростов-на-Дону", "от 25 000 ₽"],
  ["Краснодарский край", "от 35 000 ₽"],
  ["Ростовская область", "от 50 000 ₽"],
  ["Ставропольский край, Республика Крым", "от 100 000 ₽"],
  ["Волгоградская область и Волгоград", "от 100 000 ₽"],
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const telHref = (p: string) => "tel:+7" + p.replace(/\D/g, "").slice(1);

function QuickForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>;
    // в форме одно поле «телефон или почта» — раскладываем его по колонкам
    // таблицы, чтобы менеджер видел контакт там, где привык
    const contact = (data.contact || "").trim();
    const isEmail = contact.includes("@");
    try {
      await sendLead({
        name: data.name,
        email: isEmail ? contact : "",
        phone: isEmail ? "" : contact,
        comment: data.message || "Короткая заявка с сайта",
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-bordeaux-deep to-night-deep p-9 text-center shadow-[0_20px_45px_-20px_rgba(8,14,30,0.6)]">
        <h3 className="font-display text-2xl text-cream">Заявка у нас 🎄</h3>
        <p className="mt-3 leading-relaxed text-muted">
          Менеджер Отдела заботы свяжется с вами в ближайшее рабочее время
          и уточнит детали заказа.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-gold/20 bg-gradient-to-br from-bordeaux-deep to-night-deep p-7 shadow-[0_20px_45px_-20px_rgba(8,14,30,0.6)] md:p-9"
    >
      <h3 className="font-display text-2xl text-cream">Оставить заявку</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Заполните форму — менеджер свяжется с вами для уточнения деталей заказа.
      </p>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-semibold text-muted">Имя</span>
        <input name="name" required autoComplete="name" className={inputCls} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-muted">
          Телефон или email
        </span>
        <input name="contact" required autoComplete="tel" className={inputCls} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-muted">Комментарий</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Количество подарков, бюджет, сроки, место поставки"
          className={inputCls + " resize-y"}
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-ribbon mt-6 w-full cursor-pointer rounded-full px-8 py-4 font-medium disabled:opacity-60"
      >
        {state === "sending" ? "Отправляем…" : "Отправить заявку"}
      </button>

      {state === "error" && (
        <p className="mt-4 text-sm text-bordeaux-bright">
          Что-то пошло не так — попробуйте ещё раз или позвоните:
          8 (861) 250-65-51.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted/80">
        Нажимая кнопку, вы даёте{" "}
        <a
          href={asset("/consent")}
          className="text-gold underline underline-offset-4 hover:text-gold-soft"
        >
          согласие на обработку персональных данных
        </a>{" "}
        и принимаете{" "}
        <a
          href={asset("/privacy")}
          className="text-gold underline underline-offset-4 hover:text-gold-soft"
        >
          политику конфиденциальности
        </a>
        .
      </p>
    </form>
  );
}

export default function Contacts() {
  return (
    <section id="contacts" className="section-vignette relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...reveal}>
            <p className="text-xs uppercase tracking-[0.3em] text-gold/85">Контакты</p>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
              Обсудим ваш <span className="glow-gold">новогодний заказ</span>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              Оставьте заявку или свяжитесь напрямую — ответим в ближайшее
              рабочее время и подготовим коммерческое предложение под ваши
              задачи.
            </p>

            <ul className="mt-8 grid gap-5">
              {PHONES.map(([label, phone]) => (
                <li key={phone} className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-[0.16em] text-gold">
                    {label}
                  </span>
                  <a
                    href={telHref(phone)}
                    className="text-lg font-semibold text-cream transition-colors hover:text-gold"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-[0.16em] text-gold">
                  Электронная почта
                </span>
                <a
                  href="mailto:info@kolibri-ug.ru"
                  className="text-lg font-semibold text-cream transition-colors hover:text-gold"
                >
                  info@kolibri-ug.ru
                </a>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-[0.16em] text-gold">
                  Производство
                </span>
                <span className="text-muted">г. Краснодар, ул. Уральская, 104</span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-[0.16em] text-gold">
                  География доставки
                </span>
                <span className="text-muted">
                  Собственный автопарк, доставка по всей России из Краснодара
                </span>
              </li>
            </ul>

            <p className="mt-7 text-xs text-muted/70">
              ООО ТК «Колибри» · ИНН 2312230564 · ОГРН 1152312007473
            </p>
          </motion.div>

          <motion.div {...reveal} id="quick-form">
            <QuickForm />
          </motion.div>
        </div>

        {/* Доставка — её блок: текст слева, паровоз справа, пороги под «плюсом» */}
        <motion.div
          {...reveal}
          id="delivery"
          className="mt-14 flex flex-col items-center gap-9 rounded-3xl border border-cream/10 bg-night-soft/45 p-7 md:p-9 lg:flex-row"
        >
          <div className="flex-[1.1]">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/85">
              Доставка до дверей
            </p>
            <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
              Доставим бережно, <span className="glow-gold">с заботой о вас</span> и вашей
              компании!
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              Отправляем из Краснодара по всей России. Собственный автопарк
              и прямые договоры с перевозчиками — дата поставки фиксируется
              в договоре.
            </p>

            {/* Правка: «аналогично для блока с паровозом» — таблица порогов
                спрятана под + , блок стал короче */}
            <div className="mt-5">
              <Disclosure
                question="Куда и от какой суммы доставляем бесплатно?"
                tone="dark"
                full
              >
                <dl className="divide-y divide-cream/10 rounded-2xl border border-cream/10 bg-night-deep/40 px-5 py-2">
                  {REGIONS.map(([name, sum]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-sm text-cream/90">{name}</dt>
                      <dd className="whitespace-nowrap font-display text-lg text-gold">
                        {sum}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted/75">
                  В остальные регионы России доставляем собственным автопарком
                  и по прямым договорам с перевозчиками — сроки и стоимость
                  фиксируем в договоре, уточняйте у менеджера. Занос в помещение
                  и подъём на этаж — дополнительная услуга.
                </p>
              </Disclosure>
            </div>
          </div>

          {/* Паровоз из каталога — «паровоз добавим где доставка». Кладём
              на кремовую карточку: его собственный белёсо-голубой фон иначе
              читается случайной плашкой на тёмном. */}
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-cream/90 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] lg:flex-[0.9]">
            <img
              src={asset("/brand/train.webp")}
              alt="Новогодний поезд с подарками"
              width={1000}
              height={879}
              loading="lazy"
              className="w-full rounded-xl"
              style={{ filter: "sepia(0.12) saturate(1.04)" }}
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
