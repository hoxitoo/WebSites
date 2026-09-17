"use client";

import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import { asset } from "@/lib/asset";

/**
 * Листалка каталога с эффектом перелистывания.
 *
 * Финальные правки 3: «полистайте каталог меня очень смущает», 40 отдельных
 * страниц из папки «каталог JPG» и «эффект как будто бы они листаются».
 * Это эффект настоящей книги: страница загибается за угол и переворачивается,
 * открывая следующую. Делает его библиотека page-flip (StPageFlip, MIT):
 * листать можно стрелками, миниатюрами, перетаскиванием за угол мышью
 * и свайпом на телефоне.
 *
 * По одной странице на экране — её прежняя правка «по 1 странице на
 * картинке». Библиотека показывает одну страницу сама, когда блок уже двух
 * страниц, а колонка листалки ~670 px.
 *
 * Объём: «это сильно завесит сайт?» Страницы сжаты (scripts/make-catalog-book.mjs,
 * в среднем 150 КБ) и грузятся не все сразу — картинка подставляется, когда
 * до страницы остаётся пара перелистываний. При первом показе блока
 * загружаются 3 страницы из 40.
 *
 * Без JavaScript и для поисковиков остаётся обычная картинка первой страницы.
 */

// Названия — из текстового слоя PDF-каталога; раздел — по номеру страницы.
const PAGES: { page: number; name: string }[] = [
  { page: 6, name: "Посидим, поиграем" },
  { page: 7, name: "Тому, кто верит в чудеса!" },
  { page: 8, name: "Заснеженная" },
  { page: 9, name: "Кудряшки" },
  { page: 10, name: "Барашки наряжают ёлку" },
  { page: 11, name: "Милая моя ёлочка · Морозец" },
  { page: 12, name: "Творческие барашки" },
  { page: 13, name: "Поезд новогодних экспериментов" },
  { page: 14, name: "Самому музыкальному!" },
  { page: 15, name: "Моя семья · Бирюзовое настроение" },
  { page: 16, name: "Чудеса · Мама, папа, я — весёлая семья!" },
  { page: 17, name: "Волшебный барашек · Козлик и дети · Дед Мороз в коробке" },
  { page: 18, name: "Окно в Новый год! · Тёплая мастерская" },
  { page: 19, name: "Банкомат подарков · Финансовая грамотность" },
  { page: 20, name: "Музыкалити · Умник и умница" },
  { page: 21, name: "Новогодние домики с овечкой · Ёлочные игрушки" },
  { page: 22, name: "Зимние краски · Творческий Новый год" },
  { page: 23, name: "Волшебный Новый год! · Пуховая коза" },
  { page: 24, name: "В гостях у сказки" },
  { page: 25, name: "Чудеса там, где в них верят · Зимний сюрприз" },
  { page: 26, name: "Спорт барашки · Прекрасных путешествий!" },
  { page: 27, name: "Зимний вайб" },
  { page: 28, name: "Шоппер «Моя Россия!»" },
  { page: 32, name: "Сказочный уголок" },
  { page: 33, name: "Зимняя сказка" },
  { page: 34, name: "Волшебный Новый год" },
  { page: 35, name: "Дети" },
  { page: 37, name: "Пуховая коза" },
  { page: 47, name: "Сумочка «Почта чудес»" },
  { page: 52, name: "Морозец · Барашки" },
  { page: 53, name: "Подарок · Кучеряшки · Сказочные друзья" },
  { page: 54, name: "Скай" },
  { page: 57, name: "Козлик в шарфике · Медведь в шарфике · Снеговик" },
  { page: 58, name: "Бирюзовый бараш · Умник · Овечка в шарфике" },
  { page: 59, name: "Инженер · Бараш · Дед Мороз" },
  { page: 66, name: "Русские сказки" },
  { page: 69, name: "Конверт средний · Матрёшка пряничная" },
  { page: 70, name: "Коза в оренбургском платке · Кремлёвская звезда" },
  { page: 71, name: "Крафт" },
  { page: 73, name: "Золотая коза" },
];

