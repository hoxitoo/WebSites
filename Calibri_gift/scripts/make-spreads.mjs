/**
 * Готовит развороты каталога для блока «Полистайте наш каталог».
 *
 * Заказчица прислала архив «правки сайт для листания каталога» — 8 макетов
 * раскрытого каталога (3000×2000, файлы названы по номерам страниц: 6-7,
 * 8-9 …). Ставить их на сайт как есть нельзя: на страницах видны цены
 * и артикулы, а в этом же блоке написано, что каталог мы в открытый доступ
 * не выкладываем. Поэтому строки «Цена: …» и «Артикул: …» замываем.
 *
 * Как это сделано. Замывать прямо в макете оказалось ненадёжно: страницы
 * в макете вытянуты по вертикали относительно PDF и слегка асимметричны
 * (переплёт), поэтому заплатки уезжали — тем сильнее, чем ниже на странице
 * стоял текст. Поэтому идём в обратную сторону: страницы каталога
 * перерисовываем из PDF, замываем цены прямо на рендере (там координаты
 * текста точные, из текстового слоя) и вклеиваем страницы в макет на место
 * разворота. Совпадение гарантировано: мы накрываем страницу той же самой
 * страницей. От макета остаётся то, ради чего он и нужен, — тень, поля
 * и ощущение настоящей раскрытой книги.
 *
 * Запуск (из папки Calibri_gift):
 *   node scripts/make-spreads.mjs <папка с макетами> <каталог.pdf>
 *   node scripts/make-spreads.mjs <папка> <pdf> --debug   — обвести замытое
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
const PDF = process.argv[3];
if (!SRC || !PDF) {
  console.error("Использование: node scripts/make-spreads.mjs <папка с макетами> <каталог.pdf>");
  process.exit(1);
}
const DEBUG = process.argv.includes("--debug");

const OUT = path.resolve("public/catalog");
mkdirSync(OUT, { recursive: true });

// Место разворота в макете, в долях от размера картинки. Замерено детектором
// границ по самим макетам; шаблон у всех восьми один и тот же.
const FRAME = { x0: 0.082, x1: 0.92, y0: 0.281, y1: 0.818 };

// Запас вокруг замываемых строк, в долях страницы каталога.
const PAD_X = 0.006;
const PAD_RIGHT = 0.06; // цене — больше: в тексте PDF её рамка короче нарисованной
const PAD_Y = 0.004;

const doc = mupdf.Document.openDocument(readFileSync(PDF), "application/pdf");

/** Полосы «Артикул + Цена» на странице каталога, в долях страницы. */
function priceBands(pageNumber) {
  const page = doc.loadPage(pageNumber - 1); // в каталоге нумерация с 1
  const [, , pw, ph] = page.getBounds();
  const bands = [];
  const st = JSON.parse(page.toStructuredText().asJSON());
  for (const block of st.blocks || []) {
    // «Артикул» и «Цена» — две последние строки описания набора, поэтому
    // замываем их одной полосой на всю ширину текстовой колонки.
    const hits = (block.lines || []).filter((l) =>
      // без \b: в JS это граница ASCII-слова, и после кириллической «л»
      // перед двоеточием она не срабатывает — строки не находились
      /^(Цена|Артикул)/i.test((l.text || "").trim())
    );
    if (!hits.length) continue;
    const b = block.bbox;
    bands.push({
      text: hits.map((l) => l.text.trim()).join(" · "),
      x0: b.x / pw - PAD_X,
      x1: (b.x + b.w) / pw + PAD_RIGHT,
      y0: Math.min(...hits.map((l) => l.bbox.y)) / ph - PAD_Y,
      y1: Math.max(...hits.map((l) => l.bbox.y + l.bbox.h)) / ph + PAD_Y,
    });
  }
  return bands;
}

