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

console.log("готово");
