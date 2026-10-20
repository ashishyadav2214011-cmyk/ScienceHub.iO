# Repository layout proposal

Based on the current `main` tree, the repository has 230 tracked files, about 177 Markdown documents, and almost all documentation at the root. The deployed web entry points and runtime assets must stay at root until every path is verified; academic data/runtime modules stay in `academic/`.

Target structure:

- `index.html`, `3_index.html`, `3_manifest.webmanifest`, `4_styles.css`, `5_app.js`, `6_sw.js`, `sw.js`: root deployment/runtime files
- `academic/`: academic data, store, and engine
- `assets/visual/`: PNG visual identity assets and visual manifest
- `assets/pcb/`: science SVG assets
- `docs/blueprints/`: blueprints and locked specifications
- `docs/architecture/`: architecture documents
- `docs/contracts/`: contracts, matrices, authority/privacy/security/data model documents
- `docs/audits/`: audit reports
- `docs/guides/`: README/apply/build/verification instructions
- `docs/manifests/`: phase/manifests and file-order metadata
- `docs/phases/`: phase reports, approval records, integration maps
- `docs/specifications/`: remaining product/system specifications
- `docs/archive/`: legacy README material
- `tools/`: repository repair utility
- `patches/`: patch files

The migration intentionally does not delete duplicate-looking files, change the main app behavior, or implement Upgrade Guard. Review all generated changes before publishing.
