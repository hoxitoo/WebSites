# Kling AI — открытие фирменной коробки «Колибри» (детальная раскадровка)

Ассеты (в `design/brand/`):
- `box-scene-1.jpg` — зелёный 6-гранник, красный бант, на тёмно-синем фоне
  с боке (ЛУЧШИЙ стартовый кадр)
- `box-scene-2.jpg` — та же коробка анфас
- фирменные шары `ball-1..5` — уже на сайте (секция «А вот и сама радость»)

Логику берём из `nano-banana-prompts.md`: сначала **бант развязывается**,
потом лента сползает, потом крышка открывается и вырывается свет. В Kling
делаем это тремя короткими клипами по 5 сек (каждый — одно чёткое движение),
затем склеиваем. Между клипами используем **последний кадр** предыдущего как
стартовый для следующего (в Kling: «Extend» / загрузить последний кадр).

## Общие настройки Kling (для КАЖДОГО клипа)

- Режим: **Image to Video**, модель новейшая (Kling 2.x / Master)
- Duration **5s**, Creativity/CFG **0.3–0.4** (низкий — не перерисовывать
  барашков, детей и надпись «С Новым годом»)
- Professional / High Quality — если доступно
- Камера — жёстко статичная (в промпте `static locked camera`)

**Negative prompt — вставлять во ВСЕ клипы (у Kling это критично):**
```
camera movement, camera rotation, zoom, pan, orbit, morphing, warping,
distorted faces, deformed sheep, deformed children, changing text, melting,
extra objects, duplicate box, flicker, glitch, jitter, low quality, blurry,
watermark, text overlay
```

---

## Клип 1 (5 сек) — БАНТ РАЗВЯЗЫВАЕТСЯ

Стартовый кадр: `box-scene-1.jpg`

**Prompt:**
```
Static locked camera, cinematic product shot. The green hexagonal gift box
stays perfectly still on a dark navy bokeh background with softly falling snow.
The big red satin bow on top slowly loosens: the knot gently comes undone and
the two long ribbon ends lift and curl into the air in elegant slow motion, as
if pulled by an invisible hand. Silk catches warm golden light. A faint warm
glow begins to appear in the thin seam under the lid. A few gold dust particles
float near the bow. The printed artwork — sheep, children, golden lettering —
stays exactly the same, no distortion.
```

## Клип 2 (5 сек) — ЛЕНТА СПОЛЗАЕТ, КРЫШКА ПРИОТКРЫВАЕТСЯ

Стартовый кадр: последний кадр клипа 1

**Prompt:**
```
Static locked camera, same green box, same background and lighting. The untied
red ribbon slides off the box — one silk strand slips down the left side, the
other flows to the right, both catching warm light and settling softly on the
dark reflective surface. At the same time the lid lifts a little, about 10–15
degrees at the front, and a thin bright strip of warm golden light escapes from
inside, glowing along the edge of the lid. Gentle golden sparkles rise from the
seam. Slow, magical, premium. Box artwork unchanged, no distortion.
```

## Клип 3 (5 сек) — КРЫШКА ОТКРЫВАЕТСЯ, СВЕТ ВЫРЫВАЕТСЯ

Стартовый кадр: последний кадр клипа 2

**Prompt:**
```
Static locked camera, same green box and background. The lid rises straight up
and tilts back, fully opening the box, and a warm golden volumetric beam of
light bursts upward from inside like a soft spotlight in the dark. A fountain
of glittering gold sparkles and tiny embers streams up and swirls gently. The
red ribbon lies loosely coiled beside the box. The box glows warmly from within.
Slow, cinematic, weightless, joyful New Year magic. No distortion of artwork.
```

## (Опционально) Клип 4 (5 сек) — поднимаются шары

Стартовый кадр: последний кадр клипа 3. Kling нарисует «похожие» шары —
её ТОЧНЫЕ шары `ball-1..5` вылетают уже на сайте, см. примечание ниже.

**Prompt:**
```
Static locked camera. From the open glowing box, a few round glass Christmas
baubles float gently upward on the fountain of golden light and hover in the
air, reflecting warm highlights, connected by faint sparkling trails. Slow,
weightless, magical. The box below stays unchanged.
```

---

## ⚠️ Про «вылетают ИМЕННО её шары»

Kling нарисует шары «в тему», но НЕ вставит её точные `ball-1..5`. Рекомендуемая
схема (даёт и киношность, и точные шары):
- **Клипы 1–3** из Kling (бант → лента → открытие + свет) — идут в сцену сайта.
- Её **реальные шары** вылетают уже на самом сайте — секция «А вот и сама
  радость» идёт сразу после открытия коробки. Пиксель-в-пиксель её шары,
  движением управляем мы.
- Клип 4 — только если хочется «вылет» прямо внутри видео (шары будут
  обобщёнными).

## Почему Kling «плохо генерил» раньше — чек-лист

1. Длинный образный промпт → путается. Держи 2–3 предложения + negative.
2. Нет negative prompt (у Veo не нужен, у Kling обязателен) — добавлен.
3. Высокий CFG → перерисовывает рисунок. Ставь 0.3–0.4.
4. Нет «static camera» → облетает, рисунок плывёт. Фиксируй.
5. Всё сразу в одном клипе → дроби: бант / лента / открытие — отдельно.

## Сведение и загрузка на сайт

Склей клипы 1→2→3 подряд (любой редактор, или Kling Extend — тогда они уже
непрерывны). Готовый ролик → `design/gift-src/video/new 1.mp4`
(при желании второй — `new 2.mp4`), затем:
`node scripts/extract-scene.mjs` — сцена на сайте пересоберётся сама.

> Совет: чтобы склейка была бесшовной, для клипов 2 и 3 берите РОВНО
> последний кадр предыдущего (Kling → «Extend from last frame»).
