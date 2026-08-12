"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Magnetic from "./Magnetic";

/**
 * Квиз-анкета — те же вопросы, что задаёт бот «Служба заботы Деда Мороза»:
 * 5 вопросов кнопками → город → дата → особое пожелание → контакты.
 * Ответы уходят в ту же Google Таблицу (лист «Заявки») с источником «сайт».
 */

type Base = {
  key: string;
  title: string;
  when?: (a: Record<string, string>) => boolean;
  // от каких ответов зависит when: пока они не даны, шаг считаем в общем числе
  // вопросов (иначе счётчик «из N» скакал бы на первом шаге)
  dependsOn?: readonly string[];
};
type Step =
  | (Base & { type: "buttons"; options: readonly string[] })
  | (Base & { type: "text"; placeholder: string })
  | (Base & { type: "date"; options: readonly string[] })
  | (Base & { type: "textarea"; placeholder: string; skip: true });

// крупный заказ (от 300 подарков) — только им показываем вопрос про логотип:
// персонализация имеет смысл на больших тиражах
const BIG_ORDER = (a: Record<string, string>) => {
  const big = ["300–1000", "1000 и больше", "больше 300"];
  return big.includes(a.employees ?? "") || big.includes(a.kids ?? "");
};

const QUIZ: readonly Step[] = [
  {
    key: "employees",
    type: "buttons",
    title: "Сколько сотрудников хотите поздравить в этом году?",
    options: ["до 100", "100–300", "300–1000", "1000 и больше"],
  },
  {
    key: "kids",
    type: "buttons",
    title: "Какое примерное количество детских подарков?",
    options: ["до 100", "100–300", "больше 300", "Пока не знаю"],
  },
  {
    key: "budget",
    type: "buttons",
    title: "Какой примерно бюджет на один подарок?",
    options: ["до 500 ₽", "500–1000 ₽", "1000–2000 ₽", "2000 ₽ и выше"],
  },
  {
    key: "packaging",
    type: "buttons",
    title: "В какой упаковке доставить чудо?",
    options: ["Картон", "Жесть", "Текстиль", "Наборы", "Премиум упаковка", "Доверимся вам"],
  },
  {
    key: "personalization",
    type: "buttons",
    title: "Нужен ли логотип фирмы на подарках?",
    options: ["С логотипом компании", "Без персонализации", "Подскажите варианты"],
    when: BIG_ORDER,
    dependsOn: ["employees", "kids"],
  },
  {
    key: "city",
    type: "text",
    title: "В какой город нужна доставка?",
    placeholder: "Например, Краснодар",
  },
  {
    key: "deliveryDate",
    type: "date",
    title: "К какой дате нужны подарки?",
    options: ["до 15 декабря", "до 20 декабря", "до 25 декабря", "к Новому году", "Пока не знаю"],
  },
  {
    key: "personalNote",
    type: "textarea",
    title: "Расскажите что-то особенное о ваших людях",
    placeholder: "Например: наши сотрудники обожают конфеты «Алёнка»",
    skip: true,
  },
];

const TOTAL = QUIZ.length; // квиз-шаги; далее — контакты, затем «готово»

/* ————— условные шаги: пропускаем те, чей when() ложен ————— */
const shown = (i: number, a: Record<string, string>) => !QUIZ[i].when || QUIZ[i].when!(a);

function nextVisible(from: number, a: Record<string, string>) {
  for (let i = from + 1; i < TOTAL; i++) if (shown(i, a)) return i;
  return TOTAL; // дальше — контакты
}

function prevVisible(from: number, a: Record<string, string>) {
  for (let i = Math.min(from, TOTAL) - 1; i >= 0; i--) if (shown(i, a)) return i;
  return 0;
}

// нумерация «Вопрос N из M» — только по видимым шагам. Условный шаг, судьба
// которого ещё не решена (нет ответов из dependsOn), считаем в общем числе.
function progress(step: number, a: Record<string, string>) {
  let total = 0;
  let current = 0;
  for (let i = 0; i < TOTAL; i++) {
    const q = QUIZ[i];
    const undecided = q.dependsOn?.every((k) => !a[k]) ?? false;
    if (!shown(i, a) && !undecided) continue;
    total++;
    if (i <= step) current = total;
  }
  return { current, total };
}

type SendState = "idle" | "sending" | "error";

const stepAnim = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const inputCls =
  "w-full rounded-xl border border-cream/15 bg-night-soft/60 px-5 py-3.5 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-gold/60";

