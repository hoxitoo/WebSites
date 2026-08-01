# Kling AI — открытие РЕАЛЬНОЙ коробки «Колибри» (барашки, красный бант)

Kling капризнее Veo к длинным описаниям и «магии»: он лучше слушается, когда
промпт короткий, конкретный, с чёткой камерой и ОДНИМ понятным движением.
Ниже — под режим **Image-to-Video** (загружаешь фото её коробки как первый кадр).

## Как запускать в Kling (важно)

1. Режим **Image to Video**, модель — новейшая (Kling 2.x / Master, что доступно).
2. Первый кадр — фото её коробки (`podarok_s_lentoy_Barashki.png`).
   Лучше сначала посадить коробку на тёмный фон (см. блок «Подготовка» ниже),
   тогда свет читается ярче.
3. **Duration 5s**, **CFG / Creativity ~0.3–0.4** (низкая — чтобы Kling не
   перерисовывал барашков и бант), **Professional / High Quality** если есть.
4. Камера — в промпте жёстко «static camera», иначе Kling любит облетать.

## Подготовка кадра (Nano Banana, по желанию — резко улучшает свет)

```
Keep this exact gift box unchanged — the red satin bow, the three sheep
characters, the snowy printed artwork. Replace only the beige background with
a deep dark-navy (#0E1526) winter-night scene: soft falling snow, warm golden
bokeh, subtle reflective dark table under the box. Cinematic warm light from
above. Do not alter the box or the bow. 16:9.
```

## Kling — Клип 1 (5 сек): крышка открывается, свет

**Prompt (положительный):**
```
Static locked camera, cinematic product shot. A red-bow gift box stands still.
The lid slowly rises straight up and tilts slightly back. Warm golden light
and soft sparkles gently rise from inside the opening box. Snow falls softly.
Calm, magical, premium mood. The box artwork and the red bow stay exactly the
same, no distortion.
```

**Negative prompt (обязательно для Kling):**
```
camera movement, zoom, pan, rotation, morphing, warping, distorted faces,
deformed characters, changing text, extra objects, flicker, glitch, low quality,
watermark, text overlay
```

## Kling — Клип 2 (5 сек): вылетают золотые шары

Первый кадр — последний кадр клипа 1 (extend / «продолжить»).

**Prompt:**
```
Static locked camera. From the open glowing box, several golden Christmas
baubles float gently upward and hover in the air, reflecting warm light,
connected by faint sparkling trails. Slow, weightless, magical. The box below
stays unchanged.
```

**Negative prompt:** тот же, что выше.

## Почему у тебя «плохо генерит» — 4 типичных причины на Kling

1. **Слишком длинный/образный промпт** → Kling теряется. Держи 2–3 коротких
   предложения + negative prompt (у Veo negative не нужен, у Kling — критичен).
2. **Высокий CFG/Creativity** → перерисовывает барашков. Ставь низкий (0.3–0.4).
3. **Нет «static camera»** → Kling облетает коробку, рисунок «плывёт». Жёстко фиксируй.
4. **Просишь сразу много** (открытие + вылет + дети + текст) → дроби на 2 клипа
   по 5 сек, каждый — одно движение.

## ⚠️ Про барашков и лица

Печатные персонажи на коробке в динамике могут «дышать»/искажаться на любой
нейросети. Минимизируем: низкий CFG, статичная камера, короткий клип, движется
только крышка и свет (корпус с барашками — неподвижен). Если после 2–3 попыток
барашки всё равно плывут — снимаем корпус статично, а «магию» (свет, шары)
добавляем поверх уже на монтаже/в коде.

## После генерации

Клипы (mp4) → `design/gift-src/video/` как `new 1.mp4`, `new 2.mp4`, затем:
`node scripts/extract-scene.mjs` — сцена на сайте пересоберётся сама.
