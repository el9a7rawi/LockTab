# LockTab

[![Versión](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![Licencia: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)

**Tus pestañas, tras un PIN.**

LockTab es una extensión pequeña y sin conexión que oculta cualquier pestaña tras un PIN de 6
dígitos. Define un PIN global, pon un PIN distinto a una página sensible si lo deseas, y aléjate del
ordenador sin darle más vueltas.

> Leer en otro idioma: [English](README.md) · [Français](README.fr.md) · [Deutsch](README.de.md) ·
> [Português (Brasil)](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md) ·
> [简体中文](README.zh-CN.md)

## Por qué LockTab

- **Oculta la página de verdad.** Una capa con shadow root cerrado cubre el contenido, atrapa el
  foco y bloquea el desplazamiento. Si la página la elimina, vuelve a aparecer.
- **Ningún secreto en texto plano.** El PIN se deriva con PBKDF2-HMAC-SHA256 (600.000 iteraciones y
  una sal única de 16 bytes). Solo se guarda el hash, en tu dispositivo.
- **El popup no sirve para saltárselo.** Toda acción que amplía el acceso vuelve a pedir el PIN.
- **Un contador compartido.** Los fallos escalan a bloqueos de 30 s → 60 s → 300 s → 900 s. Abrir
  otra pestaña no reinicia el contador con el PIN global.
- **Recuperación sin servidor.** Al crear el PIN se muestra un código de un solo uso: úsalo si lo
  olvidas y se consumirá borrando todos los bloqueos.
- **Privado por diseño.** Sin cuenta, sin telemetría, sin código remoto, sin peticiones de red.

## Instalación

### Chrome, Edge, Brave y Opera

1. Descarga `locktab-chrome-1.0.1.zip` de [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extrae el archivo en una carpeta.
3. Abre `chrome://extensions` y activa **Modo desarrollador**.
4. Pulsa **Cargar sin empaquetar** y selecciona la carpeta extraída.

### Firefox 121+

1. Descarga `locktab-firefox-1.0.1.zip` de [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extrae el archivo en una carpeta.
3. Abre `about:debugging#/runtime/this-firefox` y elige **Cargar complemento temporal**.
4. Selecciona `manifest.json` dentro de la carpeta extraída.

## Uso

1. Pulsa el icono de LockTab. La primera vez te pedirá crear un PIN (6 dígitos).
2. **Guarda el código de recuperación**: se muestra una sola vez.
3. Abre la pestaña que quieres proteger, pulsa el icono y elige **Bloquear esta pestaña**.
4. Para leerla de nuevo, introduce el PIN en la capa. El popup ofrece **Desbloquear un rato** o
   **Quitar bloqueo**; ambas acciones piden el PIN antes.
5. Opcionalmente define un PIN propio para un sitio desde la tarjeta **PIN de este sitio**.

El popup también incluye el cambio de tema, el idioma, la duración del desbloqueo, el contador del
icono, el cambio de PIN y el reinicio completo.

## Modelo de seguridad

| Decisión | Motivo |
| --- | --- |
| La verificación ocurre solo en el background | Un content script corre en una página que el web puede manipular; nunca ve el hash, la sal ni el contador. |
| Se ignoran la query y el fragmento | Una redirección no debe poder quitar el bloqueo añadiendo `?utm_source=…`. |
| La capa usa un shadow root cerrado | La página anfitriona no puede leer ni estilizar el bloqueo. |
| Los intentos se escriben en serie | Dos clics simultáneos no pueden regalar un intento extra. |
| Los desbloqueos temporales se borran al iniciar el navegador | Cerrar el navegador cuenta como abandonar el puesto. |

LockTab oculta una página a quien se sienta en tu equipo. No es cifrado de disco y no protege frente
a un navegador comprometido o a un administrador que elimine la extensión.

La política de privacidad completa está en [privacy.html](privacy.html).

## Idiomas

English, Español, Français, Deutsch, Português (Brasil), Русский, العربية (RTL) y 简体中文. La
interfaz sigue el idioma del navegador y se puede cambiar en el popup.

## Compilar desde el código

```bash
python tools/build.py          # valida los idiomas y genera los dos zips
node --test tests/core.test.mjs
```

Sin bundler y sin dependencias npm.

## Apoyo

Si LockTab te ha evitado un momento incómodo, puedes apoyar el proyecto:

- PayPal: <https://paypal.me/27medYousry>
- InstaPay: <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## Licencia

Apache-2.0 © Ahmed Yousry

Hecho con cariño ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)
