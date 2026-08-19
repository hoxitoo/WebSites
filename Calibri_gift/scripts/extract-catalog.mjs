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

// Плитки категорий — целые страницы-разделители каталога, а не вырезанные
// предметы. Правка заказчика: «хочу, чтобы не только предмет был в кадре,
// а целая страница — как было в блоке „Полистайте наш каталог“ раньше».
// Это нарядные титульные листы разделов («Новогодние подарки В КАРТОННОЙ
// УПАКОВКЕ» и т.д.), они стоят перед первой страницей своего раздела.
const TILES = [
  { out: "nabory", page: 5, alt: "Страница каталога: новогодние подарки в наборах" },
  { out: "karton", page: 31, alt: "Страница каталога: новогодние подарки в картонной упаковке" },
  { out: "tekstil", page: 51, alt: "Страница каталога: новогодние подарки в текстильной упаковке" },
  { out: "kombi", page: 63, alt: "Страница каталога: новогодние подарки в комбинированной упаковке" },
  { out: "premium", page: 67, alt: "Страница каталога: новогодние подарки в премиум-упаковке" },
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

for (const t of TILES) {
  const png = await pagePng(t.page);
  const out = `tile-${t.out}.webp`;
  await sharp(png).resize({ width: 1100 }).webp({ quality: 84 }).toFile(path.join(OUT, out));
  const m = await sharp(path.join(OUT, out)).metadata();
  console.log(`${out}  ${m.width}×${m.height}  ← стр. ${t.page}`);
}
console.log("готово:", OUT);
