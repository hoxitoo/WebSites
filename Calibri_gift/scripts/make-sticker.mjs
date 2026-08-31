/**
 * Готовит стикер Деда Мороза для блока «Чтобы декабрь прошёл спокойно».
 *
 * Заказчица прислала «стикер.png» — Дед Мороз с надписью «Подберу для вас
 * 3 лучших варианта!». Смысл совпадает с блоком дословно: там как раз
 * про то, что чат-бот подберёт три варианта.
 *
 * Делать почти ничего не нужно: в присланном файле УЖЕ есть альфа-канал,
 * 44% кадра прозрачны, стикер вырезан вместе с белой обводкой. Остаётся
 * обрезать пустые поля и сжать под веб.
 *
 * Записал это отдельно, потому что сам сначала не проверил альфу и написал
 * вырезание фона по белому цвету — заливкой от краёв кадра. Оно съедало
 * белую обводку стикера (она того же цвета, что фон), подпись оказывалась
 * прямо на тёмном фоне и не читалась; попытка нарастить обводку обратно
 * оставляла белые пятна там, где прозрачные пиксели исходника принимались
 * за содержимое. Правильный первый шаг — посмотреть, что в файле уже есть.
 *
 * Запуск (из папки Calibri_gift):
 *   node scripts/make-sticker.mjs "D:/.../стикер.png"
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Укажите путь к файлу: node scripts/make-sticker.mjs <стикер.png>");
  process.exit(1);
}
const OUT = path.resolve("public/brand");
mkdirSync(OUT, { recursive: true });

const src = sharp(SRC).ensureAlpha();
const { width: W, height: H } = await src.metadata();

// доля прозрачного — заодно проверка, что альфа на месте: если файл
// заменят на плоский PNG без прозрачности, это сразу будет видно
const { data } = await src.clone().raw().toBuffer({ resolveWithObject: true });
let clear = 0;
for (let i = 3; i < data.length; i += 4) if (data[i] < 250) clear++;
const clearPct = (clear / (W * H)) * 100;
if (clearPct < 5) {
  console.error(
    `⚠️  в файле почти нет прозрачности (${clearPct.toFixed(1)}%) — похоже, ` +
      `стикер прислали на белом фоне. Фон нужно убрать в редакторе: ` +
      `автоматически его не отличить от белой обводки самого стикера.`
  );
  process.exit(1);
}

const out = path.join(OUT, "santa-sticker.webp");
const meta = await src
  .trim({ threshold: 1 }) // обрезаем прозрачные поля вокруг стикера
  .resize({ width: 640, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(out);

console.log(
  `santa-sticker.webp  ${meta.width}×${meta.height}  ` +
    `(в исходнике ${W}×${H}, прозрачно ${clearPct.toFixed(0)}%)`
);
