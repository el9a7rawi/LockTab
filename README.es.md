<p align="center">
  <img src="assets/banner/locktab-banner-es.png" width="100%" alt="LockTab — Tus pestañas, solo para ti" />
</p>

<h1 align="center">LockTab — Tus pestañas, solo para ti</h1>

<p align="center">Bloquea cualquier pestaña con un clic y un PIN de 6 dígitos. Añade un PIN privado para un sitio, guarda un código de recuperación de un solo uso y aléjate sabiendo que nadie puede leer tu pantalla. Ocho idiomas, RTL árabe completo y cero conexiones a la nube.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Latest release" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PRs welcome" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 languages" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Works offline" />
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.ar.md">العربية</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a> · <a href="README.zh-CN.md">中文（简体）</a>
</p>

<h3 align="center">Descarga para tu navegador — pulsa el icono</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Firefox 121 o posterior usa un archivo dedicado con un manifiesto específico.

---

## 1. ¿Por qué LockTab?

| Without LockTab | With LockTab |
| --- | --- |
| Cualquiera puede leer una pestaña abierta | Tu pestaña queda cubierta hasta introducir el PIN |
| Una contraseña compartida por todos los sitios | Un PIN dedicado para las páginas importantes |
| Olvidar el PIN significa perder el acceso | Un código de recuperación de un solo uso lo desbloquea todo |
| Extensiones que envían datos a casa | Completamente sin conexión, sin cuenta ni seguimiento |

La pestaña bloqueada sigue cubierta hasta introducir el PIN. Sin cuenta en la nube, contraseña compartida ni peticiones salientes.

---

## 2. Cómo funciona — tres pasos

1. Crea un PIN de 6 dígitos y guarda el código de recuperación que se muestra una vez.
2. Abre la pestaña que quieres proteger y pulsa Bloquear esta pestaña.
3. Introduce el PIN para leerla de nuevo, o concede un desbloqueo temporal.

---

## 3. Recorrido por la interfaz — cada parte de la extensión

### 3.1 Cabecera — todo a mano
<p align="center"><img src="assets/screenshots/es/sections/section-header.png" width="400" alt="Cabecera — todo a mano" /></p>

El título, el tema, el idioma y el enlace de GitHub comparten una fila sobria.

### 3.2 Una acción principal
<p align="center"><img src="assets/screenshots/es/sections/section-hero.png" width="400" alt="Una acción principal" /></p>

Un solo botón con degradado cubre la página activa. El desbloqueo temporal y la eliminación piden el PIN antes.

### 3.3 Estado de la pestaña
<p align="center"><img src="assets/screenshots/es/sections/section-status.png" width="400" alt="Estado de la pestaña" /></p>

Una placa plana indica si la pestaña está bloqueada, abierta o abierta temporalmente.

### 3.4 Entrada del PIN
<p align="center"><img src="assets/screenshots/es/sections/section-otp.png" width="400" alt="Entrada del PIN" /></p>

Seis casillas aparecen una tras otra, se detienen en la sexta y centran el asterisco.

### 3.5 Código de recuperación
<p align="center"><img src="assets/screenshots/es/sections/section-recovery.png" width="400" alt="Código de recuperación" /></p>

Se muestra una sola vez tras la configuración. Guárdalo bien; un código usado no se reutiliza.

### 3.6 Sitios bloqueados
<p align="center"><img src="assets/screenshots/es/sections/section-sites.png" width="400" alt="Sitios bloqueados" /></p>

Filas numeradas listan cada dominio bloqueado. Pasando cinco sitios, unas flechas recorren la lista.

### 3.7 Ajustes
<p align="center"><img src="assets/screenshots/es/sections/section-settings.png" width="400" alt="Ajustes" /></p>

Desenfoque con tres intensidades, contador en el icono, duración del desbloqueo, tema e idioma en un solo lugar.

### 3.8 Apoyo
<p align="center"><img src="assets/screenshots/es/sections/section-donate.png" width="400" alt="Apoyo" /></p>

LockTab es gratuito y de código abierto. PayPal y un InstaPay destacado ayudan a mantenerlo independiente.

---

## 4. Qué protege el PIN

El PIN nunca sale de tu dispositivo. Se guarda como hash PBKDF2 con una sal única y la cubierta se vuelve a colocar en su sitio sin recargar la página.

<div dir="ltr">

```text
PBKDF2-HMAC-SHA256 · 600.000 iteraciones · sal de 16 bytes · shadow root cerrado · espera 30/60/300/900 s
```

</div>

The query string and fragment are ignored, so a redirect cannot shed a lock. Every action that widens
access asks for the PIN again, including the temporary unlock and lock removal.

---

## 5. Instalación

1. Download the release archive for your browser from [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extract it into a folder.
3. Chrome, Edge, Brave and Opera: open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked** and select the folder.
4. Firefox 121+: open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on** and select `manifest.json` in the folder.

La privacidad se explica en la sección 7 y en privacy.html.

---

## 6. Desarrollo

No bundler and no npm dependencies. Run `python tools/build.py` to validate all eight
locale bundles and write the release archives, then `node --test tests/core.test.mjs` for the
unit tests. The interface follows a fixed visual contract in the design reference.

---

## 7. Privacidad

Consulta privacy.html. El PIN solo se guarda como hash PBKDF2 con una sal única. Se descartan la consulta y el fragmento, nunca se lee el contenido de la página y ninguna petición sale de la extensión. Las fuentes son locales.

---

## 8. Licencia

El proyecto es de código abierto y gratuito bajo Apache-2.0 — úsalo, modifícalo y compártelo libremente; el texto completo está en LICENSE. Las fuentes incluidas tienen licencia SIL OFL 1.1. El historial está en CHANGELOG.md.

<p align="center">Hecho con cariño ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab">LockTab</a> · <a href="LICENSE">Apache-2.0</a></p>
