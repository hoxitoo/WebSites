"use client";

import { motion } from "motion/react";

/**
 * Колибри из света — стилизованный line-art силуэт (отсылка к логотипу),
 * отрисовывается светящейся золотой линией (pathLength), затем мягко парит.
 */

const strokes = [
  // клюв → голова → спина
  "M348 76 C322 86 302 90 286 99 C264 110 253 124 251 140 C248 166 234 190 212 206",
  // горло → грудь → к хвосту
  "M286 99 C280 122 270 146 254 164 C240 180 226 194 212 206",
  // крыло — взмах вверх
  "M256 126 C214 88 166 66 124 62 C150 84 176 112 196 142 C204 154 213 161 224 166",
  // длинные хвостовые перья (как в логотипе)
  "M212 206 C186 244 152 292 104 330",
  "M212 206 C196 252 174 306 140 356",
  "M212 206 C204 240 196 270 182 296",
];

const sparks = [
  { cx: 120, cy: 320, r: 2.2, delay: 2.6 },
  { cx: 150, cy: 345, r: 1.6, delay: 3.1 },
  { cx: 175, cy: 290, r: 1.8, delay: 3.5 },
  { cx: 100, cy: 345, r: 1.4, delay: 2.9 },
  { cx: 135, cy: 62, r: 1.8, delay: 2.2 },
  { cx: 355, cy: 72, r: 1.5, delay: 2.0 },
];

export default function Hummingbird({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 420 420"
      fill="none"
      className={className}
      aria-hidden
      // лёгкое парение после отрисовки
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    >
      <defs>
        <filter id="bird-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="bird-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d9a4" />
          <stop offset="55%" stopColor="#e8b968" />
          <stop offset="100%" stopColor="#a03049" />
        </linearGradient>
      </defs>

      <g filter="url(#bird-glow)">
        {strokes.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="url(#bird-stroke)"
            strokeWidth={i < 3 ? 3 : 2.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.1, delay: 0.5 + i * 0.35, ease: "easeInOut" },
              opacity: { duration: 0.3, delay: 0.5 + i * 0.35 },
            }}
          />
        ))}

        {/* глаз */}
        <motion.circle
          cx={272}
          cy={112}
          r={3.4}
          fill="#f3d9a4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        />

        {/* искры вокруг */}
        {sparks.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#e8b968"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{
              duration: 2.4,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 1.6,
            }}
          />
        ))}
      </g>
    </motion.svg>
  );
}
