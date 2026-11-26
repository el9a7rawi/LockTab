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

<h3 align="center">Descarga para tu navegador — haz clic en el icono</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Chrome y los navegadores Chromium son el objetivo principal. Firefox 121 o posterior se admite mediante un archivo dedicado con su propio manifiesto.

---

## 1. Por qué LockTab

<div align="center">

| Sin LockTab | Con LockTab |
|---|---|
| Cualquiera puede leer una pestaña abierta | Tu pestaña queda cubierta hasta introducir el PIN |
| Una contraseña compartida por todos los sitios | Un PIN dedicado para las páginas importantes |
| Olvidar el PIN significa perder el acceso | Un código de recuperación de un solo uso lo desbloquea todo |
| Extensiones que envían datos a casa | Completamente sin conexión, sin cuenta ni seguimiento |

</div>

LockTab oculta una pestaña de quien se sienta ante tu equipo. No es cifrado de disco y no puede protegerte de un navegador comprometido ni de un administrador que retire la extensión.

---

## 2. Cómo funciona — tres pasos

1. Crea un PIN de 6 dígitos y guarda el código de recuperación que se muestra una vez.
2. Abre la pestaña que quieres proteger y pulsa Bloquear esta pestaña.
3. Introduce el PIN para leerla de nuevo, o concede un desbloqueo temporal.

---

## 3. Recorrido por la interfaz — cada parte de la extensión

### 3.1 Cabecera — todo a mano
<p align="center"><img src="assets/screenshots/es/sections/section-header.webp" width="400" alt="Header" /></p>

El título, el tema, el idioma y el enlace de GitHub comparten una fila sobria.

### 3.2 Una acción principal
<p align="center"><img src="assets/screenshots/es/sections/section-hero.webp" width="400" alt="Primary action" /></p>

Un solo botón con degradado cubre la página activa. El desbloqueo temporal y la eliminación piden el PIN antes.

### 3.3 Estado de la pestaña
<p align="center"><img src="assets/screenshots/es/sections/section-status.webp" width="400" alt="Tab status" /></p>

Una placa plana indica si la pestaña está bloqueada, abierta o abierta temporalmente.

### 3.4 Entrada del PIN
<p align="center"><img src="assets/screenshots/es/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Seis casillas aparecen una tras otra, se detienen en la sexta y centran el asterisco.

### 3.5 Código de recuperación
<p align="center"><img src="assets/screenshots/es/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

Se muestra una sola vez tras la configuración. Guárdalo bien; un código usado no se reutiliza.

### 3.6 Sitios bloqueados
<p align="center"><img src="assets/screenshots/es/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

Filas numeradas listan cada dominio bloqueado. Pasando cinco sitios, unas flechas recorren la lista.

### 3.7 Ajustes
<p align="center"><img src="assets/screenshots/es/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Desenfoque con tres intensidades, contador en el icono, duración del desbloqueo, tema e idioma en un solo lugar.

### 3.8 Apoyo
LockTab es gratuito y de código abierto. PayPal y un InstaPay destacado ayudan a mantenerlo independiente.

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

1. Un PIN de 6 dígitos. Se guarda como hash PBKDF2 con una sal única; el PIN en texto nunca se escribe en el disco.
2. Una cubierta cerrada. La capa usa una shadow root cerrada, mantiene el foco dentro y bloquea el desplazamiento de la página.
3. Un contador compartido. Los errores escalan a 30, 60, 300 y 900 segundos; cambiar de pestaña no reinicia el contador.
4. Recuperación de un solo uso. El código se muestra una vez, se consume una vez y borra todos los bloqueos.

---

## 5. Instalación (sin empaquetar)

1. Abre `chrome://extensions`.
2. Activa el **modo de desarrollador**.
3. Haz clic en **Cargar sin empaquetar** y selecciona la carpeta del archivo descomprimido.
4. Haz clic en el icono de LockTab en la barra de herramientas.

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
