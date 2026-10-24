# ScienceHub.io × Sukoon.Brain — Identity Package

This ZIP contains the agreed visual-identity blueprint and starter integration files for the existing ScienceHub.io project.

## Locked identity roles
1. **ScienceHub.io Internal App Icon** — internal app/module identity only where a separate internal app surface exists.
2. **ScienceHub.io Frontend App Icon** — primary public icon for the website, browser favicon and installable web app.
3. **Sukoon.Brain Realtime Icon** — assistant avatar/button for AI-related interface surfaces.

The three icons share a visual family, but they do not represent three separate applications by default.

## Important status note
This is an **identity blueprint + integration starter ZIP**, not a full copy of the ScienceHub.io repository and not proof of a deployed change. Existing source inspection indicated icon references and local/offline Sukoon fallback behavior. A real AI connection is not confirmed. The package intentionally does not claim otherwise.

## Contents
- `docs/BRAND-IDENTITY.md` — identity, roles, usage locations and design rules.
- `docs/INTEGRATION-GUIDE.md` — step-by-step integration and QA checklist.
- `integration/brand-assets.js` — central asset path constants.
- `integration/brand-identity.css` — reusable design tokens and accessible component styles.
- `integration/sukoon-status.js` — helper for honest assistant connection states.
- `integration/manifest-example.webmanifest` — example public-facing manifest.
- `visual-reference/icon-concept-reference.png` — supplied three-icon concept image, for reference only.

## Before integrating
Verify these repository assets exist and are valid PNGs:
- `11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png`
- `11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png`
- `12_SUKOON-BRAIN-REALTIME-ICON.png`

The concept reference image is **not** a replacement for separate production icon files. Do not rename or overwrite existing project files until the current asset paths have been verified.

## Cost
The visual identity, CSS, local assistant interface and fallback can be implemented without an AI API charge. Genuine model-generated responses require an available AI model/service; any free access depends on that provider's current terms. Never put a private AI API key in frontend JavaScript.
