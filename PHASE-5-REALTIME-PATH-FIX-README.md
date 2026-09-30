# ScienceHub.io — Phase 5 Real-Time Path Fix

## Purpose
This is a minimal corrective package for the current repository state.

The Phase 5 runtime files are already present in the repository, but the three academic ES modules were uploaded at repository root while `5_app.js` imports them from `./academic/`.

## Correct target structure

```text
ScienceHub.iO/
└── academic/
    ├── academic-data.js
    ├── academic-store.js
    └── academic-engine.js
```

## Included files
- `academic/academic-data.js`
- `academic/academic-store.js`
- `academic/academic-engine.js`

No Phase 1–5 specification files are included or removed by this patch.

## Important
After extracting this ZIP, place the `academic` folder at the repository root so the existing imports in `5_app.js` and cache entries in `6_sw.js` resolve correctly.

Expected imports:
- `./academic/academic-data.js`
- `./academic/academic-store.js`
- `./academic/academic-engine.js`
