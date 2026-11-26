/* ============================================================================
   LockTab — core.js
   Pure policy logic: URL identity, PIN shape, lock-out arithmetic, recovery
   code formatting. Nothing here touches a browser API, so the module runs
   unchanged in the service worker, an extension page, the overlay, and a test
   harness.
   ========================================================================== */

(function (global) {
  "use strict";

  const PIN_MIN = 6;
  const PIN_MAX = 6;

  /* One representation for "no deadline": a plain number survives storage and
     JSON, unlike Infinity, and is far beyond any real clock value. */
  const FOREVER = Number.MAX_SAFE_INTEGER;

  /* I and O are absent alongside 0 and 1 so a code read off a screen cannot be
     mistyped into a different valid code. */
  const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const RECOVERY_LENGTH = 20;
  const RECOVERY_GROUP = 4;

  /* Offsets chosen so the first four typos cost seconds, not minutes: a mistyped
     digit is common, and a punishing first penalty trains people to disable the
     extension. The cap keeps a deliberate attacker under one attempt per 15 min. */
  const BACKOFF_SECONDS = { 5: 30, 6: 60, 7: 300 };
  const BACKOFF_CEILING = 900;
  const SOFT_ATTEMPT_LIMIT = 5;

  const AUTO_LOCK_OPTIONS = [0, 1, 5, 15, 30, 60];
  const AUTO_LOCK_DEFAULT = 5;

  const BLUR_OPTIONS = [4, 10, 20];
  const BLUR_DEFAULT = 10;

  /* Chrome rebinds commands in its own shortcuts page; extensions cannot set
     them programmatically. This is only the suggested default. */
  const LOCK_SHORTCUT = "Alt+Shift+L";

  const SUPPORTED_LOCALES = ["en", "es", "fr", "de", "pt-BR", "ru", "ar", "zh-CN"];
  const RTL_LOCALES = ["ar"];
  const FALLBACK_LOCALE = "en";

  /**
   * Extracts the stable identity of a page.
   *
   * The query string is dropped on purpose: campaign and session parameters
   * (`?utm_source`, `?fbclid`, `?ref`) change between visits, and a lock that a
   * redirect can shed is not a lock. The fragment is dropped for the same
   * reason. Only HTTP(S) has a meaningful identity here; internal browser
   * pages cannot be scripted, so they are reported as unsupported rather than
   * silently mis-keyed.
   *
   * @param {string} raw
   * @returns {{urlKey: string, origin: string, pathname: string, host: string} | null}
   */
  function normalizeUrl(raw) {
    if (typeof raw !== "string") return null;

    const trimmed = raw.trim();
    if (!trimmed) return null;

    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch (_error) {
      return null;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

    let pathname = parsed.pathname || "/";
    pathname = pathname.replace(/\/{2,}/g, "/");

    /* "/inbox" and "/inbox/" serve the same document on virtually every server;
       treating them as separate keys would let a redirect walk out of the lock. */
    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");
    if (!pathname) pathname = "/";

    /* A trailing dot in a hostname resolves to the same host, but would make a
       completely different storage key and walk straight out of a lock. */
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    const origin = parsed.protocol + "//" + host + (parsed.port ? ":" + parsed.port : "");

    return {
      urlKey: origin + pathname,
      origin,
      pathname,
      host,
    };
  }

  /**
   * Resolves the rule that governs a page.
   *
   * An exact match wins over an origin-wide rule so a single sensitive path can
   * be protected while the rest of the site stays open. Rules of scope `origin`
   * are stored under `origin + "/"`; that key is only consulted when it really
   * is origin-wide, otherwise a normal page rule would be read twice.
   *
   * @param {Record<string, object>} rules
   * @param {{urlKey: string, origin: string} | null} info
   */
  function findRule(rules, info) {
    if (!rules || !info) return null;

    if (Object.prototype.hasOwnProperty.call(rules, info.urlKey)) {
      return { rule: rules[info.urlKey], key: info.urlKey };
    }

    const originKey = info.origin + "/";
    if (originKey !== info.urlKey && Object.prototype.hasOwnProperty.call(rules, originKey)) {
      const wide = rules[originKey];
      if (wide && wide.scope === "origin") return { rule: wide, key: originKey };
    }

    return null;
  }

  /** The storage key a new rule must use for the chosen scope. */
  function ruleKeyFor(info, scope) {
    if (!info) return null;
    return scope === "origin" ? info.origin + "/" : info.urlKey;
  }

  /**
   * Turns the rule table into a display list for the popup.
   *
   * Rules are stored keyed by URL, so the host is already in the key and no
   * second index is needed. Malformed keys are skipped rather than rendered:
   * a bad record must never put arbitrary text on the interface.
   */
  function describeRules(rules) {
    if (!rules || typeof rules !== "object") return [];

    const sites = [];
    for (const entry of Object.entries(rules)) {
      const key = entry[0];
      const rule = entry[1];
      const info = normalizeUrl(key);
      if (!info || !rule || typeof rule !== "object") continue;

      sites.push({
        id: key,
        host: info.host,
        path: info.pathname === "/" ? "" : info.pathname,
        origin: info.origin,
        custom: Boolean(rule.pin),
        scope: rule.scope === "origin" ? "origin" : "path",
        createdAt: Number(rule.createdAt) || 0,
      });
    }

    sites.sort(
      (left, right) =>
        left.host.localeCompare(right.host) || left.path.localeCompare(right.path)
    );
    return sites;
  }

  function validatePin(value) {
    return typeof value === "string" && new RegExp("^[0-9]{" + PIN_MIN + "," + PIN_MAX + "}$").test(value);
  }

  /** Keeps only digits and caps the length, so paste and stray keys are safe. */
  function sanitizePin(raw) {
    return String(raw == null ? "" : raw).replace(/[^0-9]/g, "").slice(0, PIN_MAX);
  }

  function normalizeRecoveryInput(raw) {
    const cleaned = String(raw == null ? "" : raw)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    return cleaned;
  }

  function validateRecoveryCode(raw) {
    const code = normalizeRecoveryInput(raw);
    if (code.length !== RECOVERY_LENGTH) return false;
    for (const char of code) {
      if (RECOVERY_ALPHABET.indexOf(char) === -1) return false;
    }
    return true;
  }

  /** Groups the code so it can be read aloud and copied without losing a digit. */
  function formatRecoveryCode(raw) {
    const code = normalizeRecoveryInput(raw);
    const groups = [];
    for (let index = 0; index < code.length; index += RECOVERY_GROUP) {
      groups.push(code.slice(index, index + RECOVERY_GROUP));
    }
    return groups.join("-");
  }

  /**
   * Seconds the caller must wait after `failures` consecutive wrong PINs.
   * Zero means "try again immediately".
   */
  function backoffFor(failures) {
    if (!Number.isFinite(failures) || failures < SOFT_ATTEMPT_LIMIT) return 0;
    const over = Math.floor(failures) - SOFT_ATTEMPT_LIMIT + 1;
    const ladder = [BACKOFF_SECONDS[5], BACKOFF_SECONDS[6], BACKOFF_SECONDS[7]];
    const seconds = ladder[over - 1];
    return seconds === undefined ? BACKOFF_CEILING : Math.min(seconds, BACKOFF_CEILING);
  }

  /** Attempts the user still has before the first lock-out kicks in. */
  function remainingAttempts(failures) {
    if (!Number.isFinite(failures) || failures <= 0) return SOFT_ATTEMPT_LIMIT;
    return Math.max(0, SOFT_ATTEMPT_LIMIT - failures);
  }

  function clampAutoLock(minutes) {
    const value = Number(minutes);
    return AUTO_LOCK_OPTIONS.indexOf(value) === -1 ? AUTO_LOCK_DEFAULT : value;
  }

  /** Number of digit boxes to show while `length` digits are already entered. */
  function otpBoxCount(length, expected) {
    const max = Math.min(PIN_MAX, Math.max(1, Number(expected) || PIN_MAX));
    const used = Math.min(max, Math.max(0, Number(length) || 0));
    return Math.min(max, Math.max(1, used + 1));
  }

  function clampBlur(strength) {
    const value = Number(strength);
    return BLUR_OPTIONS.indexOf(value) === -1 ? BLUR_DEFAULT : value;
  }

  /**
   * Maps any BCP-47 tag onto a bundle we actually ship.
   *
   * Regional variants collapse onto the nearest bundle: `es-419` and `es-MX`
   * both read `es`, `pt-PT` reads `pt-BR` because it is the only Portuguese
   * bundle. An unrelated language falls back to English rather than showing a
   * half-translated interface.
   */
  function matchLocale(tag) {
    if (!tag || typeof tag !== "string") return FALLBACK_LOCALE;
    if (SUPPORTED_LOCALES.indexOf(tag) !== -1) return tag;

    const lower = tag.toLowerCase();
    for (const code of SUPPORTED_LOCALES) {
      const base = code.split("-")[0].toLowerCase();
      if (lower === base) return code;
      if (lower.indexOf(base + "-") === 0) return code;
    }
    return FALLBACK_LOCALE;
  }

  function isRtlLocale(locale) {
    return RTL_LOCALES.indexOf(locale) !== -1;
  }

  /**
   * Builds the storage scope for the attempt counter.
   *
   * The global PIN shares one counter across every site. A per-site counter
   * would let an attacker reset the ladder by opening a new tab, which is the
   * exact move a lock has to survive.
   */
  function attemptScope(urlKey, hasSitePin) {
    return hasSitePin ? "site:" + urlKey : "global";
  }

  /** mm:ss below an hour, h:mm:ss above it. Never negative. */
  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;
    const pad = (value) => String(value).padStart(2, "0");
    return hours > 0 ? hours + ":" + pad(minutes) + ":" + pad(rest) : minutes + ":" + pad(rest);
  }

  /** True while a temporary unlock is valid. The far-future marker means "until the tab closes". */
  function isUnlockActive(expiresAt, now) {
    if (!expiresAt) return false;
    if (expiresAt === FOREVER) return true;
    return Number(expiresAt) > (Number(now) || Date.now());
  }

  /* Chrome and Firefox deliver cross-extension messages on `onMessageExternal`,
     so `onMessage` normally only sees our own contexts. A renderer running our
     content script is still less trusted than the popup: classify the sender
     explicitly before any privileged action. */
  const POPUP_ACTIONS = [
    "SETUP_PIN",
    "CHANGE_PIN",
    "RESET_ALL",
    "GET_STATE",
    "LOCK_TAB",
    "UNLOCK_TAB",
    "REMOVE_LOCK",
    "SET_SITE_PIN",
    "USE_GLOBAL_PIN",
  ];
  const CONTENT_ACTIONS = ["PAGE_PING", "VERIFY_PIN", "RECOVER"];

  function messageScope(sender, ownId) {
    if (!sender || typeof sender !== "object") return "unknown";
    if (sender.id && ownId && sender.id !== ownId) return "foreign";
    if (sender.tab && typeof sender.tab.id === "number") return "content";
    if (sender.id && ownId && sender.id === ownId) return "popup";
    return "unknown";
  }

  function canHandle(scope, type) {
    if (scope === "popup") return POPUP_ACTIONS.indexOf(type) !== -1;
    if (scope === "content") return CONTENT_ACTIONS.indexOf(type) !== -1;
    return false;
  }

  /** Once a lockout has elapsed, keep only one remaining free mistake. */
  function decayAttempt(entry, now) {
    if (!entry || !entry.lockedUntil || entry.lockedUntil > now) return entry;
    return { count: Math.max(0, SOFT_ATTEMPT_LIMIT - 1), lockedUntil: 0 };
  }

  /** An unlock belongs to a URL, not to a tab, so drop it when no tab holds it. */
  function pruneUnlocked(unlocked, activeUrlKeys) {
    const active = new Set(activeUrlKeys || []);
    const kept = {};
    for (const key of Object.keys(unlocked || {})) {
      if (active.has(key)) kept[key] = unlocked[key];
    }
    return kept;
  }

  /** Storage is user-accessible; cap the derivation cost before using it. */
  function clampIterations(value) {
    const parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed) || parsed < 1) return 600000;
    return Math.min(parsed, 2000000);
  }

  /** Stringify only JSON-safe scalars; objects from a message must not become secrets. */
  function messageString(value) {
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return "";
  }

  const api = {
    PIN_MIN,
    PIN_MAX,
    RECOVERY_ALPHABET,
    RECOVERY_LENGTH,
    RECOVERY_GROUP,
    AUTO_LOCK_OPTIONS,
    AUTO_LOCK_DEFAULT,
    BLUR_OPTIONS,
    BLUR_DEFAULT,
    LOCK_SHORTCUT,
    SOFT_ATTEMPT_LIMIT,
    SUPPORTED_LOCALES,
    RTL_LOCALES,
    FALLBACK_LOCALE,
    normalizeUrl,
    findRule,
    ruleKeyFor,
    describeRules,
    validatePin,
    sanitizePin,
    normalizeRecoveryInput,
    validateRecoveryCode,
    formatRecoveryCode,
    backoffFor,
    remainingAttempts,
    clampAutoLock,
    otpBoxCount,
    FOREVER,
    clampBlur,
    matchLocale,
    isRtlLocale,
    attemptScope,
    formatDuration,
    isUnlockActive,
    messageScope,
    canHandle,
    decayAttempt,
    pruneUnlocked,
    messageString,
    clampIterations,
  };

  global.LockTabCore = api;
})(typeof globalThis !== "undefined" ? globalThis : self);
