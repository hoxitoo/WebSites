# Настройка приёма заявок: Google Таблица + письмо менеджеру

Без сервера и платных сервисов: заявки с формы сайта попадают в Google Таблицу,
менеджеру уходит письмо. Всё живёт в Google-аккаунте компании (тот же подход
будет использовать бот «Служба заботы Деда Мороза» — таблица общая).

## Шаг 1. Таблица

1. Создать Google Таблицу, назвать лист `Заявки`.
2. Первая строка (шапка): `Дата | Имя | Компания | Почта | Телефон | Сотрудников | Источник`.
3. Из адресной строки скопировать ID таблицы — длинная строка между `/d/` и `/edit`.

## Шаг 2. Скрипт

1. В таблице: **Расширения → Apps Script**.
2. Вставить код (заменить `SHEET_ID` и `MANAGER_EMAIL`):

```javascript
const SHEET_ID = "ВСТАВИТЬ_ID_ТАБЛИЦЫ";
const MANAGER_EMAIL = "manager@example.ru";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Заявки");
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.company || "",
    data.email || "",
    data.phone || "",
    data.teamSize || "",
    data.source || "сайт",
  ]);

  MailApp.sendEmail({
    to: MANAGER_EMAIL,
    subject: "🎄 Новая заявка с сайта Колибри: " + (data.company || data.name),
    body:
      "Имя: " + (data.name || "—") + "\n" +
      "Компания: " + (data.company || "—") + "\n" +
      "Почта: " + (data.email || "—") + "\n" +
      "Телефон: " + (data.phone || "—") + "\n" +
      "Сотрудников поздравить: " + (data.teamSize || "—") + "\n\n" +
      "Заявка уже в Google Таблице.",
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Шаг 3. Публикация

1. **Развернуть → Новое развёртывание → Веб-приложение**.
2. «Выполнять от имени»: **меня**. «У кого есть доступ»: **все**.
3. Нажать «Развернуть», разрешить доступы, скопировать **URL веб-приложения**
   (вид: `https://script.google.com/macros/s/…/exec`).

## Шаг 4. Подключить сайт

В папке `Calibri_gift` создать файл `.env.local`:

```
LEAD_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
```

Перезапустить сервер (`npm run build && npm run start`). Отправить тестовую
заявку с сайта — строка появится в таблице, менеджеру придёт письмо.

> Если `LEAD_WEBHOOK_URL` не задан, сайт работает как раньше: заявка логируется
> в консоль сервера, пользователь видит «Спасибо». Ничего не ломается.

## Тот же скрипт для бота

Когда запустим бота «Служба заботы Деда Мороза», его ответы будем писать
в эту же таблицу (отдельный лист `Бот`) тем же способом — единая база заявок.
