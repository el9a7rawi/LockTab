# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- The first box in "Set a site PIN" is now the main PIN. It was verified against the site's previous PIN whenever a rule existed, so changing a custom PIN only worked when all three boxes held the same digits. The main-PIN check also no longer counts as a lock-screen guess or grants a temporary unlock. The box is shown before the site has a rule and is translated in all eight languages.

## [1.0.3] - 2026-11-24

### Fixed

- Ship `popup.js` in every release archive. The v1.0.2 archive omitted the popup controller, so the installed extension showed an empty popup and could not create a PIN or lock a tab.

### Changed

- Fail the release build when any script referenced by an HTML page is missing from the staged files, so an archive with an empty popup can never be published again.

- Mirror the reference release and README format exactly: six badges, centered language strip, browser table in an alignment wrapper, eight numbered sections with a 14-part interface tour, and the same separator placement in every translation.
- Rebuild all eight banners as real HTML/CSS composited at 1500x500 CSS pixels and captured at 2x into 3000x1000 WebP with transparent rounded corners, using the same dark tokens, Inter Tight / Cairo / Noto Sans SC typography and product-shot structure as the reference.
- Regenerate every README screenshot from the shipped popup markup through a generated fixture and headless Chrome at 2x, with transparent dynamic corners and a theme-aware inner border, in all eight languages.
- Add square social posts rendered from HTML/CSS at 2x and downsampled in-page for crisp type.
- Rewrite the eight banner headlines and supporting copy around a concrete moment and outcome ("Step away. Still locked."), and make the four chips name distinct capabilities instead of restating the PIN claim.
- Frame every README screenshot on the whole popup rather than an isolated card, and group neighbouring cards in each fixture state so a single capture shows several features in context.
- Take the screenshot fixture off the shipped 600px popup cap, so a capture paints the full panel while the published popup and stylesheet stay unchanged.
- Replace the single hand-drawn product preview in every banner with a staggered gallery of four real captures: the live lock gate, tab status and action, the locked-sites list, and the true-black theme. Each carries a translated label, and the layout mirrors logically in Arabic.
- Wait for image decode and font readiness before capturing a banner instead of using a fixed delay, so a slow local decode cannot leave a blank frame.

### Fixed
- Render locked-site rows exactly as the popup does: index, domain plus path, and the translated inherited/custom PIN badge, instead of a host-only approximation.
- Bring the lock-screen capture closer and apply the same transparent rounded-corner mask used by the other interface shots.

### Fixed
- Localize the status label and PIN-match text in the screenshot fixture instead of falling back to English markup in translated captures.
- Render the status icon and its translated label in every captured state; the empty and locked-sites shots previously showed an empty square.
- Show the correct inherited-PIN state in the site card: the "uses your main PIN" badge with a single "set a site PIN" action, hiding the revert button that only exists once a custom PIN is set.
- Shorten the language-menu capture and keep the real panel visible behind it so the shot reads as a live extension.
- Remove the PIN hint from the popup action capture and replace it with an actual lock-screen photo of the shipped overlay.
- Retry an individual capture when Chrome keeps the DevTools port busy, so one transient launch failure no longer aborts a whole locale run.

### Added
- `tools/capture-lockscreen.mjs` and a dev fixture that drives the production `core.js`, `pin.js` and `overlay.js` with a translated POLICY payload, producing a real lock-screen WebP in all eight languages. The gate is shown with four entered digits to document how the OTP row grows and stops at six.

## [1.0.2] - 2026-11-24

### Fixed
- Stop the page reloading on every post or photo click on Facebook. The overlay acknowledged no POLICY message, so Chrome reported the handoff as failed and the background escalated to `tabs.reload` on each SPA URL change; the overlay now answers every policy push and `pushPolicy` no longer reloads tabs.
- Report `content_unavailable` for an unreachable content script instead of silently discarding the page state.
- Clear the `Uncaught TypeError: Cannot assign to read only property '__locktabInstalled'` errors: the install marker is now configurable so the background can delete it, and re-injected overlays install again instead of silently bailing out.

### Changed
- Rebuild all eight README covers in the reference art direction: black canvas, single restrained accent, two-line statement, product mockup and floating confirmation.
- Redraw all 64 interface captures so each section shows a different part of the product instead of one repeated card.
- Exclude the current language from each README's language picker and translate the section headings in every bundle.

## [1.0.1] — 2026-11-23

