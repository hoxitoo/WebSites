"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

/**
 * Шапка сайта — по её переработке (сентябрь 2026): «нравится моя верхушка
 * сайта». От её макета здесь: липкая при прокрутке полупрозрачная панель,
 * меню из четырёх разделов, телефон с иконкой и главная кнопка «Оставить
 * заявку», которая ведёт в анкету.
 *
 * Над ней осталась наша узкая полоса контактов — по её же прежней правке
 * «контакты сверху и снизу». Полоса не липкая: уезжает при прокрутке,
 * а сама шапка остаётся. На узких экранах полоса уходит в меню целиком,
 * иначе занимает две строки из трёх видимых на телефоне 360×600.
 */

const NAV = [
  { label: "Главная", href: "#hero" },
  { label: "О компании", href: "#about" },
  { label: "Услуги и продукция", href: "#services" },
  { label: "Контакты", href: "#contacts" },
] as const;

const PHONES = ["8 (861) 250-65-51", "8 (988) 246-15-51"] as const;
const TG = "https://telegram.me/+f0vDIlkA2yY3ODIy";

const telHref = (p: string) => "tel:+7" + p.replace(/\D/g, "").slice(1);

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Esc закрывает панель, как любое всплывающее окно на сайте
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Полоса контактов — только на широком экране */}
      <div className="relative z-40 hidden border-b border-cream/10 bg-night-deep/60 px-4 py-2 backdrop-blur-sm lg:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-sm text-cream/80">
          {PHONES.map((p) => (
            <a key={p} href={telHref(p)} className="transition-colors hover:text-gold">
              {p}
            </a>
          ))}
          <a href="mailto:info@kolibri-ug.ru" className="transition-colors hover:text-gold">
            info@kolibri-ug.ru
          </a>
          <span className="text-cream/25">·</span>
          {/* WhatsApp убран с сайта по правке заказчицы */}
          <a
            href={TG}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            Telegram
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-cream/10 bg-night-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3 md:px-12">
          {/* «вывернутая» версия фирменного логотипа: кремово-золотая, без
              плашки — собирается из оригинала скриптом scripts/make-logo.mjs */}
          <a
            href="#hero"
            aria-label="Колибри — на главную"
            className="mr-auto inline-flex shrink-0 transition-opacity duration-300 hover:opacity-80"
          >
            <img
              src={asset("/logo-kolibri-row.webp")}
              alt="Торговая компания «Колибри»"
              width={964}
              height={400}
              className="h-9 w-auto sm:h-11 md:h-12"
              draggable={false}
            />
          </a>

          <nav aria-label="Разделы сайта" className="hidden lg:block">
            <ul className="flex items-center gap-7 whitespace-nowrap text-sm font-semibold text-cream/85">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="border-b-2 border-transparent pb-1 transition-colors duration-200 hover:border-gold/70 hover:text-cream"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={telHref(PHONES[0])}
            className="hidden items-center gap-2 whitespace-nowrap font-semibold text-cream transition-colors hover:text-gold lg:flex"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] text-gold">
              <path
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                fill="currentColor"
              />
            </svg>
            {PHONES[0]}
          </a>

          {/* Главная кнопка шапки ведёт в анкету — её правка: «кнопка первая
              получить индивидуальное предложение тоже перекидывает на эту
              анкету форму» */}
          <a
            href="#lead"
            className="btn-ribbon hidden whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold lg:block"
          >
            Оставить заявку
          </a>

          {/* кнопка меню — до lg */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Закрыть меню" : "Меню и контакты"}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10 lg:hidden"
          >
            {/* три полоски превращаются в крестик */}
            <span className="relative block h-4 w-5" aria-hidden>
              <motion.span
                animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-0 block h-[2px] w-5 bg-current"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-[7px] block h-[2px] w-5 bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 block h-[2px] w-5 bg-current"
              />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="site-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-cream/10 bg-night-deep/95 backdrop-blur-sm lg:hidden"
            >
              <nav aria-label="Разделы сайта" className="px-5 py-4">
                <ul className="flex flex-col">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block border-b border-cream/10 py-3 text-cream/90 transition-colors hover:text-gold"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {PHONES.map((p) => (
                    <a key={p} href={telHref(p)} className="text-cream/85 hover:text-gold">
                      {p}
                    </a>
                  ))}
                  <a href="mailto:info@kolibri-ug.ru" className="text-cream/85 hover:text-gold">
                    info@kolibri-ug.ru
                  </a>
                  <a
                    href={TG}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/85 hover:text-gold"
                  >
                    Telegram
                  </a>
                </div>

                <a
                  href="#lead"
                  onClick={() => setOpen(false)}
                  className="btn-ribbon mt-4 block rounded-full px-5 py-3 text-center text-sm font-semibold"
                >
                  Оставить заявку
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
