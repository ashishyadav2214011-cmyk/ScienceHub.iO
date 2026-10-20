#!/usr/bin/env python3
"""Conservative ScienceHub repository layout migration. Python stdlib only."""
from pathlib import Path
from datetime import datetime
import argparse, json, shutil, sys

KEEP_ROOT = {
    'index.html', '3_index.html', '3_manifest.webmanifest', '4_styles.css',
    '5_app.js', '6_sw.js', 'sw.js', 'README.md',
}
RUNTIME_DIRS = {'academic'}
TEXT_EXTS = {'.md', '.txt', '.json', '.html', '.css', '.js', '.mjs', '.patch', '.webmanifest', '.svg', '.yml', '.yaml'}


def classify(name: str) -> str | None:
    low = name.lower()
    if name in KEEP_ROOT or name in RUNTIME_DIRS:
        return None
    if low.endswith('.png') or low == 'visual-assets-manifest.json' or low.startswith('visual-assets-manifest'):
        return 'assets/visual/' + name
    if low.endswith('.svg'):
        return 'assets/pcb/' + name
    if name == 'apply-sciencehub-repairs.mjs':
        return 'tools/' + name
    if low.endswith('.patch'):
        return 'patches/' + name
    if low in {'file_order.json'} or ('manifest' in low and low.endswith('.json')):
        return 'docs/manifests/' + name
    if 'audit' in low and low.endswith(('.md', '.txt')):
        return 'docs/audits/' + name
    if 'approval-record' in low or 'integration-map' in low or 'verification' in low:
        return 'docs/phases/' + name
    if 'readme' in low or low in {'readme', '00_read_me_first.txt', '00_readme_apply_first.txt'} or 'build-and-upload' in low or 'apply-first' in low or 'apply-repairs' in low or 'root-fix' in low:
        return 'docs/guides/' + name
    if 'architecture' in low or 'layer-architecture' in low or 'module-architecture' in low or 'data-flow-master' in low or 'user-flow-master' in low:
        return 'docs/architecture/' + name
    if 'blueprint' in low or 'locked-specification' in low or 'master-blueprint' in low:
        return 'docs/blueprints/' + name
    if any(k in low for k in ('contract', 'matrix', 'authority', 'permission', 'privacy', 'security-boundary', 'scope-boundary', 'data-model', 'storage-contract')):
        return 'docs/contracts/' + name
    if low.endswith(('.md', '.txt')):
        return 'docs/specifications/' + name
    if name == 'README':
        return 'docs/archive/README_legacy.md'
    return None


def safe_text(path: Path):
    if path.suffix.lower() not in TEXT_EXTS:
        return None
    try:
        return path.read_text(encoding='utf-8')
    except (UnicodeDecodeError, OSError):
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', default='.', help='repository root (default: current directory)')
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument('--dry-run', action='store_true')
    mode.add_argument('--apply', action='store_true')
    args = ap.parse_args()
    root = Path(args.root).resolve()
    if not (root / '.git').exists() and not (root / 'index.html').exists():
        sys.exit('ERROR: This does not look like the ScienceHub repository root (index.html missing).')
    moves = {}
    for p in sorted(root.iterdir()):
        if not p.is_file():
            continue
        dest = classify(p.name)
        if dest:
            moves[p.relative_to(root).as_posix()] = dest
    if not moves:
        print('No root-level organization moves found; repository may already be organized.')
        return
    collisions = [dest for dest in moves.values() if (root / dest).exists()]
    if collisions:
        print('ERROR: destination collisions detected; no changes made:')
        print('\n'.join('  ' + x for x in collisions))
        sys.exit(2)
    print(f'Repository root: {root}')
    print(f'Planned file moves: {len(moves)}')
    for src, dst in moves.items():
        print(f'  {src} -> {dst}')
    if args.dry_run:
        print('\nDRY RUN ONLY — no files changed. Re-run with --apply to apply after review.')
        return

    stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup = root / f'.sciencehub-layout-backup-{stamp}'
    backup.mkdir(parents=True, exist_ok=False)
    # Back up every root file that may be moved or have its references rewritten.
    for p in root.iterdir():
        if p.is_file() and safe_text(p) is not None:
            rel = p.relative_to(root)
            out = backup / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, out)
    for src, dst in moves.items():
        srcp, dstp = root / src, root / dst
        dstp.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(srcp), str(dstp))

    # Rewrite old path/name references throughout remaining and moved text files.
    replacements = sorted(moves.items(), key=lambda kv: len(kv[0]), reverse=True)
    changed = []
    for p in root.rglob('*'):
        if not p.is_file() or backup in p.parents or '.git' in p.parts:
            continue
        text = safe_text(p)
        if text is None:
            continue
        updated = text
        for old, new in replacements:
            old_name = old.rsplit('/', 1)[-1]
            new_name = new
            # Handle root-relative paths, quoted filenames, and Markdown links.
            updated = updated.replace('./' + old_name, './' + new_name)
            updated = updated.replace('"' + old_name + '"', '"' + new_name + '"')
            updated = updated.replace("'" + old_name + "'", "'" + new_name + "'")
            updated = updated.replace('(' + old_name + ')', '(' + new_name + ')')
            updated = updated.replace('](' + old_name + ')', '](' + new_name + ')')
        if updated != text:
            p.write_text(updated, encoding='utf-8')
            changed.append(p.relative_to(root).as_posix())

    report = {
        'timestamp': stamp,
        'backup_directory': backup.name,
        'moves': moves,
        'text_files_with_reference_updates': changed,
        'upgrade_guard_behavior_changed': False,
        'runtime_tests_run': False,
        'note': 'Reorganization only. Review git diff and run runtime/PWA checks before publishing.'
    }
    (root / 'docs').mkdir(exist_ok=True)
    (root / 'docs' / 'REPOSITORY-ORGANIZATION-REPORT.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f'\nApplied {len(moves)} moves. Backup: {backup.name}')
    print(f'Updated references in {len(changed)} text files.')
    print('IMPORTANT: run verification, review git diff, and test the app before pushing.')

if __name__ == '__main__':
    main()
