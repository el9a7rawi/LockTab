/* ============================================================================
   LockTab — storage.js
   One place that knows the shape of persisted state. Callers never touch
   chrome.storage directly, so a schema change has a single edit site.
   ========================================================================== */

(function (global) {
  "use strict";

  const SCHEMA_VERSION = 1;

  const DEFAULT_SETTINGS = Object.freeze({
    autoLockMinutes: 5,
    showBadge: true,
    blurEnabled: false,
    blurStrength: 10,
  });

  const DEFAULTS = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    theme: "light",
    locale: "auto",
    globalPin: null,
    recovery: null,
    rules: {},
    attempts: {},
    unlocked: {},
    settings: DEFAULT_SETTINGS,
  });

  function area() {
    return global.chrome && global.chrome.storage && global.chrome.storage.local;
  }

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  /**
   * Reads the requested keys and fills any gap with the default.
   *
   * Settings are merged key by key rather than replaced: an install that predates
   * a new preference must keep its stored values and gain the new default, not
   * lose both.
   */
  async function get(keys) {
    const wanted = keys == null ? Object.keys(DEFAULTS) : [].concat(keys);
    const stored = await area().get(wanted);
    const result = {};

    for (const key of wanted) {
      const hasValue = Object.prototype.hasOwnProperty.call(stored, key) && stored[key] !== undefined;
      if (hasValue) {
        result[key] = clone(stored[key]);
      } else {
        result[key] = clone(DEFAULTS[key]);
      }
    }

    if (Object.prototype.hasOwnProperty.call(result, "settings")) {
      result.settings = Object.assign({}, DEFAULT_SETTINGS, result.settings || {});
    }

    return result;
  }

  async function set(patch) {
    await area().set(patch);
    return patch;
  }

  /** Wipes policy state but keeps presentation choices, which are not secrets. */
  async function clearPolicy() {
    const current = await get(["theme", "locale"]);
    await area().clear();
    await area().set({
      schemaVersion: SCHEMA_VERSION,
      theme: current.theme,
      locale: current.locale,
      settings: clone(DEFAULT_SETTINGS),
    });
  }

  /**
   * Serialises read-modify-write sequences.
   *
   * Two rapid unlock taps would otherwise both read the attempt counter, both
   * increment it to the same value, and hand an attacker one free try per
   * double-click.
   */
  let tail = Promise.resolve();

  function exclusive(task) {
    const run = tail.then(task, task);
    tail = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  global.LockTabStorage = {
    SCHEMA_VERSION,
    DEFAULT_SETTINGS,
    DEFAULTS,
    get,
    set,
    clearPolicy,
    exclusive,
  };
})(typeof globalThis !== "undefined" ? globalThis : self);
