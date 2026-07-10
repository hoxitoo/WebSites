"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";

/**
 * Надёжный прогресс pinned-сцены: 0 когда верх обёртки коснулся верха вьюпорта,
 * 1 когда обёртка доскроллена до конца. Считаем сами через getBoundingClientRect —
 * без сюрпризов измерения sticky-контента.
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

/**
 * Pinned scroll-storytelling: скролл развязывает ленту, открывает крышку,
 * из коробки вырывается тёплый свет и «разлетаются» три смысла подарка.
 * Высота обёртки 320vh задаёт длительность сцены; внутренний экран sticky.
 */

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
  const p = useSceneProgress(wrapRef);

  // — заголовок сцены
  const titleOpacity = useTransform(p, [0.02, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const titleY = useTransform(p, [0.02, 0.1], [40, 0]);

  // — бант и ленты (развязываются)
  const bowScale = useTransform(p, [0.06, 0.2], [1, 0]);
  const strandLeftX = useTransform(p, [0.08, 0.24], [0, -110]);
  const strandRightX = useTransform(p, [0.08, 0.24], [0, 110]);
  const strandOpacity = useTransform(p, [0.08, 0.24], [1, 0]);
  const ribbonOpacity = useTransform(p, [0.16, 0.3], [1, 0]);

  // — крышка открывается
  const lidRotate = useTransform(p, [0.26, 0.46], [0, -26]);
  const lidY = useTransform(p, [0.26, 0.46], [0, -110]);
  const lidX = useTransform(p, [0.26, 0.46], [0, -46]);

  // — свет из коробки
  const glowScale = useTransform(p, [0.3, 0.56], [0.2, 1.5]);
  const glowOpacity = useTransform(p, [0.3, 0.5, 0.85], [0, 0.95, 0.7]);

  // — коробка отступает, выходят карточки
  const boxScale = useTransform(p, [0.52, 0.72], [1, 0.88]);
  const boxOpacity = useTransform(p, [0.52, 0.72], [1, 0.28]);
  const boxY = useTransform(p, [0.52, 0.72], [0, 60]);

  const cardsProgress = [
    useTransform(p, [0.52, 0.66], [0, 1]),
    useTransform(p, [0.58, 0.72], [0, 1]),
    useTransform(p, [0.64, 0.78], [0, 1]),
  ];

  return (
    <div ref={wrapRef} id="story" className="relative h-[320vh]">
      <div className="section-vignette sticky top-0 flex h-screen flex-col items-center overflow-hidden">
        {/* заголовок */}
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="z-20 mt-[9vh] px-6 text-center font-display text-3xl md:mt-[11vh] md:text-5xl"
        >
          Внутри — больше, <span className="glow-gold">чем подарок</span>
        </motion.h2>

        {/* карточки-смыслы */}
        <div className="pointer-events-none absolute inset-x-0 top-[24%] z-20 flex flex-col items-center justify-center gap-3 px-6 md:top-[30%] md:flex-row md:gap-8">
          {cards.map((c, i) => {
            const cp = cardsProgress[i];
            return (
              <CardOut key={c.title} progress={cp} index={i}>
                <h3 className="mb-2 font-display text-xl text-gold md:text-2xl">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream/80">{c.text}</p>
              </CardOut>
            );
          })}
        </div>

        {/* сцена с коробкой */}
        <motion.div
          style={{ scale: boxScale, opacity: boxOpacity, y: boxY }}
          className="absolute bottom-[6vh] left-1/2 h-[360px] w-[320px] -translate-x-1/2"
        >
          {/* свет из коробки */}
          <motion.div
            style={{ scale: glowScale, opacity: glowOpacity }}
            className="absolute bottom-[140px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full"
            aria-hidden
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,243,214,0.9) 0%, rgba(243,217,164,0.5) 30%, rgba(232,185,104,0.22) 50%, transparent 72%)",
              }}
            />
          </motion.div>

          {/* корпус коробки */}
          <div
            className="absolute bottom-0 left-[20px] h-[170px] w-[280px] rounded-2xl"
            style={{
              background: "linear-gradient(160deg, #8c2a41 0%, #7a2438 45%, #521626 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
          {/* вертикальная лента на корпусе */}
          <motion.div
            style={{ opacity: ribbonOpacity }}
            className="absolute bottom-0 left-[148px] h-[170px] w-[24px]"
          >
            <div
              className="h-full w-full"
              style={{
                background: "linear-gradient(90deg, #c99a4e, #f3d9a4 50%, #c99a4e)",
              }}
            />
          </motion.div>

          {/* крышка */}
          <motion.div
            style={{
              rotate: lidRotate,
              y: lidY,
              x: lidX,
              transformOrigin: "12% 100%",
            }}
            className="absolute bottom-[164px] left-0 h-[54px] w-[320px] rounded-xl"
          >
            <div
              className="h-full w-full rounded-xl"
              style={{
                background: "linear-gradient(160deg, #a03049 0%, #7a2438 60%, #5c1a2e 100%)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            />
            <motion.div
              style={{ opacity: ribbonOpacity }}
              className="absolute inset-y-0 left-[148px] w-[24px]"
            >
              <div
                className="h-full w-full"
                style={{
                  background: "linear-gradient(90deg, #c99a4e, #f3d9a4 50%, #c99a4e)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* бант */}
          <motion.svg
            style={{ scale: bowScale }}
            viewBox="0 0 120 70"
            className="absolute bottom-[206px] left-[100px] w-[120px] origin-bottom"
            aria-hidden
          >
            <path
              d="M60 52 C38 20 10 18 8 38 C6 56 36 58 60 52 Z"
              fill="#e8b968"
              opacity={0.95}
            />
            <path
              d="M60 52 C82 20 110 18 112 38 C114 56 84 58 60 52 Z"
              fill="#e8b968"
              opacity={0.95}
            />
            <circle cx="60" cy="52" r="10" fill="#f3d9a4" />
          </motion.svg>

          {/* развязанные концы ленты */}
          <motion.svg
            style={{ x: strandLeftX, opacity: strandOpacity }}
            viewBox="0 0 100 120"
            className="absolute bottom-[120px] left-[40px] w-[90px]"
            aria-hidden
          >
            <path
              d="M90 8 C50 30 30 70 12 112"
              stroke="#e8b968"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
            />
          </motion.svg>
          <motion.svg
            style={{ x: strandRightX, opacity: strandOpacity }}
            viewBox="0 0 100 120"
            className="absolute bottom-[120px] right-[40px] w-[90px]"
            aria-hidden
          >
            <path
              d="M10 8 C50 30 70 70 88 112"
              stroke="#e8b968"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
            />
          </motion.svg>

          {/* поднимающиеся искры */}
          <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0" aria-hidden>
            {[38, 92, 150, 205, 258].map((left, i) => (
              <motion.span
                key={i}
                className="absolute bottom-[170px] block h-[5px] w-[5px] rounded-full bg-gold-soft"
                style={{ left }}
                animate={{ y: [-10, -150 - i * 22], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.6 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.55,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function CardOut({
  progress,
  index,
  children,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
  index: number;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, [0, 1], [140, 0]);
  const rotate = useTransform(progress, [0, 1], [index === 0 ? -6 : index === 2 ? 6 : 0, 0]);

  return (
    <motion.div
      style={{ opacity: progress, y, rotate }}
      className="w-full max-w-[300px] rounded-2xl border border-gold/20 bg-night-soft/80 p-5 backdrop-blur-sm md:p-7"
    >
      {children}
    </motion.div>
  );
}
