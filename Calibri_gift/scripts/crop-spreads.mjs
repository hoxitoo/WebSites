/**
 * Обрезает белые поля вокруг разворотов каталога.
 *
 * Финальная правка заказчицы про «Полистайте наш каталог»: «почему сжато
 * сильно по ширине и вытянуто вверх — так не должно быть». Одна из причин —
 * в самих файлах: scripts/make-spreads.mjs кладёт раскрытую книгу на белый
 * лист с полями 40 px сверху и по бокам и 80 px снизу (под тень). На кремовой
 * подложке листалки эти поля выглядели частью страницы, и разворот казался
 * выше и у́же, чем есть.
 *
 * Границы книги измерены по всем восьми файлам — они одинаковые:
 * x 40…1559, y 40…689 из 1600×769. Оставляем по 4 px с краёв,
 * чтобы не срезать скругление обложки. Итог 1528×664, пропорция 2,3 : 1 —
 * как у разворотов в её макете.
 *
 * Запуск (из папки Calibri_gift):  node scripts/crop-spreads.mjs
 * Безопасно запускать повторно: уже обрезанные файлы пропускаются.
 */
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// На Windows sharp держит прочитанный файл открытым в своём кэше, и запись
// поверх него падает с «UNKNOWN: unknown error, open». Поэтому кэш выключен,
// а файл читается в память целиком, прежде чем sharp его увидит.
sharp.cache(false);

const DIR = path.resolve("public/catalog");
const SRC_W = 1600;
const SRC_H = 769;
const BOX = { left: 36, top: 36, width: 1528, height: 664 };

for (const file of readdirSync(DIR).filter((f) => /^spread-.*\.webp$/.test(f))) {
  const full = path.join(DIR, file);
  const input = readFileSync(full);
  const meta = await sharp(input).metadata();
  if (meta.width !== SRC_W || meta.height !== SRC_H) {
    console.log(`${file}: ${meta.width}×${meta.height} — уже обрезан, пропускаю`);
    continue;
  }
  const buf = await sharp(input).extract(BOX).webp({ quality: 88 }).toBuffer();
  writeFileSync(full, buf);
  console.log(`${file}: ${SRC_W}×${SRC_H} → ${BOX.width}×${BOX.height}`);
}
