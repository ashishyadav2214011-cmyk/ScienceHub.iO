# ScienceHub.io Phase 1 patch package

## Scope included
- Keeps the existing HTML/CSS/ES-module framework and existing academic data/engine.
- Fixes the critical missing `#sukoon` element that `5_app.js` expects during startup.
- Adds a visual logo in the header and a hero section on Home, using existing repository asset filenames.
- Adds an explicit UP Board selector and a quick subject selector for Class 11/12.
- Adds a movable Sukoon.Brain launcher, orbit-inspired floating motion, expression choices, and a chat UI.
- The Sukoon chat is intentionally a local/offline fallback. It does NOT pretend that an AI API is connected.
- Adds official UPMSP syllabus and NCERT textbook portal links, a user-provided HTTPS PDF reader, and local-only notes.

## Files
Copy `index.html` over the existing root `index.html`, and add `phase1-enhancements.js` and `phase1-enhancements.css` to the repository root. Keep all existing files and folders.

## Important limitations / testing status
- This package has not been committed to GitHub and has not been tested on the live hosted site.
- The existing app code and academic data are not replaced.
- Board selector currently exposes UP Board only, as agreed.
- The subject selector opens a subject when the existing app has that subject's card mapped.
- PDF embedding depends on the source website's frame/security policy; some sources will require opening in a new tab.
- Complete Class 11–12 textbook-level chapter/topic/concept coverage is NOT included by this patch. Existing data still needs official-session mapping and verification.
- Real AI remains disconnected until a supported free service is configured safely. Do not put secret API keys in browser JavaScript or public GitHub files.

## Manual checks after upload
1. Open the GitHub Pages URL in a fresh browser tab.
2. Confirm the Home page loads and the console has no `Cannot set properties of null (setting 'onclick')` error.
3. Test Class 11 and 12 selectors, language selector, subject selector, nav, search, Practice and Performance.
4. Drag the Sukoon launcher, open chat, choose expressions, send a message, close and reopen.
5. Open Assets, follow the official portals, test a permitted HTTPS PDF URL, save notes, then refresh.
6. Test at narrow Android viewport and with offline mode. Record any failures before marking the phase complete.
