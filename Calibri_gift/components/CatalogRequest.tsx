"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendLead } from "@/lib/sendLead";
import Portal from "./Portal";
import { asset } from "@/lib/asset";

/**
 * Кнопка «Получить каталог» и маленькое окно к ней.
 *
 * Правка заказчицы: «получить каталог — как будто бы не удобно проходить
 * сразу подборку подарков? может просто предложить новое окошко с обратной
 * связью куда отправить каталог». Поэтому здесь только контакты — четыре
 * поля, без анкеты. Полная анкета осталась на второй кнопке
 * («Получить индивидуальное предложение»), она ведёт в блок #lead.
 *
 * Заявка уходит в ту же таблицу, в колонке «Комментарий» будет
 * «Запрос каталога» — чтобы менеджер сразу видел, что человек хочет.
 */

type State = "idle" | "sending" | "done" | "error";

const inputCls =
  "w-full rounded-xl border border-cream/15 bg-night-soft/60 px-5 py-3.5 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-gold/60";

export default function CatalogRequest({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");

  // при открытии возвращаем чистую форму: иначе после успешной отправки
  // окно так и остаётся с «Каталог уже собираем»
  const openModal = () => {
    setState("idle");
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>;
    try {
      await sendLead({ ...data, comment: "Запрос каталога" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        {children}
      </button>

      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-night-deep/92 p-5 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Получить каталог"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl border border-cream/15 bg-night p-7 shadow-[0_30px_90px_rgba(8,14,30,0.7)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                  className="absolute right-4 top-4 cursor-pointer text-sm text-muted transition-colors hover:text-gold"
                >
                  ✕
                </button>

                {state === "done" ? (
                  <div className="py-6 text-center">
                    <h3 className="font-display text-2xl text-cream">
                      Каталог уже собираем 🎄
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      Отправим его на указанную почту. Если появятся вопросы — с
                      вами свяжется менеджер Отдела заботы.
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-6 cursor-pointer rounded-full border border-gold/40 px-6 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
                    >
                      Закрыть
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="pr-6 font-display text-2xl text-cream">
                      Куда отправить каталог?
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Заполнять анкету не нужно — оставьте контакты, и мы
                      пришлём каталог на почту.
                    </p>
                    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
                      <input
                        name="name"
                        required
                        placeholder="Ваше имя"
                        className={inputCls}
                      />
                      <input
                        name="company"
                        required
                        placeholder="Компания"
                        className={inputCls}
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="Рабочая почта"
                        className={inputCls}
                      />
                      <input
                        name="phone"
                        placeholder="Телефон (по желанию)"
                        className={inputCls}
                      />
                      <button
                        type="submit"
                        disabled={state === "sending"}
                        className="mt-2 cursor-pointer btn-ribbon rounded-full px-8 py-3.5 font-medium disabled:opacity-60"
                      >
                        {state === "sending"
                          ? "Отправляем…"
                          : "Отправить каталог мне"}
                      </button>
                      {state === "error" && (
                        <p className="text-sm text-bordeaux-bright">
                          Что-то пошло не так — попробуйте ещё раз или
                          позвоните: 8 (861) 250-65-51.
                        </p>
                      )}
                      <p className="text-center text-xs text-muted/80">
                        Нажимая кнопку, вы соглашаетесь с{" "}
                        <a
                          href={asset("/privacy")}
                          className="text-gold underline underline-offset-4 hover:text-gold-soft"
                        >
                          обработкой персональных данных
                        </a>
                        .
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
