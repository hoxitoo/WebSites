"use client";

import { useEffect, useState } from "react";

const BULBS = 12;
const COLORS = ["#e8b968", "#a03049", "#f3d9a4"]; // золото / бордо / тёплый свет

/**
 * Гирлянда-прогресс: вертикальная нить лампочек у правого края,
 * лампочки загораются по мере прокрутки страницы. Десктоп-только.
 */
export default function Garland() {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      setLit(Math.round(p * BULBS));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      aria-hidden
    >
      {/* нить */}
      <div className="absolute inset-y-[-8px] w-px bg-cream/15" />
      {Array.from({ length: BULBS }, (_, i) => {
        const on = i < lit;
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="relative h-2.5 w-2.5 rounded-full transition-all duration-500"
            style={{
              background: on ? color : "rgba(247,243,236,0.12)",
              boxShadow: on ? `0 0 10px ${color}, 0 0 22px ${color}66` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
