ScienceHub.io repository audit — stabilization patch scope
=========================================================

Reviewed Git tree SHA: cb64ef77d4c4cd671a53fb84862a1dbb921966ca
Prior tree count: 244 paths (241 root-level, three under academic/). Recheck the current
branch before applying; repository state may have changed since this snapshot.

Findings from inspected source:
1. Confirmed fallback bug: academic/academic-store.js wrote app state to localStorage when
   IndexedDB was unavailable, but loadAppState did not read the same key.
2. academic/academic-data.js uses syllabus-unit structures and contains status/provenance
   indicating fine-grained chapter/topic/concept mapping is pending. Full mapping is not
   demonstrated by the inspected data.
3. An explicit empty `pyqs: []` marker was present in the inspected academic data source;
   complete PYQ coverage is not demonstrated.
4. Sukoon's visual panel is present, but live AI routing is not connected in the inspected
   runtime description.
5. Successful static-site deployment alone does not prove browser/device/offline behaviour.
6. Prior identical-content candidates included index.html and 3_index.html; two similarly
   named build-prompt text files; and two similarly named visual identity/icon PNGs. These
   are review candidates only and are not deleted or merged by this patch.

Patch scope:
- One narrow persistence fix.
- Add static validation and a safe, opt-in cleanup tool.
- Leave Upgrade Guard and approved visual assets untouched.

Not verified here:
- Runtime browser/device tests, IndexedDB-disabled reload, offline cold start, or mobile install.
- Whether duplicate-looking files are interchangeable in all current references/workflows.
- Full official UPMSP syllabus correctness/completeness.
- Production backend, cloud sync, or live AI integration.
