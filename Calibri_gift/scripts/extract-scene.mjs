import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

/**
 * Нарезка Kling-видео (design/gift-src/video/new 1-1.mp4 + new 2-2.mp4)
 * в канвас-секвенцию public/gift/seq/frame_NNN.webp.
 *
 * Клип 1 (бант развязывается) — 1280x720, клип 2 (открытие + вылет шаров) —
 * 1920x1080. Приводим оба к 1920x1080, склеиваем, срезаем правый край
 * (~320px) — там бледный вотермарк Kling. 10 сек @ 14 к/с ≈ 140 кадров.
 *
 * Запуск: node scripts/extract-scene.mjs
 */

const v1 = path.resolve("design/gift-src/video/new 1-1.mp4");
const v2 = path.resolve("design/gift-src/video/new 2-2.mp4");
const outDir = path.resolve("public/gift/seq");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

execFileSync(
  ffmpeg,
  [
    "-y",
    // клип 1: обрезаем статичное начало (~1.6с коробка стоит без движения)
    "-ss", "1.6", "-i", v1,
    "-i", v2,
    "-filter_complex",
    // оба клипа → 1920x1080, склейка, срез правого края с вотермарком, 12 к/с
    "[0:v]scale=1920:1080,setsar=1[a];" +
      "[1:v]scale=1920:1080,setsar=1[b];" +
      "[a][b]concat=n=2:v=1:a=0[c];" +
      "[c]crop=1600:1080:0:0,fps=12,scale=1700:-2[out]",
    "-map", "[out]",
    "-c:v", "libwebp",
    "-quality", "60",
    "-compression_level", "6",
    path.join(outDir, "frame_%03d.webp"),
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);

const files = readdirSync(outDir).filter((f) => f.endsWith(".webp"));
const total = files.reduce((s, f) => s + statSync(path.join(outDir, f)).size, 0);
console.log(`\nКадров: ${files.length}, суммарно ${(total / 1024 / 1024).toFixed(1)} МБ`);
