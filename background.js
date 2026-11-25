/* ============================================================================
   LockTab — background.js
   The only context that sees a PIN hash. Everything that decides whether a tab
   is allowed to be read happens here; the overlay and the popup are dumb
   clients that can ask a yes/no question and nothing more.

   Loaded as a service worker on Chromium and as an event page on Firefox, so
   nothing in this file may touch the DOM.
   ========================================================================== */

if (typeof importScripts === "function") {
  importScripts("core.js", "crypto.js", "storage.js");
}

(function (global) {
  "use strict";

  const api = global.chrome;
  const Core = global.LockTabCore;
  const Crypto = global.LockTabCrypto;
  const Store = global.LockTabStorage;

  const SWEEP_ALARM = "locktab-sweep";
  const BADGE_COLOR = "#4f46e5";
  const BADGE_TEXT_COLOR = "#ffffff";

  /* The overlay is handed a translated subset instead of loading a bundle
     itself. That keeps `locales/` out of `web_accessible_resources`, so no page
     can read our dictionaries or fingerprint the extension by fetching them. */
  const OVERLAY_KEYS = [
    "lockHeading",
    "lockSubtitle",
    "pinLabel",
    "pinMoreHint",
    "unlock",
    "verifying",
    "attemptsLabel",
    "pinWrong",
    "retryIn",
    "useRecovery",
    "recoveryHeading",
    "recoverySubtitle",
    "recoveryPlaceholder",
    "recoveryInvalid",
    "recoveryUsed",
    "recoveryPrompt",
    "errorGeneric",
    "cancel",
  ];

  /* tabId -> urlKey. A cache, never the source of truth: every decision reads
     the live tab record, so a stale entry can slow us down but never widen a
     lock. */
  const tabUrlKey = new Map();

  /**
   * Bridges the callback and promise flavours of the extension APIs.
   *
   * Chromium resolves these calls with a promise, Firefox's `chrome` namespace
   * does not, and the same file must run on both. Passing a callback is accepted
   * by both engines, so the callback is always the settle path and a returned
   * thenable is merely an alternative.
   */
  function call(invoke) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      const fail = (error) => {
        if (settled) return;
        settled = true;
        reject(error);
      };
      const settleFromApi = (value) => {
        const lastError = api.runtime && api.runtime.lastError;
        if (lastError) fail(new Error(lastError.message));
        else done(value);
      };

      let maybe;
      try {
        maybe = invoke(settleFromApi);
      } catch (error) {
        fail(error);
        return;
      }
      if (maybe && typeof maybe.then === "function") maybe.then(done, fail);
    });
  }

  function getTab(tabId) {
    return call((done) => api.tabs.get(tabId, done));
  }

  /** Returns false instead of hiding a failed delivery: the caller can retry. */
  function sendToTab(tabId, message) {
    return call((done) => api.tabs.sendMessage(tabId, message, done))
      .then(() => true)
      .catch(() => false);
  }

  /** A tab may still run a stale content script after an extension reload. */
  async function ensureContentScript(tabId) {
    if (!api.scripting || !api.scripting.executeScript) return false;
    const injected = await call((done) =>
      api.scripting.executeScript(
        {
          target: { tabId },
          files: ["core.js", "pin.js", "overlay.js"],
          injectImmediately: true,
        },
        done
      )
    ).catch(() => false);
    return injected !== false;
  }

  function queryTabs(query) {
    return call((done) => api.tabs.query(query, done));
  }

  /**
   * Resolves the page identity from the browser's own record of the sender.
   * At document_start `sender.tab.url` can still be the previous document, so
   * prefer the content script's own document URL whenever it is a real page.
   */
  function senderPageInfo(sender) {
    const tabUrl = (sender && sender.tab && sender.tab.url) || "";
    const docUrl = (sender && sender.url) || "";
    const tabInfo = Core.normalizeUrl(tabUrl);
    const docInfo = Core.normalizeUrl(docUrl);
    return docInfo ? { url: docUrl, info: docInfo } : { url: tabUrl, info: tabInfo };
  }

  async function readState() {
    return Store.get(["globalPin", "recovery", "rules", "attempts", "unlocked", "settings", "locale"]);
  }

  function isUnlocked(data, urlKey) {
    return Core.isUnlockActive(data.unlocked[urlKey], Date.now());
  }

  /**
   * Length of the PIN that governs a page. Older records have no length, so
   * they fall back to the maximum instead of breaking the input row.
   */
  function pinLengthFor(data, info) {
    const found = Core.findRule(data.rules, info);
    const record = found && found.rule && found.rule.pin ? found.rule.pin : data.globalPin;
    return record && record.length ? record.length : Core.PIN_MAX;
  }

  /** What a tab is allowed to know: a verdict, never the material behind it. */
  function policyFor(data, info) {
    const found = Core.findRule(data.rules, info);
    if (!found) return { locked: false, urlKey: info.urlKey, host: info.host };

    if (isUnlocked(data, info.urlKey)) {
      return {
        locked: false,
        urlKey: info.urlKey,
        host: info.host,
        unlockedUntil: data.unlocked[info.urlKey],
      };
    }

    const hasSitePin = Boolean(found.rule && found.rule.pin);
    const scope = Core.attemptScope(found.key, hasSitePin);
    const now = Date.now();
    const attempt = Core.decayAttempt(data.attempts[scope] || { count: 0, lockedUntil: 0 }, now);

    return {
      locked: true,
      urlKey: info.urlKey,
      host: info.host,
      custom: hasSitePin,
      lockedUntil: attempt.lockedUntil || 0,
      remaining: Core.remainingAttempts(attempt.count),
    };
  }

  async function pushPolicy(tabId) {
    const [tab, data] = await Promise.all([getTab(tabId), readState()]).catch(() => [null, null]);
    if (!tab || !data) return false;

    const info = Core.normalizeUrl(tab.url);
    if (!info) {
      return sendToTab(tabId, { type: "POLICY", locked: false, urlKey: null });
    }

    tabUrlKey.set(tabId, info.urlKey);
    ensureLockFonts(tabId);
    const payload = await policyPayload(data, info, tab.url);

    if (await sendToTab(tabId, payload)) return true;
    /* The tab may be running the previous overlay build. Let it release its
       listeners and install flag first, then re-inject once and retry. */
    await call((done) =>
      api.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            if (window.__locktabReinit) window.__locktabReinit();
          },
        },
        done
      )
    ).catch(() => undefined);
    if (await ensureContentScript(tabId)) {
      if (await sendToTab(tabId, payload)) return true;
    }
    /* An unreachable tab keeps whatever gate it already has. Reloading here
       would wipe form state on every SPA route change, which Chrome reports
       through tabs.onUpdated as an ordinary URL change. Explicit callers turn
       the false result into content_unavailable; passive ones simply move on. */
    return false;
  }

  /* --------------------------------------------------------------------------
     Overlay copy
     ------------------------------------------------------------------------ */
  const stringsCache = new Map();

  async function overlayLocale() {
    const data = await Store.get(["locale"]);
    const preference = data.locale || "auto";
    const tag =
      preference === "auto"
        ? (api.i18n && api.i18n.getUILanguage ? api.i18n.getUILanguage() : "en")
        : preference;
    return Core.matchLocale(tag);
  }

  let englishTable = null;

  async function englishStrings() {
    if (!englishTable) {
      const response = await fetch(api.runtime.getURL("locales/en.json"));
      englishTable = await response.json();
    }
    return englishTable;
  }

  async function overlayStrings() {
    const locale = await overlayLocale();
    const cached = stringsCache.get(locale);
    if (cached) return cached;

    const response = await fetch(api.runtime.getURL("locales/" + locale + ".json"));
    const table = await response.json();
    /* A missing key falls back to the English bundle, never to the raw key:
       users must not see `pinMoreHint` written on the lock screen. */
    const english = locale === "en" ? table : await englishStrings();
    const strings = {};
    for (const key of OVERLAY_KEYS) {
      strings[key] = table[key] !== undefined ? table[key] : english[key] !== undefined ? english[key] : key;
    }

    const bundle = {
      locale,
      dir: Core.isRtlLocale(locale) ? "rtl" : "ltr",
      strings,
    };
    stringsCache.set(locale, bundle);
    return bundle;
  }

  async function policyPayload(data, info, pageUrl) {
    const [verdict, copy] = await Promise.all([policyFor(data, info), overlayStrings()]);
    const settings = data.settings || {};
    return Object.assign(
      {
        type: "POLICY",
        blur: settings.blurEnabled ? Core.clampBlur(settings.blurStrength) : 0,
        pageUrl: pageUrl || info.urlKey,
      },
      verdict,
      copy
    );
  }

  /** Resolves the browser language onto a bundle we actually ship. */
  function detectLocale() {
    const tag = api.i18n && api.i18n.getUILanguage ? api.i18n.getUILanguage() : "en";
    return Core.matchLocale(tag);
  }

  /* Pages with a strict CSP can refuse fonts declared from a content script's
     shadow tree. Injecting the same @font-face rules through the privileged
     scripting API makes Cairo load for the lock screen on those pages too. */
  const FONT_CSS = ["cairo-latin.woff2", "cairo-arabic.woff2"]
    .map(
      (file, index) =>
        '@font-face{font-family:"Cairo";font-style:normal;font-weight:400 800;' +
        `font-display:swap;src:url("${api.runtime.getURL("fonts/" + file)}") format("woff2");` +
        `unicode-range:${index === 0 ? "U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+20AC, U+2122, U+FEFF" : "U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFC"};}`
    )
    .join("\n");
  const styledTabs = new Set();

  function ensureLockFonts(tabId) {
    if (!api.scripting || !api.scripting.insertCSS || !tabId || styledTabs.has(tabId)) return;
    /* `origin` accepts AUTHOR/USER; "MAIN" belongs to executeScript and would
       make this call fail every time. Track the tab only after a real success. */
    call((done) => api.scripting.insertCSS({ target: { tabId }, css: FONT_CSS }, done))
      .then(() => styledTabs.add(tabId))
      .catch(() => undefined);
  }

  /* --------------------------------------------------------------------------
     Badge
     ------------------------------------------------------------------------ */
  /* A service worker can be stopped before a timer fires, so refresh directly. */
  function scheduleBadgeRefresh() {
    refreshBadge().catch(() => undefined);
  }

  async function refreshBadge() {
    if (!api.action) return;
    const data = await readState();
    if (!data.settings.showBadge) {
      await call((done) => api.action.setBadgeText({ text: "" }, done)).catch(() => undefined);
      return;
    }

    const tabs = await queryTabs({});
    let count = 0;
    for (const tab of tabs) {
      /* The map is already maintained by onUpdated; avoid re-parsing URLs. */
      const info = Core.normalizeUrl(tabUrlKey.get(tab.id) || tab.url);
      if (info && Core.findRule(data.rules, info)) count += 1;
    }

    const text = count > 0 ? String(count) : "";
    await call((done) => api.action.setBadgeText({ text }, done)).catch(() => undefined);
    if (count > 0) {
      await call((done) => api.action.setBadgeBackgroundColor({ color: BADGE_COLOR }, done)).catch(
        () => undefined
      );
      if (api.action.setBadgeTextColor) {
        await call((done) =>
          api.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR }, done)
        ).catch(() => undefined);
      }
    }
    if (api.action.setTitle) {
      const title = count > 0 ? `LockTab — ${count}` : "LockTab";
      await call((done) => api.action.setTitle({ title }, done)).catch(() => undefined);
    }
  }

  /* --------------------------------------------------------------------------
     Attempts and verification
     ------------------------------------------------------------------------ */

  /**
   * Checks a PIN against the secret that governs `info`, then records the
   * outcome.
   *
   * The whole read-verify-write sequence runs inside one exclusive slot. Two
   * concurrent guesses would otherwise read the same counter, both write the
   * same increment, and buy an attacker a free try per double click. Deriving
   * the key inside the slot costs a little latency and removes that class of
   * bug entirely.
   */
  function verifyPin(info, pin) {
    return Store.exclusive(async () => {
      const data = await readState();

      if (!data.globalPin) return { ok: false, error: "no_pin" };

      const found = Core.findRule(data.rules, info);
      const hasSitePin = Boolean(found && found.rule && found.rule.pin);
      const scope = Core.attemptScope(found ? found.key : info.urlKey, hasSitePin);
      const now = Date.now();
      /* A served lockout is a fresh start for the user; keeping the old count
         would lock them out again on the very next typo, forever. */
      const entry = Core.decayAttempt(data.attempts[scope] || { count: 0, lockedUntil: 0 }, now);

      if (entry.lockedUntil && entry.lockedUntil > now) {
        return {
          ok: false,
          error: "locked_out",
          retryAfterMs: entry.lockedUntil - now,
          remaining: 0,
        };
      }

      const secret = hasSitePin ? found.rule.pin : data.globalPin;
      const accepted = Core.validatePin(pin) && (await Crypto.verifySecret(pin, secret));

      const attempts = Object.assign({}, data.attempts);

      if (accepted) {
        delete attempts[scope];
        const minutes = Core.clampAutoLock(data.settings.autoLockMinutes);
        const expiresAt = minutes === 0 ? Number.MAX_SAFE_INTEGER : now + minutes * 60000;
        const unlocked = Object.assign({}, data.unlocked, { [info.urlKey]: expiresAt });
        await Store.set({ attempts, unlocked });
        return { ok: true, unlockedUntil: expiresAt };
      }

      const next = { count: (entry.count || 0) + 1, lockedUntil: 0 };
      const backoff = Core.backoffFor(next.count);
      next.lockedUntil = backoff > 0 ? now + backoff * 1000 : 0;
      attempts[scope] = next;
      await Store.set({ attempts });

      return {
        ok: false,
        error: "wrong_pin",
        remaining: Core.remainingAttempts(next.count),
        retryAfterMs: next.lockedUntil ? next.lockedUntil - now : 0,
      };
    });
  }

  /* --------------------------------------------------------------------------
     Policy mutations
     ------------------------------------------------------------------------ */
  async function lockTab(tabId) {
    const tab = await getTab(tabId);
    const info = Core.normalizeUrl(tab && tab.url);
    if (!info) return { ok: false, error: "not_lockable" };

    /* Two lock actions on different tabs can arrive together. The read and the
       write must share one slot or the second overwrites the first rule. */
    const result = await Store.exclusive(async () => {
      const data = await readState();
      if (!data.globalPin) return { ok: false, error: "no_pin" };

      /* Re-locking a page that already has a rule must not rewrite it: a page
         holding its own PIN would silently fall back to the global one. */
      const rules = Object.assign({}, data.rules);
      if (!Core.findRule(data.rules, info)) {
        rules[Core.ruleKeyFor(info, "path")] = {
          mode: "inherit",
          scope: "path",
          createdAt: Date.now(),
        };
      }
      /* A rule added while an old unlock is live would look applied but stay
         readable, so the unlock is dropped with it. */
      const unlocked = Object.assign({}, data.unlocked);
      delete unlocked[info.urlKey];

      await Store.set({ rules, unlocked });
      return { ok: true, urlKey: info.urlKey, host: info.host };
    });

    if (!result.ok) return result;
    tabUrlKey.set(tabId, info.urlKey);
    const delivered = await pushPolicy(tabId);
    scheduleBadgeRefresh();
    if (!delivered) return { ok: false, error: "content_unavailable" };
    return { ok: true, urlKey: info.urlKey, host: info.host };
  }

  async function removeLock(tabId, pin) {
    const tab = await getTab(tabId);
    const info = Core.normalizeUrl(tab.url);
    if (!info) return { ok: false, error: "not_lockable" };

    /* Verification owns its own storage slot; never nest exclusive calls. */
    const current = await readState();
    if (!Core.findRule(current.rules, info)) return { ok: true };
    const verified = await verifyPin(info, pin);
    if (!verified.ok) return verified;

    await Store.exclusive(async () => {
      const data = await readState();
      const found = Core.findRule(data.rules, info);
      if (!found) return;
      const rules = Object.assign({}, data.rules);
      delete rules[found.key];
      const unlocked = Object.assign({}, data.unlocked);
      delete unlocked[info.urlKey];
      delete unlocked[found.key];
      /* The per-site attempt counter belongs to the rule being removed. */
      const attempts = Object.assign({}, data.attempts);
      delete attempts["site:" + found.key];
      await Store.set({ rules, unlocked, attempts });
    });

    await pushPolicy(tabId);
    scheduleBadgeRefresh();
    return { ok: true };
  }

  /**
   * A per-site PIN is an override of the main secret, so the first box in the
   * popup proves ownership of the main secret — never the site's previous PIN.
   * Verification and the write share one exclusive slot: two open popups must
   * not both validate against the same hash and then both replace the rule.
   */
  async function setSitePin(tabId, pin, current) {
    const tab = await getTab(tabId);
    const info = Core.normalizeUrl(tab && tab.url);
    if (!info) return { ok: false, error: "not_lockable" };
    if (!Core.validatePin(pin)) return { ok: false, error: "invalid_pin" };

    const result = await Store.exclusive(async () => {
      const data = await readState();
      if (!data.globalPin) return { ok: false, error: "no_pin" };
      /* Deliberately not verifyPin(): that also grants a temporary unlock and
         records lock-screen attempts, neither of which belongs to an admin
         action taken from the popup. */
      if (!(await Crypto.verifySecret(Core.messageString(current), data.globalPin))) {
        return { ok: false, error: "wrong_pin" };
      }

      const record = await Crypto.createSecret(pin);
      const key = Core.ruleKeyFor(info, "path");
      const existing = data.rules[key] || { mode: "inherit", scope: "path", createdAt: Date.now() };
      const rules = Object.assign({}, data.rules, {
        [key]: Object.assign({}, existing, { mode: "custom", scope: "path", pin: record }),
      });
      /* A site PIN is a lock: an old temporary pass must not keep it readable. */
      const unlocked = Object.assign({}, data.unlocked);
      delete unlocked[info.urlKey];
      await Store.set({ rules, unlocked });
      return { ok: true };
    });
    if (!result.ok) return result;

    const delivered = await pushPolicy(tabId);
    scheduleBadgeRefresh();
    if (!delivered) return { ok: false, error: "content_unavailable" };
    return { ok: true };
  }

  /** The same first box authorises both site-PIN modes: it is the main secret. */
  async function useGlobalPin(tabId, current) {
    const tab = await getTab(tabId);
    const info = Core.normalizeUrl(tab && tab.url);
    if (!info) return { ok: false, error: "not_lockable" };

    return Store.exclusive(async () => {
      const data = await readState();
      if (!data.globalPin) return { ok: false, error: "no_pin" };
      if (!(await Crypto.verifySecret(Core.messageString(current), data.globalPin))) {
        return { ok: false, error: "wrong_pin" };
      }

      const rule = Core.findRule(data.rules, info);
      if (!rule) return { ok: true };
      const rules = Object.assign({}, data.rules, {
        [rule.key]: {
          mode: "inherit",
          scope: "path",
          createdAt: rule.rule.createdAt || Date.now(),
        },
      });
      const attempts = Object.assign({}, data.attempts);
      delete attempts["site:" + rule.key];
      await Store.set({ rules, attempts });
      return { ok: true };
    });
  }

  /**
   * Installs a brand new global PIN and mints the recovery code that goes with
   * it. The code is returned once and only its hash is persisted, so a later
   * reader of storage cannot reconstruct it.
   */
  async function installPin(pin) {
    if (!Core.validatePin(pin)) return { ok: false, error: "invalid_pin" };

    const pinRecord = await Crypto.createSecret(pin);
    const recoveryCode = Crypto.createRecoveryCode();
    const recoveryRecord = await Crypto.createSecret(recoveryCode);

    await Store.set({
      globalPin: pinRecord,
      recovery: Object.assign({}, recoveryRecord, { usedAt: 0 }),
      attempts: {},
      unlocked: {},
    });

    scheduleBadgeRefresh();
    return { ok: true, recoveryCode: Core.formatRecoveryCode(recoveryCode) };
  }

  async function changePin(current, next) {
    /* The first box proves ownership of the old secret and the second becomes
       the new one; validate both at the boundary before touching storage. */
    if (!Core.validatePin(current) || !Core.validatePin(next)) {
      return { ok: false, error: "invalid_pin" };
    }

    /* Verification and installation share one slot: two concurrent changes
       must not both pass against the same old hash and return different codes. */
    return Store.exclusive(async () => {
      const data = await readState();
      if (!data.globalPin) return { ok: false, error: "no_pin" };
      const accepted = await Crypto.verifySecret(current, data.globalPin);
      if (!accepted) return { ok: false, error: "wrong_pin" };
      return installPin(next);
    });
  }

  /**
   * Consumes the recovery code.
   *
   * Recovery has to actually restore access, so it clears every PIN and every
   * lock and leaves the user in the first-run state where a new PIN is set.
   * Preferences stay untouched: they are not secrets. The code is destroyed,
   * so it cannot be replayed after a new PIN exists.
   */
  async function recover(code) {
    const normalized = Core.normalizeRecoveryInput(code);
    if (!Core.validateRecoveryCode(normalized)) return { ok: false, error: "invalid_code" };

    /* Verification and consumption must occupy the same slot. Splitting them
       would let a second recovery request verify against a code that the first
       request is about to destroy, and both would report success. */
    return Store.exclusive(async () => {
      const data = await readState();
      if (!data.recovery) return { ok: false, error: "no_recovery" };
      if (data.recovery.usedAt) return { ok: false, error: "recovery_used" };

      const accepted = await Crypto.verifySecret(normalized, data.recovery);
      if (!accepted) return { ok: false, error: "invalid_code" };

      await Store.set({
        globalPin: null,
        recovery: null,
        rules: {},
        attempts: {},
        unlocked: {},
      });

      scheduleBadgeRefresh();
      /* Other locked tabs would stay visually covered until reloaded. */
      await broadcastPolicy();
      return { ok: true };
    });
  }

  /* --------------------------------------------------------------------------
     Sender-facing state
     ------------------------------------------------------------------------ */
  async function popupState(tabId) {
    const data = await readState();
    const tab = tabId ? await getTab(tabId).catch(() => null) : null;
    const info = Core.normalizeUrl(tab && tab.url);

    const base = {
      hasPin: Boolean(data.globalPin),
      settings: data.settings,
      locale: data.locale || "auto",
      lockable: Boolean(info),
      urlKey: info ? info.urlKey : null,
      host: info ? info.host : null,
      lockedSites: Core.describeRules(data.rules),
      pinLength: info ? pinLengthFor(data, info) : Core.PIN_MAX,
    };

    if (!info) return Object.assign(base, { state: "unsupported", policy: { locked: false } });

    const policy = policyFor(data, info);
    const found = Core.findRule(data.rules, info);
    const hasSitePin = Boolean(found && found.rule && found.rule.pin);

    let state = "none";
    if (policy.locked) state = found ? "locked" : "none";
    else if (found) state = "temp";
    if (!data.globalPin) state = "none";

    return Object.assign(base, {
      state,
      custom: hasSitePin,
      hasRule: Boolean(found),
      unlockedUntil: data.unlocked[info.urlKey] || 0,
      remaining: policy.remaining === undefined ? null : policy.remaining,
      lockedUntil: policy.lockedUntil || 0,
    });
  }

  /* --------------------------------------------------------------------------
     Message router
     ------------------------------------------------------------------------ */
  /**
   * Page identity always comes from the browser's record of the sender, never
   * from a field in the message. Only the popup passes an explicit tabId.
   */
  async function targetInfo(message, sender, fromContentScript) {
    if (fromContentScript) return senderPageInfo(sender).info;
    const tab = message.tabId ? await getTab(message.tabId).catch(() => null) : null;
    return tab ? Core.normalizeUrl(tab.url) : null;
  }

  async function handle(message, sender, scope) {
    const type = message && message.type;
    const fromContentScript = scope === "content";

    switch (type) {
      case "PAGE_PING": {
        const { url, info } = senderPageInfo(sender);
        if (!info) return { type: "POLICY", locked: false, urlKey: null, url };
        const data = await readState();
        tabUrlKey.set(sender.tab.id, info.urlKey);
        ensureLockFonts(sender.tab.id);
        const payload = await policyPayload(data, info, url);
        payload.hasPin = Boolean(data.globalPin);
        payload.pinLength = pinLengthFor(data, info);
        return payload;
      }

      case "VERIFY_PIN": {
        const info = await targetInfo(message, sender, fromContentScript);
        if (!info) return { ok: false, error: "not_lockable" };
        return verifyPin(info, Core.messageString(message.pin));
      }

      case "RECOVER": {
        const info = await targetInfo(message, sender, fromContentScript);
        if (!info) return { ok: false, error: "not_lockable" };
        const result = await recover(Core.messageString(message.code));
        /* Recovery clears the rules, so the reload rebuilds the page with no
           gate. Only a content script needs it; the popup navigates nowhere. */
        if (result.ok && fromContentScript) {
          await pushPolicy(sender.tab.id);
          await call((done) => api.tabs.reload(sender.tab.id, {}, done)).catch(() => undefined);
        }
        return result;
      }

      case "GET_STATE":
        return popupState(message.tabId);
      case "LOCK_TAB":
        return lockTab(message.tabId);
      case "UNLOCK_TAB": {
        const tab = await getTab(message.tabId).catch(() => null);
        const info = Core.normalizeUrl(tab && tab.url);
        if (!info) return { ok: false, error: "not_lockable" };
        const result = await verifyPin(info, Core.messageString(message.pin));
        if (result.ok) await pushPolicy(message.tabId);
        return result;
      }
      case "REMOVE_LOCK":
        return removeLock(message.tabId, Core.messageString(message.pin));
      case "SET_SITE_PIN":
        return setSitePin(message.tabId, Core.messageString(message.pin), Core.messageString(message.current));
      case "USE_GLOBAL_PIN":
        return useGlobalPin(message.tabId, Core.messageString(message.current));
      case "SETUP_PIN":
        /* First run only. Guard and write share one slot so two simultaneous
           attempts cannot both pass the check. */
        return Store.exclusive(async () => {
          const current = await Store.get(["globalPin"]);
          if (current.globalPin) return { ok: false, error: "already_setup" };
          return installPin(Core.messageString(message.pin));
        });
      case "CHANGE_PIN":
        return changePin(Core.messageString(message.current), Core.messageString(message.next));
      case "RESET_ALL":
        await Store.clearPolicy();
        /* A reset is a fresh start: detect the browser language once again
           instead of leaving the user with the previous explicit choice. */
        await Store.set({ locale: detectLocale() });
        stringsCache.clear();
        await broadcastPolicy();
        scheduleBadgeRefresh();
        return { ok: true };
      default:
        return { ok: false, error: "unknown_message" };
    }
  }

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    /* `onMessageExternal` is the cross-extension channel, so this listener
       normally sees only our own contexts. A compromised renderer can still
       forge content-script messages, hence the explicit scope check. */
    const scope = Core.messageScope(sender, api.runtime && api.runtime.id);
    const type = message && message.type;
    if (!Core.canHandle(scope, type)) {
      sendResponse({ ok: false, error: "unauthorized" });
      return;
    }

    handle(message, sender, scope)
      .then((result) => sendResponse(result || { ok: false }))
      .catch((_error) => sendResponse({ ok: false, error: "internal" }));
    return true;
  });

  /* The popup writes presentation preferences straight to storage; the badge and
     the cached overlay copy follow those writes instead of duplicating a message
     type for every toggle. */
  if (api.storage && api.storage.onChanged) {
    api.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      if (changes.locale) {
        stringsCache.clear();
        broadcastPolicy().catch(() => undefined);
      }
      if (changes.settings) {
        const before = changes.settings.oldValue || {};
        const after = changes.settings.newValue || {};
        const overlayKeys = ["blurEnabled", "blurStrength", "autoLockMinutes"];
        if (overlayKeys.some((key) => before[key] !== after[key])) {
          broadcastPolicy().catch(() => undefined);
        }
        if (before.autoLockMinutes !== after.autoLockMinutes) {
          /* The popup writes this preference directly, so the background has to
             reschedule unlocks itself: leaving an old expiry in place means a
             shorter setting never takes effect and a longer one can cut a tab
             off at the previous deadline. */
          rescheduleUnlocks(
            Core.clampAutoLock(before.autoLockMinutes),
            Core.clampAutoLock(after.autoLockMinutes)
          ).catch(() => undefined);
        }
      }
      /* The badge counts rules, not unlock state, so an unlock does not need a
         full tabs query on every PIN entry. */
      if (changes.rules || changes.settings) scheduleBadgeRefresh();
    });
  }

  async function broadcastPolicy() {
    const tabs = await queryTabs({}).catch(() => []);
    const data = await readState();

    await Promise.all(
      tabs.map(async (tab) => {
        const info = Core.normalizeUrl(tab.url);
        if (!info) return;
        await sendToTab(tab.id, await policyPayload(data, info, tab.url));
      })
    );
  }

  /* --------------------------------------------------------------------------
     Tab lifecycle
     ------------------------------------------------------------------------ */
  api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.url) {
      const info = Core.normalizeUrl(tab.url);
      if (info) tabUrlKey.set(tabId, info.urlKey);
      /* Injected CSS does not survive a document navigation. */
      styledTabs.delete(tabId);
    }

    if (changeInfo.url) {
      const info = Core.normalizeUrl(changeInfo.url);
      if (info) tabUrlKey.set(tabId, info.urlKey);
      /* A single-page app can change route without loading a document, so the
         content script that is already running needs the new verdict pushed. */
      pushPolicy(tabId).catch(() => undefined);
    }

    if (changeInfo.status === "complete") scheduleBadgeRefresh();
  });

  api.tabs.onRemoved.addListener((tabId) => {
    tabUrlKey.delete(tabId);
    styledTabs.delete(tabId);
    queryTabs({})
      .then(async (tabs) => {
        const active = tabs
          .map((tab) => Core.normalizeUrl(tab.url))
          .filter(Boolean)
          .map((info) => info.urlKey);
        await Store.exclusive(async () => {
          const data = await Store.get(["unlocked"]);
          const pruned = Core.pruneUnlocked(data.unlocked, active);
          if (Object.keys(pruned).length !== Object.keys(data.unlocked).length) {
            await Store.set({ unlocked: pruned });
          }
        });
      })
      .catch(() => undefined);
    scheduleBadgeRefresh();
  });

  api.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    const cached = tabUrlKey.get(removedTabId);
    tabUrlKey.delete(removedTabId);
    if (cached) tabUrlKey.set(addedTabId, cached);
    scheduleBadgeRefresh();
  });

  /* --------------------------------------------------------------------------
     Session boundaries and the expiry sweep
     ------------------------------------------------------------------------ */
  async function clearUnlocks() {
    const data = await Store.get(["unlocked"]);
    if (Object.keys(data.unlocked).length === 0) return;
    await Store.set({ unlocked: {} });
  }

  /**
   * Drops expired unlocks and re-covers any tab still showing a page that is
   * locked again. Without the second half, a five-minute unlock would keep the
   * page readable until the user happened to navigate.
   */
  async function sweep() {
    let changed = false;
    let rules = {};

    /* Re-read inside the slot: a verification that started just before the
       sweep may still be running, and its fresh unlock must survive. */
    await Store.exclusive(async () => {
      const data = await Store.get(["unlocked", "rules"]);
      const now = Date.now();
      const unlocked = {};

      for (const [key, expiresAt] of Object.entries(data.unlocked)) {
        if (Core.isUnlockActive(expiresAt, now)) unlocked[key] = expiresAt;
        else changed = true;
      }

      if (changed) await Store.set({ unlocked });
      rules = data.rules;
    });

    if (!changed) return;
    const tabs = await queryTabs({}).catch(() => []);
    await Promise.all(
      tabs.map(async (tab) => {
        const info = Core.normalizeUrl(tab.url);
        if (info && Core.findRule(rules, info)) await pushPolicy(tab.id);
      })
    );
  }

  /**
   * Rewrites live unlocks when the stay-open duration changes. Shifting the
   * stored expiry by the difference keeps the time already spent open; a new
   * "until closed" choice gets the far-future marker. Anything that lands in
   * the past is left for the sweep to drop and re-cover.
   */
  async function rescheduleUnlocks(previousMinutes, nextMinutes) {
    if (previousMinutes === nextMinutes) return;
    const now = Date.now();
    let changed = false;

    await Store.exclusive(async () => {
      const data = await Store.get(["unlocked"]);
      const unlocked = {};
      for (const [key, stored] of Object.entries(data.unlocked || {})) {
        const expiry = Number(stored);
        let next;
        if (nextMinutes === 0) {
          next = Number.MAX_SAFE_INTEGER;
        } else if (previousMinutes === 0 || !Number.isFinite(expiry) || expiry === Number.MAX_SAFE_INTEGER) {
          next = now + nextMinutes * 60000;
        } else {
          next = expiry + (nextMinutes - previousMinutes) * 60000;
        }
        unlocked[key] = next;
        if (next !== expiry) changed = true;
      }
      if (changed) await Store.set({ unlocked });
    });

    if (changed) await sweep();
  }

  function ensureAlarm() {
    if (!api.alarms) return;
    call((done) => api.alarms.get(SWEEP_ALARM, done))
      .then((existing) => {
        if (existing) return undefined;
        return call((done) => api.alarms.create(SWEEP_ALARM, { periodInMinutes: 1 }, done));
      })
      .catch(() => undefined);
  }

  if (api.alarms) {
    api.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === SWEEP_ALARM) sweep().catch(() => undefined);
    });
  }

  api.runtime.onInstalled.addListener((details) => {
    Store.get(["schemaVersion", "locale"])
      .then((data) => {
        const patch = {};
        if (data.schemaVersion !== Store.SCHEMA_VERSION) patch.schemaVersion = Store.SCHEMA_VERSION;
        /* Language is detected once, on the very first run, and then becomes an
           explicit choice the user can change from the popup. */
        if (!data.locale || data.locale === "auto") patch.locale = detectLocale();
        if (Object.keys(patch).length) return Store.set(patch);
        return undefined;
      })
      .catch(() => undefined);

    ensureAlarm();
    scheduleBadgeRefresh();

    /* Nothing is locked on a fresh install, but a reload makes the new content
       script available in tabs that were already open. */
    if (details.reason === "install") {
      queryTabs({})
        .then((tabs) => {
          for (const tab of tabs) {
            if (!Core.normalizeUrl(tab.url)) continue;
            call((done) => api.tabs.reload(tab.id, {}, done)).catch(() => undefined);
          }
        })
        .catch(() => undefined);
    }
  });

  if (api.commands && api.commands.onCommand) {
    api.commands.onCommand.addListener(async (command) => {
      if (command !== "lock-now") return;
      const tabs = await queryTabs({ active: true, currentWindow: true }).catch(() => []);
      if (tabs[0]) await lockTab(tabs[0].id);
    });
  }

  api.runtime.onStartup.addListener(() => {
    clearUnlocks()
      .then(() => {
        ensureAlarm();
        return refreshBadge();
      })
      .catch(() => undefined);
  });
})(typeof globalThis !== "undefined" ? globalThis : self);
