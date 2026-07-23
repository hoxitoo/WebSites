# Veo 3 — открытие РЕАЛЬНОЙ коробки «Колибри»

Цель: заменить бордовую AI-коробку на настоящий брендовый бокс заказчицы
(красный с бантом — он лучше всего подходит: чистое фото продукта на белом,
как наш кадр 1).

## Подготовка стартового кадра (важно!)

Veo лучше анимирует, когда фон уже «сценический», а не белый. Перед видео
прогони фото коробки через Nano Banana (image-to-image), чтобы посадить её
в тёмно-синюю новогоднюю сцену:

```
Place this exact gift box (keep its printed artwork — the sheep characters,
snowflakes, red bow — 100% unchanged) onto a dark navy (#0E1526) winter-night
background with soft falling snow, warm bokeh lights and a subtle reflective
dark surface underneath. Cinematic product lighting, warm key light from
above-left. Do not alter the box design or the bow. 16:9.
```

Полученный кадр → стартовый для Veo.

## Клип 1 (8 сек) — открытие

```
Static locked-off camera, cinematic. The gift box stays perfectly still and
its printed artwork does NOT change. Only the lid slowly lifts straight up
and tilts back, and a warm golden volumetric light beam bursts upward from
inside the box, with rising gold sparkles and dust. The red bow stays on the
lid. Snow keeps falling softly. No camera movement, no morphing of the box
graphics, no text changes. Slow, magical, premium New Year mood.
```

## Клип 2 (8 сек) — вылетают шары с детьми (её идея)

```
Continuation, same static camera and box. Out of the glowing open box rise
several golden Christmas baubles floating in the air, each ornament reflecting
warm light, connected by thin sparkling gold trails like a constellation.
Gentle upward motion, then they hover. The box stays unchanged below.
No morphing of printed artwork.
```

## ⚠️ Риск и как его снизить

Печатная графика (барашки, дети, надпись «С Новым годом») при движении может
исказиться — Veo плохо держит сложные рисунки в динамике. Поэтому:
- держим камеру статичной (в промпте «static locked-off camera»);
- двигается только крышка и свет, сам корпус с рисунком — неподвижен;
- если барашки на корпусе всё равно «поплыли» — перегенерировать 2–3 раза
  или обрезать кадр так, чтобы корпус с рисунком был максимально статичен.

Если фидиться не хочет — переходим на путь B: открытие коробки в коде
(лид поднимается CSS/3D, рисунок остаётся идеально чётким, т.к. это её же
картинка на гранях). Магия света будет скромнее, но бренд — пиксель-в-пиксель.

## После генерации

Кладём клипы в `design/gift-src/video/` (`new 1.mp4`, `new 2.mp4`) и
`node scripts/extract-scene.mjs` — секвенция пересоберётся автоматически.
