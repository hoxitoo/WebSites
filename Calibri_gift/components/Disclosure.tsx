"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Свёрнутый блок: вопрос и плюс, по нажатию раскрывается содержимое.
 *
 * Правка заказчицы: «блок с индивидуальным подарком переделать в вопрос
 * „Хотите посмотреть как собирается уникальный подарок?“ и вынести весь
 * текст под + (тап по + раскрывает блок свёрнутый) — аналогично для блока
 * с паровозом». Так страница становится короче: она жаловалась, что сайт
 * долго листать и «на середине уже устали».
 *
 * `tone` — под тёплые винные секции («warm») и синие («dark»). Раньше
 * тёплые секции были светлыми бежевыми, отсюда прежнее имя «light».
 */
export default function Disclosure({
  question,
  children,
  tone = "warm",
  className = "",
}: {
  question: string;
  children: React.ReactNode;
  tone?: "warm" | "dark";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const warm = tone === "warm";

  return (
    <div className={"mx-auto max-w-3xl " + className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className={
          "flex w-full cursor-pointer items-center justify-between gap-5 rounded-2xl border px-5 py-4 text-left transition-colors md:px-7 md:py-5 " +
          (warm
            ? "border-cream/12 bg-warm-soft/70 hover:border-gold/45"
            : "border-cream/15 bg-night-soft/50 hover:border-gold/45")
        }
      >
        <span
          className={
            "font-display text-lg leading-snug md:text-2xl " +
            "text-cream"
          }
        >
          {question}
        </span>
        {/* плюс превращается в минус — понятно, что блок раскрыт */}
        <span
          aria-hidden
          className={
            "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-2xl leading-none " +
            (warm ? "border-gold/40 text-gold" : "border-gold/40 text-gold")
          }
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            +
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
