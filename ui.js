/* ============================================================================
   LockTab — ui.js
   The composable select used across the extension. The native <select> stays
   in the DOM as the source of truth for value and form semantics; the visible
   button and listbox are ours, so styling is identical in every browser and
   does not inherit Chrome's or Firefox's system menu.
   ========================================================================== */

(function (global) {
  "use strict";

  const CHEVRON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  const CHECK =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  const GLOBE =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></svg>';

  let selectSequence = 0;

  function createSelect(native) {
    if (!native || native.dataset.customSelect === "ready") return null;
    native.dataset.customSelect = "ready";
    const iconMode = native.id === "localeSelect";
    native.setAttribute("tabindex", "-1");
    native.setAttribute("aria-hidden", "true");
    native.hidden = true;

    const selectId = "cselect-" + (selectSequence += 1);
    const wrapper = document.createElement("div");
    wrapper.className = iconMode ? "cselect lang" : "cselect";

    const button = document.createElement("button");
    button.className = "cselect-btn";
    button.type = "button";
    button.setAttribute("role", "combobox");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", selectId + "-list");

    const labelledBy = native.getAttribute("aria-labelledby");
    if (labelledBy) {
      button.setAttribute("aria-labelledby", labelledBy);
    } else {
      /* The native select is hidden, so its translated name must move to the
         visible button or screen readers announce an anonymous combobox. */
      const ariaLabel = native.getAttribute("aria-label");
      if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
      const title = native.getAttribute("title");
      if (title) button.setAttribute("title", title);
    }

    let valueNode = null;
    if (iconMode) {
      button.innerHTML = GLOBE;
    } else {
      valueNode = document.createElement("span");
      valueNode.className = "cselect-value";
      const chevron = document.createElement("span");
      chevron.className = "cselect-chev";
      chevron.innerHTML = CHEVRON;
      button.append(valueNode, chevron);
    }

    const menu = document.createElement("ul");
    menu.id = selectId + "-list";
    menu.className = iconMode ? "cselect-menu cselect-lang-menu" : "cselect-menu";
    menu.setAttribute("role", "listbox");
    if (labelledBy) menu.setAttribute("aria-labelledby", labelledBy);
    menu.hidden = true;

    native.parentNode.insertBefore(wrapper, native);
    wrapper.append(button, menu);

    let highlight = -1;

    function options() {
      return Array.from(native.options);
    }

    function paint() {
      const selected = native.options[native.selectedIndex];
      if (valueNode) valueNode.textContent = selected ? selected.textContent : "";
      menu.textContent = "";

      options().forEach((option, index) => {
        const item = document.createElement("li");
        item.className = "cselect-option";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(option.selected));
        item.id = selectId + "-option-" + index;
        item.dataset.index = String(index);

        const label = document.createElement("span");
        label.className = "cselect-opt-label";
        label.textContent = option.textContent;
        const check = document.createElement("span");
        check.className = "cselect-check";
        check.innerHTML = CHECK;
        item.append(label, check);

        item.addEventListener("click", () => choose(index));
        menu.appendChild(item);
      });
    }

    function open() {
      menu.hidden = false;
      button.setAttribute("aria-expanded", "true");
      wrapper.classList.add("open");
      highlight = Math.max(0, native.selectedIndex);
      syncHighlight();
    }

    function close() {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
      wrapper.classList.remove("open");
      button.removeAttribute("aria-activedescendant");
      highlight = -1;
    }

    function syncHighlight() {
      const items = menu.querySelectorAll(".cselect-option");
      items.forEach((item, index) => item.classList.toggle("highlight", index === highlight));
      if (items[highlight]) button.setAttribute("aria-activedescendant", items[highlight].id);
      else button.removeAttribute("aria-activedescendant");
      if (highlight >= 0 && items[highlight]) {
        items[highlight].scrollIntoView({ block: "nearest" });
      }
    }

    function choose(index) {
      const option = native.options[index];
      if (!option) return;
      native.selectedIndex = index;
      native.dispatchEvent(new Event("change", { bubbles: true }));
      paint();
      close();
      button.focus();
    }

    button.addEventListener("click", () => {
      if (menu.hidden) open();
      else close();
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!menu.hidden) {
          event.preventDefault();
          close();
        }
        return;
      }

      const opens = event.key === "ArrowDown" || event.key === "ArrowUp" ||
                    event.key === "Enter" || event.key === " ";
      if (!opens) return;

      if (menu.hidden) {
        event.preventDefault();
        open();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        highlight = Math.min(options().length - 1, Math.max(0, highlight + step));
        syncHighlight();
      } else {
        /* Enter and Space commit the same highlighted option once open. */
        event.preventDefault();
        choose(highlight);
      }
    });

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) close();
    });

    paint();

    return {
      setValue(value) {
        native.value = value;
        paint();
      },
      refresh() {
        paint();
      },
      close,
    };
  }

  global.LockTabUI = { createSelect };
})(typeof globalThis !== "undefined" ? globalThis : self);
