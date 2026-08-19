"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * Два QR-кода на бота «Отдел заботы Деда Мороза» — Telegram и MAX.
 *
 * Сделано по её же макету третьей страницы каталога: «ОТСКАНИРУЙТЕ QR-КОД
 * или напишите „старт“ в чат — НАЧНЁМ ПОДБОР», два кода рядом.
 * Коды рисует scripts/make-qr.mjs — при смене ссылки на бота
 * достаточно перегенерировать.
 */

const TG_URL = process.env.NEXT_PUBLIC_TG_BOT_URL ?? "https://t.me/kolibri_care_bot";
const MAX_URL = process.env.NEXT_PUBLIC_MAX_BOT_URL ?? "https://max.ru/id2312230564_bot";

const MESSENGERS = [
  { name: "Telegram", url: TG_URL, qr: "/bot-qr.png" },
  { name: "MAX", url: MAX_URL, qr: "/max-qr.png" },
] as const;

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * Тот же блок с QR, но встроенный в светлую секцию «Чтобы декабрь прошёл
 * спокойно» — правка заказчицы «qr кода переместить в блок чтобы декабрь
 * прошел спокойно». Отдельная секция BotQr со страницы убрана: два блока
 * с одними и теми же кодами не нужны.
 */
export function BotQrInline() {
  return (
    <motion.div {...reveal} className="mt-16">
      <p className="text-xs uppercase tracking-[0.3em] text-bordeaux">
        Отсканируйте QR-код — и начнём подбор
      </p>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-night/75">
        Или просто напишите «старт» в чат. Ответите на несколько коротких
        вопросов — и мы подберём три варианта под ваш бюджет и сроки.
      </p>
      <div className="mt-8 flex flex-wrap items-start justify-center gap-8 sm:gap-14">
        {MESSENGERS.map((m) => (
          <a
            key={m.name}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <span className="block rounded-2xl border border-night/10 bg-cream p-3.5 shadow-[0_12px_40px_rgba(16,28,51,0.14)] transition-transform duration-300 group-hover:-translate-y-1.5">
              <img
                src={asset(m.qr)}
                alt={`QR-код: Отдел заботы Деда Мороза в ${m.name}`}
                width={200}
                height={200}
                className="h-36 w-36 md:h-44 md:w-44"
                loading="lazy"
                draggable={false}
              />
            </span>
            <span className="mt-3 block text-sm uppercase tracking-[0.2em] text-night/70 group-hover:text-bordeaux">
              {m.name}
            </span>
          </a>
        ))}
      </div>
      <p className="mt-8 text-base text-night/70">
        Не пользуетесь мессенджерами?{" "}
        <a
          href="#lead"
          className="text-bordeaux underline-offset-4 transition-colors hover:underline"
        >
          Оставьте заявку на сайте
        </a>
      </p>
    </motion.div>
  );
}

export default function BotQr() {
  return (
    <section className="section-vignette relative py-24">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <motion.p {...reveal} className="text-xs uppercase tracking-[0.3em] text-gold/85">
          Отдел заботы Деда Мороза
        </motion.p>
        <motion.h2
          {...reveal}
          className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight md:text-5xl"
        >
          Отсканируйте QR-код — и <span className="glow-gold">начнём подбор</span>
        </motion.h2>
        <motion.p {...reveal} className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Или просто напишите «старт» в чат. Ответите на несколько коротких
          вопросов — и мы подберём три варианта под ваш бюджет и сроки.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-8 sm:gap-14">
          {MESSENGERS.map((m, i) => (
            <motion.a
              key={m.name}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="group block"
            >
              {/* QR на светлой плашке — так камера считывает уверенно */}
              <span className="block rounded-2xl bg-cream p-3.5 shadow-[0_20px_60px_rgba(8,14,30,0.5)] transition-transform duration-300 group-hover:-translate-y-1.5">
                <img
                  src={asset(m.qr)}
                  alt={`QR-код: Отдел заботы Деда Мороза в ${m.name}`}
                  width={200}
                  height={200}
                  className="h-40 w-40 md:h-48 md:w-48"
                  loading="lazy"
                  draggable={false}
                />
              </span>
              <span className="mt-4 block text-sm uppercase tracking-[0.2em] text-cream/85 group-hover:text-gold">
                {m.name}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.p {...reveal} className="mt-9 text-sm text-muted">
          Не пользуетесь мессенджерами?{" "}
          <a
            href="#lead"
            className="text-gold underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
          >
            Оставьте заявку на сайте
          </a>
        </motion.p>
      </div>
    </section>
  );
}
