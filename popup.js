/* ============================================================================
   LockTab — popup.js
   Presentation only. Every decision about a tab lives in the background; this
   file asks questions, collects a PIN when access is being widened, and renders
   the answer. No secret is computed or compared here.
   ========================================================================== */

(function () {
  "use strict";

  const Core = globalThis.LockTabCore;
  const Store = globalThis.LockTabStorage;
  const I18n = globalThis.LockTabI18n;
  const Theme = globalThis.LockTabTheme;
  const Pin = globalThis.LockTabPin;
  const UI = globalThis.LockTabUI;

  const LOCALE_NAMES = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    "pt-BR": "Português (Brasil)",
    ru: "Русский",
    ar: "العربية",
    "zh-CN": "简体中文",
  };

  const ICONS = {
    locked:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    temp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    open: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    none: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 8.5l7 7"/></svg>',
  };

  const MOON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
  const SUN =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>';

  const byId = (id) => document.getElementById(id);
  const el = {
    feedback: byId("feedback"),
    themeBtn: byId("themeBtn"),
    themeGlyph: byId("themeGlyph"),

    setupCard: byId("setupCard"),
    setupPin: byId("setupPin"),
    setupConfirm: byId("setupConfirm"),
    pinMatch: byId("pinMatch"),
    setupError: byId("setupError"),
    setupSave: byId("setupSave"),

    recoveryCard: byId("recoveryCard"),
    recoveryValue: byId("recoveryValue"),
    recoveryCopy: byId("recoveryCopy"),
    recoveryDone: byId("recoveryDone"),

    statusCard: byId("statusCard"),
    stateRow: byId("stateRow"),
    stateIcon: byId("stateIcon"),
    stateValue: byId("stateValue"),
    stateHint: byId("stateHint"),
    siteHost: byId("siteHost"),

    actionCard: byId("actionCard"),
    lockBtn: byId("lockBtn"),
    unlockRow: byId("unlockRow"),
    unlockBtn: byId("unlockBtn"),
    removeBtn: byId("removeBtn"),
    promptField: byId("promptField"),
    promptPin: byId("promptPin"),
    promptError: byId("promptError"),
    promptCancel: byId("promptCancel"),
    promptGo: byId("promptGo"),

    pinCard: byId("pinCard"),
    pinBadge: byId("pinBadge"),
    pinHint: byId("pinHint"),
    sitePinBtn: byId("sitePinBtn"),
    useGlobalBtn: byId("useGlobalBtn"),
    sitePinForm: byId("sitePinForm"),
    sitePinCurrentWrap: byId("sitePinCurrentWrap"),
    sitePinCurrent: byId("sitePinCurrent"),
    sitePinNewWrap: byId("sitePinNewWrap"),
    sitePinNew: byId("sitePinNew"),
    sitePinConfirm: byId("sitePinConfirm"),
    sitePinError: byId("sitePinError"),
    sitePinCancel: byId("sitePinCancel"),
    sitePinSave: byId("sitePinSave"),

    lockedSitesCard: byId("lockedSitesCard"),
    lockedSitesList: byId("lockedSitesList"),
    lockedSitesCount: byId("lockedSitesCount"),
    lockedSitesEmpty: byId("lockedSitesEmpty"),
    sitePager: byId("sitePager"),
    sitePrev: byId("sitePrev"),
    siteNext: byId("siteNext"),
    sitePage: byId("sitePage"),

    settingsCard: byId("settingsCard"),
    autoLockSelect: byId("autoLockSelect"),
    localeSelect: byId("localeSelect"),
    showBadge: byId("showBadge"),
    blurEnabled: byId("blurEnabled"),
    blurSelect: byId("blurSelect"),
    blurStrengthRow: byId("blurStrengthRow"),
    lockShortcutHint: byId("lockShortcutHint"),
    shortcutValue: byId("shortcutValue"),
    shortcutEditBtn: byId("shortcutEditBtn"),
    changePinBtn: byId("changePinBtn"),
    resetAllBtn: byId("resetAllBtn"),
    resetConfirmPanel: byId("resetConfirmPanel"),
    resetConfirmText: byId("resetConfirmText"),
    resetConfirmCancel: byId("resetConfirmCancel"),
    resetConfirmGo: byId("resetConfirmGo"),
    changePinForm: byId("changePinForm"),
    changeCurrent: byId("changeCurrent"),
    changeNext: byId("changeNext"),
    changeConfirm: byId("changeConfirm"),
    changeError: byId("changeError"),
    changeCancel: byId("changeCancel"),
    changeSave: byId("changeSave"),

    donateCard: byId("donateCard"),
    siteFooter: byId("siteFooter"),
  };

  const cards = [
    el.setupCard,
    el.recoveryCard,
    el.statusCard,
    el.actionCard,
    el.pinCard,
    el.lockedSitesCard,
    el.settingsCard,
    el.donateCard,
  ];

  const fields = {};
  let tabId = null;
  let view = null;
  let recoveryCode = "";
  let promptResolve = null;
  let promptErrorText = "";
  let siteFormMode = "set";
  let sitePage = 0;
  const SITE_PAGE_SIZE = 5;
  let feedbackTimer = null;
  let statusTimer = null;
  let statusTemplate = "";
  let selects = {};

  /* --------------------------------------------------------------------------
     Browser plumbing — Chromium returns promises, Firefox's chrome namespace
     still uses callbacks. Passing the callback satisfies both engines.
     ------------------------------------------------------------------------ */
  function send(message) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      let maybe;
      try {
        maybe = chrome.runtime.sendMessage(message, (response) => {
          void chrome.runtime.lastError;
          done(response);
        });
      } catch (_error) {
        done(undefined);
        return;
      }
      if (maybe && typeof maybe.then === "function") maybe.then(done, () => done(undefined));
    });
  }

  function activeTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        void chrome.runtime.lastError;
        resolve(tabs && tabs[0]);
      });
    });
  }

  /* The recovery code stays visible until it is acknowledged. Keeping it in
     session storage (memory-backed, gone at browser exit) avoids writing a
     second plaintext copy into persistent storage. */
  const RECOVERY_KEY = "locktab.pendingRecovery";

  function sessionArea() {
    return chrome.storage && chrome.storage.session ? chrome.storage.session : null;
  }

  function savePendingRecovery(code) {
    const area = sessionArea();
    if (!area) return Promise.resolve();
    return new Promise((resolve) => {
      area.set({ [RECOVERY_KEY]: code }, () => {
        void chrome.runtime.lastError;
        resolve();
      });
    });
  }

  function readPendingRecovery() {
    const area = sessionArea();
    if (!area) return Promise.resolve("");
    return new Promise((resolve) => {
      area.get(RECOVERY_KEY, (data) => {
        void chrome.runtime.lastError;
        resolve((data && data[RECOVERY_KEY]) || "");
      });
    });
  }

  function clearPendingRecovery() {
    const area = sessionArea();
    if (!area) return Promise.resolve();
    return new Promise((resolve) => {
      area.remove(RECOVERY_KEY, () => {
        void chrome.runtime.lastError;
        resolve();
      });
    });
  }

  function showFeedback(text) {
    el.feedback.textContent = text;
    el.feedback.hidden = false;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      el.feedback.hidden = true;
      feedbackTimer = null;
    }, 6000);
  }

  function clearFeedback() {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = null;
    el.feedback.hidden = true;
    el.feedback.textContent = "";
  }

  function describeError(result) {
    if (!result) return I18n.t("errorGeneric");
    switch (result.error) {
      case "wrong_pin":
        return I18n.t("pinWrong");
      case "locked_out":
        return I18n.t("tooMany");
      case "no_pin":
        return I18n.t("errorNoPin");
      case "invalid_pin":
        return I18n.t("pinInvalid");
      case "not_lockable":
        return I18n.t("errorNotLockable");
      case "content_unavailable":
        return I18n.t("errorContentUnavailable");
      case "unauthorized":
        return I18n.t("errorGeneric");
      default:
        return I18n.t("errorGeneric");
    }
  }

  function showError(node, message) {
    node.textContent = message;
    node.hidden = false;
  }

  function hideError(node) {
    node.hidden = true;
    node.textContent = "";
  }

  /* --------------------------------------------------------------------------
     PIN prompt — the single gate through which every access-widening action
     passes. Failed attempts reopen the prompt with the reason visible.
     ------------------------------------------------------------------------ */
  function askPin() {
    if (promptResolve) return Promise.resolve(null);
    return new Promise((resolve) => {
      promptResolve = resolve;
      if (promptErrorText) showError(el.promptError, promptErrorText);
      else hideError(el.promptError);
      fields.promptPin.clear();
      el.promptField.hidden = false;
      fields.promptPin.focus();
    });
  }

  function settlePin(value) {
    const resolve = promptResolve;
    promptResolve = null;
    el.promptField.hidden = true;
    if (resolve) resolve(value);
  }

  async function withPin(run) {
    clearFeedback();
    promptErrorText = "";
    for (;;) {
      const pin = await askPin();
      if (pin === null) return false;
      const result = await run(pin);
      if (result && result.ok) return true;
      if (result && result.error === "locked_out") {
        showFeedback(describeError(result));
        return false;
      }
      promptErrorText = describeError(result);
      if (!promptErrorText) return false;
    }
  }

  /* --------------------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------------ */
  function stopStatusTimer() {
    if (statusTimer) clearInterval(statusTimer);
    statusTimer = null;
    statusTemplate = "";
  }

  function isNeverExpiring(value) {
    return value === Number.MAX_SAFE_INTEGER || !Number.isFinite(value);
  }

  function tickStatus() {
    if (!view || view.state !== "temp" || !statusTemplate || isNeverExpiring(view.unlockedUntil)) return;
    const parts = statusTemplate.split("{time}");
    const left = Math.max(0, Math.ceil((view.unlockedUntil - Date.now()) / 1000));
    el.stateHint.textContent = parts[0] + Core.formatDuration(left) + (parts[1] || "");
  }

  function startStatusTimer() {
    stopStatusTimer();
    if (!view || view.state !== "temp" || !view.unlockedUntil || isNeverExpiring(view.unlockedUntil)) return;
    statusTemplate = I18n.t("hintTemp");
    tickStatus();
    statusTimer = setInterval(tickStatus, 1000);
  }

  function formatUnlockTime(expiresAt) {
    if (!expiresAt || expiresAt === Number.MAX_SAFE_INTEGER) return I18n.t("autoLockNever");
    return Core.formatDuration(Math.ceil((expiresAt - Date.now()) / 1000));
  }

  function renderStatus() {
    let key = "none";
    let label = I18n.t("stateNone");
    let hint = I18n.t("hintNone");

    if (!view.lockable) {
      key = "unsupported";
      label = I18n.t("unsupportedTitle");
      hint = I18n.t("unsupportedHint");
    } else if (view.state === "locked") {
      key = "locked";
      label = I18n.t("stateLocked");
      hint = I18n.t(view.custom ? "hintSite" : "hintGlobal");
    } else if (view.state === "temp") {
      key = "temp";
      label = I18n.t("stateTemp");
      const parts = I18n.t("hintTemp").split("{time}");
      hint = parts[0] + formatUnlockTime(view.unlockedUntil) + (parts[1] || "");
    } else if (view.hasPin) {
      key = "open";
      label = I18n.t("stateOpen");
    } else {
      hint = I18n.t("hintNoPin");
    }

    if (
      key !== "temp" &&
      view.remaining !== null &&
      view.remaining !== undefined &&
      view.remaining < Core.SOFT_ATTEMPT_LIMIT
    ) {
      hint += " · " + I18n.t("attemptsLabel") + ": " + view.remaining;
    }

    el.stateRow.dataset.state = key;
    el.stateIcon.innerHTML = ICONS[key] || ICONS.none;
    el.stateValue.textContent = label;
    el.stateHint.textContent = hint;
    el.siteHost.textContent = view.host || "";
    el.siteHost.dir = I18n.dir;
    el.stateRow.dir = I18n.dir;
    if (key === "temp") startStatusTimer();
    else stopStatusTimer();
  }

  function renderActions() {
    el.lockBtn.disabled = Boolean(view.hasRule && view.state === "locked");
    el.unlockRow.hidden = !view.hasRule;
    el.unlockBtn.hidden = view.state === "temp";
  }

  function renderPinCard() {
    el.pinBadge.dataset.state = view.custom ? "locked" : "none";
    el.pinBadge.textContent = I18n.t(view.custom ? "pinCustom" : "pinInherit");
    el.pinHint.textContent = I18n.t(view.custom ? "hintSite" : "hintGlobal");
    el.sitePinBtn.querySelector("span").textContent = I18n.t(view.custom ? "pinChangeSite" : "pinSetupSite");
    el.useGlobalBtn.hidden = !view.custom;
    el.sitePinForm.hidden = true;
    hideError(el.sitePinError);
  }

  function renderLockedSites() {
    const sites = Array.isArray(view.lockedSites) ? view.lockedSites : [];
    const totalPages = Math.ceil(sites.length / SITE_PAGE_SIZE);
    if (sitePage >= totalPages) sitePage = Math.max(0, totalPages - 1);

    el.lockedSitesCount.textContent = String(sites.length);
    el.lockedSitesCount.dataset.state = sites.length ? "locked" : "none";
    el.lockedSitesEmpty.hidden = sites.length > 0;
    el.lockedSitesList.textContent = "";
    el.lockedSitesList.dir = I18n.dir;

    const visible = sites.slice(sitePage * SITE_PAGE_SIZE, (sitePage + 1) * SITE_PAGE_SIZE);
    visible.forEach((site, index) => {
      if (!site || typeof site.host !== "string") return;

      const number = document.createElement("span");
      number.className = "site-index";
      number.textContent = String(sitePage * SITE_PAGE_SIZE + index + 1).padStart(2, "0");
      number.setAttribute("aria-hidden", "true");

      const body = document.createElement("div");
      body.className = "site-item-body";
      const host = document.createElement("span");
      host.className = "site-item-host selectable";
      host.textContent = site.host;
      host.dir = I18n.dir;
      const path = document.createElement("span");
      path.className = "site-item-path selectable";
      path.textContent = site.path || site.origin || "";
      path.dir = I18n.dir;
      body.append(host, path);

      const badge = document.createElement("span");
      badge.className = "site-item-badge";
      badge.textContent = I18n.t(site.custom ? "pinCustom" : "pinInherit");

      const row = document.createElement("li");
      row.className = "site-item";
      row.dataset.custom = String(Boolean(site.custom));
      row.append(number, body, badge);
      el.lockedSitesList.appendChild(row);
    });

    el.sitePager.hidden = totalPages <= 1;
    el.sitePage.textContent = I18n.t("sitePage", { n: sitePage + 1, total: totalPages });
    el.sitePrev.disabled = sitePage === 0;
    el.siteNext.disabled = sitePage >= totalPages - 1;
  }

  function renderSettings() {
    const settings = view.settings || {};
    selects.autoLock.setValue(String(Core.clampAutoLock(settings.autoLockMinutes)));
    selects.locale.setValue(String(view.locale || "auto"));
    el.showBadge.checked = settings.showBadge !== false;
    el.blurEnabled.checked = settings.blurEnabled === true;
    el.blurStrengthRow.hidden = !el.blurEnabled.checked;
    selects.blur.setValue(String(Core.clampBlur(settings.blurStrength)));
    el.changePinForm.hidden = true;
    el.resetConfirmPanel.hidden = true;
    hideError(el.changeError);
  }

  function render() {
    /* A settings change can refresh the popup mid-prompt. Cancel the pending
       promise instead of leaving the caller waiting forever. */
    if (promptResolve) settlePin(null);
    for (const card of cards) card.hidden = true;
    const firstRun = !view || !view.hasPin;
    el.siteFooter.hidden = firstRun;
    el.donateCard.hidden = firstRun || Boolean(recoveryCode);
    if (!view) return;

    if (!view.hasPin) {
      el.setupCard.hidden = false;
      return;
    }

    if (recoveryCode) {
      el.recoveryCard.hidden = false;
      return;
    }

    el.statusCard.hidden = false;
    el.lockedSitesCard.hidden = false;
    if (view.lockable) {
      el.actionCard.hidden = false;
      el.pinCard.hidden = false;
      el.promptField.hidden = true;
    }
    el.settingsCard.hidden = false;

    renderStatus();
    if (view.lockable) {
      renderActions();
      renderPinCard();
    }
    renderLockedSites();
    renderSettings();
  }

  async function refresh() {
    view = await send({ type: "GET_STATE", tabId });
    if (!view) return showFeedback(I18n.t("errorGeneric"));
    render();
    if (fields.promptPin) fields.promptPin.setMax(view.pinLength);
    if (fields.sitePinCurrent) fields.sitePinCurrent.setMax(view.sitePinLength || view.pinLength);
    if (fields.changeCurrent) fields.changeCurrent.setMax(view.pinLength);
  }

  /* --------------------------------------------------------------------------
     Selects
     ------------------------------------------------------------------------ */
  function renderShortcut() {
    el.shortcutValue.textContent = Core.LOCK_SHORTCUT;
    el.lockShortcutHint.textContent = I18n.t("lockShortcutHint", { key: Core.LOCK_SHORTCUT });
  }

  function buildSelects() {
    el.autoLockSelect.textContent = "";
    for (const minutes of Core.AUTO_LOCK_OPTIONS) {
      const option = document.createElement("option");
      option.value = String(minutes);
      option.textContent = minutes === 0 ? I18n.t("autoLockNever") : I18n.t("minutesAfter", { n: minutes });
      el.autoLockSelect.appendChild(option);
    }

    el.localeSelect.textContent = "";
    for (const code of Core.SUPPORTED_LOCALES) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = LOCALE_NAMES[code] || code;
      el.localeSelect.appendChild(option);
    }

    el.blurSelect.textContent = "";
    const blurLabels = ["blurLow", "blurMedium", "blurHigh"];
    Core.BLUR_OPTIONS.forEach((value, index) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = I18n.t(blurLabels[index]);
      el.blurSelect.appendChild(option);
    });

    selects.autoLock = UI.createSelect(el.autoLockSelect);
    selects.locale = UI.createSelect(el.localeSelect);
    selects.blur = UI.createSelect(el.blurSelect);
  }

  function applyThemeGlyph() {
    const dark = Theme.current() === "dark";
    el.themeGlyph.innerHTML = dark ? SUN : MOON;
    const key = dark ? "themeToLight" : "themeToDark";
    el.themeBtn.setAttribute("aria-label", I18n.t(key));
    el.themeBtn.setAttribute("title", I18n.t(key));
    el.themeBtn.setAttribute("aria-pressed", String(dark));
  }

  /* --------------------------------------------------------------------------
     Field wiring
     ------------------------------------------------------------------------ */
  function buildFields() {
    fields.setupPin = Pin.create(el.setupPin, {
      labelId: "setupPinLabel",
      onChange: () => {
        fields.setupMatch.update();
        hideError(el.setupError);
      },
      onSubmit: () => el.setupSave.click(),
    });
    fields.setupConfirm = Pin.create(el.setupConfirm, {
      labelId: "setupConfirmLabel",
      onChange: () => fields.setupMatch.update(),
      onSubmit: () => el.setupSave.click(),
    });
    fields.setupMatch = Pin.createMatchIndicator(el.pinMatch, [fields.setupPin, fields.setupConfirm]);

    fields.promptPin = Pin.create(el.promptPin, {
      label: I18n.t("pinLabel"),
      onSubmit: () => el.promptGo.click(),
    });

    fields.sitePinCurrent = Pin.create(el.sitePinCurrent, { labelId: "sitePinCurrentLabel" });
    fields.sitePinNew = Pin.create(el.sitePinNew, {
      labelId: "sitePinNewLabel",
      onChange: () => fields.siteMatch.update(),
      onSubmit: () => el.sitePinSave.click(),
    });
    fields.sitePinConfirm = Pin.create(el.sitePinConfirm, {
      labelId: "sitePinConfirmLabel",
      onChange: () => fields.siteMatch.update(),
      onSubmit: () => el.sitePinSave.click(),
    });

    fields.changeCurrent = Pin.create(el.changeCurrent, { labelId: "changeCurrentLabel" });
    fields.changeNext = Pin.create(el.changeNext, {
      labelId: "changeNextLabel",
      onChange: () => fields.changeMatch.update(),
      onSubmit: () => el.changeSave.click(),
    });
    fields.changeConfirm = Pin.create(el.changeConfirm, {
      labelId: "changeConfirmLabel",
      onChange: () => fields.changeMatch.update(),
      onSubmit: () => el.changeSave.click(),
    });

    const addInlineMatch = (anchor, first, second) => {
      const node = document.createElement("div");
      node.className = "pin-match";
      node.dataset.state = "idle";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      node.innerHTML = '<span class="match-icon" aria-hidden="true"></span><span class="match-text"></span>';
      anchor.insertBefore(node, anchor.querySelector(".form-actions"));
      return Pin.createMatchIndicator(node, [first, second]);
    };
    fields.siteMatch = addInlineMatch(el.sitePinForm, fields.sitePinNew, fields.sitePinConfirm);
    fields.changeMatch = addInlineMatch(el.changePinForm, fields.changeNext, fields.changeConfirm);
  }

  function openSiteForm(mode) {
    siteFormMode = mode;
    el.sitePinForm.hidden = false;
    hideError(el.sitePinError);
    fields.sitePinCurrent.clear();
    /* The first box is the main PIN in both modes — it proves ownership before
       any per-site secret is created or replaced, even on an unmarked page. */
    el.sitePinCurrentWrap.hidden = false;

    const setMode = mode === "set";
    el.sitePinNewWrap.hidden = !setMode;
    fields.siteMatch.node.hidden = !setMode;
    fields.sitePinNew.clear();
    fields.sitePinConfirm.clear();
    el.sitePinSave.querySelector("strong").textContent = I18n.t(setMode ? "save" : "pinUseGlobal");
    (el.sitePinCurrentWrap.hidden ? fields.sitePinNew : fields.sitePinCurrent).focus();
  }

  function invalid(field) {
    field.setInvalid(true);
    field.focus();
  }

  async function saveSitePin() {
    hideError(el.sitePinError);
    const current = fields.sitePinCurrent.getValue();

    if (!Core.validatePin(current)) {
      showError(el.sitePinError, I18n.t("pinInvalid"));
      return invalid(fields.sitePinCurrent);
    }

    if (siteFormMode === "revert") {
      const result = await send({ type: "USE_GLOBAL_PIN", tabId, current });
      if (!result || !result.ok) {
        showError(el.sitePinError, describeError(result));
        fields.sitePinCurrent.setInvalid(true);
        return;
      }
      await refresh();
      return;
    }

    const pin = fields.sitePinNew.getValue();
    if (!Core.validatePin(pin)) {
      showError(el.sitePinError, I18n.t("pinInvalid"));
      return invalid(fields.sitePinNew);
    }
    if (pin !== fields.sitePinConfirm.getValue()) {
      showError(el.sitePinError, I18n.t("pinMismatch"));
      return invalid(fields.sitePinConfirm);
    }

    const result = await send({ type: "SET_SITE_PIN", tabId, pin, current });
    if (!result || !result.ok) {
      showError(el.sitePinError, describeError(result));
      return;
    }
    await refresh();
  }

  async function saveSettings(patch) {
    await Store.set({ settings: Object.assign({}, view.settings, patch) });
    await refresh();
  }

  /* --------------------------------------------------------------------------
     Handlers
     ------------------------------------------------------------------------ */
  function bind() {
    /* The background reschedules unlocks when the stay-open duration changes.
       Updating from the storage event keeps the countdown in step without
       guessing when that asynchronous write has finished. */
    if (globalThis.chrome && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "local" || !changes.unlocked || !view || !view.urlKey) return;
        const table = changes.unlocked.newValue || {};
        view.unlockedUntil = table[view.urlKey] || 0;
        if (view.hasRule) view.state = view.unlockedUntil ? "temp" : "locked";
        renderStatus();
      });
    }

    el.themeBtn.addEventListener("click", () => {
      Theme.toggle();
      applyThemeGlyph();
    });

    el.setupSave.addEventListener("click", async () => {
      hideError(el.setupError);
      const pin = fields.setupPin.getValue();
      const confirm = fields.setupConfirm.getValue();

      if (!Core.validatePin(pin)) {
        showError(el.setupError, I18n.t("pinInvalid"));
        fields.setupPin.setInvalid(true);
        return;
      }
      if (pin !== confirm) {
        showError(el.setupError, I18n.t("pinMismatch"));
        fields.setupConfirm.setInvalid(true);
        return;
      }

      const result = await send({ type: "SETUP_PIN", pin });
      if (!result || !result.ok) {
        showError(el.setupError, describeError(result));
        return;
      }

      recoveryCode = result.recoveryCode;
      el.recoveryValue.textContent = recoveryCode;
      el.recoveryCopy.querySelector("span").textContent = I18n.t("copy");
      await savePendingRecovery(recoveryCode);
      await refresh();
    });

    el.recoveryCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(recoveryCode);
        el.recoveryCopy.querySelector("span").textContent = I18n.t("copied");
      } catch (_error) {
        showFeedback(recoveryCode);
      }
    });

    el.recoveryDone.addEventListener("click", async () => {
      await clearPendingRecovery();
      recoveryCode = "";
      await refresh();
    });

    el.lockBtn.addEventListener("click", async () => {
      clearFeedback();
      const result = await send({ type: "LOCK_TAB", tabId });
      if (!result || !result.ok) return showFeedback(describeError(result));
      await refresh();
    });

    el.unlockBtn.addEventListener("click", () =>
      withPin((pin) => send({ type: "UNLOCK_TAB", tabId, pin })).then(refresh)
    );

    el.removeBtn.addEventListener("click", () =>
      withPin((pin) => send({ type: "REMOVE_LOCK", tabId, pin })).then(refresh)
    );

    el.promptGo.addEventListener("click", () => {
      const pin = fields.promptPin.getValue();
      if (!Core.validatePin(pin)) {
        fields.promptPin.setInvalid(true);
        showError(el.promptError, I18n.t("pinInvalid"));
        return;
      }
      settlePin(pin);
    });

    el.promptCancel.addEventListener("click", () => settlePin(null));

    el.sitePinBtn.addEventListener("click", () => openSiteForm("set"));
    el.useGlobalBtn.addEventListener("click", () => openSiteForm("revert"));
    el.sitePinCancel.addEventListener("click", () => {
      el.sitePinForm.hidden = true;
    });
    el.sitePinSave.addEventListener("click", saveSitePin);

    el.autoLockSelect.addEventListener("change", () =>
      saveSettings({ autoLockMinutes: Core.clampAutoLock(Number(el.autoLockSelect.value)) })
    );
    el.showBadge.addEventListener("change", () => saveSettings({ showBadge: el.showBadge.checked }));
    el.blurEnabled.addEventListener("change", () => {
      el.blurStrengthRow.hidden = !el.blurEnabled.checked;
      saveSettings({ blurEnabled: el.blurEnabled.checked });
    });
    el.blurSelect.addEventListener("change", () =>
      saveSettings({ blurStrength: Core.clampBlur(Number(el.blurSelect.value)) })
    );
    el.localeSelect.addEventListener("change", async () => {
      await Store.set({ locale: el.localeSelect.value });
      /* A reload is the only way to re-translate static markup and rebuild the
         language-dependent option labels without leaving stale bilingual nodes. */
      location.reload();
    });

    el.changePinBtn.addEventListener("click", () => {
      el.changePinForm.hidden = false;
      hideError(el.changeError);
      fields.changeCurrent.clear();
      fields.changeNext.clear();
      fields.changeConfirm.clear();
      fields.changeCurrent.focus();
    });

    el.changeCancel.addEventListener("click", () => {
      el.changePinForm.hidden = true;
    });

    el.changeSave.addEventListener("click", async () => {
      hideError(el.changeError);
      const current = fields.changeCurrent.getValue();
      const next = fields.changeNext.getValue();
      const confirm = fields.changeConfirm.getValue();

      if (!Core.validatePin(current) || !Core.validatePin(next)) {
        showError(el.changeError, I18n.t("pinInvalid"));
        return;
      }
      if (next !== confirm) {
        showError(el.changeError, I18n.t("pinMismatch"));
        return;
      }

      const result = await send({ type: "CHANGE_PIN", current, next });
      if (!result || !result.ok) {
        showError(el.changeError, describeError(result));
        return;
      }

      recoveryCode = result.recoveryCode;
      el.recoveryValue.textContent = recoveryCode;
      el.recoveryCopy.querySelector("span").textContent = I18n.t("copy");
      await savePendingRecovery(recoveryCode);
      await refresh();
    });

    el.sitePrev.addEventListener("click", () => {
      if (sitePage > 0) {
        sitePage -= 1;
        renderLockedSites();
      }
    });
    el.siteNext.addEventListener("click", () => {
      sitePage += 1;
      renderLockedSites();
    });

    el.shortcutEditBtn.addEventListener("click", () => {
      /* Browsers own keyboard bindings; an extension can only send the user to
         their shortcut editor, it cannot rebind a command itself. */
      chrome.tabs.create({ url: "chrome://extensions/shortcuts" }, () => void chrome.runtime.lastError);
    });

    el.resetAllBtn.addEventListener("click", () => {
      el.resetConfirmText.textContent = I18n.t("resetConfirm");
      el.resetConfirmPanel.hidden = false;
      el.resetConfirmCancel.focus();
    });

    el.resetConfirmCancel.addEventListener("click", () => {
      el.resetConfirmPanel.hidden = true;
      el.resetAllBtn.focus();
    });

    el.resetConfirmPanel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") el.resetConfirmCancel.click();
    });

    el.resetConfirmGo.addEventListener("click", async () => {
      el.resetConfirmPanel.hidden = true;
      const result = await send({ type: "RESET_ALL" });
      if (!result || !result.ok) return showFeedback(describeError(result));
      recoveryCode = "";
      await clearPendingRecovery();
      fields.setupPin.clear();
      fields.setupConfirm.clear();
      /* A reset also re-detects the browser language, so the popup has to
         reload to pick up the new bundle. */
      location.reload();
    });
  }

  async function boot() {
    await Theme.ready;
    await I18n.init();
    renderShortcut();
    buildSelects();
    buildFields();
    applyThemeGlyph();
    const pending = await readPendingRecovery();
    if (pending) {
      recoveryCode = pending;
      el.recoveryValue.textContent = pending;
    }
    const tab = await activeTab();
    tabId = tab ? tab.id : null;
    bind();
    await refresh();
    fields.setupPin.focus();
  }

  boot().catch(() => showFeedback(I18n.t("errorGeneric")));
})();
