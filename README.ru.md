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

<h3 align="center">Download for your browser — click the icon</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Основная цель — Chrome и браузеры на Chromium. Firefox 121+ поддерживается через отдельный архив со своим манифестом.

---

## 1. Зачем LockTab?

<div align="center">

| Without LockTab | With LockTab |
|---|---|
| Любой может прочитать открытую вкладку | Вкладка скрыта до ввода PIN-кода |
| Один пароль для всех сайтов | Отдельный PIN для важных страниц |
| Забыли PIN — потеряли доступ | Одноразовый код снимает все блокировки |
| Расширения, которые отправляют данные | Полностью офлайн, без аккаунта и слежки |

</div>

undefined

---

## 2. Как это работает — три шага

1. Создайте PIN из 6 цифр и сохраните показанный один раз код восстановления.
2. Откройте нужную вкладку и нажмите «Заблокировать вкладку».
3. Введите PIN, чтобы продолжить, или разрешите временную разблокировку.

---

## 3. Обзор интерфейса — все части расширения

### 3.1 Header — everything in reach
<p align="center"><img src="assets/screenshots/ru/sections/section-header.webp" width="400" alt="Header" /></p>

The title, theme toggle, GitHub link and language picker share one compact row.

### 3.2 One primary action
<p align="center"><img src="assets/screenshots/ru/sections/section-hero.webp" width="400" alt="Primary action" /></p>

A single gradient button covers the active page. Temporary unlock and lock removal ask for the PIN first.

### 3.3 Tab status
<p align="center"><img src="assets/screenshots/ru/sections/section-status.webp" width="400" alt="Tab status" /></p>

A flat status plate shows whether the tab is locked, open, or open for a while.

### 3.4 First run — create your PIN
<p align="center"><img src="assets/screenshots/ru/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Six boxes appear one after another, stop exactly at six, and centre the asterisk.

### 3.5 Recovery code shown once
<p align="center"><img src="assets/screenshots/ru/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

The code is displayed only at setup. Store it somewhere safe; a used code can never be replayed.

### 3.6 A PIN for one site
<p align="center"><img src="assets/screenshots/ru/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

A site PIN overrides the global one on that domain, so sensitive pages can stay separate.

### 3.7 Locked sites
<p align="center"><img src="assets/screenshots/ru/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Numbered rows list every locked domain. Past five sites, arrows page through the list.

### 3.8 Lock from anywhere
The Alt+Shift+L shortcut locks the current tab without opening the popup.

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

1. **A 6-digit PIN.** Stored as a PBKDF2 hash with a unique 16-byte salt; the plaintext is never written to disk.
2. **A closed gate.** The overlay runs in a closed shadow root, traps focus and blocks scrolling underneath.
3. **A shared counter.** Wrong guesses escalate through 30, 60, 300 and 900 second lock-outs; switching tabs does not reset it.
4. **One-time recovery.** The code is shown once, consumed once, and clears every lock.

---

## 5. Установка (без сборки)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted release folder.
4. Click the LockTab icon in the toolbar.

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
