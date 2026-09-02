"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CatalogRequest from "./CatalogRequest";
import { asset } from "@/lib/asset";

/**
 * Шапка сайта: логотип, меню разделов и контакты.
 *
 * Правка заказчицы: «вверху сайта о нас, доставка и т.д. шапкой» и
 * «контакты нужно и сверху и снизу».
 *
 * На широком экране всё видно сразу: полоса контактов, логотип, меню,
 * кнопка каталога. На узком — так было нельзя: меню из пяти пунктов,
 * два телефона, почта и Telegram выстраивались в строчки и занимали
 * 212 px, то есть 35% экрана телефона 360×600. Кнопка «Получить
 * индивидуальное предложение» уезжала на 163 px ниже сгиба — человек
 * открывал сайт и видел одну навигацию вместо предложения.
 *
 * Поэтому до lg остаётся компактная строка (логотип и кнопка меню), а
 * контакты с разделами прячутся в раскрывающуюся панель.
 */

const NAV = [
  { label: "О нас", href: "#about" },
  { label: "Каталог", href: "#catalog" },
  { label: "Отдел заботы", href: "#care" },
  { label: "Доставка", href: "#delivery" },
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
      {/* Полоса контактов — только на широком экране: на узком она уходит
          в панель меню, иначе занимает две строки из трёх видимых. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 hidden border-b border-cream/10 bg-night-deep/45 px-4 py-2.5 backdrop-blur-sm lg:block"
      >
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
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 md:px-12 lg:py-6"
      >
        {/* «вывернутая» версия фирменного логотипа: кремово-золотая, без
            плашки — собирается из оригинала скриптом scripts/make-logo.mjs */}
        <a
          href="#"
          aria-label="Колибри — торговая компания"
          className="inline-flex shrink-0 transition-opacity duration-300 hover:opacity-80"
        >
          <img
            src={asset("/logo-kolibri-row.webp")}
            alt="Торговая компания «Колибри»"
            width={964}
            height={400}
            className="h-11 w-auto sm:h-14 md:h-20"
            draggable={false}
          />
        </a>

        {/* меню в строку — от lg, где для него есть место */}
        <nav aria-label="Разделы сайта" className="hidden lg:block">
          <ul className="flex items-center gap-7 whitespace-nowrap text-sm text-cream/85">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors duration-200 hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <CatalogRequest className="hidden cursor-pointer whitespace-nowrap rounded-full border border-gold/40 px-5 py-2 text-sm text-gold transition-colors duration-200 hover:bg-gold/10 lg:block">
          Получить каталог
        </CatalogRequest>

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
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 overflow-hidden border-y border-cream/10 bg-night-deep/95 backdrop-blur-sm lg:hidden"
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

              <CatalogRequest className="mt-4 w-full cursor-pointer rounded-full border border-gold/40 px-5 py-3 text-sm text-gold transition-colors duration-200 hover:bg-gold/10">
                Получить каталог
              </CatalogRequest>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
