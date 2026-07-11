import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

/**
 * Нарезка Veo-видео (design/gift-src/video/new 1.mp4 + new 2.mp4)
 * в канвас-секвенцию public/gift/seq/frame_NNN.webp.
 *
 * - склейка двух клипов встык (шов замаскирован световым взрывом)
 * - кроп правого края 200px — убирает вотермарк Gemini
 * - ~8.75 кадра/сек из 16 сек ≈ 140 кадров, 1440w, WebP q58
 *
 * Запуск: node scripts/extract-scene.mjs
 */

const v1 = path.resolve("design/gift-src/video/new 1.mp4");
const v2 = path.resolve("design/gift-src/video/new 2.mp4");
const outDir = path.resolve("public/gift/seq");
mkdirSync(outDir, { recursive: true });

execFileSync(
  ffmpeg,
  [
    "-y",
    "-i", v1,
    "-i", v2,
    "-filter_complex",
    "[0:v][1:v]concat=n=2:v=1:a=0," +
      "crop=1720:1080:0:0," + // правые 200px с вотермарком — в отход
      "fps=8.75," +
      "scale=1440:-2",
    "-c:v", "libwebp",
    "-quality", "58",
    "-compression_level", "6",
    path.join(outDir, "frame_%03d.webp"),
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);

const files = readdirSync(outDir).filter((f) => f.endsWith(".webp"));
const total = files.reduce((s, f) => s + statSync(path.join(outDir, f)).size, 0);
console.log(`\nКадров: ${files.length}, суммарно ${(total / 1024 / 1024).toFixed(1)} МБ`);
