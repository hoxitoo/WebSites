import type { NextConfig } from "next";

// GITHUB_PAGES=true — статический экспорт (папка out/). Нужен и для
// GitHub Pages (https://hoxitoo.github.io/WebSites/), и для обычного хостинга
// заказчика — см. scripts/build-hosting.mjs. Статика не умеет серверные роуты:
// /api вырезается перед сборкой, форма шлёт заявки напрямую в Apps Script
// через NEXT_PUBLIC_LEAD_WEBHOOK_URL.
// Подкаталог берём из NEXT_PUBLIC_BASE_PATH: на Pages это /WebSites (задано
// в workflow), на своём домене сайт живёт в корне — пусто.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      ...(basePath ? { basePath } : {}),
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
