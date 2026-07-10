import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Конвертация исходных кадров Nano Banana (design/gift-src/N.jpeg)
 * в веб-формат: public/gift/frame-0N.webp 1920w q80 + og.jpg 1200x630 из кадра 9.
 * Запуск: node scripts/convert-gift.mjs
 */
const srcDir = path.resolve("design/gift-src");
const dir = path.resolve("public/gift");
const files = (await readdir(srcDir)).filter((f) => /^\d\.jpeg$/.test(f));

for (const f of files.sort()) {
  const n = f.replace(".jpeg", "");
  const out = path.join(dir, `frame-0${n}.webp`);
  const info = await sharp(path.join(srcDir, f))
    .resize({ width: 1920 })
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`frame-0${n}.webp — ${Math.round(info.size / 1024)} KB`);
}

const og = await sharp(path.join(srcDir, "9.jpeg"))
  .resize({ width: 1200, height: 630, fit: "cover" })
  .jpeg({ quality: 82 })
  .toFile(path.join(dir, "og.jpg"));
console.log(`og.jpg — ${Math.round(og.size / 1024)} KB`);
