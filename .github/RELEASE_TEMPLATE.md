<p align="center">
  <img src="https://raw.githubusercontent.com/el9a7rawi/LockTab/v{{VERSION}}/icons/icon-128.png" width="96" alt="LockTab" />
</p>

<h1 align="center">LockTab v{{VERSION}}</h1>

<p align="center">Lock any tab in one click with a 6-digit PIN. Private PINs per site, one-time recovery, zero cloud.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Latest release" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PRs welcome" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 languages" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Works offline" />
</p>

---

## 1. Release files

<div align="center">

| File | Browser |
|---|---|
| `locktab-chrome-v{{VERSION}}.zip` | Chrome |
| `locktab-edge-v{{VERSION}}.zip` | Edge |
| `locktab-brave-v{{VERSION}}.zip` | Brave |
| `locktab-opera-v{{VERSION}}.zip` | Opera |
| `locktab-firefox-v{{VERSION}}.zip` | Firefox |
| `SHA256SUMS.txt` | Checksums for verifying the integrity of every file above |
| `Source code (zip / tar.gz)` | Tracked source — extension files plus docs (dev tooling excluded) |

</div>

---

## 2. Installation — one minute

**Chrome / Edge / Brave / Opera** (file `locktab-<browser>-v{{VERSION}}.zip`):

1. Unzip the archive.
2. Open `chrome://extensions` (or the equivalent page) and enable **Developer mode**.
3. Choose **Load unpacked**, select the unzipped folder, then pin the toolbar icon.

**Firefox** (file `locktab-firefox-v{{VERSION}}.zip`):

This archive has its own Firefox manifest with a classic background script and Gecko settings. Do not use the Chrome archive on Firefox.

1. Unzip the archive.
2. Open `about:debugging` → This Firefox → Load Temporary Add-on → select `manifest.json`.

---

## 3. Requirements

<div align="center">

| Browser | Minimum version |
|---|---|
| Chrome / Edge / Brave / Opera | **121+** |
| Firefox | **121+** |

</div>

---

## 4. Verify file integrity

<p align="center">Compare the checksum of the file you downloaded with the matching line in <code>SHA256SUMS.txt</code>.</p>

<div dir="ltr">

```powershell
Get-FileHash locktab-chrome-v{{VERSION}}.zip -Algorithm SHA256
```

</div>

<div dir="ltr">

```bash
sha256sum -c SHA256SUMS.txt
```

</div>

---

## 5. What's changed

See [`CHANGELOG.md`](https://github.com/el9a7rawi/LockTab/blob/main/CHANGELOG.md) for the complete list of changes.

---

## 6. Source code and license

<p align="center">The tracked source code is attached below, and the project is licensed under <b>Apache-2.0</b> — free to use, modify, and share. Bundled fonts carry their own SIL OFL 1.1 notice in <code>fonts/OFL.txt</code>.</p>

---

<p align="center">Made with care ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE">Apache-2.0</a></p>
