#!/usr/bin/env python3
"""Standard-library static checks for a local ScienceHub repository copy."""
from pathlib import Path
from collections import defaultdict
import hashlib, json, re, sys
ROOT=Path(__file__).resolve().parents[1]
IGNORE={'.git','backup','node_modules'}
def main():
    passed=[]; warnings=[]; failed=[]
    files=[p for p in ROOT.rglob('*') if p.is_file() and not any(x in IGNORE for x in p.parts)]
    def check(ok,label,detail=''): (passed if ok else failed).append((label,detail))
    check(bool(files),'Repository files discovered',f'{len(files)} files')
    idx=ROOT/'index.html'
    if idx.exists():
        for ref in re.findall(r'''(?:src|href)\s*=\s*["']([^"'#]+)["']''',idx.read_text(encoding='utf-8',errors='replace'),re.I):
            if re.match(r'^(https?:|data:|mailto:|tel:|javascript:)',ref,re.I): continue
            target=(idx.parent/ref.split('?',1)[0]).resolve(); check(target.exists(),f'index reference exists: {ref}','' if target.exists() else 'Missing local target')
    else: check(False,'index.html exists')
    manifest=ROOT/'3_manifest.webmanifest'
    if manifest.exists():
        try:
            data=json.loads(manifest.read_text(encoding='utf-8')); check(True,'manifest parses as JSON')
            for icon in data.get('icons',[]):
                src=icon.get('src')
                if src:
                    ok=(manifest.parent/src).resolve().exists(); check(ok,f'manifest icon exists: {src}','' if ok else 'Missing local target')
        except Exception as e: check(False,'manifest parses as JSON',str(e))
    else: warnings.append(('Manifest absent','Manifest checks skipped'))
    hashes=defaultdict(list)
    for p in files:
        try: hashes[hashlib.sha256(p.read_bytes()).hexdigest()].append(p.relative_to(ROOT).as_posix())
        except OSError: pass
    groups=[v for v in hashes.values() if len(v)>1]
    (ROOT/'reports').mkdir(exist_ok=True)
    (ROOT/'reports'/'duplicate-content-report.txt').write_text('Identical-content groups (SHA-256 only). This does not mean safe to delete.\n\n'+('\n'.join(' - '+' | '.join(g) for g in groups) if groups else 'No groups found.')+'\n',encoding='utf-8')
    check(True,'duplicate-content report generated',f'{len(groups)} group(s)')
    datafile=ROOT/'academic'/'academic-data.js'
    if datafile.exists():
        src=datafile.read_text(encoding='utf-8',errors='replace')
        pyq=bool(re.search(r'\bpyqs\s*:\s*\[\s*\]',src))
        report='ScienceHub academic data static scan\nCounts are rough declaration-marker counts, not record validation.\n'
        for name in ('subjects','chapters','topics','concepts','questions','resources'):
            pattern = r'\b' + re.escape(name) + r'\s*='
            count = len(re.findall(pattern, src))
            report += f'{name}: {count} declaration marker(s)\n'
        report+=f'Explicit empty pyqs array found: {pyq}\nOfficial syllabus completeness is not established by this static scan.\n'
        (ROOT/'reports'/'academic-data-static-report.txt').write_text(report,encoding='utf-8'); check(True,'academic data static report generated')
        if pyq: warnings.append(('PYQ coverage','Explicit empty pyqs array found; complete PYQ coverage is not demonstrated.'))
    else: warnings.append(('Academic data file absent','Academic scan skipped'))
    print('SCIENCEHUB STATIC VALIDATION')
    for label,detail in passed: print('PASS '+label+(f' — {detail}' if detail else ''))
    for label,detail in warnings: print('WARN '+label+' — '+detail)
    for label,detail in failed: print('FAIL '+label+(f' — {detail}' if detail else ''))
    print(f'\nSummary: {len(passed)} pass, {len(warnings)} warning, {len(failed)} fail')
    print('Browser/device tests and offline cold-start are NOT tested by this script.')
    return 1 if failed else 0
if __name__=='__main__': sys.exit(main())
