ScienceHub Fix Pack 01
======================

Purpose
-------
This is an upload-ready patch pack for the existing ScienceHub repository. It addresses:
01. Global search UI/result click navigation (audit bug #1).
02. Stricter question answer checking and numeric normalization for the Avogadro-value question (audit bug #2).
03. Defensive defaults for app state in the UI.
04. Sukoon.Brain visual concept integration using the supplied design images.
05. PWA icon metadata and cache version update.

Numbered replacement files
--------------------------
1. 5_app.js
2. academic/academic-engine.js
3. 4_styles.css
4. 3_manifest.webmanifest
5. 6_sw.js
6. 11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png
7. 11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png
8. 12_SUKOON-BRAIN-REALTIME-ICON.png

How to apply
------------
1. Make a backup/branch of the current repository first.
2. Extract this ZIP into the repository root, preserving the academic/ folder.
3. Keep the existing index.html, academic/academic-data.js and academic/academic-store.js.
4. Commit and push the extracted files.
5. Test the live deployment in a private/incognito browser or clear the site data/service-worker cache.

Important limitations
---------------------
- This is a focused fix pack, not a complete implementation of the full locked ScienceHub blueprint.
- The strict answer checker accepts exact answer/answerHi/acceptedAnswers matches. The Avogadro question ID q-chem11-1 additionally accepts numeric values within 0.5% of its expected value. Add explicit acceptedAnswers for valid synonyms instead of broad substring matching.
- The existing data model contains short-answer seed questions. Free-form descriptive marking still needs a rubric/teacher/AI-assisted evaluation.
- Sukoon.Brain is integrated as a visual panel only; live AI routing is not connected.
- Runtime/browser/device tests are still required. A ZIP existing is not proof of a verified release.
