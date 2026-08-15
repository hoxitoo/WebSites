"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

const TG_URL = process.env.NEXT_PUBLIC_TG_BOT_URL ?? "https://t.me/kolibri_care_bot";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * QR на бота «Отдел заботы Деда Мороза» — внизу страницы.
 * Наведите камеру телефона → откроется чат с ботом.
 */
export default function BotQr() {
  return (
    <section className="section-vignette relative py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <div className="grid items-center gap-10 rounded-3xl border border-gold/20 bg-night-soft/40 p-8 md:grid-cols-[auto_1fr] md:p-12">
          {/* QR на светлой плашке — чтобы камера уверенно считывала */}
          <motion.a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            {...reveal}
            className="mx-auto block rounded-2xl bg-cream p-4 shadow-[0_20px_60px_rgba(27,16,12,0.5)]"
          >
            <img
              src={asset("/bot-qr.png")}
              alt="QR-код: Отдел заботы Деда Мороза в Telegram"
              width={200}
              height={200}
              className="h-44 w-44 md:h-52 md:w-52"
              loading="lazy"
              draggable={false}
            />
          </motion.a>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }} className="text-center md:text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold/80">
              Отдел заботы Деда Мороза
            </p>
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              Наведите камеру — и <span className="glow-gold">начнём</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted md:mx-0">
              Несколько вопросов в Telegram — и мы соберём каталог и персональное
              предложение под вашу компанию. Пара минут, ни к чему не обязывает.
            </p>
            <a
              href={TG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-gold/40 px-6 py-3 text-sm text-gold transition-colors duration-200 hover:bg-gold/10"
            >
              Открыть бота в Telegram
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
