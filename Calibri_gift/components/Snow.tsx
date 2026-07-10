"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  r: number; // радиус
  depth: number; // 0..1 — глубина слоя (дальше = меньше/медленнее)
  vy: number;
  drift: number; // фаза бокового покачивания
  driftSpeed: number;
};

/**
 * Атмосферный снег: 3 слоя глубины, параллакс от мыши,
 * тёплая подсветка снежинок ближнего слоя.
 * Уважает prefers-reduced-motion.
 */
export default function Snow({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let flakes: Flake[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }; // t* — целевые значения

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(((w * h) / 14000) * density);
      flakes = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + depth * 2.2,
          depth,
          vy: 0.25 + depth * 0.9,
          drift: Math.random() * Math.PI * 2,
          driftSpeed: 0.003 + Math.random() * 0.008,
        };
      });
    };

    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      // плавное догоняние мыши
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      ctx.clearRect(0, 0, w, h);

      for (const f of flakes) {
        f.drift += f.driftSpeed;
        f.y += f.vy;
        f.x += Math.sin(f.drift) * 0.3 * (0.4 + f.depth);

        if (f.y > h + 5) {
          f.y = -5;
          f.x = Math.random() * w;
        }

        const px = f.x + mouse.x * f.depth * 28; // параллакс
        const py = f.y + mouse.y * f.depth * 14;

        // ближние снежинки — тёплые, дальние — холодно-белые
        const warm = f.depth > 0.72;
        const alpha = 0.25 + f.depth * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, f.r, 0, Math.PI * 2);
        ctx.fillStyle = warm
          ? `rgba(243, 217, 164, ${alpha})`
          : `rgba(230, 236, 248, ${alpha * 0.85})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
