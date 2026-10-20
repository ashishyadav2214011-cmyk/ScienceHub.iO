# ScienceHub.io — Safe Repository Fix Pack

This is an overlay patch pack, not a full repository backup and not a claim that every feature is complete.

## Included replacements
- `index.html`: adds primary icon and Apple touch icon metadata; aligns theme color with the manifest.
- `3_index.html`: keeps the duplicate entry page consistent with `index.html`.
- `3_manifest.webmanifest`: adds explicit PWA `id` and `scope`; preserves the two existing official icon assets.
- `6_sw.js`: versions the cache, precaches assets independently, prefers fresh network responses, and falls back to cached files for offline use.

It deliberately does **not** modify Upgrade Guard, AI routing, academic content, approved icon artwork, `5_app.js`, or legacy `sw.js`.

## Apply safely
1. Back up the repository or create a branch first.
2. Extract this ZIP into the repository root, preserving filenames.
3. Confirm these existing root assets remain present:
   - `11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png`
   - `11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png`
   - `12_SUKOON-BRAIN-REALTIME-ICON.png`
4. Review the diff, then commit and push if correct.

## Verify after deployment
- Wait for GitHub Pages deployment to finish.
- Open the site in a private/incognito tab.
- Test navigation, search, class/language switching, a practice attempt, and Sukoon panel.
- Visit once online, then test offline behavior.
- If an installed PWA still uses an older worker, close its windows and reopen; clearing site data may be needed for a clean test.

## Limits
Source references were inspected against the repository snapshot available on 2026-10-20. This pack has structural checks only; it has not been tested on every browser/device. A successful Pages build does not prove all runtime behavior. Actual home-screen icon rendering still needs device verification.
