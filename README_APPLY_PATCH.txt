ScienceHub.io — Stabilization Patch
===================================

TYPE
----
Overlay patch, not a full repository snapshot.
Target: ashishyadav2214011-cmyk/ScienceHub.iO

FILES
-----
- academic/academic-store.js: fixes app-state persistence when IndexedDB is missing or fails.
  It reads the `sciencehub.phase5.app` localStorage fallback, restores it across fresh store
  instances, and falls back to localStorage if IndexedDB reads/writes fail.
- scripts/validate_repo.py: standard-library static audit helper.
- scripts/safe_cleanup.py: manifest-driven move helper. Dry-run by default, never deletes,
  refuses overwrites, backs up sources, and attempts rollback.
- tests/test_academic_store_fallback.mjs: automated localStorage fallback smoke test.
- cleanup-plan.json: zero moves approved.
- reports/: audit and verification notes.

APPLY SAFELY
------------
1. Create a backup or branch before applying.
2. Extract this ZIP at the repository root, preserving folder paths.
3. Review the diff for academic/academic-store.js; do not replace other app files blindly.
4. From the repository root run:
     python scripts/validate_repo.py
     node --experimental-default-type=module tests/test_academic_store_fallback.mjs
     python scripts/safe_cleanup.py
5. The cleanup command is a dry-run and currently has zero approved moves. Do not approve
   moves without reviewing references and usage. No automatic deletion is performed.
6. Test actual browser rendering, IndexedDB failure, PWA installation, and offline cold start
   on desktop and mobile before publishing.

LIMITS
-----
- Upgrade Guard and visual assets are not included in this patch and are not modified.
- PYQ coverage remains incomplete (`pyqs: []` in the current dataset); this patch does not
  invent or fabricate academic content.
- Live Sukoon.Brain AI routing remains unconnected in the current frontend.
- Browser/device/offline tests are not claimed as passed.
- GitHub API writes were rejected with HTTP 403 in this session. This ZIP is prepared, but
  the fix has NOT been committed to the remote repository by this assistant.
