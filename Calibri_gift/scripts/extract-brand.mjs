/**
 * Достаёт из каталога заказчицы фирменные материалы для сайта:
 * логотипы кондитерских фабрик, новогодний паровоз и ёлку.
 *
 * Запуск (из папки Calibri_gift):
 *   node scripts/extract-brand.mjs "D:/.../kolibri_katalog_2027.pdf"
 *   node scripts/extract-brand.mjs <файл.pdf> --list   — показать номера картинок
 *
 * Всё лежит на 2-й странице каталога, и всё вырезаем из её рендера.
 * Встроенные картинки брать нельзя: у части логотипов в PDF чёрная подложка
 * без маски, а у паровоза маска грубее рисунка — по краям лезет чернота.
 * На странице же всё уже сведено на светлом фоне.
 *
 * Координаты и номера привязаны к каталогу 2027 года. Обновится каталог —
 * сверьте через --list и поправьте таблицы ниже.
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const PDF = process.argv[2] || process.env.KATALOG;
if (!PDF) {
  console.error("Укажите путь к PDF: node scripts/extract-brand.mjs <файл.pdf>");
  process.exit(1);
}
const LIST = process.argv.includes("--list");

const OUT = path.resolve("public/brand");
mkdirSync(OUT, { recursive: true });

// логотипы: имя → прямоугольник на 2-й странице в пунктах (x0, y0, x1, y1)
const LOGOS = {
  "factory-krasnyy-oktyabr": [175, 114, 262, 160, "Красный Октябрь"],
  "factory-rotfront": [278, 114, 365, 160, "РотФронт"],
  "factory-babaevskiy": [384, 114, 476, 160, "Бабаевский"],
  "factory-maheev": [484, 118, 566, 153, "Махеевъ"],
  "factory-pobeda": [576, 116, 669, 153, "Победа"],
  "factory-akkond": [174, 170, 261, 221, "Акконд"],
  "factory-ferrero": [273, 188, 391, 212, "Ferrero"],
  "factory-slavyanka": [411, 176, 459, 223, "Славянка"],
  "factory-sladkiy-oreshek": [484, 177, 576, 215, "Сладкий Орешек"],
  "factory-kdv": [602, 183, 662, 215, "KDV"],
};

// Паровоз: вырезаем прямоугольником из отрендеренной страницы.
//
// Пробовал собрать его с прозрачностью (цвет + маска getMask) — не годится:
// маска в PDF грубее рисунка и не покрывает вагоны целиком, поэтому по краям
// и в дыме проступала чёрная подложка. Фон паровоза на странице — светлый
// зимний, он сам вписывается в светлую секцию сайта, где стоит панелью
// со скруглёнными углами.
const CUTOUTS = {
  train: [452, 262, 765, 537, 1000, "новогодний паровоз"],
};

const doc = mupdf.Document.openDocument(readFileSync(PDF), "application/pdf");
const page = doc.loadPage(1); // 2-я страница каталога

/* ————— страница целиком: из неё вырезаем и паровоз, и логотипы ————— */

if (LIST) {
  let i = 0;
  page.toStructuredText("preserve-images").walk({
    onImageBlock(bbox, _t, img) {
      const [x0, y0, x1, y1] = bbox.map(Math.round);
      console.log(`#${i++}  x:${x0}-${x1} y:${y0}-${y1}  ${img.getWidth()}×${img.getHeight()}px`);
    },
  });
  process.exit(0);
}

const SCALE = 3.4; // 765pt → ~2600px
const pagePix = page.toPixmap(
  mupdf.Matrix.scale(SCALE, SCALE),
  mupdf.ColorSpace.DeviceRGB,
  false,
  true
);
const pagePng = path.join(OUT, "_page2.png");
writeFileSync(pagePng, pagePix.asPNG());
pagePix.destroy();
const pageMeta = await sharp(pagePng).metadata();

const cut = async (name, x0, y0, x1, y1, width, quality = 88, feather = false) => {
  const left = Math.max(0, Math.round(x0 * SCALE));
  const top = Math.max(0, Math.round(y0 * SCALE));
  const file = path.join(OUT, `${name}.webp`);
  let img = sharp(pagePng)
    .extract({
      left,
      top,
      width: Math.min(pageMeta.width - left, Math.round((x1 - x0) * SCALE)),
      height: Math.min(pageMeta.height - top, Math.round((y1 - y0) * SCALE)),
    })
    .resize({ width, withoutEnlargement: true });

  if (feather) {
    // Растворяем края в прозрачность. Иначе по кромкам кропа остаются обрывки
    // соседних элементов каталога (полоска плашки слева, синий угол справа),
    // а сама картинка читается как вставленный прямоугольник.
    //
    // Два отдельных прохода, а не одна маска с пересечением градиентов:
    // mix-blend-mode внутри SVG отрисовщик sharp не поддерживает, и маска
    // выходила пустой — картинка исчезала целиком.
    let buf = await img.png().toBuffer();
    const meta = await sharp(buf).metadata();
    const ramp = (vertical) => {
      const [x1, y1, x2, y2] = vertical ? [0, 0, 0, 1] : [0, 0, 1, 0];
      const soft = vertical ? [0.06, 0.88] : [0.07, 0.93];
      return Buffer.from(
        `<svg width="${meta.width}" height="${meta.height}">
           <defs><linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
             <stop offset="0" stop-color="#fff" stop-opacity="0"/>
             <stop offset="${soft[0]}" stop-color="#fff" stop-opacity="1"/>
             <stop offset="${soft[1]}" stop-color="#fff" stop-opacity="1"/>
             <stop offset="1" stop-color="#fff" stop-opacity="0"/>
           </linearGradient></defs>
           <rect width="100%" height="100%" fill="url(#g)"/>
         </svg>`
      );
    };
    for (const vertical of [false, true]) {
      buf = await sharp(buf)
        .ensureAlpha()
        .composite([{ input: ramp(vertical), blend: "dest-in" }])
        .png()
        .toBuffer();
    }
    img = sharp(buf);
  }

  await img.webp({ quality, alphaQuality: 100 }).toFile(file);
  return sharp(file).metadata();
};

for (const [name, [x0, y0, x1, y1, width, human]] of Object.entries(CUTOUTS)) {
  const m = await cut(name, x0, y0, x1, y1, width, 86, true);
  console.log(`${name}.webp  ${m.width}×${m.height}  — ${human}`);
}

/* ————— логотипы: вырезаем из отрендеренной страницы ————— */

for (const [name, [x0, y0, x1, y1, human]] of Object.entries(LOGOS)) {
  const pad = 2; // логотипы стоят вплотную — берём с небольшим запасом
  const m = await cut(name, x0 - pad, y0 - pad, x1 + pad, y1 + pad, 300, 90);
  console.log(`${name}.webp  ${m.width}×${m.height}  — ${human}`);
}
console.log("готово:", OUT);
