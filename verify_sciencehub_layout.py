#!/usr/bin/env python3
"""Quick static checks after ScienceHub layout migration; not a browser test."""
from pathlib import Path
import json, sys
root = Path('.').resolve()
errors=[]
required=['index.html','3_manifest.webmanifest','4_styles.css','5_app.js','6_sw.js','sw.js','academic/academic-data.js','academic/academic-store.js','academic/academic-engine.js']
for rel in required:
    if not (root/rel).is_file(): errors.append(f'Missing required runtime file: {rel}')
for rel in ['assets/visual','assets/pcb','docs','docs/blueprints','docs/architecture','docs/contracts','docs/audits','docs/guides','docs/manifests','docs/phases']:
    if not (root/rel).is_dir(): errors.append(f'Missing expected organized directory: {rel}')
manifest=root/'3_manifest.webmanifest'
if manifest.exists():
    try:
        data=json.loads(manifest.read_text(encoding='utf-8'))
        for icon in data.get('icons',[]):
            src=icon.get('src','').removeprefix('./')
            if src and not (root/src).exists(): errors.append(f'Manifest icon missing: {src}')
    except Exception as e: errors.append(f'Manifest JSON invalid: {e}')
# Confirm main entry references are resolvable relative to repository root.
if (root/'index.html').exists():
    html=(root/'index.html').read_text(encoding='utf-8')
    for marker in ['3_manifest.webmanifest','4_styles.css','5_app.js']:
        if marker not in html: errors.append(f'index.html does not reference expected runtime asset: {marker}')
if errors:
    print('STATIC VERIFICATION: FAIL')
    print('\n'.join('- '+e for e in errors))
    sys.exit(1)
print('STATIC VERIFICATION: PASS (structure and key references only; not an end-to-end test).')
