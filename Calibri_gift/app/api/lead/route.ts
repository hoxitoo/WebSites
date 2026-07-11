import { NextResponse } from "next/server";

/**
 * Приём заявок с формы.
 * Если задан LEAD_WEBHOOK_URL (Google Apps Script, см. docs/lead-setup.md) —
 * заявка уходит в Google Таблицу + письмо менеджеру.
 * Без него — логируем в консоль (режим разработки/демо).
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data?.name || !data?.email || !data?.company) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const payload = {
      name: String(data.name).slice(0, 200),
      company: String(data.company).slice(0, 200),
      email: String(data.email).slice(0, 200),
      phone: String(data.phone ?? "").slice(0, 100),
      teamSize: String(data.teamSize ?? "").slice(0, 100),
      source: "сайт",
    };

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Apps Script отвечает редиректом на googleusercontent — идём за ним
        redirect: "follow",
      });
      if (!res.ok) {
        console.error("[LEAD] webhook failed:", res.status, await res.text());
        return NextResponse.json({ ok: false }, { status: 502 });
      }
    } else {
      console.log("[LEAD]", JSON.stringify({ ...payload, at: new Date().toISOString() }));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
