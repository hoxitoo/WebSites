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

// дописываем происхождение в тот же файл, где записаны первые шестнадцать
const provPath = path.join(KIDS_OUT, "kids-source.json");
if (existsSync(provPath)) {
  const prov = JSON.parse(readFileSync(provPath, "utf8"));
  prov.extra = {
    note:
      "Десять фото из архива «отобранные фото для галереи» — прислала заказчица " +
      "вместе со своим макетом в сентябре 2026. Оригиналы: design/rework-2026-09/gallery/",
    files: extra,
  };
  writeFileSync(provPath, JSON.stringify(prov, null, 2) + "\n");
  console.log("происхождение дописано в kids-source.json");
}

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

console.log("готово");
