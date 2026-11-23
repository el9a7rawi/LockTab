/* ============================================================================
   LockTab — theme.js
   Applies the stored theme to <html> before the interface paints. The attribute
   lives on the root element so the popup backdrop is themed too, rather than
   framing a dark panel with a light page for one frame.
   ========================================================================== */

(function (global) {
  "use strict";

  const KEY = "theme";

  function normalize(theme) {
    return theme === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    const value = normalize(theme);
    document.documentElement.setAttribute("data-theme", value);
    return value;
  }

  function current() {
    return normalize(document.documentElement.getAttribute("data-theme"));
  }

  function boot() {
    return new Promise((resolve) => {
      chrome.storage.local.get({ theme: "light" }, (data) => {
        void chrome.runtime.lastError;
        resolve(apply(data && data.theme));
      });
    });
  }

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    apply(next);
    chrome.storage.local.set({ [KEY]: next }, () => void chrome.runtime.lastError);
    return next;
  }

  /* Runs while <head> is still parsing, so the attribute is set before the
     first paint of anything below it. */
  const ready =
    typeof document !== "undefined" && document.documentElement
      ? boot()
      : Promise.resolve("light");

  global.LockTabTheme = { KEY, boot, ready, apply, current, toggle };
})(typeof globalThis !== "undefined" ? globalThis : self);