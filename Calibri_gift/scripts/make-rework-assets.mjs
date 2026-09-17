/**
 * Картинки из её переработки сайта (сентябрь 2026).
 *
 * Заказчица прислала папку «новые правки»: свой HTML-макет целиком,
 * скриншоты с пометками, 10 новых фото для галереи и 6 картинок разделов
 * без надписей. Надписи она попросила убрать: «они местами обрезаны и всё
 * равно текстовыми заголовками дублируются».
 *
 * Оригиналы лежат в design/rework-2026-09/ (папка в .gitignore — сайту
 * нужны только готовые webp).
 *
 * Запуск (из папки Calibri_gift):  node scripts/make-rework-assets.mjs
 */
import sharp from "sharp";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("design/rework-2026-09");
if (!existsSync(SRC)) {
  console.error(`нет папки с оригиналами: ${SRC}`);
  process.exit(1);
}

/* ————— 1. Десять новых фото для галереи ————— */
// Идут после шестнадцати с её Яндекс-Диска (kid-01…16), поэтому нумерация
// продолжается с 17. Порядок и подписи — как в её макете.
const KIDS = [
  ["01-девочка-овечка-набор.jpg", "Девочка в красном платье с игрушкой-овечкой и подарочным набором"],
  ["02-девочка-пакет-игрушка.jpg", "Девочка с подарочным пакетом и мягкой игрушкой у ёлки"],
  ["03-мальчик-пакет.jpg", "Мальчик в клетчатой рубашке с подарочным пакетом"],
  ["04-девочка-синее-платье.jpg", "Девочка в синем платье с подарочным пакетом"],
  ["05-мальчик-пакет-2.jpg", "Мальчик с подарочным пакетом"],
  ["06-девочка-ободок.jpg", "Девочка в красном платье с ободком"],
  ["07-девочка-свеча.jpg", "Девочка с новогодней свечой у ёлки"],
  ["08-девочка-овечка-камин.jpg", "Девочка с мягкой игрушкой-овечкой у камина"],
  ["09-мальчик-коробка.jpg", "Мальчик в белой рубашке с подарочной коробкой"],
  ["10-девочка-игрушки.jpg", "Девочка в синем платье с новогодними игрушками"],
];

const KIDS_OUT = path.resolve("public/catalog");
mkdirSync(KIDS_OUT, { recursive: true });

const extra = [];
for (let i = 0; i < KIDS.length; i++) {
  const [file, alt] = KIDS[i];
  const src = path.join(SRC, "gallery", file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} — карта разошлась с папкой`);
    process.exit(1);
  }
  const name = `kid-${String(17 + i).padStart(2, "0")}.webp`;
  // тот же размер, что у первых шестнадцати: пропорция 2:3 совпадает,
  // иначе карточки галереи прыгали бы по высоте
  const meta = await sharp(src)
    .resize(700, 1049, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(path.join(KIDS_OUT, name));
  extra.push({ file: name, alt, source: "архив «отобранные фото для галереи»" });
  console.log(`${name}  ${meta.width}×${meta.height}`);
}

// Происхождение кадров — в отдельный файл kids-source-extra.json.
// Раньше скрипт дописывал поле в kids-source.json, но тот хранит массив
// (его пишет scripts/fetch-kids.mjs), а у массива JSON.stringify
// нечисловые поля молча отбрасывает — запись терялась без ошибки.
// Файл собирается целиком за один запуск, из обеих партий ниже.
const provPath = path.join(KIDS_OUT, "kids-source-extra.json");
const prov = {
  gallery: {
    note:
      "Десять фото из архива «отобранные фото для галереи» — прислала заказчица " +
      "вместе со своим макетом в сентябре 2026. Оригиналы: design/rework-2026-09/gallery/",
    files: extra,
  },
};

/* ————— 2. Шесть картинок разделов без надписей ————— */
// Соответствие «файл → раздел» опознавал по её скриншоту с подписями:
// на нём те же сюжеты, но с врисованными надписями «в наборах»,
// «в картонной упаковке» и т.д.
const FORMATS = [
  ["artboard-3.jpg", "nabory", "Подарки в наборах"],
  ["artboard-1.jpg", "karton", "Картонная упаковка"],
  ["artboard-5.jpg", "tekstil", "Текстильная упаковка"],
  ["artboard-2.jpg", "kombi", "Комбинированная упаковка"],
  ["artboard-6.jpg", "premium", "Премиум-упаковка"],
  // Шестая карточка — брендирование. В её макете там стояло фото каталога,
  // но оно уже занято карточкой «Коллекция по личному запросу» выше:
  // два одинаковых снимка в одном блоке. Поэтому берём шестую картинку
  // из той же серии — сюжет тёплый и без надписей, как она и просила.
  ["artboard-4.jpg", "brand", "Брендирование логотипом"],
];

const FMT_OUT = path.resolve("public/formats");
mkdirSync(FMT_OUT, { recursive: true });

for (const [file, name, human] of FORMATS) {
  const src = path.join(SRC, "formats", file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} (${human})`);
    process.exit(1);
  }
  const meta = await sharp(src)
    .webp({ quality: 88 })
    .toFile(path.join(FMT_OUT, `format-${name}.webp`));
  console.log(`format-${name}.webp  ${meta.width}×${meta.height}  — ${human}`);
}

