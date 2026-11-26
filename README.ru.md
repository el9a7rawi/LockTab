<p align="center">
  <img src="assets/banner/locktab-banner-ru.webp" width="100%" alt="LockTab — Ваши вкладки. Только ваши." />
</p>

<h1 align="center">LockTab — Ваши вкладки. Только ваши.</h1>

<p align="center">Блокируйте любую вкладку в один клик PIN-кодом из 6 цифр. Назначьте отдельный PIN для сайта, сохраните одноразовый код восстановления и уходите, зная, что никто не прочитает ваш экран. Восемь языков, полноценное арабское RTL и ничего облачного.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Последний релиз" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PR приветствуются" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 языков" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Офлайн" />
</p>

<h4 align="center">
  <a href="README.md">English</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ar.md">العربية</a> · <a href="README.zh-CN.md">中文（简体）</a>
</h4>

<h3 align="center">Скачайте для своего браузера — нажмите значок</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Основная цель — Chrome и браузеры на Chromium. Firefox 121+ поддерживается через отдельный архив со своим манифестом.

---

## 1. Зачем LockTab?

<div align="center">

| Без LockTab | С LockTab |
|---|---|
| Любой может прочитать открытую вкладку | Вкладка скрыта до ввода PIN-кода |
| Один пароль для всех сайтов | Отдельный PIN для важных страниц |
| Забыли PIN — потеряли доступ | Одноразовый код снимает все блокировки |
| Расширения, которые отправляют данные | Полностью офлайн, без аккаунта и слежки |

</div>

LockTab скрывает вкладку от того, кто садится за ваше устройство. Это не шифрование диска и не защита от скомпрометированного браузера или администратора, удалившего расширение.

---

## 2. Как это работает — три шага

1. Создайте PIN из 6 цифр и сохраните показанный один раз код восстановления.
2. Откройте нужную вкладку и нажмите «Заблокировать вкладку».
3. Введите PIN, чтобы продолжить, или разрешите временную разблокировку.

---

## 3. Обзор интерфейса — все части расширения

### 3.1 Заголовок — всё под рукой
<p align="center"><img src="assets/screenshots/ru/sections/section-header.webp" width="400" alt="Header" /></p>

Название, тема, язык и ссылка на GitHub занимают одну спокойную строку.

### 3.2 Одно главное действие
<p align="center"><img src="assets/screenshots/ru/sections/section-hero.webp" width="400" alt="Primary action" /></p>

Одна кнопка с градиентом скрывает активную страницу. Временная разблокировка и удаление требуют PIN.

### 3.3 Состояние вкладки
<p align="center"><img src="assets/screenshots/ru/sections/section-status.webp" width="400" alt="Tab status" /></p>

Плоская плашка показывает, заблокирована вкладка, открыта или открыта временно.

### 3.4 Ввод PIN
<p align="center"><img src="assets/screenshots/ru/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Шесть полей появляются одно за другим, останавливаются на шестом и центрируют звёздочку.

### 3.5 Код восстановления
<p align="center"><img src="assets/screenshots/ru/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

Показывается один раз после настройки. Использованный код нельзя повторить.

### 3.6 Заблокированные сайты
<p align="center"><img src="assets/screenshots/ru/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

Пронумерованные строки перечисляют все домены. После пяти сайтов стрелки листают список.

### 3.7 Настройки
<p align="center"><img src="assets/screenshots/ru/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Размытие в трёх уровнях, счётчик на значке, длительность разблокировки, тема и язык — в одном месте.

### 3.8 Поддержка
LockTab бесплатен и с открытым кодом. PayPal и выделенный InstaPay помогают ему оставаться независимым.

### 3.9 Настройки
<p align="center"><img src="assets/screenshots/ru/sections/section-settings.webp" width="400" alt="Settings" /></p>

Размытие, счётчик, длительность, тема и язык в одной карточке.

### 3.10 Восемь языков, настоящий RTL
<p align="center"><img src="assets/screenshots/ru/sections/section-language.webp" width="400" alt="Language menu" /></p>

Мгновенное переключение; арабский логически зеркалит интерфейс.

### 3.11 Чёрная тёмная тема
<p align="center"><img src="assets/screenshots/ru/popup-dark.webp" width="280" alt="LockTab popup — dark theme" /></p>

Настоящий чёрный фон с подобранным контрастом и сохранением выбора.

### 3.12 Ввод PIN-кода
<p align="center"><img src="assets/screenshots/ru/lockscreen.webp" width="600" alt="PIN entry" /></p>

Блокировка использует закрытый shadow root; фокус остаётся внутри.

### 3.13 Пустое состояние
<p align="center"><img src="assets/screenshots/ru/sections/section-empty.webp" width="400" alt="Empty state" /></p>

Честное приглашение заблокировать вкладку.

### 3.14 Поддержка
<p align="center"><img src="assets/screenshots/ru/sections/section-donate.webp" width="400" alt="Support section" /></p>

PayPal и InstaPay помогают сохранять независимость проекта.

## 4. Что защищает блокировка

1. PIN-код из 6 цифр. Хранится как хеш PBKDF2 с уникальной солью; открытый код никогда не записывается на диск.
2. Закрытая перекрышка. Блокировка использует закрытый shadow root, удерживает фокус внутри и блокирует прокрутку страницы.
3. Общий счётчик. Ошибки увеличивают задержку до 30, 60, 300 и 900 секунд; переключение вкладок счётчик не сбрасывает.
4. Одноразовое восстановление. Код показывается один раз, используется один раз и снимает все блокировки.

---

## 5. Установка (без сборки)

1. Откройте `chrome://extensions`.
2. Включите **Режим разработчика**.
3. Нажмите **Загрузить распакованное расширение** и выберите извлечённую папку.
4. Нажмите на значок LockTab на панели инструментов.

Конфиденциальность описана в разделе 7 и в `privacy.html`.

---

## 6. Разработка

Опубликованный репозиторий содержит только расширение и документацию. Скрипты захвата и локальные тесты исключены; GitHub Actions проверяет манифест, CSP и полноту переводов.

---

## 7. Конфиденциальность

См. `privacy.html`. PIN хранится только как хеш PBKDF2 с уникальной солью; содержимое страницы не читается, ни один запрос не покидает расширение.

---

## 8. Лицензия

Проект с открытым кодом по лицензии **Apache-2.0**; полный текст в [LICENSE](LICENSE). Шрифты по [SIL OFL 1.1](fonts/OFL.txt). История в [CHANGELOG.md](CHANGELOG.md).

---

<p align="center">Создано с заботой ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab">LockTab</a> · <a href="LICENSE">Apache-2.0</a></p>
