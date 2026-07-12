"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Snow from "./Snow";
import { asset } from "@/lib/asset";

/**
 * Pinned scroll-storytelling на видео-секвенции (Veo 3 → 140 кадров WebP).
 * Кадры рисуются в <canvas> по прогрессу скролла — техника Apple AirPods:
 * настоящее покадровое движение вместо кросс-фейда статичных поз.
 *
 * Плавность: useSpring-инерция скраба + 8.75 к/с исходника, интерполяция
 * скроллом. Загрузка прогрессивная: сначала каждый 7-й кадр (~800 КБ),
 * остальные докачиваются в фоне; до первого кадра — постер <img>.
 */

const FRAME_COUNT = 140;
const frameSrc = (i: number) =>
  asset(`/gift/seq/frame_${String(i + 1).padStart(3, "0")}.webp`);

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

/* ————— прогрессивная загрузка кадров ————— */

function useSequence(wrapRef: React.RefObject<HTMLDivElement | null>) {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const [coarseReady, setCoarseReady] = useState(false);
  // счётчик догруженных кадров — сигнал канвасу перерисоваться без скролла
  const loadTick = useMotionValue(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let cancelled = false;
    let started = false;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (imagesRef.current[i]) return resolve();
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[i] = img;
            loadTick.set(loadTick.get() + 1);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    const start = async () => {
      if (started) return;
      started = true;
      // каркас: каждый 7-й кадр + последний
      const coarse: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i += 7) coarse.push(i);
      coarse.push(FRAME_COUNT - 1);
      await Promise.all(coarse.map(load));
      if (!cancelled) setCoarseReady(true);
      // остальные — в фоне, последовательно, чтобы не душить сеть
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (cancelled) return;
        await load(i);
      }
    };

    // 5.4 МБ не грузим «на всякий случай»: ждём приближения сцены
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [wrapRef, loadTick]);

  return { imagesRef, coarseReady, loadTick };
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raw = useSceneProgress(wrapRef);
  const spring = useSpring(raw, { stiffness: 58, damping: 21, mass: 0.7, restDelta: 0.0004 });
  const reduce = useReducedMotion();
  const p = reduce ? raw : spring;

  const { imagesRef, coarseReady, loadTick } = useSequence(wrapRef);
  const [hasDrawn, setHasDrawn] = useState(false);

  /* отрисовка кадра по прогрессу */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastImg: HTMLImageElement | null = null;
    let drawnOnce = false;

    const nearestLoaded = (idx: number) => {
      const imgs = imagesRef.current;
      for (let o = 0; o < FRAME_COUNT; o++) {
        if (idx - o >= 0 && imgs[idx - o]) return imgs[idx - o];
        if (idx + o < FRAME_COUNT && imgs[idx + o]) return imgs[idx + o];
      }
      return null;
    };

    const draw = () => {
      raf = 0;
      const img = nearestLoaded(
        Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p.get() * (FRAME_COUNT - 1))))
      );
      // сравниваем сам кадр: когда докачался точный — перерисуемся без скролла
      if (!img || img === lastImg) return;
      lastImg = img;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      // object-cover: центрируем и кропим
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      if (!drawnOnce) {
        drawnOnce = true;
        setHasDrawn(true);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const unsubP = p.on("change", schedule);
    const unsubTick = loadTick.on("change", schedule);
    const onResize = () => {
      lastImg = null; // форсируем перерисовку в новом размере
      schedule();
    };
    window.addEventListener("resize", onResize);
    if (coarseReady) schedule();

    return () => {
      unsubP();
      unsubTick();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [p, coarseReady, imagesRef, loadTick]);

  const glowOpacity = useTransform(p, [0.22, 0.45, 0.75, 1], [0, 0.5, 0.35, 0.25]);

  const cardsProgress = [
    useTransform(p, [0.64, 0.78], [0, 1]),
    useTransform(p, [0.7, 0.84], [0, 1]),
    useTransform(p, [0.76, 0.9], [0, 1]),
  ];

  return (
    <div ref={wrapRef} id="story" className="relative h-[460vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-night-deep">
        {/* постер до загрузки каркаса кадров */}
        <img
          src={frameSrc(0)}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hasDrawn ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}
        />
        {/* видео-секвенция */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* постоянное тёплое свечение — мягкая связка с виньетками страницы */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/3 rounded-full"
          aria-hidden
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,243,214,0.22) 0%, rgba(232,185,104,0.1) 40%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* живой снег поверх кадров */}
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

        {/* сторителлинг */}
        {storyLines.map((line, i) => (
          <StoryLine
            key={line.text}
            text={line.text}
            window={line.window}
            progress={p}
            as={i === 0 ? "h2" : "p"}
          />
        ))}

        {/* карточки-смыслы над парящими подарками */}
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
