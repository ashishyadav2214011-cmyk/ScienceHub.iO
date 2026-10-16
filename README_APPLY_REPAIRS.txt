ScienceHub.io repair bundle

1. Extract this ZIP into the root of your existing ScienceHub.iO repository.
2. Run from that repository root: node tools/apply-sciencehub-repairs.mjs
3. Review the generated .sciencehub-backup-<timestamp> folder and the changed files.
4. Run JavaScript syntax checks and browser tests before committing/deploying.

The script validates expected source fragments before writing, backs up existing files, and leaves index.html, the manifest, icons, academic data and legacy files intact. It repairs search navigation, localStorage fallback persistence and service-worker cache scope, and adds AUDIT_AND_REPAIR_PLAN.md.

GitHub connector writes returned HTTP 403 in this session, so this is an in-repository apply path; changes are not live until applied and committed.
