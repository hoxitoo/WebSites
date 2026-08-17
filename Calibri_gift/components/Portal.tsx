"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Рендерит содержимое прямо в <body>.
 *
 * Нужно для окон поверх страницы: у шапки и карточек есть анимация
 * прозрачности, а любой элемент с opacity < 1 создаёт свой контекст
 * наложения — и `fixed z-50` внутри него перестаёт перекрывать соседние
 * блоки. Модалка каталога из-за этого уезжала под заголовок.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // на сервере document нет
  return createPortal(children, document.body);
}
