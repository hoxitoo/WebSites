/**
 * Сборка сайта для хостинга заказчика (сайт в корне домена).
 *
 * То же, что делает workflow для GitHub Pages, только без подкаталога
 * /WebSites и со ссылками на настоящий домен (превью ссылки в соцсетях,
 * sitemap.xml, robots.txt строятся от него).
 *
 * Запуск (из папки Calibri_gift, dev-сервер должен быть остановлен):
 *   node scripts/build-hosting.mjs https://домен.ru https://script.google.com/macros/s/…/exec
 * Второй аргумент — адрес Apps Script, куда форма шлёт заявки (тот же, что
 * в секрете LEAD_WEBHOOK_URL на GitHub). Без него заявки с сайта не дойдут.
 *
 * Результат — папка out/: её СОДЕРЖИМОЕ заливается в корень сайта на хостинге.
 */
import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";

const [site, webhook] = process.argv.slice(2);
if (!site || !/^https?:\/\/[^/]+$/.test(site) || !webhook) {
  console.error(
    "нужно: node scripts/build-hosting.mjs https://домен.ru https://script.google.com/macros/s/…/exec\n" +
      "(домен — без слэша в конце)"
  );
  process.exit(1);
}

// серверный роут /api на статическом хостинге не работает и ломает экспорт —
// убираем на время сборки и возвращаем в любом случае
const API = "app/api";
const API_OFF = "app/_api-off";
if (existsSync(API)) renameSync(API, API_OFF);
try {
  execSync("npm run build", {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: "",
      NEXT_PUBLIC_SITE_URL: site,
      NEXT_PUBLIC_LEAD_WEBHOOK_URL: webhook,
    },
  });
} finally {
  if (existsSync(API_OFF)) renameSync(API_OFF, API);
}
console.log("\nготово: залить содержимое папки out/ в корень сайта");
