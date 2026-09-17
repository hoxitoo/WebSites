/**
 * Страницы для листалки «Полистайте наш каталог».
 *
 * Финальные правки 3: «отсюда возьмите отдельно странички» — папка «каталог
 * JPG» на её Яндекс.Диске, 80 страниц, из них она выбрала 40. Там же:
 * «если их так много скачать — это сильно завесит сайт по объёму? их чуть
 * поджать можно?» и «эффект как будто бы они листаются».
 *
 * Оригиналы — 3189×2362, около 2 МБ каждый, вместе 76 МБ. Для сайта:
 *  • страница — 1100 px по ширине, WebP. На сайте колонка листалки ~670 px,
 *    1100 даёт запас на экраны высокой плотности и на крупный просмотр;
 *  • миниатюра — 120 px для полосы под книгой.
 * Грузятся не все сразу: страница подгружается, когда до неё остаётся
 * пара перелистываний (components/CatalogBook.tsx).
 *
 * В этих файлах цены настоящие (в PDF-каталоге вместо них «00 ₽»), замывать
 * ничего не нужно — правка «убрать замазку с цен» остаётся в силе.
 *
 * Оригиналы: design/rework-2026-09/catalog-jpg/page-N.jpg (папка в .gitignore).
 * Запуск (из папки Calibri_gift):  node scripts/make-catalog-book.mjs
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, statSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("design/rework-2026-09/catalog-jpg");
const OUT = path.resolve("public/catalog/book");

// ровно те страницы, что она перечислила, по порядку каталога
const PAGES = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 32, 33, 34, 35, 37, 47, 52, 53, 54, 57, 58, 59, 66, 69, 70, 71, 73,
];

if (!existsSync(SRC)) {
  console.error(`нет папки с оригиналами: ${SRC}`);
  process.exit(1);
}
// пересобираем с нуля: страница, убранная из списка, не должна остаться на сайте
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

let pagesBytes = 0;
let thumbsBytes = 0;
for (const p of PAGES) {
  const src = path.join(SRC, `page-${p}.jpg`);
  if (!existsSync(src)) {
    console.error(`нет страницы ${p}: ${src}`);
    process.exit(1);
  }
  const page = path.join(OUT, `p-${p}.webp`);
  const thumb = path.join(OUT, `t-${p}.webp`);
  const meta = await sharp(src).resize({ width: 1100 }).webp({ quality: 80 }).toFile(page);
  await sharp(src).resize({ width: 120 }).webp({ quality: 70 }).toFile(thumb);
  pagesBytes += statSync(page).size;
  thumbsBytes += statSync(thumb).size;
  console.log(`p-${p}.webp  ${meta.width}×${meta.height}  ${(statSync(page).size / 1024).toFixed(0)} КБ`);
}

const kb = (b) => `${(b / 1024).toFixed(0)} КБ`;
console.log(
  `готово: ${PAGES.length} страниц, ${kb(pagesBytes)} (в среднем ${kb(pagesBytes / PAGES.length)}), ` +
    `миниатюры ${kb(thumbsBytes)}; оригиналы были ${(readdirSync(SRC).reduce((s, f) => s + statSync(path.join(SRC, f)).size, 0) / 1048576).toFixed(0)} МБ`
);
