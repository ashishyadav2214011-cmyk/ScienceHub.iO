#!/usr/bin/env python3
"""Standard-library static checks for a local ScienceHub repository copy."""
from pathlib import Path
from collections import defaultdict
import hashlib, json, re, sys

ROOT = Path(__file__).resolve().parents[1]
IGNORE = {'.git', 'backup', 'node_modules', '__pycache__'}

def main():
    passed, warnings, failed = [], [], []
    files = [p for p in ROOT.rglob('*') if p.is_file() and not any(x in IGNORE for x in p.parts)]
    def check(ok, label, detail=''):
        (passed if ok else failed).append((label, detail))
    def check_local_ref(ref, base, label):
        if re.match(r'^(https?:|data:|mailto:|tel:|javascript:|#)', ref, re.I):
            return
        clean = ref.split('?', 1)[0].split('#', 1)[0]
        if not clean:
            return
        target = (base / clean).resolve()
        ok = target == ROOT or ROOT in target.parents
        ok = ok and target.exists()
        check(ok, f'{label}: {ref}', '' if ok else 'Missing local target or path escapes repository')

    check(bool(files), 'Repository files discovered', f'{len(files)} files')
    idx = ROOT / 'index.html'
    if idx.exists():
        html = idx.read_text(encoding='utf-8', errors='replace')
        for ref in re.findall(r'''(?:src|href)\s*=\s*["']([^"'#]+)["']''', html, re.I):
            check_local_ref(ref, idx.parent, 'HTML reference')
    else:
        check(False, 'index.html exists')

    manifest = ROOT / '3_manifest.webmanifest'
    if manifest.exists():
        try:
            mdata = json.loads(manifest.read_text(encoding='utf-8'))
            check(True, 'manifest parses as JSON')
            for icon in mdata.get('icons', []):
                if isinstance(icon, dict) and icon.get('src'):
                    check_local_ref(icon['src'], manifest.parent, 'Manifest icon')
        except Exception as exc:
            check(False, 'manifest parses as JSON', str(exc))
    else:
        warnings.append(('Manifest absent', 'Manifest checks skipped'))

    # Check relative ES module imports in JS files.
    for js in (p for p in files if p.suffix == '.js'):
        source = js.read_text(encoding='utf-8', errors='replace')
        for ref in re.findall(r'''\bfrom\s*["'](\.[^"']+)["']|\bimport\s*["'](\.[^"']+)["']''', source):
            target = next((x for x in ref if x), '')
            if target:
                check_local_ref(target, js.parent, f'JS import ({js.relative_to(ROOT).as_posix()})')

    # Check assets precached by the service worker.
    sw = ROOT / '6_sw.js'
    if sw.exists():
        source = sw.read_text(encoding='utf-8', errors='replace')
        for ref in sorted(set(re.findall(r'''["'](\./[^"']+)["']''', source))):
            if ref == './' or re.search(r'\.(?:html|css|js|webmanifest|png|svg|ico|json)$', ref, re.I):
                check_local_ref(ref, ROOT, 'Service-worker asset')
    else:
        warnings.append(('Service worker absent', 'Offline asset checks skipped'))

    hashes = defaultdict(list)
    for p in files:
        try:
            hashes[hashlib.sha256(p.read_bytes()).hexdigest()].append(p.relative_to(ROOT).as_posix())
        except OSError:
            pass
    groups = [group for group in hashes.values() if len(group) > 1]
    reports = ROOT / 'reports'
    reports.mkdir(exist_ok=True)
    (reports / 'duplicate-content-report.txt').write_text(
        'Identical-content groups (SHA-256 only). This does not mean safe to delete.\n\n' +
        ('\n'.join(' - ' + ' | '.join(group) for group in groups) if groups else 'No groups found.') + '\n',
        encoding='utf-8')
    check(True, 'duplicate-content report generated', f'{len(groups)} group(s)')

    datafile = ROOT / 'academic' / 'academic-data.js'
    if datafile.exists():
        source = datafile.read_text(encoding='utf-8', errors='replace')
        empty_pyq = bool(re.search(r'\bpyqs\s*:\s*\[\s*\]', source))
        report = 'ScienceHub academic data static scan\nCounts below are rough marker counts, not a completeness proof.\n'
        for name in ('subjects', 'chapters', 'topics', 'concepts', 'questions', 'resources'):
            report += f'{name}: {len(re.findall(r"\\b" + re.escape(name) + r"\\s*=", source))} declaration marker(s)\n'
        report += f'Explicit empty pyqs array found: {empty_pyq}\nOfficial syllabus completeness is not established by this static scan.\n'
        (reports / 'academic-data-static-report.txt').write_text(report, encoding='utf-8')
        check(True, 'academic data static report generated')
        if empty_pyq:
            warnings.append(('PYQ coverage', 'Explicit empty pyqs array found; complete PYQ coverage is not demonstrated.'))
    else:
        warnings.append(('Academic data file absent', 'Academic scan skipped'))

    print('SCIENCEHUB STATIC VALIDATION')
    for label, detail in passed:
        print('PASS ' + label + (f' — {detail}' if detail else ''))
    for label, detail in warnings:
        print('WARN ' + label + ' — ' + detail)
    for label, detail in failed:
        print('FAIL ' + label + (f' — {detail}' if detail else ''))
    print(f'\nSummary: {len(passed)} pass, {len(warnings)} warning, {len(failed)} fail')
    print('This is static analysis only; browser/device and offline cold-start tests are not performed.')
    return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(main())
