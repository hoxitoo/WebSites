"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Lightbox, { type Shot } from "./Lightbox";
import { asset } from "@/lib/asset";

/**
 * Горизонтальная лента фотографий детей с подарками — из каталога заказчицы
 * (собрано скриптом scripts/extract-catalog.mjs).
 *
 * Листается свайпом на телефоне и стрелками на компьютере; по клику
 * фотография открывается крупно.
 */

// 16 студийных фотографий с Яндекс.Диска заказчицы и ещё несколько партий,
// которые она присылала позже. Файлы лежат в репозитории (scripts/fetch-kids.mjs
// и scripts/make-rework-assets.mjs): «копии сохрани локально, чтобы если нет
// доступа к диску не сломалось». Откуда какой кадр — в
// public/catalog/kids-source.json и kids-source-extra.json.
//
// ПОРЯДОК — финальные правки 3:
//  • мальчик с коробкой-домиком (kid-19) — четвёртым: «эту фотку поставить 4-й»;
//  • «чуть разбавить девочек: мальчик — девочка — мальчик — девочка». Мальчиков
//    9 на 39 кадров, строго чередовать не хватит: в начале мальчики на 2-й
//    и 4-й позиции, дальше — равномерно, через 3–4 девочки;
//  • «там где формы одинаковые не ставьте их рядом, миксуйте и детей и формы
//    коробок»: один и тот же ребёнок и одинаковые подарки рядом не стоят.
//    Из-за этого разведены и две девочки с бантом (kid-10 и kid-11) — её
//    правка «поменять местами»;
//  • удалены девочка с игрушкой-антистресс (kid-01) и девочка с сумкой-
//    матрёшкой (kid-20): «верхние 2 шт удалить». Вместо второй — новый кадр
//    той же девочки с матрёшкой анфас (kid-40);
//  • кадр без ребёнка (подвески на ёлке) — последним.
// Имена файлов не меняем: их знает и kids-source.json, и блок «Зачем это
// бизнесу».
const PHOTOS = [
  { file: "kid-27.webp", alt: "Девочка с двумя игрушками-овечками в очках и свитерах" },
  { file: "kid-31.webp", alt: "Мальчик с книгой, игрушкой-овечкой и рюкзаком «Чудеса там, где в них верят»" },
  { file: "kid-28.webp", alt: "Девочка с подушкой с новогодним рисунком домика и овечек" },
  { file: "kid-19.webp", alt: "Мальчик с большим новогодним набором в подарочной коробке" },
  { file: "kid-33.webp", alt: "Девочка в красном платье с игрушкой-барашком" },
  { file: "kid-30.webp", alt: "Девочка с двумя мягкими снеговиками в шапках-ушанках" },
  { file: "kid-40.webp", alt: "Девочка с сумкой-шопером с матрёшкой" },
  { file: "kid-12.webp", alt: "Мальчик с мягкой игрушкой-бараном" },
  { file: "kid-10.webp", alt: "Девочка с картонной коробкой с новогодним рисунком" },
  { file: "kid-36.webp", alt: "Девочка с ободком-мишками и подушкой «Волшебного Нового года» с Дедом Морозом" },
  { file: "kid-43.webp", alt: "Девочка в красном платье с подарочной сумкой «Заснеженная»" },
  { file: "kid-34.webp", alt: "Мальчик в белой рубашке с игрушкой-барашком" },
  { file: "kid-41.webp", alt: "Девочка в белом платье с подарочной коробкой с барашками" },
  { file: "kid-13.webp", alt: "Девочка с мягкой игрушкой-козочкой" },
  { file: "kid-08.webp", alt: "Девочка с картонной коробкой-домиком" },
  { file: "kid-38.webp", alt: "Девочка с подушкой «С Новым годом!» с барашками в очках" },
  { file: "kid-16.webp", alt: "Мальчик с подарочной тубой" },
  { file: "kid-35.webp", alt: "Девочка в красном платье с игрушкой-козочкой в шарфе" },
  { file: "kid-37.webp", alt: "Девочка с ободком-мишками и подарочной коробкой с барашками" },
  { file: "kid-15.webp", alt: "Девочка с подарком в комбинированной упаковке" },
  { file: "kid-06.webp", alt: "Мальчик с подарочной сумкой" },
  { file: "kid-29.webp", alt: "Девочка с тремя игрушками-овечками в полосатых шарфах" },
  { file: "kid-11.webp", alt: "Девочка с подарочной коробкой в руках" },
  { file: "kid-32.webp", alt: "Девочка с игрушкой-овечкой на плече и подарочной сумкой" },
  { file: "kid-09.webp", alt: "Девочка с подарком в картонной упаковке у ёлки" },
  { file: "kid-04.webp", alt: "Мальчик с новогодним набором и книгами" },
  { file: "kid-42.webp", alt: "Девочка с мягкой игрушкой-овечкой на диване" },
  { file: "kid-22.webp", alt: "Девочка в красном платье с новогодней раскраской" },
  { file: "kid-18.webp", alt: "Девочка с игрушкой-овечкой и новогодними наборами" },
  { file: "kid-21.webp", alt: "Мальчик в клетчатой рубашке с новогодним набором и игрушкой" },
  { file: "kid-24.webp", alt: "Девочка с мягкой игрушкой-овечкой в красном свитере" },
  { file: "kid-07.webp", alt: "Девочка с подарком в картонной коробке" },
  { file: "kid-14.webp", alt: "Девочка с мягкой игрушкой в новогоднем костюме" },
  { file: "kid-39.webp", alt: "Девочка с ободком-мишками и подарочной коробкой с барашками в очках" },
  { file: "kid-25.webp", alt: "Мальчик с новогодним набором в тубусе и наборами для творчества" },
  { file: "kid-02.webp", alt: "Девочка с набором и игрушками-барашками у ёлки" },
  { file: "kid-26.webp", alt: "Девочка в красном платье с игрушкой-овечкой и письмом Деду Морозу" },
  { file: "kid-03.webp", alt: "Девочка с мягкой игрушкой-овечкой на руках" },
  { file: "kid-23.webp", alt: "Новогодние сувениры-подвески 2027 на ёлке" },
] as const;

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function KidsStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // шаг = ширина карточки с отступом, но не больше видимой области
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <section id="gallery" className="section-band relative py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2 {...reveal} className="text-center font-display text-3xl md:text-5xl">
          Как выглядит <span className="candle-sweep">радость</span>
        </motion.h2>
        <motion.p
          {...reveal}
          className="mx-auto mt-4 max-w-3xl text-center leading-relaxed text-muted"
        >
          {/* правка «каждое предложение с новой строки» — пробелы в конце
              нужны тексту страницы: без них поисковик склеивает предложения */}
          <span className="block">Настоящее чудо в кадре: дети держат подарки из нашего каталога. </span>
          <span className="block">Именно такую радость вы можете подарить семьям своих сотрудников. </span>
          <span className="block">И это только маленькая часть нашей коллекции 2027 года.</span>
        </motion.p>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-gold/70">
            листайте в сторону →
          </p>
          {/* стрелки нужны на компьютере, где нет свайпа */}
          <div className="hidden gap-2 md:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollBy(d)}
                aria-label={d < 0 ? "Предыдущие фото" : "Следующие фото"}
                className="cursor-pointer rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
              >
                {d < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* лента шире контейнера — прокручивается до самого края экрана.
          Края растворяются маской: раньше поверх лежали две плашки цвета
          #101c33, но фон страницы плывёт по градиенту, и в этом месте
          плашка уже не совпадала с ним — был виден стык. Маска гасит
          сами карточки и работает на любом фоне. */}
      <motion.div {...reveal} className="relative mt-5">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 md:px-12"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
          }}
        >
          {PHOTOS.map((p) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setShot({ src: asset(`/catalog/${p.file}`), alt: p.alt })}
              className="group w-[13.125rem] shrink-0 cursor-pointer snap-center overflow-hidden rounded-2xl border border-cream/10 bg-night-soft/40 transition-colors duration-300 hover:border-gold/45 md:w-[15.625rem]"
            >
              <img
                src={asset(`/catalog/${p.file}`)}
                alt={p.alt}
                loading="lazy"
                className="h-[17.5rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] md:h-[20.625rem]"
              />
            </button>
          ))}
        </div>
      </motion.div>

      <Lightbox shot={shot} onClose={() => setShot(null)} />
    </section>
  );
}
