/**
 * Префикс для статики в обычных <img>/canvas (не next/image):
 * Next сам подставляет basePath только в Link и next/image,
 * а на GitHub Pages сайт живёт в подкаталоге /WebSites.
 */
export const asset = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
