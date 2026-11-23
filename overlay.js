/* ============================================================================
   LockTab — overlay.js
   Content script. Builds a closed shadow root over the page and does nothing
   else: every decision, including the attempt counter, belongs to the
   background. This file never holds a hash, a salt, or a rule.
   ========================================================================== */

(function () {
  "use strict";

  if (window.top !== window) return;
  if (window.__locktabInstalled) return;
  Object.defineProperty(window, "__locktabInstalled", { value: true, enumerable: false });

  const Core = window.LockTabCore;
  const Pin = window.LockTabPin;
  if (!Core) return;

  const HOST_TAG = "locktab-gate";
  const SVG_NS = "http://www.w3.org/2000/svg";
  /* sessionStorage outlives the reloads this guard triggers, unlike the
     in-memory tick state — that is what makes a bounded budget possible. */
  const RELOAD_BUDGET_KEY = "locktab.gate.reloadBudget";
  const MAX_AUTO_RELOADS = 2;

  /* Fonts are extension assets, so the absolute URLs must come from the
     runtime. Only `fonts/*.woff2` is made web-accessible in the manifest. */
  /* One family for both scripts. The unicode-range means the browser fetches
     only the subset it actually needs, so the lock screen paints faster. */
  const FONT_FILES = [
    ["cairo-latin.woff2", "U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+20AC, U+2122, U+FEFF"],
    ["cairo-arabic.woff2", "U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFC"],
  ];

  function fontCss() {
    return FONT_FILES.map(([file, range]) => {
      return (
        '@font-face{font-family:"Cairo";font-style:normal;font-weight:400 800;' +
        `font-display:swap;src:url("${chrome.runtime.getURL("fonts/" + file)}") format("woff2");` +
        `unicode-range:${range};}`
      );
    }).join("\n");
  }

  const STYLE = `
  :host { all: initial; }
  :host, * { box-sizing: border-box; }
  .wrap {
    --bg: #f7f8fc; --card: #ffffff; --text: #141826; --muted: #4b5563;
    --border: #e8eaf1; --accent: #4f46e5; --accent-soft: #eef0ff;
    --success: #047857; --success-soft: #e7f7f0;
    --danger: #b91c1c; --danger-soft: #fdecec; --warn: #b45309; --warn-soft: #fdf3e3;
    --muted-soft: #f1f2f6; --radius: 16px; --button-gradient: linear-gradient(135deg, #4f46e5, #7c3aed);
    --font: "Cairo", "Segoe UI", Tahoma, Arial, sans-serif;
    --mono: var(--font);
    position: fixed; inset: 0; z-index: 2147483647;
    display: grid; place-items: center; padding: 16px;
    background: rgba(12, 14, 24, 0.72);
    font-family: var(--font); font-size: 14px; line-height: 1.4; color: var(--text);
    -webkit-font-smoothing: antialiased;
    animation: fade 0.12s ease-out both;
  }
  @media (prefers-color-scheme: dark) {
    .wrap {
      --bg: #000000; --card: #141417; --text: #fafafa; --muted: #a1a1aa;
      --border: #26262b; --accent: #a5b4fc; --accent-soft: #1e1f3a;
      --success: #34d399; --success-soft: #0f231c;
      --danger: #f87171; --danger-soft: #2a1113; --warn: #fbbf24; --warn-soft: #2a2110;
      --muted-soft: #1c1c21;
      background: rgba(0, 0, 0, 0.82);
    }
  }
  @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
  @keyframes rise { from { opacity: 0; transform: translateY(4px) scale(0.99) } to { opacity: 1; transform: none } }
  @keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-4px) } 50% { transform: translateX(4px) } 75% { transform: translateX(-2px) } }
  @keyframes otp-in { from { opacity: 0.6; transform: translateX(-2px) } to { opacity: 1; transform: none } }
  @keyframes otp-pop { 0% { transform: scale(1) } 50% { transform: scale(1.04) } 100% { transform: scale(1) } }
  .card {
    width: min(360px, 100%); background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px; box-shadow: 0 12px 32px rgba(20, 24, 38, 0.14);
    display: flex; flex-direction: column; gap: 12px; text-align: center;
    animation: rise 0.12s ease-out both;
  }
  .card.shake { animation: shake 0.14s ease-in-out; }
  .glyph {
    width: 56px; height: 56px; border-radius: 50%; margin: 0 auto;
    display: grid; place-items: center; background: var(--accent-soft); color: var(--accent);
  }
  .title { font-size: 15px; font-weight: 800; margin: 0; line-height: 1.35; }
  .subtitle { font-size: 12.5px; margin: 0; color: var(--muted); line-height: 1.45; }
  .host {
    display: inline-flex; align-items: center; align-self: center;
    max-width: 100%; min-height: 28px; padding: 4px 12px;
    border-radius: 999px; background: var(--accent-soft);
    border: 1.5px solid var(--accent); color: var(--accent);
    font-family: var(--mono); font-size: 11.5px; font-weight: 700;
    text-decoration: none; direction: ltr; unicode-bidi: isolate;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .host:hover { text-decoration: none; }
  .field { display: flex; flex-direction: column; gap: 8px; }
  .otp { display: flex; align-items: center; justify-content: center; gap: 8px; direction: ltr; }
  .otp-box {
    flex: 1 1 0; width: auto; min-width: 0; max-width: 40px; height: 48px;
    border: 1px solid var(--muted); border-radius: 12px;
    background: var(--bg); color: var(--text);
    font-family: var(--mono); font-size: 20px; font-weight: 800;
    text-align: center; caret-color: var(--accent);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .otp-box:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .otp-box.filled { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
  .otp-box.filled:focus { box-shadow: 0 0 0 3px var(--accent-soft); }
  .otp-box.otp-next { border-style: dashed; border-color: var(--muted); background: var(--card); }
  .otp.invalid .otp-box,
  .otp.invalid .otp-box.filled { border-color: var(--danger); }
  .otp-box.otp-enter { animation: otp-in 0.09s ease-out both; }
  .otp-box.otp-pop { animation: otp-pop 0.09s ease-out; }
  .otp-hint { margin-top: 14px; font-size: 11px; color: var(--muted); }
  .primary {
    min-height: 44px; width: 100%; border: 0; border-radius: 16px; cursor: pointer;
    background: var(--button-gradient); color: #ffffff;
    font-family: inherit; font-size: 15px; font-weight: 800;
    transition: filter 0.15s, transform 0.06s;
  }
  .primary:hover { filter: brightness(1.07); }
  .primary:active { transform: scale(0.98); }
  .primary:disabled { cursor: progress; opacity: 0.75; }
  .ghost {
    min-height: 40px; width: 100%; border-radius: 12px; cursor: pointer;
    background: var(--card); border: 1px solid var(--accent); color: var(--accent);
    font-family: inherit; font-size: 13px; font-weight: 700;
    transition: background 0.15s, transform 0.06s;
  }
  .ghost:hover { background: var(--accent-soft); }
  .ghost:active { transform: scale(0.98); }
  .meta { font-size: 11.5px; margin: 0; color: var(--muted); display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
  .meta b { color: var(--text); font-weight: 700; font-variant-numeric: tabular-nums; }
  .meta.warn { color: var(--warn); } .meta.warn b { color: var(--warn); }
  .meta.error { color: var(--danger); } .meta.error b { color: var(--danger); }
  .link { background: none; border: 0; padding: 0; cursor: pointer; font-family: inherit; min-height: 24px; font-size: 12px; font-weight: 700; color: var(--accent); }
  .link:hover { text-decoration: underline; }
  .code {
    width: 100%; height: 52px; text-align: center; border-radius: 12px;
    border: 1px solid var(--muted); background: var(--bg); color: var(--text);
    font-family: var(--mono); font-size: 15px; font-weight: 700;
    letter-spacing: 0.12em; text-indent: 0.12em; direction: ltr; text-transform: uppercase; padding: 0 12px;
  }
  .code:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .input-label { font-size: 11px; font-weight: 800; color: var(--text); margin-bottom: -2px; }
  .input-caption { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; color: var(--muted); }
  .card-actions { display: flex; gap: 8px; }
  .card-actions .primary { flex: 3 1 0; }
  .card-actions .ghost { flex: 1 1 0; min-width: 0; border: 0; }
  [dir="rtl"] .card-actions { flex-direction: row-reverse; }
  .sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .wrap, .card, .card.shake, .otp-box { animation: none !important; }
    * { transition-duration: 0.01ms !important; }
  }
  `;

  let host = null;
  let shadow = null;
  let observer = null;
  let shadowObserver = null;
  let heartbeat = null;
  let countdown = null;
  let policy = null;
  let strings = {};
  let savedScroll = null;
  let lastFocus = null;
  let pinField = null;
  let styleNode = null;
  let wrapNode = null;
  let lastRestore = 0;
  let appliedBlur = 0;
  let lastBlurValue = "";
  let enforceTick = 0;

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

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null) continue;
        if (key === "text") node.textContent = value;
        else if (key === "class") node.className = value;
        else node.setAttribute(key, value);
      }
    }
    for (const child of children || []) node.appendChild(child);
    return node;
  }

  function t(key) {
    const value = strings[key];
    return value === undefined ? key : value;
  }

  function lockGlyph() {
    const box = el("div", { class: "glyph" });
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "26");
    svg.setAttribute("height", "26");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("aria-hidden", "true");
    const body = document.createElementNS(SVG_NS, "rect");
    body.setAttribute("x", "4");
    body.setAttribute("y", "10.5");
    body.setAttribute("width", "16");
    body.setAttribute("height", "10.5");
    body.setAttribute("rx", "2.5");
    const shackle = document.createElementNS(SVG_NS, "path");
    shackle.setAttribute("d", "M8 10.5V7a4 4 0 0 1 8 0v3.5");
    svg.append(body, shackle);
    box.appendChild(svg);
    return box;
  }

  function lockPageScroll() {
    if (savedScroll) return;
    savedScroll = {
      html: document.documentElement.style.overflow,
      body: document.body ? document.body.style.overflow : null,
    };
    document.documentElement.style.setProperty("overflow", "hidden", "important");
    if (document.body) document.body.style.setProperty("overflow", "hidden", "important");
  }

  function unlockPageScroll() {
    if (!savedScroll) return;
    document.documentElement.style.overflow = savedScroll.html;
    if (document.body && savedScroll.body !== null) document.body.style.overflow = savedScroll.body;
    savedScroll = null;
  }

  function teardown() {
    if (countdown) {
      clearInterval(countdown);
      countdown = null;
    }
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (shadowObserver) {
      shadowObserver.disconnect();
      shadowObserver = null;
    }
    if (pinField) {
      pinField.destroy();
      pinField = null;
    }
    unlockPageScroll();
    if (host && host.parentNode) host.parentNode.removeChild(host);
    host = null;
    shadow = null;
    policy = null;
    styleNode = null;
    wrapNode = null;
    lastBlurValue = "";
    appliedBlur = 0;
    if (lastFocus && typeof lastFocus.focus === "function") {
      try {
        lastFocus.focus({ preventScroll: true });
      } catch (_error) {
        /* The page may have replaced the focused node while it was covered. */
      }
    }
    lastFocus = null;
  }

  /** The blur lives on the host element, which DevTools users will notice is
      not removed when the overlay is rebuilt. Writing only on change avoids a
      style recalculation on every guard tick. */
  function applyBlur() {
    if (!host) return;
    const value = appliedBlur ? "blur(" + appliedBlur + "px)" : "none";
    if (value === lastBlurValue) return;
    lastBlurValue = value;
    host.style.setProperty("backdrop-filter", value, "important");
    host.style.setProperty("-webkit-backdrop-filter", value, "important");
  }

  function autoReloadsUsed() {
    try {
      return Number(window.sessionStorage.getItem(RELOAD_BUDGET_KEY)) || 0;
    } catch (_error) {
      return 0;
    }
  }

  /** Returns the count after spending one reload. A storage failure disables
      reloading outright, so a locked-down storage context can never loop. */
  function spendAutoReload() {
    try {
      const used = autoReloadsUsed() + 1;
      window.sessionStorage.setItem(RELOAD_BUDGET_KEY, String(used));
      return used;
    } catch (_error) {
      return MAX_AUTO_RELOADS + 1;
    }
  }

  /**
   * Rebuilds anything DevTools removed from the gate.
   *
   * A first removal is undone in place. A removal within two seconds of the
   * last restore is treated as tampering and, while the budget lasts, reloads
   * the document so the page is rebuilt with the gate injected at
   * document_start. The reload count is capped per tab session: a page that
   * strips the host on every load would otherwise keep us reloading forever.
   * Once the budget is gone, tampering is answered by re-attaching in place.
   */
  function enforceGate(forceDeep) {
    if (!host || !shadow || !policy) return;

    enforceTick += 1;
    if (!host.isConnected) {
      const now = Date.now();
      if (now - lastRestore < 2000 && spendAutoReload() <= MAX_AUTO_RELOADS) {
        location.replace(location.href);
        return;
      }
      lastRestore = now;
      if (document.documentElement) document.documentElement.appendChild(host);
    }

    /* The host check is cheap and runs on every tick. Rebuilding the shadow
       tree is only checked periodically, or when its own observer reports a
       removal, so the guard does not thrash the page while typing. */
    if (forceDeep || enforceTick % 3 === 0) {
      if (styleNode && !styleNode.isConnected) shadow.insertBefore(styleNode, shadow.firstChild);
      if (wrapNode && !wrapNode.isConnected) shadow.appendChild(wrapNode);
      if (wrapNode && !wrapNode.querySelector(".card")) renderPinView();
      if (appliedBlur && host.style.backdropFilter !== lastBlurValue) {
        lastBlurValue = "";
        applyBlur();
      }
    }
    applyBlur();
  }

  function attachToDocument() {
    const root = document.documentElement;
    if (!root || !host) return;
    root.appendChild(host);
    observer = new MutationObserver(() => enforceGate(false));
    observer.observe(root, { childList: true, subtree: false });
    shadowObserver = new MutationObserver(() => enforceGate(true));
    shadowObserver.observe(shadow, { childList: true });
    /* MutationObserver already catches deliberate removals immediately; this
       timer is only a safety net for page-level tree replacement. */
    heartbeat = setInterval(() => {
      if (!document.hidden) enforceGate(false);
    }, 1000);
  }

  function setMeta(node, text, tone) {
    node.className = "meta" + (tone ? " " + tone : "");
    node.textContent = text || "";
  }

  function startCountdown(meta, until, onExpiry) {
    if (countdown) clearInterval(countdown);
    const paint = () => {
      const remaining = until - Date.now();
      if (remaining <= 0) {
        clearInterval(countdown);
        countdown = null;
        meta.textContent = "";
        if (onExpiry) onExpiry();
        return;
      }
      const parts = t("retryIn").split("{time}");
      setMeta(meta, "", "warn");
      meta.appendChild(document.createTextNode(parts[0]));
      const clock = el("b", { text: Core.formatDuration(Math.ceil(remaining / 1000)) });
      meta.appendChild(clock);
      meta.appendChild(document.createTextNode(parts[1] || ""));
    };
    paint();
    countdown = setInterval(paint, 1000);
  }

  function globeGlyph() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "13");
    svg.setAttribute("height", "13");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "9");
    const equator = document.createElementNS(SVG_NS, "path");
    equator.setAttribute("d", "M3 12h18");
    const meridian = document.createElementNS(SVG_NS, "path");
    meridian.setAttribute("d", "M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z");
    svg.append(circle, equator, meridian);
    return svg;
  }

  /** Plain text with a small site mark. Never a hyperlink. */
  function hostLabel() {
    const info = Core.normalizeUrl(policy && policy.pageUrl);
    const label = (policy && policy.host) || (info ? info.host : "");
    const node = el("span", { class: "host", dir: "ltr" });
    node.append(globeGlyph(), el("span", { class: "host-text", text: label }));
    return node;
  }

  function renderPinView() {
    if (!shadow) return;
    const card = shadow.querySelector(".card");
    if (!card) return;
    if (pinField) pinField.destroy();
    card.textContent = "";

    const mount = el("div", { class: "otp-mount" });
    const submit = el("button", { class: "primary", type: "button", text: t("unlock") });
    const meta = el("p", { class: "meta", id: "locktab-meta", role: "status", "aria-live": "polite" });
    const recover = el("button", { class: "link", type: "button", text: t("useRecovery") });

    card.append(
      lockGlyph(),
      el("h2", { class: "title", id: "locktab-title", text: t("lockHeading") }),
      el("p", { class: "subtitle", text: t("lockSubtitle") }),
      hostLabel(),
      el("div", { class: "field" }, [mount]),
      submit,
      meta,
      recover
    );

    pinField = Pin.create(mount, {
      label: t("pinLabel"),
      hint: t("pinMoreHint"),
      max: policy && policy.pinLength ? policy.pinLength : Core.PIN_MAX,
      onChange: () => pinField && pinField.setInvalid(false),
      onSubmit: () => submit.click(),
    });

    const attempt = async () => {
      if (submit.disabled) return;
      const value = pinField.getValue();
      if (!Core.validatePin(value)) {
        pinField.setInvalid(true);
        pinField.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = t("verifying");

      const answer = await send({ type: "VERIFY_PIN", pin: value });

      if (answer && answer.ok) {
        teardown();
        return;
      }

      submit.textContent = t("unlock");
      submit.disabled = false;
      pinField.clear();
      pinField.setInvalid(true);
      pinField.focus();

      if (answer && answer.error === "locked_out" && answer.retryAfterMs > 0) {
        submit.disabled = true;
        startCountdown(meta, Date.now() + answer.retryAfterMs, () => {
          submit.disabled = false;
        });
        return;
      }
      if (answer && answer.error === "no_pin") {
        setMeta(meta, t("recoveryPrompt"), "error");
        return;
      }

      setMeta(meta, answer && answer.error === "wrong_pin" ? t("pinWrong") : t("errorGeneric"), "error");
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 220);
    };

    submit.addEventListener("click", attempt);
    recover.addEventListener("click", renderRecoveryView);

    const lockedUntil = policy && policy.lockedUntil ? policy.lockedUntil : 0;
    if (lockedUntil > Date.now()) {
      submit.disabled = true;
      startCountdown(meta, lockedUntil, () => {
        submit.disabled = false;
      });
    } else if (
      policy &&
      policy.remaining !== null &&
      policy.remaining !== undefined &&
      policy.remaining < Core.SOFT_ATTEMPT_LIMIT
    ) {
      setMeta(meta, t("attemptsLabel") + ": " + policy.remaining, "warn");
    }

    setTimeout(() => pinField && pinField.focus(), 30);
  }

  function renderRecoveryView() {
    if (!shadow) return;
    const card = shadow.querySelector(".card");
    if (!card) return;
    card.textContent = "";

    const input = el("input", {
      id: "locktab-recovery-code",
      class: "code",
      type: "text",
      maxlength: "29",
      autocomplete: "off",
      autocapitalize: "characters",
      spellcheck: "false",
      dir: "ltr",
    });
    const submit = el("button", { class: "primary", type: "button", text: t("unlock") });
    const back = el("button", { class: "ghost", type: "button", text: t("cancel") });
    const meta = el("p", { class: "meta", id: "locktab-meta", role: "status", "aria-live": "polite" });

    card.append(
      lockGlyph(),
      el("h2", { class: "title", id: "locktab-title", text: t("recoveryHeading") }),
      el("p", { class: "subtitle", text: t("recoverySubtitle") }),
      el("div", { class: "field" }, [
        el("label", { class: "input-label", for: "locktab-recovery-code", text: t("recoveryHeading") }),
        input,
        el("span", { class: "input-caption", text: t("recoveryPlaceholder") }),
      ]),
      el("div", { class: "card-actions" }, [submit, back]),
      meta
    );

    const attempt = async () => {
      if (!Core.validateRecoveryCode(input.value)) {
        input.setAttribute("aria-invalid", "true");
        setMeta(meta, t("recoveryInvalid"), "error");
        return;
      }
      submit.disabled = true;
      input.disabled = true;
      submit.textContent = t("verifying");
      const answer = await send({ type: "RECOVER", code: input.value });
      if (answer && answer.ok) {
        setMeta(meta, t("recoveryPrompt"));
        return;
      }
      submit.textContent = t("unlock");
      submit.disabled = false;
      input.disabled = false;
      setMeta(meta, answer && answer.error === "recovery_used" ? t("recoveryUsed") : t("recoveryInvalid"), "error");
    };

    submit.addEventListener("click", attempt);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        attempt();
      }
    });
    back.addEventListener("click", renderPinView);
    setTimeout(() => input.focus({ preventScroll: true }), 30);
  }

  function build(payload) {
    strings = payload.strings || {};
    host = document.createElement(HOST_TAG);
    host.style.cssText =
      "position:fixed!important;inset:0!important;width:100%!important;height:100%!important;" +
      "margin:0!important;padding:0!important;border:0!important;display:block!important;" +
      "z-index:2147483647!important;background:transparent!important;";

    shadow = host.attachShadow({ mode: "closed" });
    styleNode = document.createElement("style");
    styleNode.textContent = fontCss() + "\n" + STYLE;
    wrapNode = el("div", { class: "wrap", dir: payload.dir || "ltr", lang: payload.locale || "en" });
    appliedBlur = Number(payload.blur) > 0 ? Core.clampBlur(payload.blur) : 0;

    wrapNode.appendChild(
      el("section", {
        class: "card",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "locktab-title",
      })
    );
    shadow.append(styleNode, wrapNode);
    applyBlur();

    /* The host is created once, but every render rebuilds the card. Attaching
       these here keeps keystrokes inside the gate without stacking a fresh
       listener set with each view switch. */
    for (const type of ["keydown", "keyup", "keypress", "paste", "input"]) {
      host.addEventListener(type, (event) => event.stopPropagation());
    }

    shadow.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Tab") return;
        const focusable = shadow.querySelectorAll("input, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && shadow.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && shadow.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      },
      true
    );

    lastFocus = document.activeElement;
    lockPageScroll();
    attachToDocument();
    renderPinView();
  }

  function show(payload) {
    policy = payload;
    if (host && shadow) {
      appliedBlur = Number(payload.blur) > 0 ? Core.clampBlur(payload.blur) : 0;
      applyBlur();
      if (payload.lockedUntil && payload.lockedUntil > Date.now()) renderPinView();
      return;
    }
    build(payload);
  }

  function hide() {
    if (host) teardown();
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (!message || message.type !== "POLICY") return;
    if (message.locked) show(message);
    else hide();
  });

  function whenRootReady(callback) {
    if (document.documentElement) {
      callback();
      return;
    }
    const watcher = new MutationObserver(() => {
      if (!document.documentElement) return;
      watcher.disconnect();
      callback();
    });
    watcher.observe(document, { childList: true, subtree: true });
  }

  whenRootReady(() => {
    send({ type: "PAGE_PING" }).then((payload) => {
      if (payload && payload.locked) show(payload);
    });
  });
})();