/** Страница каталога без цен: рендер нужной ширины, поверх — заплатки. */
async function cleanPage(pageNumber, targetW, targetH) {
  const page = doc.loadPage(pageNumber - 1);
  const [, , pw] = page.getBounds();
  const scale = targetW / pw;
  const pix = page.toPixmap(
    mupdf.Matrix.scale(scale, scale),
    mupdf.ColorSpace.DeviceRGB,
    false,
    true
  );
  let buf = Buffer.from(pix.asPNG());
  pix.destroy();
  const meta = await sharp(buf).metadata();

  const bands = priceBands(pageNumber);
  for (const band of bands) {
    const left = Math.max(0, Math.round(band.x0 * meta.width));
    const top = Math.max(0, Math.round(band.y0 * meta.height));
    const width = Math.min(meta.width - left, Math.round((band.x1 - band.x0) * meta.width));
    const height = Math.min(meta.height - top, Math.round((band.y1 - band.y0) * meta.height));
    if (width <= 0 || height <= 0) continue;
    // не однотонная плашка, а размытый кусок самой страницы: на кремовом
    // фоне с узором заплатка так не бросается в глаза
    const patch = await sharp(buf)
      .extract({ left, top, width, height })
      .blur(Math.max(8, height / 2))
      .modulate({ brightness: 1.05 })
      .png()
      .toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left, top }]).png().toBuffer();
    if (DEBUG) {
      const svg = Buffer.from(
        `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#f00" stroke-width="3"/></svg>`
      );
      buf = await sharp(buf).composite([{ input: svg, left, top }]).png().toBuffer();
    }
  }

  // страницы в макете вытянуты по вертикали относительно PDF — подгоняем
  return {
    buf: await sharp(buf).resize(targetW, targetH, { fit: "fill" }).png().toBuffer(),
    bands: bands.length,
  };
}

const files = readdirSync(SRC).filter((f) => /^\d+-\d+\.(jpg|jpeg|png)$/i.test(f));
files.sort((a, b) => parseInt(a) - parseInt(b));

for (const file of files) {
  const [leftPage, rightPage] = path.parse(file).name.split("-").map(Number);
  const src = path.join(SRC, file);
  const { width: W, height: H } = await sharp(src).metadata();

  const fx0 = Math.round(FRAME.x0 * W);
  const fx1 = Math.round(FRAME.x1 * W);
  const fy0 = Math.round(FRAME.y0 * H);
  const fy1 = Math.round(FRAME.y1 * H);
  const halfW = Math.round((fx1 - fx0) / 2);
  const frameH = fy1 - fy0;

  const left = await cleanPage(leftPage, halfW, frameH);
  const right = await cleanPage(rightPage, halfW, frameH);

  // Вклеенные страницы плоские, и разворот перестаёт читаться как книга,
  // поэтому возвращаем ему объём: тень в переплёте и лёгкое затемнение
  // у внешних краёв — так же, как это выглядело в исходном макете.
  const gutter = Math.round(halfW * 0.1);
  const shade = Buffer.from(
    `<svg width="${fx1 - fx0}" height="${frameH}">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0" stop-color="#2b1d0f" stop-opacity="0"/>
           <stop offset="0.46" stop-color="#2b1d0f" stop-opacity="0.22"/>
           <stop offset="0.5" stop-color="#2b1d0f" stop-opacity="0.42"/>
           <stop offset="0.54" stop-color="#2b1d0f" stop-opacity="0.22"/>
           <stop offset="1" stop-color="#2b1d0f" stop-opacity="0"/>
         </linearGradient>
         <linearGradient id="e" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0" stop-color="#2b1d0f" stop-opacity="0.16"/>
           <stop offset="0.05" stop-color="#2b1d0f" stop-opacity="0"/>
           <stop offset="0.95" stop-color="#2b1d0f" stop-opacity="0"/>
           <stop offset="1" stop-color="#2b1d0f" stop-opacity="0.16"/>
         </linearGradient>
       </defs>
       <rect x="${(fx1 - fx0) / 2 - gutter}" y="0" width="${gutter * 2}" height="100%" fill="url(#g)"/>
       <rect width="100%" height="100%" fill="url(#e)"/>
     </svg>`
  );

  let buf = await sharp(src)
    .composite([
      { input: left.buf, left: fx0, top: fy0 },
      { input: right.buf, left: fx0 + halfW, top: fy0 },
      { input: shade, left: fx0, top: fy0, blend: "over" },
    ])
    .png()
    .toBuffer();

  // Обрезаем пустое поле макета: в исходнике разворот занимает меньше
  // половины кадра, а на сайте плитка узкая. Небольшой запас оставляем —
  // в нём лежит тень, благодаря которой разворот читается как бумага.
  const m = Math.round(W * 0.022);
  const cropLeft = Math.max(0, fx0 - m);
  const cropTop = Math.max(0, fy0 - m);
  const out = path.join(OUT, `spread-${leftPage}-${rightPage}.webp`);
  const meta = await sharp(buf)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: Math.min(W - cropLeft, fx1 - fx0 + m * 2),
      height: Math.min(H - cropTop, frameH + m * 3), // снизу тень заметнее
    })
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(
    `spread-${leftPage}-${rightPage}.webp  ${meta.width}×${meta.height}  ` +
      `замыто полос: ${left.bands + right.bands}`
  );
}
console.log("готово:", OUT);
