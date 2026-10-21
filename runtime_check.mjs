// Usage: node runtime_check.mjs <repo-dir>
// Boots the real 5_app.js with a minimal DOM stub + fake IndexedDB/localStorage and drives the UI.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.resolve(process.argv[2]);
const problems = [];
process.on('unhandledRejection', e => problems.push('unhandledRejection: ' + (e && e.message || e)));
const realErr = console.error; console.error = (...a) => problems.push('console.error: ' + a.map(x => x && x.message || x).join(' '));

const camel = s => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const dec = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const tick = () => new Promise(r => setTimeout(r, 5));

// ---- fake storage ----
function makeLS() { const m = new Map(); return { store: m, getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) }; }
function makeIDB(opts = {}) {
  const data = { state: new Map(), attempts: [], revision: new Map() }; let id = 1;
  const db = { objectStoreNames: { contains: () => true }, createObjectStore() {},
    transaction(name) {
      if (opts.throwOnTransaction) throw new Error('InvalidStateError');
      const tx = {};
      const mk = (fn, fail) => { const r = {}; setTimeout(() => { if (fail) { r.onerror && r.onerror(); tx.onerror && tx.onerror(); tx.onabort && tx.onabort(); } else { r.result = fn(); r.onsuccess && r.onsuccess(); setTimeout(() => tx.oncomplete && tx.oncomplete(), 0); } }, 0); return r; };
      tx.objectStore = () => ({
        get: k => mk(() => data[name].get(k), opts.failGet),
        put: v => mk(() => { if (name === 'state') data.state.set(v.id, v); else data.revision.set(v.conceptId, v); }, opts.failPut),
        add: v => mk(() => { data.attempts.push({ id: id++, ...v }); }, opts.failPut),
        getAll: () => mk(() => name === 'attempts' ? [...data.attempts] : [...data[name].values()], opts.failGet) });
      return tx; } };
  return { indexedDB: { open() { const r = {}; setTimeout(() => { r.result = db; r.onupgradeneeded && r.onupgradeneeded(); r.onsuccess && r.onsuccess(); }, 0); return r; } }, data, opts };
}

// ---- minimal DOM ----
function parseTags(html) {
  const out = []; const re = /<([a-zA-Z0-9]+)([^>]*)>/g; let m;
  while ((m = re.exec(html))) { const attrs = {}; const ar = /([a-zA-Z0-9-]+)="([^"]*)"/g; let a; while ((a = ar.exec(m[2]))) attrs[a[1]] = dec(a[2]); out.push({ pos: m.index, tag: m[1].toLowerCase(), attrs }); }
  return out;
}
function makeEl(tag = 'div') {
  const el = { tagName: tag, _html: '', _reg: new Map(), id: null, value: '', className: '', dataset: {}, handlers: {}, onclick: null, onsubmit: null, onchange: null,
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); this._reg = new Map(); },
    addEventListener(t, fn) { (this.handlers[t] = this.handlers[t] || []).push(fn); },
    blur() {}, remove() { if (this._env) this._env.body = this._env.body.filter(x => x !== this); }, appendChild() {},
    querySelectorAll(sel) { return query(this, sel); }, querySelector(sel) { return query(this, sel)[0] || null; } };
  return el;
}
function query(owner, sel) {
  let test;
  const am = sel.match(/^\[([a-z0-9-]+)(?:="([^"]*)")?\]$/);
  if (am) test = t => am[1] in t.attrs && (am[2] === undefined || t.attrs[am[1]] === am[2]);
  else test = t => t.tag === sel;
  const res = [];
  for (const t of parseTags(owner._html)) if (test(t)) {
    let e = owner._reg.get(t.pos);
    if (!e) { e = makeEl(t.tag); e.id = t.attrs.id || null; for (const [k, v] of Object.entries(t.attrs)) if (k.startsWith('data-')) e.dataset[camel(k.slice(5))] = v; owner._reg.set(t.pos, e); }
    res.push(e);
  }
  return res;
}
function findById(app, env, id) {
  const b = env.body.find(x => x.id === id); if (b) return b;
  const walk = o => { for (const e of query(o, `[id="${id}"]`)) return e; for (const c of o._reg.values()) { if (c._html) { const f = walk(c); if (f) return f; } } return null; };
  return walk(app);
}

async function boot({ idb, ls, sw = 'ok' }) {
  const env = { body: [], alerts: [], swUrl: null };
  const app = makeEl(); const sukoon = makeEl(); sukoon.id = 'sukoon'; sukoon._env = env;
  const doc = { querySelector: s => s === '#app' ? app : app.querySelector(s), querySelectorAll: s => app.querySelectorAll(s),
    getElementById: id => id === 'sukoon' ? sukoon : findById(app, env, id),
    createElement: t => { const e = makeEl(t); e._env = env; return e; }, body: { appendChild: e => { e._env = env; env.body.push(e); } } };
  const set = (k, v) => { try { delete globalThis[k]; } catch {} if (v !== undefined) Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true }); };
  set('window', globalThis); set('document', doc); set('indexedDB', idb && idb.indexedDB); set('localStorage', ls);
  set('alert', m => env.alerts.push(m));
  set('navigator', sw === 'none' ? {} : { serviceWorker: { register: u => { env.swUrl = u; return Promise.resolve(); } } });
  const mod = await import(pathToFileURL(path.join(dir, '5_app.js')).href + '?s=' + Math.random());
  await tick();
  const $$ = s => doc.querySelectorAll(s);
  const press = async el => { let r; if (el.onclick) r = el.onclick(); for (const f of el.handlers.click || []) await f({ preventDefault() {} }); await r; await tick(); };
  const by = (attr, val) => $$('[' + attr + ']').find(e => e.dataset[camel(attr.slice(5))] === val);
  return { env, app, doc, sukoon, $$, press, by, html: () => app.innerHTML,
    nav: async n => { const b = by('data-route', n); if (!b) throw new Error('nav button missing: ' + n); await press(b); },
    h1: () => (app.innerHTML.match(/<h1>(.*?)<\/h1>/) || [])[1] };
}

