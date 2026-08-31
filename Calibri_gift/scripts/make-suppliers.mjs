/**
 * Готовит логотипы поставщиков для блока «А внутри — только лучшее».
 *
 * Заказчица прислала архив «поставщики.zip» с оригиналами — все 14 фабрик,
 * включая те четыре, которых не было в каталоге и которые до этого висели
 * текстовыми плашками (Konti, Essen, Mars, Невский кондитер).
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
];

const CREAM = { r: 247, g: 243, b: 236 };

for (const [file, name, human] of MAP) {
  const src = path.join(SRC, file);
  if (!existsSync(src)) {
    console.error(`нет файла ${file} (${human}) — карта разошлась с архивом`);
    process.exit(1);
  }
  const out = path.join(OUT, `factory-${name}.webp`);
  const meta = await sharp(src)
    // вписываем в единую рамку с полями: логотипы разной пропорции,
    // без этого на плашках они прыгают по размеру
    .resize(420, 220, { fit: "contain", background: CREAM })
    .flatten({ background: CREAM })
    .webp({ quality: 92 })
    .toFile(out);
  console.log(`factory-${name}.webp  ${meta.width}×${meta.height}  — ${human}`);
}
console.log(`готово: ${MAP.length} логотипов в ${OUT}`);
