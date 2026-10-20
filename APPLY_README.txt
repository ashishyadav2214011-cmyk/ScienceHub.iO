ScienceHub.io - storage stabilization patch
===========================================

BASE: branch main of ashishyadav2214011-cmyk/ScienceHub.iO. The exact commit was NOT verified.
Patch was made from the academic/academic-store.js text supplied in chat, so check that your file matches before replacing.

CONTENTS
  academic/academic-store.js          full replacement file (the only runtime file changed)
  test_academic_store_storage.mjs     optional test; run: node test_academic_store_storage.mjs
  APPLY_README.txt                    this file

APPLY
1. Replace academic/academic-store.js with the file in this zip.
2. Edit 5_app.js (two small changes):
   a) In render(), change
        await save();
      to
        try{await save();}catch(e){console.error('ScienceHub: state save failed',e);}
   b) Change the service worker registration
        .catch(()=>{})
      to
        .catch(e=>console.warn('ScienceHub: service worker failed',e))
3. Optional: add test_academic_store_storage.mjs to the repo root (the existing test_academic_store_fallback.mjs is not touched).
4. Commit, wait about a minute for GitHub Pages, hard reload the site.

WHAT CHANGED IN academic-store.js
- localStorage fallback is now read as well as written.
- Malformed or non-object stored JSON gives default state instead of crashing.
- A failed IndexedDB state read no longer lets later saves overwrite the stored state.
- Errors from indexedDB.open() and db.transaction() no longer break startup.
- IndexedDB write failures fall back to the localStorage backup.
- getRevision() returns [] on read error (it used to return an Event object).
- addAttempt() and setRevision() return true if stored in IndexedDB, false if kept only in memory.

TESTS (fake IndexedDB/localStorage in Node, not a real browser)
  Original store: 4/11 passed.  Fixed store: 11/11 passed.

LIMITATIONS
- If IndexedDB is unavailable, attempts and revision items are kept in memory only and are lost on reload.
- If an IndexedDB write fails and the backup is used, a later reload with working IndexedDB reads the older IndexedDB state.
- Not checked: academic-engine.js, academic-data.js, a real browser, offline behavior, the live deployment.
- Upgrade Guard files were not touched. No hash comparison was run.

ROLLBACK
Open the file's History on GitHub, choose the previous version, and restore it (or use "Revert" on the commit).
