"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Magnetic from "./Magnetic";

/**
 * Квиз-анкета — те же 5 вопросов, что задаёт бот «Служба заботы Деда Мороза».
 * Ответы уходят в ту же Google Таблицу (лист «Заявки») с источником «сайт».
 */

const QUESTIONS = [
  {
    key: "employees",
    title: "Сколько сотрудников хотите поздравить?",
    options: ["до 100", "100–300", "300–1000", "1000 и больше"],
  },
  {
    key: "kids",
    title: "А детских подарков сколько примерно понадобится?",
    options: ["до 100", "100–300", "больше 300", "Пока не знаю"],
  },
  {
    key: "budget",
    title: "Какой примерно бюджет на один подарок?",
    options: ["до 500 ₽", "500–1000 ₽", "1000–2000 ₽", "2000 ₽ и выше"],
  },
  {
    key: "packaging",
    title: "В какой упаковке доставить чудо?",
    options: ["Картон", "Жесть", "Текстиль", "Наборы", "Доверимся вам"],
  },
  {
    key: "personalization",
    title: "Сделать подарки фирменными — с вашим логотипом?",
    options: ["С логотипом компании", "Без персонализации", "Подскажите варианты"],
  },
] as const;

const TOTAL = QUESTIONS.length; // 5 вопросов + шаг контактов

type SendState = "idle" | "sending" | "error";

const stepAnim = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export default function LeadForm() {
  const [step, setStep] = useState(0); // 0..4 вопросы, 5 контакты, 6 готово
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [send, setSend] = useState<SendState>("idle");

  function pick(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSend("sending");
    const form = e.currentTarget;
    const contact = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, ...contact }),
      });
      if (!res.ok) throw new Error("bad status");
      setSend("idle");
      setStep(TOTAL + 1);
    } catch {
      setSend("error");
    }
  }

  const input =
    "w-full rounded-xl border border-cream/15 bg-night-soft/60 px-5 py-3.5 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-gold/60";

  return (
    <section id="lead" className="section-vignette relative py-28">
      <div className="mx-auto max-w-2xl px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl md:text-5xl"
        >
          Соберём подарок <span className="candle-sweep">под вашу команду</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-center text-muted"
        >
          5 коротких вопросов — как в нашей Службе заботы Деда Мороза.
          По ответам пришлём каталог и персональное коммерческое предложение.
        </motion.p>

        {/* прогресс-гирлянда */}
        {step <= TOTAL && (
          <div className="mt-10 flex items-center justify-center gap-2.5" aria-hidden>
            {Array.from({ length: TOTAL + 1 }, (_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full transition-all duration-500"
                style={{
                  background: i <= step ? "#e8b968" : "rgba(247,243,236,0.15)",
                  boxShadow: i <= step ? "0 0 8px rgba(232,185,104,0.7)" : "none",
                }}
              />
            ))}
          </div>
        )}

        <div className="relative mt-8 min-h-[340px]">
          <AnimatePresence mode="wait">
            {/* ————— вопросы кнопками ————— */}
            {step < TOTAL && (
              <motion.div key={`q${step}`} {...stepAnim}>
                <p className="text-center text-xs uppercase tracking-[0.3em] text-gold/70">
                  Вопрос {step + 1} из {TOTAL}
                </p>
                <h3 className="mt-3 text-center font-display text-2xl text-cream md:text-3xl">
                  {QUESTIONS[step].title}
                </h3>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => pick(QUESTIONS[step].key, opt)}
                      className="cursor-pointer rounded-xl border border-cream/15 bg-night-soft/50 px-5 py-4 text-sm text-cream/90 transition-all duration-200 hover:border-gold/60 hover:bg-night-soft hover:text-gold"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ————— контакты ————— */}
            {step === TOTAL && (
              <motion.div key="contact" {...stepAnim}>
                <p className="text-center text-xs uppercase tracking-[0.3em] text-gold/70">
                  Почти готово
                </p>
                <h3 className="mt-3 text-center font-display text-2xl text-cream md:text-3xl">
                  Куда прислать каталог и предложение?
                </h3>
                <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                  <input name="name" required placeholder="Ваше имя" className={input} />
                  <input name="company" required placeholder="Компания" className={input} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Рабочая почта"
                    className={input}
                  />
                  <input name="phone" placeholder="Телефон (по желанию)" className={input} />
                  <div className="mt-2 text-center md:col-span-2">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={send === "sending"}
                        className="cursor-pointer rounded-full bg-bordeaux px-10 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)] disabled:opacity-60"
                      >
                        {send === "sending" ? "Отправляем…" : "Получить каталог и КП"}
                      </button>
                    </Magnetic>
                    {send === "error" && (
                      <p className="mt-4 text-sm text-bordeaux-bright">
                        Что-то пошло не так — попробуйте ещё раз или позвоните нам:
                        8 (861) 250-65-51.
                      </p>
                    )}
                    <p className="mt-4 text-xs text-muted/60">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ————— готово ————— */}
            {step === TOTAL + 1 && (
              <motion.div
                key="done"
                {...stepAnim}
                className="flex min-h-[340px] flex-col items-center justify-center text-center"
              >
                <h3 className="font-display text-3xl text-cream">
                  Спасибо! <span className="glow-gold">Служба заботы</span> уже собирает
                  ваш каталог 🎄
                </h3>
                <p className="mt-4 max-w-md text-muted">
                  В ближайшее время менеджер пришлёт на почту каталог и персональное
                  коммерческое предложение под ваши ответы.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* назад */}
        {step > 0 && step <= TOTAL && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="cursor-pointer text-sm text-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              ← Вернуться к предыдущему вопросу
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