### Fixed
- Restore tab locking: a stray `global.matchMedia` reference threw before the overlay could mount, so the rule was stored but the page was never covered.
- Make the blur option visible again: an OS-level reduced-transparency preference no longer overrides the explicit user choice, the scrim is lighter while blurring, and `contain: paint` was dropped.
- Detect a failed POLICY delivery, re-inject the content script and retry, then surface an actionable message (superseded in Unreleased: the last-resort reload was removed).
- Vertically centre the PIN asterisk in its box.
- Use a light grey border on the reset confirmation panel and remove the cancel button's border while keeping red text.
- Coalesce overlay guard callbacks on mutation-heavy pages and keep all animations off while blurring.
- Fix `SET_SITE_PIN` so the page is covered immediately, reinitialise stale content scripts before re-injection, and refresh the overlay when the language changes.
- Refresh injected fonts after navigation, narrow policy broadcasts to overlay-relevant settings, and restore keyboard focus visibility in OTP boxes.
- Stop the lock gate flashing off during document_start by trusting the content script's document URL over a stale tab URL.
- Remove the automatic page reload from the overlay guard; re-attach in place instead, which fixes repeated reloads on YouTube and other SPAs.
- Make PIN entry instant: drop the per-keystroke pop animation and forced layout, and focus boxes synchronously.
- Show an asterisk instead of the platform password glyph in PIN boxes.
- Remove the redundant site icon from the locked-sites list and add a tinted globe mark to the lock screen's host name.
- Drop the duplicated recovery label and suspend the full-viewport blur on hidden tabs or when reduced transparency is requested.
- Stop refreshing the toolbar badge on unlock changes, which queried every tab on each PIN entry.
- Authorize every background message by sender scope; only the popup may set, change or reset the PIN, and only our content script may ask policy questions.
- Reject a second `SETUP_PIN` when a PIN already exists.
- Decay the failed-attempt counter after a lockout has been served, so one typo a day no longer keeps the user locked out forever.
- Drop temporary unlocks when the last tab holding their URL closes.
- Bound the overlay's automatic reload budget to prevent a reload loop.
- Restore the lock dialog's accessible name and label the recovery-code field.
- Fix keyboard selection in the custom combobox and stop accumulating key listeners on the overlay host.
- Re-enable the unlock button when a lockout countdown expires.
- Keep the "until the tab closes" unlock text instead of turning it into a huge timer.
- Name the language combobox for screen readers and fix default-state text contrast.
- Normalize a trailing dot in hostnames, which otherwise bypassed a URL-keyed lock.
- Make every PIN/rules mutation atomic, clean up orphaned per-site attempt counters, and keep corrupt salts from disabling verification.

### Changed
- Remove the redundant `activeTab` permission and the unused fallback lock page.
- Cap PBKDF2 iteration counts read from storage.
- Give the extension a single production voice: "Your tabs. Your eyes only." across the manifest, the lock screen and all eight locale bundles.
- Rewrite all eight READMEs in the reference release format with localized banners, six badges, browser icons and an eight-section tour.
- Add round transparent corners to every banner and interface capture, and a localized social post for English and Arabic.
- Add CI and tag-driven release workflows that publish five browser archives with SHA-256 checksums and no governance or development files.

## [1.0.0] — 2026-11-22

### Added

- Per-tab locking with a 6-digit global PIN and an optional PIN per page.
- PIN derivation with PBKDF2-HMAC-SHA256, 600,000 iterations and a unique
  16-byte salt per secret. Only the derived hash and its parameters are stored.
- One-time recovery code shown after setup; using it clears all PINs and locks.
- Escalating lock-out after repeated wrong PINs: 30s → 60s → 300s → 900s cap.
- Closed shadow-root overlay with focus trapping, scroll suppression, and
  re-injection if the page removes it.
- Temporary unlock with a selectable duration (never / 1 / 5 / 15 / 30 / 60 min).
- Locked-tab counter on the extension icon, with an opt-out.
- Light and dark themes; Arabic RTL layout; eight interface languages.
- Manifest V3 build for Chromium and Firefox 121+.

### Security notes

- The content script never receives a hash, salt, iteration count, or attempt
  counter. Verification happens exclusively in the background page.
- Opening the popup never bypasses a lock: every action that widens access asks
  for the PIN again.
- The attempt counter is shared across all sites when the global PIN is used,
  so switching tabs cannot reset the lock-out ladder.

[Unreleased]: https://github.com/el9a7rawi/LockTab/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/el9a7rawi/LockTab/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/el9a7rawi/LockTab/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/el9a7rawi/LockTab/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/el9a7rawi/LockTab/releases/tag/v1.0.0
