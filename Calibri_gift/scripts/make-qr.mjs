/**
 * Рисует QR-коды на ботов для блока внизу сайта.
 * Запуск (из папки Calibri_gift):  node scripts/make-qr.mjs
 *
 * Цвета берём фирменные: тёмно-синий по кремовому — так код читается
 * сканером и не выбивается из палитры сайта.
 */
import QRCode from "qrcode";
import path from "node:path";

const CODES = [
  ["bot-qr.png", process.env.TG_BOT_URL || "https://t.me/kolibri_care_bot", "Telegram"],
  ["max-qr.png", process.env.MAX_BOT_URL || "https://max.ru/id2312230564_bot", "MAX"],
];

for (const [file, url, name] of CODES) {
  await QRCode.toFile(path.resolve("public", file), url, {
    width: 900,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#101c33ff", light: "#f7f3ecff" },
  });
  console.log(`${file} → ${url}  (${name})`);
}