/* ————— 3. Обложка каталога для карточки «по личному запросу» ————— */
const cover = path.join(SRC, "catalog-cover.jpg");
if (existsSync(cover)) {
  const meta = await sharp(cover)
    .resize(1100, null, { withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(path.resolve("public/catalog/cover-2027.webp"));
  console.log(`cover-2027.webp  ${meta.width}×${meta.height}`);
}

/* ————— 4. Девять фото из финальных правок (14.09) ————— */
// Архив «фото.zip» из папки «финальные правки». Часть кадров — те же дети
// и игрушки, что уже есть в галерее, но на новом, более праздничном фоне.
// Решение: «добавь новые в начало, а старые оставь все». Нумерация
// продолжается с 27. Подписи составлены по самим фотографиям.
const FINAL = [
  ["84b37198-e744-4a12-8c61-23e42536671d.png", "Девочка с двумя игрушками-овечками в очках и свитерах"],
  ["95ea8705-10cf-4a4a-a3bc-948c5086b56d.png", "Девочка с подушкой с новогодним рисунком домика и овечек"],
  ["994510ef-972d-4787-b6a5-d870523285cb.png", "Девочка с тремя игрушками-овечками в полосатых шарфах"],
  ["aacfd624-a2a6-447b-8d8e-bf9fd964a1db.png", "Девочка с двумя мягкими снеговиками в шапках-ушанках"],
  ["d31e5307-0eec-4036-8247-89893d7c7cfc.png", "Мальчик с книгой, игрушкой-овечкой и рюкзаком «Чудеса там, где в них верят»"],
  ["de3c78a2-60ca-4e0c-996f-c2f073b76bf8.png", "Девочка с игрушкой-овечкой на плече и подарочной сумкой"],
  ["бараш игрушка.png", "Девочка в красном платье с игрушкой-барашком"],
  ["бараш.png", "Мальчик в белой рубашке с игрушкой-барашком"],
  ["игрушка.png", "Девочка в красном платье с игрушкой-козочкой в шарфе"],
];

const finalFiles = [];
for (let i = 0; i < FINAL.length; i++) {
  const [file, alt] = FINAL[i];
  const src = path.join(SRC, "gallery-final", file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} — положите архив «фото.zip» в design/rework-2026-09/gallery-final/`);
    process.exit(1);
  }
  const name = `kid-${String(27 + i).padStart(2, "0")}.webp`;
  // оригиналы 1024×1536 — та же пропорция 2:3, что у остальных кадров ленты
  const meta = await sharp(src)
    .resize(700, 1049, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(path.join(KIDS_OUT, name));
  finalFiles.push({ file: name, alt, source: `архив «фото.zip» (финальные правки): ${file}` });
  console.log(`${name}  ${meta.width}×${meta.height}`);
}

prov.galleryFinal = {
  note:
    "Девять фото из финальных правок заказчицы (14.09.2026), стоят в начале ленты. " +
    "Оригиналы: design/rework-2026-09/gallery-final/",
  files: finalFiles,
};
writeFileSync(provPath, JSON.stringify(prov, null, 2) + "\n");
console.log(`происхождение кадров записано в ${path.basename(provPath)}`);

/* ————— 5. Три девочки — «разбавить мальчиков» ————— */
// Правка: «добавить фото 3 девочек между мальчиками, разбавить мальчиков».
// Исходники разного размера (2500×3746 и 1024×1536), пропорция у всех 2:3.
// Место в ленте — в components/KidsStrip.tsx.
const GIRLS = [
  ["девочка1.jpg", "Девочка с ободком-мишками и подушкой «Волшебного Нового года» с Дедом Морозом"],
  ["девочка2.png", "Девочка с ободком-мишками и подарочной коробкой с барашками"],
  ["девочка3.jpg", "Девочка с подушкой «С Новым годом!» с барашками в очках"],
];
const girlsFiles = [];
for (let i = 0; i < GIRLS.length; i++) {
  const [file, alt] = GIRLS[i];
  const src = path.join(SRC, "gallery-girls", file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} — положите фото в design/rework-2026-09/gallery-girls/`);
    process.exit(1);
  }
  const name = `kid-${String(36 + i).padStart(2, "0")}.webp`;
  const meta = await sharp(src)
    .resize(700, 1049, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(path.join(KIDS_OUT, name));
  girlsFiles.push({ file: name, alt, source: `папка «финальные правки2»: ${file}` });
  console.log(`${name}  ${meta.width}×${meta.height}`);
}
prov.galleryGirls = {
  note: "Три девочки «между мальчиками» (финальные правки 2). Оригиналы: design/rework-2026-09/gallery-girls/",
  files: girlsFiles,
};
writeFileSync(provPath, JSON.stringify(prov, null, 2) + "\n");

/* ————— 6. Пять дополнительных фото (финальные правки 3) ————— */
// «новые фото — можно чуть сжать», «мальчиков разбавляем девочками».
// Два исходника — 4912×7360 по 12 МБ; на выходе, как у всех кадров ленты,
// 700×1049 и около 100 КБ. Место в ленте — в components/KidsStrip.tsx.
const MORE = [
  ["DSC_3263 красно-серые люксюокс.jpeg", "Девочка с ободком-мишками и подарочной коробкой с барашками в очках"],
  ["DSC_3918 (1).jpg", "Девочка с сумкой-шопером с матрёшкой"],
  ["DSC_3992.jpg", "Девочка в белом платье с подарочной коробкой с барашками"],
  ["DSC_4332.jpg", "Девочка с мягкой игрушкой-овечкой на диване"],
  ["DSC_6194-2.jpg", "Девочка в красном платье с подарочной сумкой «Заснеженная»"],
];
const moreFiles = [];
for (let i = 0; i < MORE.length; i++) {
  const [file, alt] = MORE[i];
  const src = path.join(SRC, "gallery-more", file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} — распакуйте «дополнительные фото.zip» в design/rework-2026-09/gallery-more/`);
    process.exit(1);
  }
  const name = `kid-${String(39 + i).padStart(2, "0")}.webp`;
  const meta = await sharp(src)
    .rotate() // у больших исходников есть EXIF-ориентация
    .resize(700, 1049, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(path.join(KIDS_OUT, name));
  moreFiles.push({ file: name, alt, source: `архив «дополнительные фото» (финальные правки 3): ${file}` });
  console.log(`${name}  ${meta.width}×${meta.height}`);
}
prov.galleryMore = {
  note: "Пять дополнительных фото (финальные правки 3). Оригиналы: design/rework-2026-09/gallery-more/",
  files: moreFiles,
};
writeFileSync(provPath, JSON.stringify(prov, null, 2) + "\n");

/* ————— 7. Кружки с детьми ————— */
// «нужно разбавить блок текстовой информации кружочком» (над «Соберём подарок
// под ваш запрос») и «тут тоже хочется кружочек с ребёнком — небольшого
// размера» (у «Хотите посмотреть, как собирается уникальный подарок?»).
// Исходники — круг на белом квадрате. Вырезаем сам круг: ищем его границы
// по небелым пикселям и накладываем круглую маску — на тёмном фоне сайта
// белых углов быть не должно.
async function circle(file, out, size) {
  const src = path.join(SRC, file);
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const nonWhite = (x, y) => {
    const i = (y * W + x) * 3;
    return data[i] + data[i + 1] + data[i + 2] < 720;
  };
  let l = W, r = 0, t = H, b = 0;
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2)
      if (nonWhite(x, y)) {
        if (x < l) l = x;
        if (x > r) r = x;
        if (y < t) t = y;
        if (y > b) b = y;
      }
  // круг вписан в квадрат; берём сторону по меньшему размеру, чтобы не
  // захватить белое поле, и чуть срезаем край — у круга мягкий ободок
  const side = Math.min(r - l, b - t) - 8;
  const cx = Math.round((l + r) / 2);
  const cy = Math.round((t + b) / 2);
  const left = Math.round(cx - side / 2);
  const top = Math.round(cy - side / 2);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  const meta = await sharp(src)
    .extract({ left, top, width: side, height: side })
    .resize(size, size)
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(path.resolve("public/catalog", out));
  console.log(`${out}  ${meta.width}×${meta.height} (круг ${side} px из ${W}×${H})`);
}
await circle("кружок1.png", "circle-girl.webp", 360);
await circle("кружок2.png", "circle-boy.webp", 240);

/* ————— 8. Обложка каталога от дизайнера ————— */
// «замена — файл от дизайнера на прозрачном фоне»: две книги каталога
// стопкой. Прозрачные поля обрезаем, чтобы размер на сайте задавала сама
// картинка, а не пустота вокруг неё.
{
  const src = path.join(SRC, "файл от дизайнера на прозрачном фоне.png");
  // trim() тут не срабатывает: мягкая тень под книгами полупрозрачная и
  // тянется до самого края. Поэтому границы считаем по альфе ≥ 10 —
  // едва видимый хвост тени уходит, сами книги и тень под ними остаются.
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let l = info.width, r = 0, t = info.height, b = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] >= 10) {
        if (x < l) l = x;
        if (x > r) r = x;
        if (y < t) t = y;
        if (y > b) b = y;
      }
  const trimmed = await sharp(src)
    .extract({ left: l, top: t, width: r - l + 1, height: b - t + 1 })
    .toBuffer();
  const meta = await sharp(trimmed)
    .resize({ width: 1100 })
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(path.resolve("public/catalog/cover-2027-books.webp"));
  console.log(`cover-2027-books.webp  ${meta.width}×${meta.height}`);
}

console.log("готово");
