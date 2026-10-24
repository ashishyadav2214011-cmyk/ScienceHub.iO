# Integration Guide

This package is intended to be integrated into the existing ScienceHub.io framework, not replace the app.

## Step 1 — Verify icon files
Check the repository for:
- `11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png`
- `11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png`
- `12_SUKOON-BRAIN-REALTIME-ICON.png`

Verify each file opens, dimensions match its intended use, and paths work on the deployed site. The reference image in this ZIP is a comparison graphic, not three separate production assets.

## Step 2 — Centralize paths
Copy `integration/brand-assets.js` into the project and import the paths where appropriate. Existing code may use hard-coded paths; update carefully and avoid duplicate event handlers.

Example:
```js
import { BRAND_ASSETS } from "./brand-assets.js";
const icon = BRAND_ASSETS.scienceHub.frontend;
```

## Step 3 — Apply design tokens
Copy `integration/brand-identity.css` into the project and add a stylesheet link in `index.html`, or merge the tokens into the current stylesheet. Avoid conflicting duplicate styles.

## Step 4 — Public manifest
Compare `integration/manifest-example.webmanifest` with the existing `3_manifest.webmanifest`. Keep the frontend icon as the default public install icon. Do not keep the internal icon in the public manifest unless that is a deliberate, tested product decision.

## Step 5 — Sukoon status
Use `integration/sukoon-status.js` as a small status helper. The existing chat code was inspected as having a local fallback. A real `connected` state must only be set after a successful backend response. This helper does not create an AI backend.

## Step 6 — AI backend (optional)
If genuine AI is added:
1. Create a server-side endpoint.
2. Keep provider API keys on the server in environment secrets.
3. Validate input and limit message length and request rate.
4. Handle provider errors, timeouts and offline fallback.
5. Avoid sending student profile data unless needed and clearly disclosed.
6. Never hard-code a secret key into browser-delivered JavaScript.

## Step 7 — QA checklist
- [ ] All three PNG paths return successfully and display.
- [ ] Favicon and Android/PWA icon show the frontend icon.
- [ ] Internal icon appears only in intended internal surfaces.
- [ ] Sukoon icon appears in the floating assistant and chat header.
- [ ] Assistant opens and closes without duplicate event handlers.
- [ ] Mobile screen and safe-area positioning work.
- [ ] Keyboard users can operate the assistant and see focus.
- [ ] Offline fallback clearly says AI is not connected.
- [ ] Connected state only appears after a successful backend response.
- [ ] No API key is exposed in frontend files.
- [ ] Browser console and network panel have no unexpected errors.
- [ ] Manifest is valid and icon dimensions/types match.
- [ ] Test the deployed site after changes; source inspection alone is not a deployment test.
