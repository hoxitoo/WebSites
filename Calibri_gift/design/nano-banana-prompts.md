# Nano Banana 2 — промпты: фотореалистичный подарок (секвенция открытия)

Кадры для scroll-анимации на сайте: подарок стоит → развязывается → открывается →
взрыв света и подарков → спокойное послесвечение (фон под карточки текста).

## Как генерировать (важно для консистентности)

1. **Кадр 1 генерируем первым** — это «эталон» коробки.
2. **Каждый следующий кадр** делаем через редактирование: загружаем предыдущий
   кадр как референс и пишем промпт вида «Using the provided image…» —
   так коробка, свет и камера не «поплывут» между кадрами.
3. Все кадры: **квадрат 1:1, 2048×2048**, коробка по центру, в нижней трети.
4. **Никакого текста на изображениях** — карточки «Сотрудникам / Детям /
   Руководителю» остаются HTML-текстом поверх (иначе текст будет мыльный
   и его нельзя править).
5. Фон везде: глубокий тёмно-синий `#0E1526` (цвет сайта) — кадры бесшовно
   вклеятся в страницу.

## Общий стилевой блок (добавлять в конец каждого промпта)

> Photorealistic cinematic product photography, 85mm lens, eye-level camera,
> single warm key light from above-left, cool deep-navy ambient fill,
> solid dark navy background (#0E1526) with soft vignette, subtle reflective
> dark surface under the box, rich color grading (burgundy / gold / deep blue),
> ultra-detailed textures, no text, no watermark, no logo except described,
> square 1:1 composition, gift box centered in lower third of frame.

---

## Кадр 1 — подарок стоит (закрыт)

```
A luxurious deep burgundy (#7A2438) rigid gift box with a soft-touch matte
texture, closed, standing on a dark reflective surface. The box is wrapped
with a wide gold satin ribbon crossing on top, tied into an elegant double
bow with long trailing ends. A tiny gold hummingbird emblem is subtly
embossed on the front side of the box. Quiet, magical winter-night mood:
a few soft snowflakes drift in the dark background, gentle warm light
catches the silk of the ribbon. The box feels premium and full of promise.

Photorealistic cinematic product photography, 85mm lens, eye-level camera,
single warm key light from above-left, cool deep-navy ambient fill, solid
dark navy background (#0E1526) with soft vignette, subtle reflective dark
surface under the box, rich color grading (burgundy / gold / deep blue),
ultra-detailed textures, no text, no watermark, square 1:1 composition,
gift box centered in lower third of frame.
```

## Кадр 2 — бант ослабевает

```
Using the provided image as exact reference — keep the same burgundy gift
box, gold ribbon, camera angle, lighting and background completely
unchanged. Only change: the double bow on top is now loosening — the knot
is half-undone, both silk ribbon ends are gracefully lifting and curling
into the air as if an invisible hand gently pulled them, with elegant
slow-motion movement frozen in time. A faint warm glow starts to appear
in the thin seam between the lid and the box. A few gold dust particles
float near the bow.
```

## Кадр 3 — лента сползает, крышка приоткрыта

```
Using the provided image as exact reference — same box, camera, lighting,
background. Only change: the gold ribbon is now untied and sliding off the
box — one silk strand is falling along the left side, the other flows in
the air to the right, both catching warm light. The lid is slightly ajar,
lifted about 10 degrees at the front, and a thin bright strip of warm
golden light escapes from inside the box, illuminating the edge of the lid.
More glowing gold dust particles rise slowly from the seam.
```

## Кадр 4 — крышка открывается, свет вырывается

```
Using the provided image as exact reference — same box, camera, lighting,
background. Only change: the lid is now open at about 45 degrees, hinging
at the back, and a powerful beam of warm golden light bursts upward from
inside the box like a soft volumetric spotlight in the dark. The gold
ribbon lies loosely coiled on the surface next to the box. Sparkling gold
particles and tiny embers rise inside the light beam. The burgundy walls
of the box glow warmly from the inner light.
```

## Кадр 5 — крышка взлетает, пик света

```
Using the provided image as exact reference — same box, camera, lighting,
background. Only change: the lid has fully lifted off and floats in the
air above the box, slightly tilted, as if weightless. The volumetric
golden light from inside is at its brightest — a radiant warm glow filling
the center of the frame, with lens bloom. Dozens of gold sparks and
glowing dust particles swirl upward in a gentle spiral. The dark navy
background deepens the contrast of the light burst.
```

## Кадр 6 — из коробки вылетают подарки

```
Using the provided image as exact reference — same box, camera, lighting,
background, floating lid. Only change: small beautiful gifts are now
flying out of the glowing box and hovering in the air at different
heights: a tiny burgundy gift box with a gold bow, a classic teddy bear,
a snow globe with a golden glow inside, a small craft box of chocolates,
a vintage christmas tree ornament ball in deep red and gold. Each object
is lit by the warm light from below, casting soft glows, surrounded by
swirling gold particles. Magical, joyful, weightless moment — like the
peak of a fairy tale.
```

## Кадр 7 — созвездие подарков (широкий кадр)

```
Using the provided image as exact reference — same scene continued. Only
change: the flying gifts have risen higher and spread wider across the
upper half of the frame, arranged like a floating constellation around
the light beam, slightly smaller with distance. The light from the box
softens from a burst into a warm steady glow. Gold particles now form
thin elegant trails between the floating gifts, like threads of light
connecting them. The overall mood shifts from explosive to serene and
wondrous.
```

## Кадр 8 — послесвечение (фон под карточки текста)

```
Using the provided image as exact reference — same box, camera, background.
Only change: the flying gifts have faded away into soft bokeh light spots
in the upper half of the frame. The open box below glows gently and warmly,
like a fireplace at the end of the evening. The upper two thirds of the
frame are calm, dark and uncluttered — deep navy with subtle warm bokeh
and a few drifting snowflakes — leaving clean negative space. Quiet,
warm, safe atmosphere.
```

## Бонус-кадр 9 (опционально) — герой-кадр для превью/OG

```
Using frame 1 as exact reference — same closed burgundy gift box with gold
bow. Change: camera pulled back slightly, box framed a little lower, more
of the dark navy winter-night background visible with gentle falling snow
and soft warm bokeh lights far in the background, like a city square at
night. Premium New Year corporate mood — quiet luxury, care and warmth.
Wide clean space above the box for a headline overlay.
```

---

## Чек после генерации

- [ ] Коробка идентична во всех кадрах (цвет, пропорции, эмблема)
- [ ] Фон одного тона `#0E1526`, без резких перепадов между кадрами
- [ ] Свет нарастает: 1 → 5 (пик) → 8 (тёплое затухание)
- [ ] Нет текста/вотермарок
- [ ] Верхняя треть кадров 7–8 достаточно «пустая» под HTML-карточки

## Интеграция на сайт (моя часть, после генерации)

Кадры кладём в `public/gift/frame-01.png … frame-08.png` → я заменю
CSS-коробку в `GiftScene.tsx` на скролл-секвенцию: кадры кросс-фейдятся
по прогрессу `useSceneProgress`, карточки-смыслы остаются HTML поверх
кадров 7–8. Формат: WebP/AVIF после сжатия (web-performance чеклист).
