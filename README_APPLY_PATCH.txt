ScienceHub.io — Stabilization Patch ZIP
========================================

PATCH TYPE
----------
Overlay patch (not a complete repository snapshot).
Repository reviewed: ashishyadav2214011-cmyk/ScienceHub.iO
Reviewed tree snapshot: cb64ef77d4c4cd671a53fb84862a1dbb921966ca

CONTENTS
--------
- academic/academic-store.js: fixes the fallback app-state persistence bug. The old code
  wrote `sciencehub.phase5.app` to localStorage when IndexedDB was unavailable, but did
  not read that key back on load. The replacement reads it and uses it if IndexedDB state
  cannot be read; it also falls back to localStorage if an IndexedDB write fails.
- scripts/validate_repo.py: standard-library static checks for local index references,
  manifest JSON/icon paths, identical-content groups, and an academic data report.
- scripts/safe_cleanup.py: manifest-driven cleanup helper. Dry-run is default; moves require
  explicit entries in cleanup-plan.json and the --apply flag. It refuses overwrites,
  backs up source files, never deletes files, and attempts rollback if a move fails.
- cleanup-plan.json: intentionally has zero pre-approved moves.
- reports/: audit notes and verification status.

HOW TO APPLY
------------
1. Back up or branch the repository first.
2. Extract this ZIP into a clean copy of the repository root, preserving folder paths.
3. Review the diff before replacing academic/academic-store.js.
4. Run `python scripts/validate_repo.py` from the repository root.
5. Run `python scripts/safe_cleanup.py` (dry-run; currently no moves are approved).
6. Do not add a move to cleanup-plan.json until you have reviewed all references and usage.
   Then run dry-run again and only apply with `python scripts/safe_cleanup.py --apply`.
7. Test the site manually on desktop/mobile and with offline behaviour before publishing.

SAFETY AND LIMITS
-----------------
- Upgrade Guard is untouched.
- Approved visual assets are neither redesigned nor replaced.
- No files are deleted, merged, or moved by default.
- Duplicate content is only a review signal, not proof that files can be removed.
- This ZIP does not push or commit changes to GitHub.
- The static scripts do not prove runtime correctness, official syllabus completeness, or
  browser/device/offline cold-start behaviour.
- Live AI routing, production backend, and cross-device sync are not implemented by this patch.

ROLLBACK
--------
Keep a separate copy of the current academic/academic-store.js before applying. Restore it
if the patch causes a regression. Any explicit cleanup moves create timestamped backups in
backup/cleanup-... before moving source files.
