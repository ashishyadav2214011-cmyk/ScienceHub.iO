# ScienceHub.io — Phase 1 Foundation

This is the Phase 1 foundation/specification package for ScienceHub.io.

## GitHub mobile upload format
GitHub mobile uploads files reliably, so this package intentionally uses a **flat file layout**. Folder hierarchy is encoded into each filename using the pattern:

`NN_SECTION__SUBSECTION__FILE`

The filename prefix preserves the intended hierarchy without requiring GitHub folders during upload.

## Hierarchy map
- `01_IDENTITY__` — identity
- `02_VISION__` — vision and mission
- `03_SYSTEM-DOMAINS__` — system domains
- `04_NAVIGATION__` — primary navigation
- `05_ACADEMIC-FOUNDATION__` — academic hierarchy, syllabus, classes, PCB and exams
- `06_NCERT-RESOURCE-SYSTEM__` — bilingual/textbook/resource specifications
- `07_AI-SYSTEM__` — AI roles and routing
- `08_OFFLINE-ONLINE__` — offline/online foundation
- `09_USER-CONTROL__` — authority, permissions, privacy and AI control
- `10_UPGRADE-GOVERNANCE__` — upgrade, rollback and failure governance
- `11_VISUAL-IDENTITY__` — visual specifications and official uploaded assets
- `12_BLUEPRINT-GOVERNANCE__` — scope, authority and blueprint locking
- `13_PHASE-1-MANIFEST__` — Phase 1 manifest and package documentation

## Upload rule
Select/upload the files **inside this package directly to the repository root**. Do not create an additional wrapper folder. The numbered filename prefixes are the hierarchy.

## Status
Phase 1 is a foundation/specification package. Production implementation, full integration testing and final release remain separate phases and require the defined user approval process.
