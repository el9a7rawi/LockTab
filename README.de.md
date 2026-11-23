# LockTab

[![Version](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![Lizenz: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)

**Deine Tabs, hinter einer PIN.**

LockTab ist eine kleine Offline-Erweiterung, die jeden Tab hinter einer 6-stelligen PIN verbirgt.
Lege eine globale PIN fest, gib einer sensiblen Seite bei Bedarf eine eigene, und verlasse deinen
Platz ohne nachzudenken.

> In einer anderen Sprache lesen: [English](README.md) · [Español](README.es.md) · [Français](README.fr.md) ·
> [Português (Brasil)](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md) ·
> [简体中文](README.zh-CN.md)

## Warum LockTab

- **Die Seite wird wirklich verdeckt.** Eine Ebene mit geschlossener Shadow-Root überdeckt den Inhalt,
  hält den Fokus und sperrt das Scrollen. Entfernt die Seite sie, kommt sie zurück.
- **Kein Geheimnis im Klartext.** Die PIN wird mit PBKDF2-HMAC-SHA256 abgeleitet (600.000 Iterationen,
  einzigartiges 16-Byte-Salz). Gespeichert wird nur der Hash — auf deinem Gerät.
- **Das Popup ist kein Umweg.** Jede Aktion, die den Zugriff erweitert, fragt erneut nach der PIN.
- **Ein gemeinsamer Zähler.** Fehlversuche führen zu 30 s → 60 s → 300 s → 900 s Sperre. Ein anderer
  Tab setzt den Zähler bei globaler PIN nicht zurück.
- **Wiederherstellung ohne Server.** Beim Einrichten erscheint ein Einmalcode. Er wird beim Verwenden
  verbraucht und löscht alle Sperren.
- **Privat von Grund auf.** Kein Konto, keine Telemetrie, kein externer Code, keine Netzwerkaufrufe.

## Installation

### Chrome, Edge, Brave und Opera

1. Lade `locktab-chrome-1.0.1.zip` aus [Releases](https://github.com/el9a7rawi/LockTab/releases) herunter.
2. Entpacke die Datei in einen Ordner.
3. Öffne `chrome://extensions` und aktiviere den **Entwicklermodus**.
4. Klicke auf **Entpackte Erweiterung laden** und wähle den entpackten Ordner.

### Firefox 121+

1. Lade `locktab-firefox-1.0.1.zip` aus [Releases](https://github.com/el9a7rawi/LockTab/releases) herunter.
2. Entpacke die Datei in einen Ordner.
3. Öffne `about:debugging#/runtime/this-firefox` und wähle **Temporäres Add-on laden**.
4. Wähle `manifest.json` im entpackten Ordner.

## Verwendung

1. Klicke auf das LockTab-Symbol. Beim ersten Start legst du eine PIN fest (6 Ziffern).
2. **Speichere den Wiederherstellungscode** — er wird nur einmal angezeigt.
3. Öffne den zu schützenden Tab, klicke auf das Symbol und wähle **Diesen Tab sperren**.
4. Zum Weiterlesen gib die PIN in der Ebene ein. Das Popup bietet **Kurzzeitig öffnen** und
   **Sperre entfernen**; beide fragen vorher nach der PIN.
5. Optional kannst du über die Karte **PIN für diese Website** eine eigene PIN festlegen.

Im Popup befinden sich außerdem Theme, Sprache, Entsperrdauer, Zähler am Symbol, PIN-Änderung und
Komplett-Reset.

## Sicherheitsmodell

| Entscheidung | Grund |
| --- | --- |
| Die Prüfung findet ausschließlich im Hintergrund statt | Ein Content Script läuft in einer vom Web beeinflussbaren Seite und sieht nie Hash, Salz oder Zähler. |
| Query und Fragment werden ignoriert | Eine Weiterleitung darf die Sperre nicht durch `?utm_source=…` verlieren. |
| Die Ebene nutzt eine geschlossene Shadow-Root | Die Gastseite kann die Sperroberfläche weder lesen noch gestalten. |
| Versuche werden seriell geschrieben | Zwei gleichzeitige Klicks schenken keinen zusätzlichen Versuch. |
| Temporäre Entsperrungen werden beim Start gelöscht | Browser schließen gilt als Verlassen des Platzes. |

LockTab verbirgt eine Seite vor jemandem an deinem Gerät. Es ist keine Festplattenverschlüsselung und
schützt nicht vor einem kompromittierten Browser oder einem Administrator, der die Erweiterung entfernt.

Die vollständige Datenschutzerklärung steht in [privacy.html](privacy.html).

## Sprachen

English, Español, Français, Deutsch, Português (Brasil), Русский, العربية (RTL) und 简体中文. Die
Oberfläche folgt der Browsersprache und kann im Popup überschrieben werden.

## Aus Quellen bauen

```bash
python tools/build.py          # prüft die Sprachdateien und erstellt beide ZIPs
node --test tests/core.test.mjs
```

Kein Bundler, keine npm-Abhängigkeiten.

## Unterstützung

Wenn LockTab dir eine peinliche Situation erspart hat, kannst du das Projekt unterstützen:

- PayPal: <https://paypal.me/27medYousry>
- InstaPay: <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## Lizenz

Apache-2.0 © Ahmed Yousry

Mit Sorgfalt gemacht ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)
