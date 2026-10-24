# ScienceHub.io Phase 1 integration patch — review build

## Apply on a branch, not directly to main
1. Add `phase1-integration-fix.css` and `phase1-integration-fix.js` to the repository root.
2. In `index.html`, add `<link rel="stylesheet" href="./phase1-integration-fix.css">` after the existing `phase1-enhancements.css` link.
3. Add `<script type="module" src="./phase1-integration-fix.js"></script>` after the existing `phase1-enhancements.js` script.
4. Test on the deployed page at 320–360px wide and desktop before merging.

## What it attempts
- Mobile-first header controls; Mathematics appears in quick subject choices.
- Student-facing hero and Study Hub shortcut section.
- Hides two technical-only home cards.
- Movable Sukoon mascot and offline chat disclosure.

## Important limitations
This is an untested integration patch, not proof that Phase 1 is complete. Mathematics is only added to the selector; actual syllabus/chapter data is not created. AI is not connected. Board-specific syllabus/PDF completeness, saved-state restoration, Profile/Assets functionality, accessibility, console/network errors and all flows still require browser verification. Review for interaction conflicts before merging.
