/**
 * Отправка заявки в Google Таблицу (через Apps Script).
 *
 * Два пути, потому что сайт живёт в двух режимах:
 *  - обычный сервер Next.js → свой роут /api/lead, он и знает адрес скрипта;
 *  - статический экспорт (GitHub Pages) → роут вырезается при сборке,
 *    поэтому браузер шлёт заявку прямо в Apps Script.
 *    Без Content-Type json — иначе CORS-preflight, который Apps Script
 *    не умеет; ответ непрозрачный (no-cors), успех считаем оптимистично.
 */
export async function sendLead(payload: Record<string, string>) {
  const directUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
  if (directUrl) {
    await fetch(directUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ ...payload, source: "сайт" }),
    });
    return;
  }
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source: "сайт" }),
  });
  if (!res.ok) throw new Error("bad status");
}
