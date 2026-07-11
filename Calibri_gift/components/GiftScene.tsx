"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Snow from "./Snow";

/**
 * Pinned scroll-storytelling на фотореалистичной секвенции (Nano Banana 2).
 *
 * Против эффекта «нарезки картинок» работают три приёма:
 * 1) useSpring поверх прогресса — скролл получает инерцию (аналог scrub: 1),
 *    рывки колеса сглаживаются в непрерывное движение;
 * 2) каждый кадр, пока виден, медленно «наезжает» (scale 1 → 1.07) — камера
 *    всё время движется вперёд, статики нет ни в один момент;
 * 3) широкие диссолвы (~70% длины сегмента) + постоянные элементы поверх
 *    кадров (снег, тёплое свечение) сшивают склейки в одну сцену.
 */

function useSceneProgress(ref: React.RefObject<HTMLDivElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      progress.set(p);
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
  }, [ref, progress]);

  return progress;
}

/* ————— раскадровка ————— */

// «центры» кадров по прогрессу сцены
const CENTERS = [0.03, 0.12, 0.21, 0.3, 0.4, 0.51, 0.64, 0.8];
const LAST = CENTERS.length - 1;
// какая доля расстояния между кадрами занята диссолвом (шире = мягче склейка)
const DISSOLVE = 0.78;

function frameTiming(i: number) {
  const inMid = i === 0 ? 0 : (CENTERS[i - 1] + CENTERS[i]) / 2;
  const outMid = i === LAST ? 1 : (CENTERS[i] + CENTERS[i + 1]) / 2;
  const inW = i === 0 ? 0 : DISSOLVE * (CENTERS[i] - CENTERS[i - 1]);
  const outW = i === LAST ? 0 : DISSOLVE * (CENTERS[i + 1] - CENTERS[i]);
  return {
    visStart: inMid - inW / 2,
    fullStart: inMid + inW / 2,
    fullEnd: outMid - outW / 2,
    visEnd: outMid + outW / 2,
  };
}

function Frame({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const { visStart, fullStart, fullEnd, visEnd } = frameTiming(index);

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, fullEnd, visEnd]
      : index === LAST
        ? [visStart, fullStart, 1]
        : [visStart, fullStart, fullEnd, visEnd],
    index === 0 ? [1, 1, 0] : index === LAST ? [0, 1, 1] : [0, 1, 1, 0],
  );

  // непрерывный «наезд камеры»: кадр всё время движения слегка приближается
  const scale = useTransform(
    progress,
    [Math.max(visStart, 0), Math.min(visEnd === 1 ? 1 : visEnd, 1)],
    [1, 1.07],
  );

  return (
    <motion.img
      src={`/gift/frame-0${index + 1}.webp`}
      alt=""
      style={{ opacity, scale }}
      className="absolute inset-0 h-full w-full object-cover"
      // весь сет ~470 КБ: грузим сразу, чтобы диссолвы не ждали сеть
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}

/* ————— сторителлинг ————— */

const storyLines = [
  {
    text: "Как сказать команде «спасибо» — по-настоящему?",
    window: [0.03, 0.135] as const,
  },
  {
    text: "Не общими словами на планёрке — а тёплым знаком внимания каждому.",
    window: [0.165, 0.285] as const,
  },
  {
    text: "Забота не бывает громкой. Она — в тепле, которое можно взять в руки.",
    window: [0.315, 0.43] as const,
  },
  {
    text: "Внутри — больше, чем подарок. Внутри — «мы вас ценим».",
    window: [0.46, 0.585] as const,
  },
];