const section = (p: number) =>
  p <= 28
    ? "подарки в наборах"
    : p <= 47
      ? "картонная упаковка"
      : p <= 59
        ? "текстильная упаковка"
        : p <= 66
          ? "комбинированная упаковка"
          : "премиум-упаковка";

const pageSrc = (p: number) => asset(`/catalog/book/p-${p}.webp`);
const thumbSrc = (p: number) => asset(`/catalog/book/t-${p}.webp`);
const altOf = (i: number) =>
  `Страница ${PAGES[i].page} каталога, ${section(PAGES[i].page)}: ${PAGES[i].name}`;

// подгружаем текущую страницу и по две в каждую сторону
const AHEAD = 2;

export default function CatalogBook({
  onZoom,
}: {
  onZoom: (shot: { src: string; alt: string; caption: string }) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let current = 0;
    let builtWidth = 0;
    // загруженные страницы помним между пересборками книги — не качаем заново
    const loaded = new Set<number>();

    const build = (PageFlipCtor: typeof PageFlip) => {
      flipRef.current?.destroy();
      host.innerHTML = "";

      // Страницы создаём вручную, а не через React: page-flip переставляет
      // их внутри себя, и React, управляя ими, путался бы при обновлении.
      const book = document.createElement("div");
      const imgs: HTMLImageElement[] = [];
      for (let i = 0; i < PAGES.length; i++) {
        const page = document.createElement("div");
        page.className = "catalog-book-page";
        const img = document.createElement("img");
        img.alt = altOf(i);
        img.decoding = "async";
        img.draggable = false;
        if (loaded.has(i)) img.src = pageSrc(PAGES[i].page);
        page.appendChild(img);
        book.appendChild(page);
        imgs.push(img);
      }
      host.appendChild(book);

      const loadAround = (i: number) => {
        for (let k = i - AHEAD; k <= i + AHEAD; k++) {
          if (k < 0 || k >= PAGES.length || loaded.has(k)) continue;
          imgs[k].src = pageSrc(PAGES[k].page);
          loaded.add(k);
        }
      };
      loadAround(current);

      // Одна страница, а не разворот. page-flip переходит на разворот, когда
      // блок шире двух minWidth, и при этом ставит книге min-width = minWidth.
      // Раньше было minWidth 800 — книга вылезала за колонку 672 px
      // и закрывала правую стрелку. Теперь minWidth — чуть больше половины
      // колонки: книга не шире колонки, и разворот не включается.
      builtWidth = host.clientWidth;
      const flip = new PageFlipCtor(book, {
        // пропорция страницы каталога 3189×2362 (1,35)
        width: 1100,
        height: 815,
        size: "stretch",
        minWidth: Math.floor(builtWidth * 0.55),
        maxWidth: 1100,
        usePortrait: true,
        showCover: false,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: 800,
        mobileScrollSupport: true,
        showPageCorners: true,
        autoSize: true,
        startPage: current,
      });
      flip.loadFromHTML(book.querySelectorAll<HTMLElement>(".catalog-book-page"));
      flip.on("flip", (e) => {
        current = Number(e.data);
        setIndex(current);
        loadAround(current);
      });
      flipRef.current = flip;
    };

    let ro: ResizeObserver | null = null;
    import("page-flip").then(({ PageFlip }) => {
      if (cancelled) return;
      build(PageFlip);
      setReady(true);
      // Колонка заметно сменила ширину (поворот телефона, масштаб окна) —
      // пересобираем книгу на той же странице, иначе minWidth устареет.
      ro = new ResizeObserver(() => {
        const w = host.clientWidth;
        if (builtWidth && Math.abs(w - builtWidth) / builtWidth > 0.1) build(PageFlip);
      });
      ro.observe(host);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      flipRef.current?.destroy();
      flipRef.current = null;
      host.innerHTML = "";
    };
  }, []);

  const go = (i: number) => {
    const flip = flipRef.current;
    if (!flip || i === index || i < 0 || i >= PAGES.length) return;
    // далёкую страницу подгружаем заранее, иначе при перелистывании мелькнёт пустая
    const imgs = hostRef.current?.querySelectorAll("img");
    if (imgs?.[i] && !imgs[i].getAttribute("src")) imgs[i].setAttribute("src", pageSrc(PAGES[i].page));
    flip.flip(i);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => flipRef.current?.flipPrev()}
          disabled={index === 0}
          aria-label="Предыдущая страница"
          className="hidden h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-cream/25 sm:grid text-cream transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold disabled:cursor-default disabled:opacity-30 disabled:hover:border-cream/25 disabled:hover:bg-transparent disabled:hover:text-cream"
        >
          ←
        </button>

        <div className="relative w-full max-w-[42rem]">
          {/* пока библиотека не загрузилась (и без JavaScript) — первая страница
              обычной картинкой в той же пропорции, чтобы блок не прыгал */}
          {!ready && (
            <img
              src={pageSrc(PAGES[0].page)}
              alt={altOf(0)}
              width={1100}
              height={815}
              className="block h-auto w-full rounded-lg shadow-[0_24px_60px_rgba(8,14,30,0.55)]"
              draggable={false}
            />
          )}
          <div
            ref={hostRef}
            className={ready ? "catalog-book" : "catalog-book absolute inset-0 opacity-0"}
          />
        </div>

        <button
          type="button"
          onClick={() => flipRef.current?.flipNext()}
          disabled={index === PAGES.length - 1}
          aria-label="Следующая страница"
          className="hidden h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-cream/25 sm:grid text-cream transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold disabled:cursor-default disabled:opacity-30 disabled:hover:border-cream/25 disabled:hover:bg-transparent disabled:hover:text-cream"
        >
          →
        </button>
      </div>

      {/* подпись — название набора и номер страницы из 40, плюс крупный просмотр.
          На телефоне стрелки здесь, а не по бокам книги: по бокам они
          съедали треть ширины, и страница выходила 215 px — не прочитать. */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <span className="w-full font-semibold text-gold sm:w-auto">{PAGES[index].name}</span>
        <button
          type="button"
          onClick={() => flipRef.current?.flipPrev()}
          disabled={index === 0}
          aria-label="Предыдущая страница"
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/25 text-cream disabled:opacity-30 sm:hidden"
        >
          ←
        </button>
        <span className="text-muted/80">
          {index + 1} / {PAGES.length}
        </span>
        <button
          type="button"
          onClick={() => flipRef.current?.flipNext()}
          disabled={index === PAGES.length - 1}
          aria-label="Следующая страница"
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/25 text-cream disabled:opacity-30 sm:hidden"
        >
          →
        </button>
        <button
          type="button"
          onClick={() =>
            onZoom({ src: pageSrc(PAGES[index].page), alt: altOf(index), caption: PAGES[index].name })
          }
          className="cursor-pointer rounded-full border border-gold/40 px-3 py-1 text-xs text-gold transition-colors hover:bg-gold/10"
        >
          Открыть крупно
        </button>
      </div>

      {/* миниатюры: 40 штук, лента с прокруткой — в два ряда по сетке они
          заняли бы полэкрана */}
      <div
        className="no-scrollbar mx-auto mt-5 flex max-w-[42rem] gap-2 overflow-x-auto px-1 pb-1"
        role="list"
      >
        {PAGES.map((p, i) => (
          <button
            key={p.page}
            type="button"
            role="listitem"
            onClick={() => go(i)}
            aria-label={`Страница ${p.page}: ${p.name}`}
            aria-current={i === index}
            ref={(el) => {
              // активная миниатюра всегда в видимой части ленты
              if (el && i === index) el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
            }}
            className={
              "h-11 w-[3.75rem] shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-opacity " +
              (i === index ? "border-gold opacity-100" : "border-transparent opacity-55 hover:opacity-85")
            }
          >
            <img
              src={thumbSrc(p.page)}
              alt=""
              loading="lazy"
              width={120}
              height={89}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