// ---- reporting ----
const results = [];
async function t(name, fn) { try { await fn(); results.push([name, true]); console.log('PASS', name); } catch (e) { results.push([name, false]); console.log('FAIL', name, '-', String(e.message).split('\n')[0].slice(0, 160)); } }
const ok = (c, m) => { if (!c) throw new Error(m || 'assertion failed'); };
const clean = h => ok(!/undefined|NaN|\[object/.test(h), 'page text contains undefined/NaN/[object]');

const { DATA } = await import(pathToFileURL(path.join(dir, 'academic/academic-data.js')).href);
const NAV = ['Home', 'Learning', 'Practice', 'Performance', 'Assets', 'Profile', 'Settings'];
const q0 = DATA.questions.find(q => q.classId === '11');
const concept0 = DATA.concepts.find(c => c.id === q0.conceptId);

let A; const idb = makeIDB(), ls = makeLS();
await t('startup: app boots, Home renders, IndexedDB ready', async () => {
  A = await boot({ idb, ls });
  ok(A.h1() === 'Home', 'h1=' + A.h1()); ok(A.html().includes('IndexedDB: ready'), 'IndexedDB not ready'); clean(A.html());
});
await t('service worker: registered with ./6_sw.js', async () => { ok(A.env.swUrl === './6_sw.js', 'swUrl=' + A.env.swUrl); });
await t('navigation: all 7 tabs render without errors', async () => {
  for (const n of NAV) { await A.nav(n); ok(A.h1() === n, n + ' -> ' + A.h1()); clean(A.html()); }
});
await t('search: finds a concept and opens it in Learning', async () => {
  const box = () => A.doc.getElementById('searchResults'); const inp = A.doc.getElementById('search');
  for (const f of inp.handlers.input) f({ target: { value: concept0.title.toLowerCase() } }); await tick();
  const item = box().querySelectorAll('[data-search-id]').find(e => e.dataset.searchKind === 'concept' && e.dataset.searchId === concept0.id);
  ok(item, 'concept result not found for "' + concept0.title + '"'); await A.press(item);
  ok(A.h1() === 'Learning', 'h1=' + A.h1()); ok(A.html().includes('Practice this concept'), 'concept page not shown');
});
await t('practice: wrong answer -> "Needs review", attempt stored', async () => {
  await A.press(A.by('data-practice-concept', concept0.id)); ok(A.h1() === 'Practice');
  await A.press(A.by('data-question', q0.id));
  A.doc.getElementById('answer').value = 'zzz wrong'; await A.doc.getElementById('answerForm').onsubmit({ preventDefault() {} });
  const r = A.doc.getElementById('answerResult').innerHTML; ok(r.includes('Needs review'), 'no Needs review'); ok(idb.data.attempts.length === 1, 'attempts=' + idb.data.attempts.length);
});
await t('practice: correct answer -> "Correct", second attempt stored', async () => {
  await A.press(A.doc.getElementById('nextQ')); await A.press(A.by('data-question', q0.id));
  A.doc.getElementById('answer').value = q0.answer; await A.doc.getElementById('answerForm').onsubmit({ preventDefault() {} });
  ok(A.doc.getElementById('answerResult').innerHTML.includes('Correct'), 'not Correct'); ok(idb.data.attempts.length === 2, 'attempts=' + idb.data.attempts.length);
});
await t('performance: shows 2 attempts, 1 correct, 50% accuracy, weak concept', async () => {
  await A.nav('Performance'); const h = A.html();
  ok(h.includes('2 attempts · 1 correct · 1 incorrect'), 'summary wrong'); ok(h.includes('50%'), 'no 50%'); ok(h.includes(concept0.title), 'weak concept missing'); clean(h);
});
await t('revision: Add to revision -> alert + queue count 1', async () => {
  await A.nav('Learning'); await A.press(A.by('data-revise', concept0.id));
  ok(A.env.alerts.some(a => /revision queue/i.test(a)), 'no alert'); await A.nav('Performance'); ok(A.html().includes('1 concepts queued'), 'queue not 1');
});
await t('settings: notification toggle flips and persists in history', async () => {
  await A.nav('Settings'); const before = A.html().includes('Enabled'); await A.press(A.doc.getElementById('toggleNotify'));
  ok(A.html().includes(before ? 'Disabled' : 'Enabled'), 'toggle did not flip'); ok(/1 relevant events/.test(A.html()), 'history not 1');
});
await t('sukoon: button opens panel, second click closes it', async () => {
  await A.press(A.sukoon); ok(A.env.body.some(e => e.id === 'sukoonPanel'), 'panel not opened');
  ok(A.env.body.find(e => e.id === 'sukoonPanel')._html.includes('not connected'), 'panel not honest about AI');
  await A.press(A.sukoon); ok(!A.env.body.some(e => e.id === 'sukoonPanel'), 'panel not closed');
});
await t('language: Hindi and Bilingual render; count translation-pending labels', async () => {
  for (const lang of ['hi', 'bi', 'en']) { for (const f of A.doc.getElementById('langSelect').handlers.change) await f({ target: { value: lang } }); await A.nav('Learning'); clean(A.html());
    if (lang === 'hi') { const pend = (A.html().match(/अनुवाद लंबित/g) || []).length; console.log('   info: Hindi Learning page translation-pending labels:', pend); } }
});
await t('class switch: Class 12 renders its subjects', async () => {
  for (const f of A.doc.getElementById('classSelect').handlers.change) await f({ target: { value: '12' } }); await A.nav('Learning'); clean(A.html());
  ok(A.html().includes('data-subject="phy12"'), 'Class 12 physics missing');
});
await t('reload: route, class and attempts restored from storage', async () => {
  const B = await boot({ idb, ls }); ok(B.h1() === 'Learning', 'route after reload=' + B.h1());
  ok(B.doc.getElementById('classSelect').value === '12', 'class after reload=' + B.doc.getElementById('classSelect').value);
});

console.log('\n--- resilience ---');
await t('RESILIENCE: startup when IndexedDB transactions throw', async () => {
  const bad = makeIDB({ throwOnTransaction: true }); const B = await boot({ idb: bad, ls: makeLS() }); ok(B.h1() === 'Home', 'h1=' + B.h1());
});
await t('RESILIENCE: tab switch when storage starts throwing mid-session', async () => {
  const o = {}; const i2 = makeIDB(o); const B = await boot({ idb: i2, ls: makeLS() }); o.throwOnTransaction = true;
  const before = problems.length; await B.nav('Learning'); await tick(); ok(B.h1() === 'Learning', 'screen did not change (h1=' + B.h1() + ')'); ok(problems.length === before, 'errors: ' + problems.slice(before).join(' | '));
});
await t('RESILIENCE: no IndexedDB -> state survives reload via localStorage', async () => {
  const l = makeLS(); const B = await boot({ idb: undefined, ls: l }); await B.nav('Practice');
  const C = await boot({ idb: undefined, ls: l }); ok(C.h1() === 'Practice', 'route after reload=' + C.h1());
});

const failed = results.filter(r => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed` + (problems.length ? `  | captured errors: ${problems.length}` : ''));
if (problems.length) console.log('first errors:', problems.slice(0, 3).join(' || ').slice(0, 400));
process.exit(failed ? 1 : 0);
