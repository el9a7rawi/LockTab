/* ============================================================================
   LockTab — i18n.js
   Loads one locale bundle, sets document language and direction, and applies
   copy through textContent only. No dictionary value ever reaches innerHTML.
   ========================================================================== */

(function (global) {
  "use strict";

  const Core = global.LockTabCore;
  const SUPPORTED = Core.SUPPORTED_LOCALES;
  const RTL = Core.RTL_LOCALES;
  const FALLBACK = Core.FALLBACK_LOCALE;

  const state = {
    locale: FALLBACK,
    dir: "ltr",
    table: {},
    plurals: null,
  };

  /* Locale matching lives in core.js so the background resolves the same bundle
     for the overlay that the popup resolves for itself. */
  const matchLocale = Core.matchLocale;

  function interpolate(template, vars) {
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name) => {
      const value = vars[name];
      return value === undefined || value === null ? match : String(value);
    });
  }

  /**
   * Resolves `key`, trying the CLDR plural category first when a count is given.
   *
   * Arabic needs six categories and Russian four; writing a single "N minutes"
   * string would be wrong in both. `_other` is the documented fallback, so a
   * bundle may ship only the categories its language actually produces.
   */
  function t(key, vars) {
    const table = state.table;

    if (vars && typeof vars.n === "number" && state.plurals) {
      const category = state.plurals.select(vars.n);
      const pluralKey = key + "_" + category;
      if (table[pluralKey] !== undefined) return interpolate(table[pluralKey], vars);
      if (table[key + "_other"] !== undefined) return interpolate(table[key + "_other"], vars);
    }

    const value = table[key];
    if (value === undefined) return key;
    return interpolate(value, vars);
  }

  const isRtl = Core.isRtlLocale;

  function applyAttributes(element) {
    const spec = element.getAttribute("data-i18n-attr");
    if (!spec) return;
    for (const pair of spec.split(";")) {
      const separator = pair.indexOf(":");
      if (separator === -1) continue;
      const attribute = pair.slice(0, separator).trim();
      const key = pair.slice(separator + 1).trim();
      if (!attribute || !key) continue;
      element.setAttribute(attribute, t(key));
    }
  }

  /** Translates a subtree; safe to call again after the DOM changes. */
  function translate(root) {
    const scope = root || document;

    for (const element of scope.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.getAttribute("data-i18n"));
    }
    for (const element of scope.querySelectorAll("[data-i18n-attr]")) {
      applyAttributes(element);
    }
    return scope;
  }

  async function load(locale) {
    const resolved = matchLocale(locale);
    const url = global.chrome.runtime.getURL("locales/" + resolved + ".json");
    const response = await fetch(url);
    if (!response.ok) throw new Error("LockTab: locale bundle " + resolved + " is missing");
    const table = await response.json();

    state.locale = resolved;
    state.dir = isRtl(resolved) ? "rtl" : "ltr";
    state.table = table;
    state.plurals = new Intl.PluralRules(resolved);

    const root = document.documentElement;
    root.lang = resolved;
    root.dir = state.dir;

    return state;
  }

  /**
   * Reads the stored preference, loads the matching bundle, and translates the
   * static markup. The background writes an explicit code on first run and
   * after a reset; `auto` remains a defensive fallback for a missing value.
   */
  async function init() {
    let preference = "auto";
    try {
      const stored = await global.chrome.storage.local.get({ locale: "auto" });
      preference = stored.locale || "auto";
    } catch (_error) {
      preference = "auto";
    }

    const requested = preference === "auto" ? global.navigator.language : preference;
    await load(requested);
    translate(document);
    return state;
  }

  global.LockTabI18n = {
    SUPPORTED,
    RTL,
    matchLocale,
    isRtl,
    t,
    translate,
    load,
    init,
    get locale() {
      return state.locale;
    },
    get dir() {
      return state.dir;
    },
  };
})(typeof globalThis !== "undefined" ? globalThis : self);
