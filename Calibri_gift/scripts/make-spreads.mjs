/**
 * Готовит развороты каталога для блока «Полистайте наш каталог».
 *
 * Заказчица прислала архив «правки сайт для листания каталога» — 8 макетов
 * раскрытого каталога (3000×2000, файлы названы по номерам страниц: 6-7,
 * 8-9 …).
 *
 * ЦЕНЫ ВИДНЫ. Раньше скрипт замывал строки «Цена: …» и «Артикул: …» — рядом
 * в блоке написано, что каталог мы в открытый доступ не выкладываем. Правка
 * заказчицы: «в „Полистайте наш каталог“ убрать замазку с цен, чтобы цены
 * везде было видно». Замывание выключено по умолчанию; если решат снова
 * скрыть цены — флаг --mask-prices, код остался.
 *
 * Важно: в PDF-каталоге вместо цен стоят заглушки «Цена: 00 ₽» — на всех
 * страницах. Настоящие цены и артикулы есть только в её макетах из архива.
 * Поэтому без --mask-prices страницы берутся прямо из макета (он лишь
 * сжимается до настоящих пропорций), а страницы из PDF вклеиваются только
 * при замывании — ради точных координат строк с ценой.
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
 *   node scripts/make-spreads.mjs <папка> <pdf> --mask-prices   — замыть цены
 *   node scripts/make-spreads.mjs <папка> <pdf> --mask-prices --debug   — и обвести замытое
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
// по умолчанию цены видны — правка «убрать замазку с цен»
const MASK_PRICES = process.argv.includes("--mask-prices");

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

  const bands = MASK_PRICES ? priceBands(pageNumber) : [];
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

  // Рамка в макете уже подогнана под настоящую пропорцию страницы (см. цикл
  // ниже), поэтому здесь растяжение — округление на пару пикселей, не больше.
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

  // ПРОПОРЦИИ. Правки заказчицы «сжато по ширине», «растянуто опять — должно
  // быть как в оригинале». Страница каталога в PDF — 765×567 (1,35).
  //
  // Рамка FRAME, замеренная детектором границ, выше самой страницы в макете:
  // половина рамки 1257×1074 (1,17), а напечатанная страница в макете —
  // 1257×~931, то есть в правильной пропорции 1,35. Лишние ~13% снизу —
  // толщина раскрытой книги и тень. Страницы из PDF раньше вклеивались
  // растяжением по всей рамке и выходили выше настоящих на 15%.
  //
  // Поэтому две ветки:
  //  • без замывания (по умолчанию) страницы — это сам макет, он и так
  //    в верных пропорциях: ничего не сжимаем, высота страницы считается
  //    по пропорции из PDF, и от неё же — поля кадра;
  //  • с --mask-prices в макет вклеиваются очищенные страницы из PDF;
  //    тогда шаблон сжимается по вертикали, чтобы рамка получила пропорцию
  //    страницы, и страницы встают без растяжения.
  //
  // Проверено по фото мальчика на стр. 10: в PDF 295×445, в сжатом макете
  // выходило 299×370 — то есть сжимать сам макет нельзя.
  const [, , pw, ph] = doc.loadPage(leftPage - 1).getBounds();
  const PAGE_ASPECT = pw / ph;
  const fx0 = Math.round(FRAME.x0 * W);
  const fx1 = Math.round(FRAME.x1 * W);
  const halfW = Math.round((fx1 - fx0) / 2);
  const rawFrameH = Math.round((FRAME.y1 - FRAME.y0) * H);
  const K = MASK_PRICES ? halfW / rawFrameH / PAGE_ASPECT : 1;
  const Hs = Math.round(H * K);
  const mockup = MASK_PRICES
    ? await sharp(src).resize(W, Hs, { fit: "fill" }).png().toBuffer()
    : await sharp(src).png().toBuffer();

  const fy0 = Math.round(FRAME.y0 * Hs);
  const frameH = MASK_PRICES
    ? Math.round(FRAME.y1 * Hs) - fy0
    : Math.round(halfW / PAGE_ASPECT);

  // Страницы из PDF нужны только для замывания цен (там точные координаты
  // текста). Без замывания страницы берём прямо из её макета: в PDF вместо
  // цен заглушки «00 ₽», настоящие цены — только в макете.
  const left = MASK_PRICES ? await cleanPage(leftPage, halfW, frameH) : null;
  const right = MASK_PRICES ? await cleanPage(rightPage, halfW, frameH) : null;

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

  // С замыванием — вклеиваем очищенные страницы в уже сжатый шаблон (его
  // рамка совпадает со страницами) и возвращаем объём тенью. Без замывания —
  // сам сжатый макет: у него своя тень в переплёте, добавлять её не нужно.
  let buf = MASK_PRICES
    ? await sharp(mockup)
        .composite([
          { input: left.buf, left: fx0, top: fy0 },
          { input: right.buf, left: fx0 + halfW, top: fy0 },
          { input: shade, left: fx0, top: fy0, blend: "over" },
        ])
        .png()
        .toBuffer()
    : mockup;

  // ПО ОДНОЙ СТРАНИЦЕ. Правка заказчицы «сделать по 1 странице на картинке»:
  // «у Клода по одной страничке, а не по две». Собранный разворот режем
  // пополам — каждая страница отдельным файлом page-N.webp.
  //
  // Поля — как в её макете (замерено по её файлам): снаружи ≈2,5% ширины
  // книги, сверху ≈5% высоты, снизу ≈10% — там тень под книгой заметнее.
  // Со стороны переплёта поле узкое (1% ширины страницы): видна только
  // тень корешка, иначе в кадр попадал бы край соседней страницы.
  const frameW = fx1 - fx0;
  const mx = Math.round(frameW * 0.025);
  const mi = Math.round(halfW * 0.01);
  const mt = Math.round(frameH * 0.048);
  const mb = Math.round(frameH * 0.1);
  const top = Math.max(0, fy0 - mt);
  const height = Math.min(Hs - top, frameH + mt + mb);

  const halves = [
    { page: leftPage, left: Math.max(0, fx0 - mx), right: fx0 + halfW + mi, bands: left ? left.bands : 0 },
    { page: rightPage, left: fx0 + halfW - mi, right: Math.min(W, fx1 + mx), bands: right ? right.bands : 0 },
  ];
  for (const h of halves) {
    const out = path.join(OUT, `page-${h.page}.webp`);
    const meta = await sharp(buf)
      .extract({ left: h.left, top, width: h.right - h.left, height })
      .resize({ width: 1100, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(out);
    console.log(
      `page-${h.page}.webp  ${meta.width}×${meta.height}  ` +
        (MASK_PRICES ? `замыто полос: ${h.bands}` : "цены видны")
    );
  }
}
console.log("готово:", OUT);