export default function LeadForm() {
  const [step, setStep] = useState(0); // 0..TOTAL-1 квиз, TOTAL контакты, TOTAL+1 готово
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [send, setSend] = useState<SendState>("idle");

  // при переходе на текстовый шаг — подставляем уже данный ответ (для «назад»)
  useEffect(() => {
    const s = QUIZ[step];
    if (s && (s.type === "text" || s.type === "date" || s.type === "textarea")) {
      setDraft(answers[s.key] ?? "");
    }
  }, [step, answers]);

  function commit(key: string, value: string) {
    // условные шаги считаем от уже обновлённых ответов
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStep((s) => nextVisible(s, next));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSend("sending");
    const form = e.currentTarget;
    const contact = Object.fromEntries(new FormData(form).entries());
    const payload = { ...answers, ...contact, source: "сайт" };
    try {
      const directUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
      if (directUrl) {
        // статический хостинг (GitHub Pages): шлём в Apps Script напрямую.
        // Без Content-Type json — иначе CORS-preflight, который GAS не умеет;
        // ответ непрозрачный (no-cors), успех считаем оптимистично
        await fetch(directUrl, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("bad status");
      }
      setSend("idle");
      setStep(TOTAL + 1);
    } catch {
      setSend("error");
    }
  }

  const cur = step < TOTAL ? QUIZ[step] : null;
  const pr = progress(step, answers);

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
          Соберём подарок <span className="candle-sweep">под ваш запрос</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-center text-muted"
        >
          Всего несколько коротких вопросов для нашей Службы заботы, на которые
          мы предлагаем Вам ответить, чтобы получить каталог и Персональное КП.
        </motion.p>

        {/* прогресс-гирлянда (по видимым шагам + шаг контактов) */}
        {step <= TOTAL && (
          <div className="mt-10 flex items-center justify-center gap-2.5" aria-hidden>
            {Array.from({ length: pr.total + 1 }, (_, i) => {
              const done = i < (step >= TOTAL ? pr.total + 1 : pr.current);
              return (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full transition-all duration-500"
                  style={{
                    background: done ? "#e8b968" : "rgba(247,243,236,0.15)",
                    boxShadow: done ? "0 0 8px rgba(232,185,104,0.7)" : "none",
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="relative mt-8 min-h-[340px]">
          <AnimatePresence mode="wait">
            {/* ————— квиз-шаги ————— */}
            {cur && (
              <motion.div key={`q${step}`} {...stepAnim}>
                <p className="text-center text-xs uppercase tracking-[0.3em] text-gold/70">
                  Вопрос {pr.current} из {pr.total}
                </p>
                <h3 className="mt-3 text-center font-display text-2xl text-cream md:text-3xl">
                  {cur.title}
                </h3>

                {cur.type === "buttons" && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {cur.options.map((opt, i) => {
                      // нечётное число вариантов: последний по центру, а не сбоку
                      const lonely =
                        cur.options.length % 2 === 1 && i === cur.options.length - 1;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => commit(cur.key, opt)}
                          className={`cursor-pointer rounded-xl border border-cream/15 bg-night-soft/50 px-5 py-4 text-sm text-cream/90 transition-all duration-200 hover:border-gold/60 hover:bg-night-soft hover:text-gold ${
                            lonely ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.375rem)]" : ""
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {cur.type === "date" && (
                  <>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {cur.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => commit(cur.key, opt)}
                          className="cursor-pointer rounded-xl border border-cream/15 bg-night-soft/50 px-5 py-4 text-sm text-cream/90 transition-all duration-200 hover:border-gold/60 hover:bg-night-soft hover:text-gold"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="или впишите свою дату"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        disabled={!draft.trim()}
                        onClick={() => commit(cur.key, draft.trim())}
                        className="cursor-pointer whitespace-nowrap rounded-xl border border-gold/40 px-5 text-sm text-gold transition-colors hover:bg-gold/10 disabled:opacity-40"
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {cur.type === "text" && (
                  <div className="mt-8 flex gap-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={cur.placeholder}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && draft.trim()) commit(cur.key, draft.trim());
                      }}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      disabled={!draft.trim()}
                      onClick={() => commit(cur.key, draft.trim())}
                      className="cursor-pointer whitespace-nowrap rounded-xl border border-gold/40 px-5 text-sm text-gold transition-colors hover:bg-gold/10 disabled:opacity-40"
                    >
                      Далее
                    </button>
                  </div>
                )}

                {cur.type === "textarea" && (
                  <div className="mt-8">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={cur.placeholder}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                    <div className="mt-4 flex items-center justify-center gap-5">
                      <Magnetic>
                        <button
                          type="button"
                          onClick={() => commit(cur.key, draft.trim())}
                          className="cursor-pointer rounded-full bg-bordeaux px-8 py-3 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)]"
                        >
                          Далее
                        </button>
                      </Magnetic>
                      <button
                        type="button"
                        onClick={() => commit(cur.key, "")}
                        className="cursor-pointer text-sm text-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
                      >
                        Пропустить ✨
                      </button>
                    </div>
                  </div>
                )}
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
                  <input name="name" required placeholder="Ваше имя" className={inputCls} />
                  <input name="company" required placeholder="Компания" className={inputCls} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Рабочая почта"
                    className={inputCls}
                  />
                  <input name="phone" placeholder="Телефон (по желанию)" className={inputCls} />
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
                  Благодарю! <span className="glow-gold">Служба заботы</span> уже
                  собирает для Вас Индивидуальное предложение 🎄
                </h3>
                <p className="mt-4 max-w-md text-muted">
                  В ближайшее время пришлём на почту каталог и персональное
                  коммерческое предложение под ваши ответы. Если появятся
                  дополнительные вопросы — с Вами свяжется наш менеджер.
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
              onClick={() => setStep((s) => prevVisible(s, answers))}
              className="cursor-pointer text-sm text-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              ← Вернуться к предыдущему вопросу
            </button>
          </div>
        )}

        {/* вторичный CTA — звонок для тех, кто не готов заполнять */}
        {step <= TOTAL && (
          <p className="mt-10 text-center text-sm text-muted">
            Не готовы заполнять?{" "}
            <a
              href="tel:+78612506551"
              className="text-gold underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
            >
              Созвонимся — 15 минут, разберём ваш запрос
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
