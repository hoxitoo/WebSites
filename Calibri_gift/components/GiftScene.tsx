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
 * Pinned scroll-storytelling на видео-секвенции (Kling → 101 кадр WebP).
 * Кадры рисуются в <canvas> по прогрессу скролла — техника Apple AirPods:
 * настоящее покадровое движение вместо кросс-фейда статичных поз.
 * Видео (открытие + вылет шаров) укладывается в первые VIDEO_END прогресса,
 * затем финальный кадр держится, и поверх выходят карточки-смыслы.
 *
 * Плавность: useSpring-инерция скраба + 8.75 к/с исходника, интерполяция
 * скроллом. Загрузка прогрессивная: сначала каждый 7-й кадр (~800 КБ),
 * остальные докачиваются в фоне; до первого кадра — постер <img>.
 */

const FRAME_COUNT = 101;
// видео (открытие + вылет шаров) проигрывается за первые VIDEO_END прогресса,
// дальше держим финальный кадр — чтобы шары успели вылететь ДО появления карточек
const VIDEO_END = 0.72;
// фон сцены = тёмная навигация, совпадает с фоном самих кадров по краям
const SCENE_BG = "#101c33";
const SCENE_BG_T = "rgba(16,28,51,0)";
// Коробка стоит не в середине кадра, а правее (её центр ≈ 0,575 ширины),
// слева — пустое боке. Поэтому рисуем не весь кадр, а его часть: коробка
// встаёт по центру экрана, лишний воздух слева уходит.
const CROP_CX = 0.575;
const CROP_W = 0.85;
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
        img.onload = async () => {
          // декодируем заранее (вне основного потока) — иначе первый рисунок
          // кадра при скролле подвисает на телефоне
          try {
            if (img.decode) await img.decode();
          } catch {
            /* decode может отклониться — не критично */
          }
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
    window: [0.02, 0.2] as const,
  },
  {
    text: "Не общими словами на планёрке — а тёплым знаком внимания каждому.",
    window: [0.21, 0.4] as const,
  },
  {
    text: "Забота не бывает громкой. Она — в тепле, которое можно взять в руки.",
    window: [0.41, 0.58] as const,
  },
  {
    text: "Внутри — больше, чем подарок. Внутри — «мы вас ценим».",
    window: [0.59, 0.72] as const,
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
      // отступ и кегль зависят и от высоты окна: на низком окне (панели
      // браузера + таскбар) крупный текст съедал экран и налезал на коробку
      className="absolute inset-x-0 top-[max(2.5vh,12px)] z-20 px-6 text-center"
    >
      <Tag
        className="mx-auto max-w-3xl font-display leading-snug text-cream [text-shadow:0_2px_28px_rgba(8,14,30,0.95),0_0_60px_rgba(8,14,30,0.6)]"
        style={{ fontSize: "clamp(1.05rem, 1.5vh + 1.1vw, 2.25rem)" }}
      >
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
      // видео проигрывается за первые VIDEO_END прогресса, дальше — стоп-кадр
      const vp = Math.min(p.get() / VIDEO_END, 1);
      const img = nearestLoaded(
        Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(vp * (FRAME_COUNT - 1))))
      );
      // сравниваем сам кадр: когда докачался точный — перерисуемся без скролла
      if (!img || img === lastImg) return;
      lastImg = img;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      // DPR: на мобильных ограничиваем 1.5 — вдвое меньше пикселей на
      // перерисовку кадра → плавнее скролл на слабых телефонах
      const mobile = cw < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      // берём часть кадра с коробкой — так она оказывается по центру экрана
      const sx = Math.round(img.naturalWidth * (CROP_CX - CROP_W / 2));
      const sw = Math.round(img.naturalWidth * CROP_W);
      const sh = img.naturalHeight;

      // Верхнюю полосу отдаём заголовку сторителлинга. Без этого на низких
      // окнах (браузер с панелями + таскбар) кадр занимал всю высоту и текст
      // ложился прямо на коробку — заказчица это и увидела.
      const band = Math.max(64, Math.min(ch * 0.24, 175));
      const avail = ch - band;
      // ×0.94 — воздух по краям и меньше апскейла (выше чёткость).
      // Без blur — он и давал лаги на ПК.
      const scale = Math.min(cw / sw, avail / sh) * 0.94;
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (cw - dw) / 2;
      const dy = band + (avail - dh) / 2;

      // фон под кадр = тёмная навигация, совпадает с фоном самого кадра по краям
      ctx.fillStyle = SCENE_BG;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, 0, sw, sh, dx, dy, dw, dh);

      // Растворяем края кадра в фоне: заказчица увидела рамку («стало видно
      // границы»). Эллиптическая виньетка по форме кадра гасит и углы, и
      // середины сторон сразу — одними полосами углы не закрывались.
      // Цвет тот же, что фон секции, поэтому стык исчезает независимо от
      // того, насколько боке в кадре светлее фона страницы.
      ctx.save();
      ctx.translate(dx + dw / 2, dy + dh / 2);
      ctx.scale(dw / dh, 1); // круг → эллипс по пропорциям кадра
      const R = (dh / 2) * 1.04;
      const vg = ctx.createRadialGradient(0, 0, R * 0.52, 0, 0, R);
      vg.addColorStop(0, SCENE_BG_T);
      vg.addColorStop(0.72, SCENE_BG_T);
      vg.addColorStop(1, SCENE_BG);
      ctx.fillStyle = vg;
      ctx.fillRect(-dh, -dh, dh * 2, dh * 2); // в масштабе покрывает весь кадр
      ctx.restore();

      // и добавочные полосы по самим кромкам — на случай очень широкого окна,
      // где эллипс не доходит до боковых краёв
      const F = Math.round(Math.min(dw, dh) * 0.1);
      const strip = (
        x: number, y: number, w: number, h: number,
        x0: number, y0: number, x1: number, y1: number,
      ) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, SCENE_BG);
        g.addColorStop(1, SCENE_BG_T);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, w, h);
      };
      strip(dx, dy, dw, F, 0, dy, 0, dy + F); // верх
      strip(dx, dy + dh - F, dw, F, 0, dy + dh, 0, dy + dh - F); // низ
      strip(dx, dy, F, dh, dx, 0, dx + F, 0); // лево
      strip(dx + dw - F, dy, F, dh, dx + dw, 0, dx + dw - F, 0); // право

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

  // Подсказка и полоса прогресса. Без них сцена читалась как «зависла»:
  // экран почти не меняется, и непонятно — листать, нажимать или ждать.
  const hintOpacity = useTransform(p, [0, 0.02, 0.1, 0.14], [1, 1, 1, 0]);
  const barScale = useTransform(p, [0, VIDEO_END], [0.02, 1]);
  const barOpacity = useTransform(p, [0, 0.01, 0.94, 1], [0, 1, 1, 0]);

  // карточки выходят ПОСЛЕ того, как шары вылетели (видео завершается на VIDEO_END)
  const cardsProgress = [
    useTransform(p, [0.78, 0.86], [0, 1]),
    useTransform(p, [0.83, 0.91], [0, 1]),
    useTransform(p, [0.88, 0.96], [0, 1]),
  ];

  return (
    // 400vh вместо 460: сцена и так читалась как «долгая», а прокрутка
    // на 3,6 экрана усиливала ощущение, что страница подвисла
    <div ref={wrapRef} id="story" className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-night-deep">
        {/* постер до загрузки каркаса кадров — кадрируем так же, как канвас,
            чтобы при подмене не было прыжка */}
        <img
          src={frameSrc(0)}
          alt=""
          className={`absolute inset-x-0 bottom-0 top-[18%] w-full object-contain transition-opacity duration-500 ${
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
          <Snow density={0.3} />
        </div>

        {/* сшивка с фоном страницы */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36"
          style={{ background: "linear-gradient(to bottom, #101c33, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36"
          style={{ background: "linear-gradient(to top, #101c33, transparent)" }}
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

        {/* Подсказка: что делать. Гаснет, как только человек начал листать.
            На низком окне уезжает под заголовок — внизу там уже коробка. */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-1 px-6 text-center [@media(max-height:620px)]:bottom-auto [@media(max-height:620px)]:top-[74px]"
          aria-hidden
        >
          <span className="rounded-full bg-night-deep/70 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.24em] text-gold/95 backdrop-blur-sm">
            Листайте — коробка откроется сама
          </span>
          {/* стрелку на низком окне убираем — там она уже упирается в коробку */}
          <motion.span
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-gold/80 [@media(max-height:620px)]:hidden"
          >
            ↓
          </motion.span>
        </motion.div>

        {/* полоса прогресса открытия — видно, что сцена живая и сколько осталось */}
        <motion.div
          style={{ opacity: barOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-cream/10"
          aria-hidden
        >
          <motion.div
            style={{ scaleX: barScale, transformOrigin: "left" }}
            className="h-full bg-gold/80 shadow-[0_0_12px_rgba(232,185,104,0.8)]"
          />
        </motion.div>

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
      className="w-full max-w-[300px] rounded-2xl border border-gold/25 bg-night-deep/70 p-5 shadow-[0_20px_60px_rgba(8,14,30,0.55)] backdrop-blur-md md:p-7"
    >
      {children}
    </motion.div>
  );
}
