/**
 * Готовит логотипы поставщиков для блока «А внутри — только лучшее».
 *
 * Заказчица прислала архив «поставщики.zip» с оригиналами — 14 фабрик,
 * включая те четыре, которых не было в каталоге и которые до этого висели
 * текстовыми плашками (Konti, Essen, Mars, Невский кондитер). Пятнадцатым
 * позже добавился Raffaello — его она прислала отдельной картинкой.
 *
 * Распакованные оригиналы лежат в design/suppliers/ (папка в .gitignore,
 * 5 МБ сайту не нужны — нужны только готовые webp), запуск:
 *   node scripts/make-suppliers.mjs design/suppliers
 *
 * Оригиналы лучше прежних картинок: те вырезались из рендера страницы PDF,
 * то есть были пережаты дважды. Здесь — исходные логотипы.
 *
 * Логотипы кладём на кремовую плашку (как в её каталоге): у большинства
 * фирменные цвета тёмные, на винном фоне они бы утонули. Поэтому фон
 * не убираем, а наоборот — приводим к единому кремовому, чтобы плашки
 * не отличались оттенком белого.
 *
 * Запуск (из папки Calibri_gift):
 *   node scripts/make-suppliers.mjs <папка с распакованным архивом>
 *
 * Соответствие «файл → фабрика» задано картой ниже: имена в архиве
 * частью в кодировке cp866, частью безымянные хеши, поэтому опознавал
 * по контактному листу.
 */
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Укажите папку с логотипами: node scripts/make-suppliers.mjs <папка>");
  process.exit(1);
}
const OUT = path.resolve("public/brand");
mkdirSync(OUT, { recursive: true });

// файл в архиве → имя на сайте и подпись
//
// Raffaello она прислала отдельной картинкой позже («добавить в логотипы этот,
// пропустили») — положите её в ту же папку под именем raffaello.png. В отличие
// от архивных логотипов у неё нет прозрачности: фон залит белым. Такие файлы
// скрипт узнаёт сам (см. `meta.hasAlpha` ниже) и приводит белый к кремовому
// умножением, а не порогом: порог съел бы белую обводку букв.
const MAP = [
  ["f09.png", "krasnyy-oktyabr", "Красный Октябрь"],
  ["f07.png", "rotfront", "РотФронт"],
  ["f04.png", "babaevskiy", "Бабаевский"],
  ["f08.png", "ferrero", "Ferrero"],
  ["f05.png", "akkond", "Акконд"],
  ["f06.png", "slavyanka", "Славянка"],
  ["f02.png", "sladkiy-oreshek", "Сладкий Орешек"],
  ["f00.png", "pobeda", "Победа"],
  ["f01.png", "maheev", "Махеевъ"],
  ["f03.png", "kdv", "KDV"],
  // эти четыре до архива стояли текстом — логотипов не было
  ["f11.png", "konti", "Konti"],
  ["f10.png", "essen", "Essen"],
  ["f13.png", "mars", "Mars"],
  ["f12.png", "nevskiy-konditer", "Невский кондитер"],
  ["raffaello.png", "raffaello", "Raffaello"],
];

const CREAM = { r: 247, g: 243, b: 236 };

for (const [file, name, human] of MAP) {
  const src = path.join(SRC, file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} (${human}) — карта разошлась с архивом`);
    process.exit(1);
  }
  const out = path.join(OUT, `factory-${name}.webp`);

  let img = sharp(src);
  const srcMeta = await img.metadata();
  if (!srcMeta.hasAlpha) {
    // Логотип на непрозрачном белом фоне. Обрезаем белые поля, а сам белый
    // умножаем на кремовый: белая плашка внутри кремовой была бы видна
    // прямоугольником. Умножение трогает только светлое — красный
    // (227,30,54) становится (220,29,50), на глаз это тот же цвет.
    const trimmed = await img
      .trim({ background: "#ffffff", threshold: 6 })
      .toBuffer({ resolveWithObject: true });
    // отдельный проход: sharp применяет composite уже после resize, в одной
    // цепочке кремовый слой не совпал бы по размеру с рамкой 420×220
    const toned = await sharp(trimmed.data)
      .composite([
        {
          input: {
            create: {
              width: trimmed.info.width,
              height: trimmed.info.height,
              channels: 3,
              background: CREAM,
            },
          },
          blend: "multiply",
        },
      ])
      .png()
      .toBuffer();
    img = sharp(toned);
  }

  const meta = await img
    // вписываем в единую рамку с полями: логотипы разной пропорции,
    // без этого на плашках они прыгают по размеру
    .resize(420, 220, { fit: "contain", background: CREAM })
    .flatten({ background: CREAM })
    .webp({ quality: 92 })
    .toFile(out);
  console.log(`factory-${name}.webp  ${meta.width}×${meta.height}  — ${human}`);
}
console.log(`готово: ${MAP.length} логотипов в ${OUT}`);
