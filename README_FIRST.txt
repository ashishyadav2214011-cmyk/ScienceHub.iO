ScienceHub.io — Repository Organization Pack (Safe, non-destructive)
===================================================================

WHAT THIS IS
This ZIP is an apply-pack for the current public repository:
  https://github.com/ashishyadav2214011-cmyk/ScienceHub.iO

It is NOT a full clone of the repository and does not itself publish changes. It contains a migration script that organizes the repository after you place this pack beside/inside a local clone and run it.

IMPORTANT SCOPE
- Upgrade Guard implementation is intentionally untouched. Its existing spec/docs are only relocated as documentation if the script categorizes them; no Upgrade Guard code or behavior is changed.
- Website entry/runtime files remain at repository root because GitHub Pages and current relative paths depend on them.
- Academic runtime files remain in academic/.
- The script creates a timestamped backup before changing files, refuses destination collisions, rewrites references to moved files in text files, and supports dry-run mode.
- Do not upload this ZIP as if it were a full replacement for the repository.

APPLY (recommended on a computer with Git + Python 3)
1. Download/clone the repository and create a backup/branch first.
2. Extract this ZIP anywhere.
3. From the repository root, run:
     python /path/to/extracted-pack/tools/organize_sciencehub_repo.py --dry-run
4. Read the planned moves. If they look right, run:
     python /path/to/extracted-pack/tools/organize_sciencehub_repo.py --apply
5. Run verification:
     python /path/to/extracted-pack/tools/verify_sciencehub_layout.py
6. Review the git diff, test locally, then commit/push to publish through GitHub Pages.

ANDROID NOTE
If you only have a phone, do not try to upload this pack over the existing repository as a replacement. Use GitHub's browser-based file editor only if comfortable reviewing each move; otherwise apply from a computer or a Git-capable environment.

NOT A DEPLOYMENT CLAIM
This pack has not been applied to GitHub or the live site. Reorganization alone cannot guarantee all features work. Verify runtime, PWA caching, search, academic data, and navigation before release.
