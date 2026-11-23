# Bundled font

The extension ships one family so English and Arabic share the same typeface:

- **Cairo** (Latin + Arabic subsets) — variable weight 400–800.

`ui.css` declares the two `@font-face` rules with `unicode-range`, so the browser fetches only the subset it needs. The overlay injects the same declarations from `overlay.js` and the background adds them with the privileged `scripting.insertCSS` API for pages with a strict CSP.

Cairo is redistributed under the SIL Open Font License 1.1; the full licence and copyright notice are in `OFL.txt`, which ships with the extension.
