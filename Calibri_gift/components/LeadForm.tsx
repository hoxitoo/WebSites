"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Magnetic from "./Magnetic";
import { sendLead } from "@/lib/sendLead";
import { asset } from "@/lib/asset";

/**
 * Квиз-анкета — те же вопросы и в том же порядке, что задаёт бот
 * «Отдел заботы Деда Мороза»: вопросы кнопками → город → дата → контакты.
 * Ответы уходят в ту же Google Таблицу (лист «Заявки») с источником «сайт».
 */

type Base = {
  key: string;
  title: string;
  hint?: string; // пояснение под вопросом (мелким текстом)
  when?: (a: Record<string, string>) => boolean;
};
type Step =
  | (Base & { type: "buttons"; options: readonly string[] })
  | (Base & { type: "text"; placeholder: string })
  | (Base & { type: "date"; options: readonly string[] });

// «крупный» заказ — от 100 подарков: только ему предлагаем логотип
const BIG_ORDER = (a: Record<string, string>) => !!a.kids && a.kids !== "до 100";
const WANTS_BRANDING = (a: Record<string, string>) =>
  BIG_ORDER(a) && a.personalization === "Нужна персонализация";

const QUIZ: readonly Step[] = [
  {
    // первым — именно детские подарки (компания заточена на них)
    key: "kids",
    type: "buttons",
    title: "Какое примерное количество детских подарков планируете?",
    options: [
      "до 100",
      "от 100 до 300",
      "от 300 до 500",
      "от 500 до 1000",
      "от 1000 до 1500",
      "от 1500 до 2500",
      "от 2500 до 5000",
      "более 5000",
    ],
  },
  {
    key: "budget",
    type: "buttons",
    title: "Какой примерно бюджет на один подарок?",
    options: [
      "до 500 ₽",
      "500–1000 ₽",
      "1000–2000 ₽",
      "2000–3000 ₽",
      "3000–4000 ₽",
      "более 4000 ₽",
    ],
  },
  {
    key: "packaging",
    type: "buttons",
    title: "В какой упаковке предпочитаете получить чудо?",
    // список тот же, что в боте (правка «жесть → жестяная упаковка,
    // добавить везде слово упаковка») и совпадает с плитками каталога
    options: [
      "Наборы",
      "Картонная упаковка",
      "Жестяная упаковка",
      "Текстильная упаковка",
      "Комбинированная упаковка",
      "Премиум упаковка",
      "Доверимся вам",
    ],
  },
  {
    // шаг 1: нужна ли персонализация вообще
    key: "personalization",
    type: "buttons",
    title: "Хотите подчеркнуть, что подарок — от вашей компании?",
    options: ["Нужна персонализация", "Не нужна персонализация"],
    when: BIG_ORDER,
  },
  {
    // шаг 2: где именно разместить логотип
    key: "branding",
    type: "buttons",
    title: "Где разместим логотип?",
    hint:
      "Наклейка на коробку и подвесная бирка — от 100 шт., фирменный значок — " +
      "от 50 шт., открытка с посланием — от 100 шт.",
    options: [
      "Наклейка на коробку",
      "Подвесная бирка",
      "Фирменный значок",
      "Открытка с посланием",
      "Подскажите варианты",
    ],
    when: WANTS_BRANDING,
  },
  {
    // Правка заказчицы: количество сотрудников убрали, спрашиваем только
    // сам факт. Ключ прежний — колонки в таблице не сдвигаются.
    key: "employees",
    type: "buttons",
    title: "Нужны подарки для сотрудников и партнёров?",
    options: ["Да", "Нет"],
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
    options: [
      "с 1 по 15 ноября",
      "с 15 ноября по 1 декабря",
      "с 1 по 15 декабря",
      "до 20 декабря",
      "до 25 декабря",
    ],
  },
  {
    // правка заказчицы: «Следующий вопрос: Нужно на почту прислать готовый
    // каталог: Да / Нет». В боте он стоит сразу после почты, здесь почту
    // спрашиваем на последнем шаге — значит, это последний вопрос анкеты.
    key: "catalog",
    type: "buttons",
    title: "Нужно на почту прислать готовый каталог?",
    options: ["Да", "Нет"],
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

// «Вопрос N из M»: знаменатель — всегда полное число шагов квиза, он
// не меняется по ходу заполнения. Раньше он пересчитывался по видимым
// шагам, и когда условный вопрос отпадал, счётчик прыгал «4 из 6» →
// «5 из 5». Заказчица это заметила и попросила «5 из 6».
function progress(step: number, a: Record<string, string>) {
  let current = 0;
  for (let i = 0; i <= step && i < TOTAL; i++) if (shown(i, a)) current++;
  return { current, total: TOTAL };
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
    if (s && (s.type === "text" || s.type === "date")) {
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
    const payload = { ...answers, ...contact } as Record<string, string>;
    try {
      await sendLead(payload);
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
          Всего несколько коротких вопросов для нашего Отдела заботы, на которые
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
                {cur.hint && (
                  <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted">
                    {cur.hint}
                  </p>
                )}

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
                        className="cursor-pointer btn-ribbon rounded-full px-10 py-4 font-medium disabled:opacity-60"
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
                    <p className="mt-4 text-xs text-muted/80">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <a
                        href={asset("/privacy")}
                        className="text-gold underline underline-offset-4 hover:text-gold-soft"
                      >
                        обработкой персональных данных
                      </a>
                      .
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
                  Благодарю! <span className="glow-gold">Отдел заботы</span> уже
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

        {/* Вторичный путь для тех, кто не готов заполнять. Раньше здесь была
            ссылка «Созвонимся» на tel: — на компьютере без приложения для
            звонков браузер показывал окно «Открыть приложение», и заказчица
            приняла это за ошибку. Теперь виден сам номер: на телефоне он
            по-прежнему набирается одним касанием, на компьютере его просто
            читают и набирают. */}
        {step <= TOTAL && (
          <p className="mt-10 text-center text-sm leading-relaxed text-muted">
            Не готовы заполнять? Позвоните — 15 минут, и разберём ваш запрос:
            <br />
            {/* WhatsApp убран с сайта по правке заказчицы */}
            <a
              href="tel:+78612506551"
              className="mt-1 inline-block text-base text-gold underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
            >
              8 (861) 250-65-51
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
