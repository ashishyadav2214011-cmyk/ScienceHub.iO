ScienceHub.io - storage fix v2 (corrected target file)
=====================================================

BASE: commit 088161a021eff8ee8c8482cb4682a0fcfee89a36 (from the uploaded ZIP).

WHY v2: the first fix was applied to the ROOT file academic-store.js. The app imports ./academic/academic-store.js,
so the first fix had no effect. This package targets the right file.

REPLACE THESE TWO FILES (full-file replacements):
  academic/academic-store.js     (inside the academic folder, NOT the root academic-store.js)
  5_app.js                       same as 088161a plus two one-line changes:
                                   line 26: try{await save();}catch(e){console.error(...)}
                                   line 96: service worker .catch now logs a warning

OPTIONAL: runtime_check.mjs - dev harness. Run: node runtime_check.mjs .   (from the repo folder, Node 22)

Do not delete anything. The root academic-store.js (which now contains the fix) and other root duplicates are unused by the app; leave them until a cleanup dry run.
Upgrade Guard files were not touched. No hash comparison was run.

RESULT (Node with a minimal DOM and fake IndexedDB/localStorage, not a real browser)
  088161a as uploaded : 13/16 runtime checks passed (3 resilience checks failed)
  with this package   : 16/16 runtime checks passed, and 11/11 storage tests passed

ROLLBACK: GitHub file History -> restore the previous version of each file.
