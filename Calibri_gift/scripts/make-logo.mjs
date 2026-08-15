/**
 * Готовит логотип «Колибри» для тёмного шоколадного фона.
 *
 * Оригинал — тёмно-синий/красный градиент, на тёмном фоне тёмная часть
 * пропадает, поэтому раньше логотип лежал на белой плашке (выглядело как
 * наклейка). Делаем «вывернутую» версию — стандартная практика для тёмных
 * шапок: перекрашиваем в фирменную для сайта пару кремовый → золотой,
 * сохраняя внутренний градиент оригинала (тёмно-синие части становятся
 * кремовыми, красные — золотыми).
 *
 * На выходе два файла:
 *   logo-kolibri-mark.webp — исходная «вертикальная» компоновка (подвал,
 *     где есть место по высоте);
 *   logo-kolibri-row.webp  — горизонтальная компоновка: птица слева,
 *     надпись справа. Нужна для шапки: в оригинале надпись занимает малую
 *     часть высоты и на 56 px превращается в нечитаемую полоску.
 *
 * Запуск (из папки Calibri_gift):  node scripts/make-logo.mjs
 */
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("design/brand/kolibri-logo.png");
const OUT_MARK = path.resolve("public/logo-kolibri-mark.webp");
const OUT_ROW = path.resolve("public/logo-kolibri-row.webp");

const CREAM = [247, 243, 236]; // #f7f3ec
const GOLD = [232, 185, 104]; // #e8b968

// прямоугольник с надписью «КОЛИБРИ / Торговая компания» в исходнике
const TEXT_BOX = { left: 1000, top: 655, width: 2833 - 1000, height: 580 };

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

/* ————— перекраска с сохранением прозрачности ————— */

let lo = 255;
let hi = 0;
for (let i = 0; i < W * H; i++) {
  if (data[i * 4 + 3] < 60) continue;
  const lum = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  if (lum < lo) lo = lum;
  if (lum > hi) hi = lum;
}
const span = Math.max(hi - lo, 1);

const tinted = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = data[i * 4 + 3];
  const lum = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  // t = 0 у тёмно-синего → кремовый, t = 1 у красного → золотой
  const t = Math.min(Math.max((lum - lo) / span, 0), 1);
  for (let c = 0; c < 3; c++) {
    tinted[i * 4 + c] = Math.round(CREAM[c] + (GOLD[c] - CREAM[c]) * t);
  }
  tinted[i * 4 + 3] = a;
}

const raw = { raw: { width: W, height: H, channels: 4 } };

await sharp(tinted, raw)
  .trim({ threshold: 1 })
  .resize({ height: 420, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(OUT_MARK);

/* ————— горизонтальная компоновка для шапки ————— */

// птица = всё, кроме прямоугольника с надписью
const birdOnly = Buffer.from(tinted);
for (let y = TEXT_BOX.top; y < TEXT_BOX.top + TEXT_BOX.height; y++) {
  for (let x = TEXT_BOX.left; x < TEXT_BOX.left + TEXT_BOX.width; x++) {
    birdOnly[(y * W + x) * 4 + 3] = 0;
  }
}

const BIRD_H = 400;
const bird = await sharp(birdOnly, raw)
  .trim({ threshold: 1 })
  .resize({ height: BIRD_H, fit: "inside" })
  .png()
  .toBuffer({ resolveWithObject: true });

const text = await sharp(tinted, raw)
  .extract(TEXT_BOX)
  .trim({ threshold: 1 })
  .resize({ height: Math.round(BIRD_H * 0.52), fit: "inside" })
  .png()
  .toBuffer({ resolveWithObject: true });

const GAP = 28;
const rowW = bird.info.width + GAP + text.info.width;
await sharp({
  create: { width: rowW, height: BIRD_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: bird.data, left: 0, top: 0 },
    {
      input: text.data,
      left: bird.info.width + GAP,
      // надпись выравниваем по «плечу» птицы, а не по центру: у птицы длинный
      // хвост, от центра надпись уезжала бы вниз
      top: Math.round(BIRD_H * 0.3),
    },
  ])
  .trim({ threshold: 1 })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(OUT_ROW);

for (const f of [OUT_MARK, OUT_ROW]) {
  const m = await sharp(f).metadata();
  console.log("готово:", path.basename(f), m.width + "×" + m.height);
}
