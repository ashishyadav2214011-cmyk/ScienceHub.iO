# ScienceHub.io P0 Entry-Point Fix (overlay)

## Purpose
Align the repository root `index.html` with the Phase 5 runtime already declared in `3_index.html`.

## Root cause verified from GitHub
The old root `index.html` referenced `manifest.json`, `sciencehub-icon-192.png`, `style.css`, `perspective.css`, `sciencehub-v101.css`, `sciencehub-v102-repair.css`, `app.js`, and several bridge scripts. Fetching those paths from the repository root returned 404. The existing `3_index.html` instead loads `3_manifest.webmanifest`, `4_styles.css`, and `5_app.js`.

## Change
Replace the repository root `index.html` with the supplied file. It uses the same runtime entry references as `3_index.html`, so opening the repository root will launch the Phase 5 academic runtime rather than trying to load missing legacy assets.

## Apply
Copy this `index.html` over the repository root `index.html` in the GitHub repository, then commit it with message:
`Fix P0: align root entry point with Phase 5 runtime`

## Verification still required
- Open the deployed root URL and confirm Home renders.
- Check browser console for failed asset/module requests.
- Verify Learning, Practice, Performance, Settings and Sukoon button.
- Test hard reload and offline behavior separately (service-worker fixes are not included in this P0 overlay).

## Scope boundary
This is a one-file P0 overlay, not a full repository ZIP and not a claim that browser/runtime testing passed. The connected GitHub integration denied both branch creation and file update with HTTP 403, so no remote repository change was made by this assistant.
