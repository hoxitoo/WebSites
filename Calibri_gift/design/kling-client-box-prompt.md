# Kling AI — открытие фирменной коробки «Колибри» (зелёный 6-гранник)

Ассеты (в `design/brand/`):
- `box-scene-1.jpg` — коробка 3/4, на тёмно-синем фоне с боке (лучший стартовый кадр)
- `box-scene-2.jpg` — коробка анфас, тот же фон
- фирменные шары `ball-1..5` — уже вынесены на сайт (секция «А вот и сама радость»)

Kling капризен: короткий промпт, чёткая камера, ОДНО движение, обязательный
negative prompt. Режим **Image to Video**, стартовый кадр — `box-scene-1.jpg`.

## Настройки Kling

- Режим: **Image to Video**, модель новейшая (Kling 2.x / Master)
- Duration **5s**, Creativity/CFG **0.3–0.4** (низкий — чтобы не перерисовал
  барашков, детей и надпись «С Новым годом»)
- Professional / High Quality — если доступно

## Клип 1 (5 сек): крышка открывается, свет

**Prompt:**
```
Static locked camera, cinematic. The green hexagonal gift box with a red bow
stays still on a dark navy bokeh background with falling snow. The lid slowly
lifts straight up and tilts back; a warm golden light and soft glittering
sparkles rise gently from inside the opening box. The printed artwork (sheep,
children, golden lettering) and the red bow stay exactly the same, no distortion.
Slow, magical, premium New Year mood.
```

**Negative prompt (обязательно):**
```
camera movement, zoom, pan, rotation, morphing, warping, distorted faces,
deformed characters, changing text, melting, extra limbs, flicker, glitch,
low quality, watermark, text overlay, duplicate box
```

## Клип 2 (5 сек): из коробки поднимается свет и шары

Стартовый кадр — последний кадр клипа 1 (extend / «продолжить сцену»).

**Prompt:**
```
Static locked camera. From the open glowing box, a soft fountain of golden
sparkles and light rises upward, and a few round glass Christmas baubles float
gently up and hover in the air, reflecting warm light. Slow, weightless, magical.
The box below stays unchanged.
```

**Negative prompt:** тот же.

## ⚠️ Важно про «вылетают ИМЕННО её шары»

Kling нарисует шары «в тему», но **не вставит её точные шары** `ball-1..5` —
нейросеть так не умеет. Есть два честных пути:

- **Путь Kling (быстро):** в видео вылетают похожие золотые шары — атмосферно,
  но не её конкретные. Годится, если важна именно динамика.
- **Путь «её точные шары» (уже сделано на сайте):** видео Kling показывает
  открытие коробки + свет, а её **реальные шары** `ball-1..5` вылетают уже
  на самом сайте — секция «А вот и сама радость» идёт сразу после сцены
  открытия. Так шары пиксель-в-пиксель её, и мы полностью управляем движением.

Рекомендация: Клип 1 (открытие + свет) из Kling → на сайте подхватывает
секция с её настоящими шарами. Это даёт и киношное открытие, и точные шары.

## Почему Kling «плохо генерил» раньше — чек-лист

1. Длинный образный промпт → путается. Держи 2–3 предложения + negative.
2. Нет negative prompt (у Veo не нужен, у Kling критичен) — добавили.
3. Высокий CFG → перерисовывает рисунок. Ставь 0.3–0.4.
4. Нет «static camera» → облетает, рисунок плывёт. Фиксируй жёстко.
5. Просишь сразу всё → дроби на клипы по 5 сек, одно движение каждый.

## После генерации

Клипы `new 1.mp4` / `new 2.mp4` → `design/gift-src/video/`, затем:
`node scripts/extract-scene.mjs` — сцена на сайте пересоберётся сама.
