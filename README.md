# ScienceHub Phase 5 starter patch (review before applying)

This patch addresses two code-level foundations only:

1. `academic/academic-store.js`: reads the localStorage fallback on startup, tolerates storage/IndexedDB errors, and keeps in-session fallbacks for attempts/revision.
2. `academic/academic-engine.js`: applies the approved `+2 / -1 / skipped 0` score model, excludes skipped attempts from accuracy, records retries as separate attempts, and requires at least two non-skipped attempts before flagging a weak concept.

## Important limitations

- This is **not** a complete Phase 1–5 implementation.
- The current UI (`5_app.js`) still uses a single text input and does not yet expose a Skip action or display the score. UI integration is a separate required change.
- Run the existing project tests and browser tests after applying. This patch has not been tested against real IndexedDB in a browser.
- Apply on a separate branch and review the diff; do not overwrite `main` blindly.
