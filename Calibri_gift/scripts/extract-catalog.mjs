/**
 * Достаёт картинки из каталога заказчицы (PDF ~97 МБ) в public/catalog/.
 *
 * Каталог в репозиторий не кладём — он тяжёлый и меняется раз в год.
 * Путь задаётся переменной KATALOG или первым аргументом:
 *   node scripts/extract-catalog.mjs "D:/.../kolibri_katalog_2027.pdf"
 *
 * Картинки берём не скриншотом страницы, а как встроенные изображения
 * (у них есть свои координаты) — поэтому в кадр не попадают артикулы,
 * ценники и соседние товары.
 *
 * Карта ниже — результат ручного отбора по каталогу 2027 года: страница
 * и порядковый номер картинки на ней. Если каталог обновится, номера
 * поедут — тогда прогоните scripts/… с флагом --sheets (см. README),
 * посмотрите контактные листы и поправьте карту.
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const PDF = process.argv[2] || process.env.KATALOG;
if (!PDF) {
  console.error("Укажите путь к PDF каталога: node scripts/extract-catalog.mjs <файл.pdf>");
  process.exit(1);
}

// плитки категорий: чистые фото товара на белом
const TILES = [
  { out: "nabory", page: 20, idx: 3, alt: "Новогодний подарочный набор: коробка со сладостями, игрушки-овечки и открытка" },
  // Правка заказчицы: «Картонная упаковка — найти в каталоге такое и вставить
  // сюда». На плитке был подарочный пакет из раздела авторского картона,
  // и по фото не читалось, что это картонная коробка. Теперь коробка
  // из раздела «картонная упаковка» — с шарами и верёвочными ручками.
  { out: "karton", page: 44, idx: 6, trim: { top: 0.1 }, alt: "Подарок в картонной упаковке — коробка с новогодними шарами" },
  // Правка: на плитке «Текстильная упаковка» стояла мягкая игрушка — то есть
  // содержимое, а не упаковка. Теперь тканевый мешочек с барашком
  // из раздела «текстильная упаковка» (стр. 60).
  { out: "tekstil", page: 60, idx: 5, trim: { right: 0.2 }, alt: "Подарок в текстильной упаковке — тканевый мешочек с барашком" },
  // туба — это и есть комбинированная упаковка; взял самый нарядный кадр
  // раздела, на белом фоне и без соседних элементов (стр. 66)
  { out: "kombi", page: 66, idx: 2, trim: { right: 0.14 }, alt: "Подарок в комбинированной упаковке — новогодняя туба" },
  { out: "premium", page: 68, idx: 4, trim: { left: 0.06, bottom: 0.04 }, alt: "Премиальный подарочный набор в упаковке-матрёшке" },
];

// Фото детей здесь больше не вырезаем: заказчица прислала студийные
// снимки на Яндекс.Диске, их забирает scripts/fetch-kids.mjs. Раньше этот
// скрипт перезаписывал kid-*.webp вырезками из PDF — то есть портил
// студийные фото при любом обновлении плиток.

const SCALE = 2.6; // рендер страницы: 765pt → ~1990px
const PW = 765, PH = 567;
const OUT = path.resolve("public/catalog");
mkdirSync(OUT, { recursive: true });

const doc = mupdf.Document.openDocument(readFileSync(PDF), "application/pdf");

// картинки страницы в том же порядке и с тем же фильтром, что при отборе
function pageImages(pno) {
  const blocks = [];
  doc.loadPage(pno - 1).toStructuredText("preserve-images").walk({
    onImageBlock(bbox, _t, image) {
      const [x0, y0, x1, y1] = bbox;
      const w = x1 - x0, h = y1 - y0;
      if (w > PW * 0.9 && h > PH * 0.9) return; // фон на всю страницу
      if (w < 60 || h < 70) return;
      if (image.getWidth() < 240 || image.getHeight() < 240) return;
      const ar = w / h;
      if (ar < 0.45 || ar > 2.0) return;
      blocks.push({ x0, y0, w, h });
    },
  });
  return blocks;
}

const pageCache = new Map();
async function pagePng(pno) {
  if (pageCache.has(pno)) return pageCache.get(pno);
  const pix = doc.loadPage(pno - 1).toPixmap(
    mupdf.Matrix.scale(SCALE, SCALE), mupdf.ColorSpace.DeviceRGB, false, true
  );
  const png = pix.asPNG();
  pix.destroy();
  pageCache.set(pno, png);
  return png;
}

// trim — сколько снять с каждой стороны, в долях от размера кадра.
// В рамку картинки на странице каталога часто залезает соседний товар
// или декор плашки, и на плитке это читается как случайный обрезок.
async function crop(pno, idx, width, out, quality, trim = {}) {
  const b = pageImages(pno)[idx];
  if (!b) throw new Error(`стр. ${pno}: нет картинки №${idx} — карта разошлась с каталогом`);
  const png = await pagePng(pno);
  const meta = await sharp(png).metadata();
  const fullW = Math.round(b.w * SCALE);
  const fullH = Math.round(b.h * SCALE);
  const cutL = Math.round(fullW * (trim.left ?? 0));
  const cutR = Math.round(fullW * (trim.right ?? 0));
  const cutT = Math.round(fullH * (trim.top ?? 0));
  const cutB = Math.round(fullH * (trim.bottom ?? 0));
  const left = Math.max(0, Math.round(b.x0 * SCALE) + cutL);
  const top = Math.max(0, Math.round(b.y0 * SCALE) + cutT);
  await sharp(png)
    .extract({
      left, top,
      width: Math.min(meta.width - left, fullW - cutL - cutR),
      height: Math.min(meta.height - top, fullH - cutT - cutB),
    })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(OUT, out));
  const m = await sharp(path.join(OUT, out)).metadata();
  console.log(out, `${m.width}×${m.height}`);
}

// Развороты каталога делает отдельный скрипт scripts/make-spreads.mjs:
// заказчица прислала макеты раскрытого каталога, и они куда живее, чем
// одиночные страницы, которые вырезались здесь раньше.

for (const t of TILES) await crop(t.page, t.idx, 900, `tile-${t.out}.webp`, 84, t.trim);
console.log("готово:", OUT);
