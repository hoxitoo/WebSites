/**
 * Забирает фотографии детей для ленты «Как выглядит радость» с Яндекс.Диска
 * заказчицы и кладёт их в public/catalog/ как kid-01…kid-16.webp.
 *
 * Заказчица: «по фото ставь с диска 16 штук, копии сохрани локально, чтобы
 * если нет доступа к диску не сломалось». Поэтому картинки лежат в репозитории
 * рядом с сайтом — публичная ссылка может закрыться, сайт от неё не зависит.
 *
 * Отбор ниже сделан по контактным листам всех папок: студийные кадры, где
 * ребёнок держит подарок, портретной ориентации, с разными детьми и разными
 * видами упаковки. Фото товара без людей и дубли одного кадра не брал.
 *
 * Запуск (из папки Calibri_gift):
 *   node scripts/fetch-kids.mjs
 *   node scripts/fetch-kids.mjs --list   — показать, что лежит в папках Диска
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const PUBLIC_KEY = "https://disk.yandex.ru/d/CG_vp-k8ljJoYA";
const API = "https://cloud-api.yandex.net/v1/disk/public/resources";
const OUT = path.resolve("public/catalog");

// папка на Диске → номера файлов в ней (порядок как отдаёт API, с нуля)
const PICK = [
  ["/наборы", [0, 3, 8, 13, 17, 30]],
  ["/картон", [0, 6, 13, 27, 33]],
  ["/текстиль", [4, 8, 10]],
  ["/комби", [1, 6]],
];

// подписи для alt: важны и для доступности, и для поиска
const ALTS = [
  "Девочка с мягкой игрушкой-овечкой и новогодним набором",
  "Девочка с набором и игрушками-барашками у ёлки",
  "Девочка с мягкой игрушкой-овечкой на руках",
  "Мальчик с новогодним набором и книгами",
  "Девочка с двумя игрушками-овечками",
  "Мальчик с подарочной сумкой",
  "Девочка с подарком в картонной коробке",
  "Девочка с картонной коробкой-домиком",
  "Девочка с подарком в картонной упаковке у ёлки",
  "Девочка с картонной коробкой с новогодним рисунком",
  "Девочка с подарочной коробкой в руках",
  "Мальчик с мягкой игрушкой-бараном",
  "Девочка с мягкой игрушкой-козочкой",
  "Девочка с мягкой игрушкой в новогоднем костюме",
  "Девочка с подарком в комбинированной упаковке",
  "Мальчик с подарочной тубой",
];

const listCache = new Map();
async function list(folder) {
  if (listCache.has(folder)) return listCache.get(folder);
  const url =
    `${API}?public_key=${encodeURIComponent(PUBLIC_KEY)}` +
    `&path=${encodeURIComponent(folder)}&limit=300`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${folder}: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const files = (data._embedded?.items ?? []).filter((x) => x.type === "file");
  listCache.set(folder, files);
  return files;
}

if (process.argv.includes("--list")) {
  for (const [folder] of PICK) {
    const files = await list(folder);
    console.log(`\n${folder} — ${files.length} файлов`);
    files.forEach((f, i) => console.log(`  ${i}: ${f.name} ${(f.size / 1048576).toFixed(1)} МБ`));
  }
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });

let n = 0;
const manifest = [];
for (const [folder, idxs] of PICK) {
  const files = await list(folder);
  for (const i of idxs) {
    const item = files[i];
    if (!item) throw new Error(`${folder}: нет файла №${i} — папка на Диске изменилась`);
    const dl = await fetch(
      `${API}/download?public_key=${encodeURIComponent(PUBLIC_KEY)}` +
        `&path=${encodeURIComponent(item.path)}`
    );
    if (!dl.ok) throw new Error(`${item.path}: ${dl.status}`);
    const { href } = await dl.json();
    const bin = Buffer.from(await (await fetch(href)).arrayBuffer());

    const name = `kid-${String(++n).padStart(2, "0")}.webp`;
    // 700 px по ширине: карточка в ленте 250 px, с запасом на retina
    const meta = await sharp(bin)
      .rotate() // учитываем EXIF-ориентацию — иначе часть кадров ложится набок
      .resize({ width: 700, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT, name));
    manifest.push({ name, folder, index: i, source: item.name, alt: ALTS[n - 1] ?? "" });
    console.log(`${name}  ${meta.width}×${meta.height}  ← ${folder}/${item.name}`);
  }
}

// откуда что взято — чтобы потом можно было заменить конкретный кадр
writeFileSync(
  path.join(OUT, "kids-source.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);
console.log(`\nготово: ${n} фото в ${OUT}`);