function StoryLine({
  text,
  window: [a, b],
  progress,
  as: Tag = "p",
}: {
  text: string;
  window: readonly [number, number];
  progress: MotionValue<number>;
  as?: "h2" | "p";
}) {
  const fade = Math.min(0.05, (b - a) / 3);
  const opacity = useTransform(progress, [a, a + fade, b - fade, b], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b], [36, -28]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 top-[10vh] z-20 px-6 text-center md:top-[12vh]"
    >
      <Tag className="mx-auto max-w-3xl font-display text-2xl leading-snug text-cream [text-shadow:0_2px_28px_rgba(9,14,26,0.95),0_0_60px_rgba(9,14,26,0.6)] md:text-4xl">
        {text}
      </Tag>
    </motion.div>
  );
}

const cards = [
  {
    title: "Сотрудникам",
    text: "Тёплый знак: ваш вклад видят и ценят. Подарок, который говорит это без слов.",
  },
  {
    title: "Детям сотрудников",
    text: "Настоящее новогоднее чудо — забота компании приходит домой, в семью.",
  },
  {
    title: "Руководителю",
    text: "Команда, которая чувствует заботу, отвечает доверием и работает сердцем.",
  },
];

export default function GiftScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const raw = useSceneProgress(wrapRef);
  // инерция скраба: скролл догоняется пружиной, рывки сглаживаются
  const spring = useSpring(raw, { stiffness: 58, damping: 21, mass: 0.7, restDelta: 0.0004 });
  // reduced-motion: без инерции — сцена меняется строго вместе с жестом скролла
  const reduce = useReducedMotion();
  const p = reduce ? raw : spring;

  // постоянное тёплое свечение — «клей» между кадрами
  const glowOpacity = useTransform(p, [0.22, 0.45, 0.75, 1], [0, 0.55, 0.4, 0.28]);

  const cardsProgress = [
    useTransform(p, [0.64, 0.78], [0, 1]),
    useTransform(p, [0.7, 0.84], [0, 1]),
    useTransform(p, [0.76, 0.9], [0, 1]),
  ];

  return (
    <div ref={wrapRef} id="story" className="relative h-[460vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-night-deep">
        {/* фото-секвенция */}
        <div className="absolute inset-0">
          {CENTERS.map((_, i) => (
            <Frame key={i} index={i} progress={p} />
          ))}
        </div>

        {/* постоянное свечение по центру — сшивает склейки */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/3 rounded-full"
          aria-hidden
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,243,214,0.28) 0%, rgba(232,185,104,0.12) 40%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* живой снег поверх кадров — непрерывность движения */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <Snow density={0.45} />
        </div>

        {/* сшивка с фоном страницы */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36"
          style={{ background: "linear-gradient(to bottom, #090e1a, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36"
          style={{ background: "linear-gradient(to top, #090e1a, transparent)" }}
          aria-hidden
        />

        {/* сторителлинг: строки сменяют друг друга по мере открытия */}
        {storyLines.map((line, i) => (
          <StoryLine
            key={line.text}
            text={line.text}
            window={line.window}
            progress={p}
            as={i === 0 ? "h2" : "p"}
          />
        ))}

        {/* карточки-смыслы поверх кадров 7–8 */}
        <div className="pointer-events-none absolute inset-x-0 top-[22%] z-20 flex flex-col items-center justify-center gap-3 px-6 md:top-[28%] md:flex-row md:gap-8">
          {cards.map((c, i) => (
            <CardOut key={c.title} progress={cardsProgress[i]} index={i}>
              <h3 className="mb-2 font-display text-xl text-gold md:text-2xl">{c.title}</h3>
              <p className="text-sm leading-relaxed text-cream/85">{c.text}</p>
            </CardOut>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardOut({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, [0, 1], [140, 0]);
  const rotate = useTransform(progress, [0, 1], [index === 0 ? -6 : index === 2 ? 6 : 0, 0]);

  return (
    <motion.div
      style={{ opacity: progress, y, rotate }}
      className="w-full max-w-[300px] rounded-2xl border border-gold/25 bg-night-deep/70 p-5 shadow-[0_20px_60px_rgba(9,14,26,0.55)] backdrop-blur-md md:p-7"
    >
      {children}
    </motion.div>
  );
}
