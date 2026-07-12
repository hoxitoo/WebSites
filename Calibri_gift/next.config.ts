import type { NextConfig } from "next";

// GITHUB_PAGES=true — статический экспорт для https://hoxitoo.github.io/WebSites/
// (Pages не умеет серверные роуты: /api вырезается в workflow, форма шлёт
// заявки напрямую в Apps Script через NEXT_PUBLIC_LEAD_WEBHOOK_URL)
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      basePath: "/WebSites",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
