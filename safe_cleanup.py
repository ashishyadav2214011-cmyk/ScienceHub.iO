#!/usr/bin/env python3
"""Manifest-driven cleanup. Dry-run by default; never deletes files."""
from pathlib import Path
import argparse, json, shutil, sys
from datetime import datetime, timezone
ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / 'cleanup-plan.json'
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='execute reviewed moves listed in cleanup-plan.json')
    args = parser.parse_args()
    if not PLAN.exists(): print('No cleanup-plan.json; no files changed.'); return 2
    try: moves = json.loads(PLAN.read_text(encoding='utf-8')).get('moves', [])
    except Exception as e: print(f'Invalid plan: {e}'); return 2
    if not isinstance(moves, list): print("Plan 'moves' must be a list."); return 2
    if not moves: print('No approved moves listed. No files changed.'); return 0
    ready=[]; errors=[]
    for item in moves:
        if not isinstance(item,dict) or not item.get('from') or not item.get('to'):
            errors.append(f'Invalid entry: {item!r}'); continue
        src=(ROOT/item['from']).resolve(); dst=(ROOT/item['to']).resolve()
        if ROOT not in src.parents or ROOT not in dst.parents: errors.append(f'Path escapes root: {item!r}'); continue
        if not src.is_file(): errors.append(f'Source missing/not a file: {item["from"]}'); continue
        if dst.exists(): errors.append(f'Destination exists; refusing overwrite: {item["to"]}'); continue
        ready.append((src,dst,item['from'],item['to']))
    if errors: print('Preflight failed; no files changed:\n'+'\n'.join(errors)); return 2
    print('APPLY MODE' if args.apply else 'DRY RUN')
    for _,__,old,new in ready: print(f'{old} -> {new}')
    if not args.apply: print(f'{len(ready)} move(s) listed. Review then rerun with --apply.'); return 0
    backup=ROOT/'backup'/('cleanup-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')); done=[]
    try:
        for src,dst,old,new in ready:
            b=backup/old; b.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,b)
            dst.parent.mkdir(parents=True,exist_ok=True); shutil.move(str(src),str(dst)); done.append((src,dst))
    except Exception as e:
        print(f'Move failed: {e}. Attempting rollback.')
        for src,dst in reversed(done):
            try:
                src.parent.mkdir(parents=True,exist_ok=True)
                if dst.exists() and not src.exists(): shutil.move(str(dst),str(src))
            except Exception as re: print(f'ROLLBACK WARNING: {src}: {re}')
        print(f'Backup copies (if created): {backup}'); return 1
    print(f'Moved {len(done)} file(s); backup: {backup.relative_to(ROOT)}. No files deleted.'); return 0
if __name__=='__main__': sys.exit(main())
