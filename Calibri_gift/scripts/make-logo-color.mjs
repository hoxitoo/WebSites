/**
 * Цветной логотип «Колибри» для блока с цифрами.
 *
 * Правка заказчицы: «убираем слово „О компании“ и ставим наш лого — как
 * Клод сделал по моей просьбе». В её макете это логотип в родных цветах
 * (птица из тёмно-фиолетового в красный), а не кремово-золотая «вывернутая»
 * версия из шапки (scripts/make-logo.mjs).
 *
 * Берём оригинал design/brand/kolibri-logo.png — у него уже прозрачный фон.
 * Присланный вместе с правками «лого.png» маленький (284×304) и на белом
 * поле — для сайта он хуже оригинала. Светлый контур, без которого тёмная
 * часть птицы теряется на синем фоне, задаётся на сайте CSS-фильтром,
 * а не впекается в картинку: так его легко подстроить.
 *
 * Запуск (из папки Calibri_gift):  node scripts/make-logo-color.mjs
 */
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("design/brand/kolibri-logo.png");
const OUT = path.resolve("public/logo-kolibri-color.webp");

// 640 px — вдвое больше самого крупного показа на сайте (12,5rem ≈ 200–250 px),
// с запасом на экраны высокой плотности; пропорция оригинала сохраняется
const meta = await sharp(SRC)
  .resize({ width: 640 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT);

console.log(`logo-kolibri-color.webp  ${meta.width}×${meta.height}`);
