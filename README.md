# LockTab

[![Version](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)
[![Made with care](https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F-4f46e5)](https://github.com/el9a7rawi)

**Your tabs, behind a PIN.**

LockTab is a small, offline browser extension that hides any tab behind a 6-digit PIN. Set one
global PIN, give a sensitive page its own PIN if you want, and walk away from your desk without
thinking twice.

> Read in another language: [Español](README.es.md) · [Français](README.fr.md) ·
> [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Русский](README.ru.md) ·
> [العربية](README.ar.md) · [简体中文](README.zh-CN.md)

## Why LockTab

- **Actually hides the page.** A closed shadow-root overlay covers the content, traps focus, and
  blocks scrolling underneath. If a page removes it, it comes back.
- **No plaintext secret.** Your PIN is derived with PBKDF2-HMAC-SHA256 (600,000 iterations, unique
  16-byte salt). Only the hash is stored — on your device.
- **No bypass through the popup.** Every action that widens access asks for the PIN again.
- **One counter, shared.** Wrong guesses escalate to a 30s → 60s → 300s → 900s lock-out. Opening a
  different tab does not reset it when the global PIN is in use.
- **Recovery without a server.** A one-time code is shown when you set your PIN. Lose the PIN, use
  the code; the code is consumed and every lock is cleared.
- **Private by construction.** No account, no telemetry, no remote code, no network requests.

## Install

### Chrome, Edge, Brave, Opera

1. Download `locktab-chrome-1.0.1.zip` from [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extract it into a folder.
3. Open `chrome://extensions`, enable **Developer mode**.
4. Choose **Load unpacked** and select the extracted folder.

### Firefox 121+

1. Download `locktab-firefox-1.0.1.zip` from [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extract it into a folder.
3. Open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**.
4. Select `manifest.json` in the extracted folder.

## Usage

1. Click the LockTab icon. On first run you are asked to create a PIN (6 digits).
2. **Save the recovery code** it shows — it is displayed once and never again.
3. Open the tab you want to protect, click the icon, then **Lock this tab**.
4. To read it again, enter the PIN in the overlay. Choose **Unlock for a while** in the popup for a
   temporary pass, or **Remove lock** to drop the rule entirely (both ask for the PIN first).
5. Optionally set a different PIN for one site from the **PIN for this site** card.

The popup also holds the theme switch, language choice, unlock duration, icon counter toggle, PIN
change, and full reset.

## Security model

| Decision | Reason |
| --- | --- |
| Verification happens only in the background page | A content script runs in a page the web can influence; it never sees a hash, salt, or attempt counter. |
| Query strings and fragments are ignored | A redirect must not shed a lock by adding `?utm_source=…`. |
| The overlay uses a closed shadow root | The host page cannot style or read the lock UI. |
| `attempts` and `lockedUntil` are written serially | Two simultaneous taps cannot buy a free guess. |
| Temporary unlocks are cleared on browser startup | Closing the browser counts as leaving the desk. |

LockTab hides a page from someone who sits at your device. It is not disk encryption and cannot
defend against a compromised browser or an administrator who removes the extension.

See [privacy.html](privacy.html) for the full privacy policy.

## Languages

English, Español, Français, Deutsch, Português (Brasil), Русский, العربية (RTL), 简体中文.
The interface follows the browser language and can be overridden in the popup.

## Build from source

```bash
python tools/build.py          # validates locales and writes both release zips
node --test tests/core.test.mjs
```

No bundler, no npm dependencies. See [DESIGN.md](DESIGN.md) for the visual contract if you are
contributing to the interface.

## Support

If LockTab saved you an awkward moment, you can support the project:

- PayPal: <https://paypal.me/27medYousry>
- InstaPay: <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## License

Apache-2.0 © Ahmed Yousry

Made with care ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)
