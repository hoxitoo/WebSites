"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Magnetic from "./Magnetic";

type State = "idle" | "sending" | "done" | "error";

export default function LeadForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  const input =
    "w-full rounded-xl border border-cream/15 bg-night-soft/60 px-5 py-3.5 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-gold/60";

  return (
    <section id="lead" className="section-vignette relative py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl md:text-5xl"
        >
          Подарите команде <span className="candle-sweep">заботу</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-center text-muted"
        >
          Оставьте контакты — пришлём каталог и подготовим коммерческое
          предложение под вашу компанию. Это ни к чему не обязывает.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={onSubmit}
          className="mt-12 grid gap-4 md:grid-cols-2"
        >
          <input name="name" required placeholder="Ваше имя" className={input} />
          <input name="company" required placeholder="Компания" className={input} />
          <input name="email" type="email" required placeholder="Рабочая почта" className={input} />
          <input name="phone" placeholder="Телефон (по желанию)" className={input} />
          <input
            name="teamSize"
            placeholder="Сколько сотрудников хотите поздравить?"
            className={`${input} md:col-span-2`}
          />
          <div className="mt-2 text-center md:col-span-2">
            <Magnetic>
              <button
                type="submit"
                disabled={state === "sending"}
                className="cursor-pointer rounded-full bg-bordeaux px-10 py-4 font-medium text-cream shadow-[0_0_40px_rgba(160,48,73,0.45)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(232,185,104,0.35)] disabled:opacity-60"
              >
                {state === "sending" ? "Отправляем…" : "Получить каталог и КП"}
              </button>
            </Magnetic>
            {state === "done" && (
              <p className="mt-4 text-sm text-gold">
                Спасибо! Служба заботы уже готовит для вас каталог 🎄
              </p>
            )}
            {state === "error" && (
              <p className="mt-4 text-sm text-bordeaux-bright">
                Что-то пошло не так — попробуйте ещё раз или напишите нам напрямую.
              </p>
            )}
            <p className="mt-4 text-xs text-muted/60">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
