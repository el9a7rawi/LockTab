/* ============================================================================
   LockTab — pin.js
   OTP-style digit boxes. The row grows with what the user has typed and stops
   at the expected length: six while creating a new PIN, the recorded length of
   a saved one while verifying. Boxes are reused in place so typing animates
   only the box that changed instead of rebuilding the whole field.
   ========================================================================== */

(function (global) {
  "use strict";

  const Core = global.LockTabCore;
  const I18n = global.LockTabI18n;
  const MAX = Core ? Core.PIN_MAX : 6;

  const ICONS = {
    idle:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/></svg>',
    ok: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16.3 9.4"/></svg>',
    bad: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/></svg>',
  };

  function labelFor(labelId, fallback) {
    if (!labelId) return fallback;
    const node = document.getElementById(labelId);
    return node ? node.textContent.trim() : fallback;
  }

  function create(mount, options) {
    if (!mount) return null;
    const settings = options || {};
    let max = Math.min(MAX, Math.max(1, Number(settings.max) || MAX));
    const label = labelFor(settings.labelId, settings.label || "PIN");
    const hintText = settings.hint || (I18n ? I18n.t("pinMoreHint") : "6 digits");
    const onChange = typeof settings.onChange === "function" ? settings.onChange : () => {};
    const onSubmit = typeof settings.onSubmit === "function" ? settings.onSubmit : null;
    let digits = [];
    let wrap = null;
    let hint = null;

    function visibleCount() {
      return Core ? Core.otpBoxCount(digits.length, max) : Math.min(max, Math.max(1, digits.length + 1));
    }

    function focusBox(index) {
      if (!wrap) return;
      const boxes = wrap.querySelectorAll(".otp-box");
      const target = boxes[Math.max(0, Math.min(index, boxes.length - 1))];
      if (target) target.focus({ preventScroll: true });
    }

    function makeBox(index) {
      const input = document.createElement("input");
      input.className = "otp-box";
      /* A real password field renders the platform's bullet glyph, which the
         bundled Arabic font draws as a black square. A plain field showing an
         asterisk is predictable across every script we support. */
      input.type = "text";
      input.inputMode = "numeric";
      input.pattern = "[0-9]*";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.autocapitalize = "off";
      input.spellcheck = false;
      input.dir = "ltr";
      input.setAttribute("aria-label", label + " — " + (index + 1));

      input.addEventListener("input", () => {
        const digit = input.value.replace(/\D/g, "").slice(-1);
        if (!digit) return;
        digits[index] = digit;
        digits = digits.slice(0, max);
        render(index + 1, index);
        onChange(getValue());
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
          event.preventDefault();
          if (input.value) digits.splice(index, 1);
          else if (index >= digits.length && digits.length) digits.pop();
          else if (digits.length) digits.splice(index, 1);
          render(Math.max(0, index - 1), Math.max(0, index - 1));
          onChange(getValue());
          return;
        }
        if (event.key === "Delete") {
          event.preventDefault();
          digits.splice(index, 1);
          render(index, index);
          onChange(getValue());
          return;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          if (onSubmit) onSubmit(getValue());
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          focusBox(index - 1);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          focusBox(index + 1);
        }
      });

      input.addEventListener("paste", (event) => {
        const text = (event.clipboardData || global.clipboardData).getData("text");
        const clean = text.replace(/\D/g, "").slice(0, max);
        if (!clean) return;
        event.preventDefault();
        digits = clean.split("");
        render(Math.min(digits.length, max - 1), digits.length - 1);
        onChange(getValue());
      });

      return input;
    }

    function render(focusIndex, changedIndex) {
      const count = visibleCount();
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "otp";
        mount.appendChild(wrap);
      }

      for (let index = 0; index < count; index += 1) {
        let box = wrap.children[index];
        if (!box || box === hint) {
          box = makeBox(index);
          box.classList.add("otp-enter");
          wrap.appendChild(box);
        }
        box.value = digits[index] ? "*" : "";
        box.classList.toggle("filled", Boolean(box.value));
        box.classList.toggle("otp-next", index === digits.length);
      }

      while (wrap.children.length > count) wrap.removeChild(wrap.lastChild);

      /* The hint stays in place while typing: it explains the growing row
         instead of vanishing as soon as the first digit is entered. */
      if (!hint) {
        hint = document.createElement("span");
        hint.className = "otp-hint";
        mount.appendChild(hint);
      }
      hint.textContent = hintText;

      if (focusIndex !== undefined) focusBox(focusIndex);
    }

    function getValue() {
      return digits.filter(Boolean).join("");
    }

    function setValue(value) {
      digits = String(value == null ? "" : value)
        .replace(/\D/g, "")
        .slice(0, max)
        .split("")
        .filter(Boolean);
      render();
      onChange(getValue());
    }

    render();

    return {
      getValue,
      setValue,
      setMax(next) {
        const resolved = Math.min(MAX, Math.max(1, Number(next) || MAX));
        if (resolved === max) return;
        max = resolved;
        digits = digits.slice(0, max);
        render();
      },
      clear() {
        setValue("");
      },
      focus() {
        focusBox(0);
      },
      setInvalid(invalid) {
        if (wrap) wrap.classList.toggle("invalid", Boolean(invalid));
      },
      destroy() {
        mount.textContent = "";
        wrap = null;
        hint = null;
      },
    };
  }

  /** Three-state match badge: unfinished (slate), equal (green), unequal (red). */
  function createMatchIndicator(node, fields) {
    if (!node) return { update() {}, node };

    const icon = node.querySelector(".match-icon");
    const text = node.querySelector(".match-text");

    function update() {
      const values = fields.map((field) => (field ? field.getValue() : ""));
      const first = values[0] || "";
      const complete = first.length >= (Core ? Core.PIN_MIN : 6);
      const equal = complete && values.every((value) => value === first);

      let state = "idle";
      let copy = I18n ? I18n.t("pinIncomplete") : "Keep typing";
      if (equal) {
        state = "ok";
        copy = I18n ? I18n.t("pinMatchOk") : "PINs match";
      } else if (complete && values.some((value) => value.length >= first.length && value !== first)) {
        state = "bad";
        copy = I18n ? I18n.t("pinMismatch") : "PINs don't match";
      }

      node.dataset.state = state;
      if (icon) icon.innerHTML = ICONS[state];
      if (text) text.textContent = copy;
    }

    update();
    return { update, node };
  }

  global.LockTabPin = { create, createMatchIndicator };
})(typeof globalThis !== "undefined" ? globalThis : self);
