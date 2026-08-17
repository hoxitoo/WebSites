"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Portal from "./Portal";

/**
 * Просмотр одной картинки поверх страницы: клик по плитке или фото —
 * и снимок открывается крупно.
 *
 * Ширина ограничена намеренно: картинки в каталоге заказчицы лежат
 * в 250–670 px, и если растянуть их на весь экран, они замылятся.
 */
export type Shot = { src: string; alt: string; caption?: string };

export default function Lightbox({
  shot,
  onClose,
}: {
  shot: Shot | null;
  onClose: () => void;
}) {
  // Esc закрывает, а пока открыто — страница под низом не скроллится
  useEffect(() => {
    if (!shot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [shot, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {shot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-night-deep/92 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={shot.caption ?? shot.alt}
          >
            <motion.img
              key={shot.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={shot.src}
              alt={shot.alt}
              // клик по самой картинке не закрывает — закрывает фон и крестик
              onClick={(e) => e.stopPropagation()}
              className="max-h-[74vh] w-auto max-w-[min(620px,92vw)] rounded-2xl bg-cream object-contain shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            />
            {shot.caption && (
              <p className="text-center text-sm uppercase tracking-[0.2em] text-gold/90">
                {shot.caption}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-5 top-5 cursor-pointer rounded-full border border-cream/25 px-4 py-2 text-sm text-cream/90 transition-colors hover:border-gold/60 hover:text-gold"
            >
              Закрыть ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
