# ScienceHub.io static repository audit

Audit basis: GitHub default branch `main`, commit `5adba1fddaf6a8164fdb6a4c4230a44cbf252a60` (2026-10-20). Repository tree contains 252 tracked files at this revision. This is a source/static audit, not a browser session.

## Confirmed results

- `index.html` local references resolve: manifest, stylesheet, app module, and frontend icon.
- Manifest parses as JSON; both icon paths exist in the repository.
- All local assets listed in `6_sw.js` exist, including academic modules and icon assets.
- `index.html` and `3_index.html` have identical Git blob SHA; preserved because duplicate content alone does not establish that deletion is safe.
- `academic/academic-store.js` saves app state to `localStorage` when IndexedDB is unavailable, but the pre-patch `loadAppState()` did not read that fallback key. This was a confirmed persistence bug.
- `academic/academic-data.js` declares `pyqs: []`; PYQ data coverage is currently empty in this dataset.
- Dataset status explicitly says detailed topic/concept mapping is pending. Chapter/unit names do not prove full syllabus coverage.
- `5_app.js` states that live Sukoon.Brain AI routing is not connected in this build.
- Service worker uses a network-first strategy with cache fallback; browser offline cold-start has not been independently verified.

## Safety constraints

- No repository files were deleted or moved during this audit.
- No cleanup moves are pre-approved in `cleanup-plan.json`.
- Upgrade Guard files were not changed.

## Limits

GitHub connector rejected branch creation with HTTP 403 (`Resource not accessible by integration`), so this session could not push a branch or open a pull request. Apply this patch locally and push from an authorized GitHub session, or retry after connector write permissions are corrected. Live browser/device testing could not be performed in this environment.
