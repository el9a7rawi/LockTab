<p align="center">
  <img src="assets/banner/locktab-banner-es.webp" width="100%" alt="LockTab — Tus pestañas, solo para ti" />
</p>

<h1 align="center">LockTab — Tus pestañas, solo para ti</h1>

<p align="center">Bloquea cualquier pestaña con un clic y un PIN de 6 dígitos. Añade un PIN privado para un sitio, guarda un código de recuperación de un solo uso y aléjate sabiendo que nadie puede leer tu pantalla. Ocho idiomas, RTL árabe completo y cero conexiones a la nube.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Última versión" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PRs bienvenidos" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 idiomas" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Sin conexión" />
</p>

<h4 align="center">
  <a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a> · <a href="README.ar.md">العربية</a> · <a href="README.zh-CN.md">中文（简体）</a>
</h4>

<h3 align="center">Download for your browser — click the icon</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Chrome y los navegadores Chromium son el objetivo principal. Firefox 121 o posterior se admite mediante un archivo dedicado con su propio manifiesto.

---

## 1. Por qué LockTab

<div align="center">

| Without LockTab | With LockTab |
|---|---|
| Cualquiera puede leer una pestaña abierta | Tu pestaña queda cubierta hasta introducir el PIN |
| Una contraseña compartida por todos los sitios | Un PIN dedicado para las páginas importantes |
| Olvidar el PIN significa perder el acceso | Un código de recuperación de un solo uso lo desbloquea todo |
| Extensiones que envían datos a casa | Completamente sin conexión, sin cuenta ni seguimiento |

</div>

undefined

---

## 2. Cómo funciona — tres pasos

1. Crea un PIN de 6 dígitos y guarda el código de recuperación que se muestra una vez.
2. Abre la pestaña que quieres proteger y pulsa Bloquear esta pestaña.
3. Introduce el PIN para leerla de nuevo, o concede un desbloqueo temporal.

---

## 3. Recorrido por la interfaz — cada parte de la extensión

### 3.1 Header — everything in reach
<p align="center"><img src="assets/screenshots/es/sections/section-header.webp" width="400" alt="Header" /></p>

The title, theme toggle, GitHub link and language picker share one compact row.

### 3.2 One primary action
<p align="center"><img src="assets/screenshots/es/sections/section-hero.webp" width="400" alt="Primary action" /></p>

A single gradient button covers the active page. Temporary unlock and lock removal ask for the PIN first.

### 3.3 Tab status
<p align="center"><img src="assets/screenshots/es/sections/section-status.webp" width="400" alt="Tab status" /></p>

A flat status plate shows whether the tab is locked, open, or open for a while.

### 3.4 First run — create your PIN
<p align="center"><img src="assets/screenshots/es/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Six boxes appear one after another, stop exactly at six, and centre the asterisk.

### 3.5 Recovery code shown once
<p align="center"><img src="assets/screenshots/es/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

The code is displayed only at setup. Store it somewhere safe; a used code can never be replayed.

### 3.6 A PIN for one site
<p align="center"><img src="assets/screenshots/es/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

A site PIN overrides the global one on that domain, so sensitive pages can stay separate.

### 3.7 Locked sites
<p align="center"><img src="assets/screenshots/es/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Numbered rows list every locked domain. Past five sites, arrows page through the list.

### 3.8 Lock from anywhere
The Alt+Shift+L shortcut locks the current tab without opening the popup.

### 3.9 Ajustes
<p align="center"><img src="assets/screenshots/es/sections/section-settings.webp" width="400" alt="Settings" /></p>

Desenfoque, contador, duración, tema e idioma en una sola tarjeta.

### 3.10 Ocho idiomas, RTL real
<p align="center"><img src="assets/screenshots/es/sections/section-language.webp" width="400" alt="Language menu" /></p>

Cambia al instante entre los ocho paquetes; el árabe invierte el diseño.

### 3.11 Tema oscuro negro real
<p align="center"><img src="assets/screenshots/es/popup-dark.webp" width="280" alt="LockTab popup — dark theme" /></p>

Fondo negro auténtico con contraste ajustado y recordado entre sesiones.

### 3.12 Entrada del PIN
<p align="center"><img src="assets/screenshots/es/lockscreen.webp" width="600" alt="PIN entry" /></p>

La cubierta usa una shadow root cerrada: el foco permanece dentro.

### 3.13 Estado vacío
<p align="center"><img src="assets/screenshots/es/sections/section-empty.webp" width="400" alt="Empty state" /></p>

Una invitación honesta a bloquear una pestaña.

### 3.14 Apoyar el desarrollo
<p align="center"><img src="assets/screenshots/es/sections/section-donate.webp" width="400" alt="Support section" /></p>

PayPal e InstaPay ayudan a mantenerlo independiente; no se envían datos.

## 4. Qué protege el bloqueo

1. **A 6-digit PIN.** Stored as a PBKDF2 hash with a unique 16-byte salt; the plaintext is never written to disk.
2. **A closed gate.** The overlay runs in a closed shadow root, traps focus and blocks scrolling underneath.
3. **A shared counter.** Wrong guesses escalate through 30, 60, 300 and 900 second lock-outs; switching tabs does not reset it.
4. **One-time recovery.** The code is shown once, consumed once, and clears every lock.

---

## 5. Instalación (sin empaquetar)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted release folder.
4. Click the LockTab icon in the toolbar.

La privacidad se explica en la sección 7 y en `privacy.html`.

---

## 6. Desarrollo

El repositorio publicado contiene solo la extensión y su documentación. Los scripts de captura y las pruebas locales se mantienen fuera; GitHub Actions valida el manifiesto, el CSP y la cobertura de idiomas.

---

## 7. Privacidad

Consulta `privacy.html`. El PIN se guarda solo como hash PBKDF2 con una sal única; no se lee el contenido de la página y ninguna petición sale de la extensión.

---

## 8. Licencia

El proyecto es de código abierto y gratuito bajo **Apache-2.0**; el texto completo está en [LICENSE](LICENSE). Las fuentes usan [SIL OFL 1.1](fonts/OFL.txt). Historial en [CHANGELOG.md](CHANGELOG.md).

---

<p align="center">Hecho con cariño ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab">LockTab</a> · <a href="LICENSE">Apache-2.0</a></p>
