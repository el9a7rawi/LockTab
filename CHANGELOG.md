# Changelog

All notable changes to LockTab are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-11-23

### Fixed
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

[1.0.1]: https://github.com/el9a7rawi/LockTab/releases/tag/v1.0.1
[1.0.0]: https://github.com/el9a7rawi/LockTab/releases/tag/v1.0.0
