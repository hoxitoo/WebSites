/**
 * Картинка для превью ссылки в соцсетях и мессенджерах (og:image).
 *
 * Правка: «добавил картинку для шеринга, нужно заменить текущую коробку
 * на это — изображение, которое появляется под ссылкой при вставке в соцсети».
 * Исходник — обложка «Коллекция новогодних подарков 2027», 811×603.
 *
 * Превью в соцсетях — 1200×630, пропорция 1,9 : 1, а обложка почти
 * квадратная (1,35 : 1). Обрезать нельзя: пропадёт либо логотип с надписью
 * вверху, либо «2027» внизу. Поэтому обложка стоит целиком по центру,
 * а поля по бокам заполнены её же копией — растянутой, размытой
 * и притемнённой. Стандартный приём: кадр полный, и нет пустых полос.
 *
 * Имя файла новое (og-2027.jpg), а не старое og.jpg: Telegram, VK
 * и WhatsApp запоминают превью по адресу картинки и под старым именем
 * ещё долго показывали бы прежнюю коробку.
 *
 * Исходник: design/rework-2026-09/og-source.png (папка в .gitignore).
 * Запуск (из папки Calibri_gift):  node scripts/make-og.mjs
 */
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("design/rework-2026-09/og-source.png");
const OUT = path.resolve("public/gift/og-2027.jpg");
const W = 1200;
const H = 630;

// у обложки белая рамка со скруглёнными прозрачными углами — срезаем её,
// иначе на превью по краям обложки была бы белая кайма
const { data: cover, info } = await sharp(SRC)
  .flatten({ background: "#ffffff" })
  .trim({ background: "#ffffff", threshold: 30 })
  .toBuffer({ resolveWithObject: true });

const bg = await sharp(cover)
  .resize(W, H, { fit: "cover" })
  .blur(28)
  .modulate({ brightness: 0.55 })
  .toBuffer();

const fg = await sharp(cover).resize({ height: H }).toBuffer({ resolveWithObject: true });
const left = Math.round((W - fg.info.width) / 2);

const meta = await sharp(bg)
  .composite([{ input: fg.data, left, top: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT);

console.log(
  `обложка без рамки ${info.width}×${info.height} → og-2027.jpg ${meta.width}×${meta.height}, ` +
    `обложка ${fg.info.width}×${fg.info.height} по центру`
);
