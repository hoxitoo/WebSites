import { NextResponse } from "next/server";

/**
 * Приём заявок с формы.
 * MVP: логируем на сервере; интеграция с почтой + Google Sheets — следующим шагом
 * (SMTP/Resend + Google Apps Script webhook, чтобы писать в ту же таблицу, что и бот).
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data?.name || !data?.email || !data?.company) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    console.log("[LEAD]", JSON.stringify({ ...data, at: new Date().toISOString() }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
