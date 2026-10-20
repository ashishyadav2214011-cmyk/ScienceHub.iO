// Usage: node test_academic_store_storage.mjs [path/to/academic-store.js]
// Uses fake IndexedDB/localStorage; no browser or dependencies needed.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const storePath = process.argv[2] || './academic/academic-store.js';
const src = readFileSync(storePath, 'utf8');
const { AcademicStore } = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));

const KEY = 'sciencehub.phase5.app';
const S = { route: 'Learning', academic: { classId: '12', board: 'UP Board', language: 'hi' }, profile: {}, settings: {}, permissions: {}, history: [{ type: 'x' }] };
const unhandled = [];
process.on('unhandledRejection', e => unhandled.push(e));

function setGlobal(name, value) {
  try { delete globalThis[name]; } catch {}
  if (value !== undefined) Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
}
function makeLS(opts = {}) {
  const m = new Map();
  return {
    store: m,
    getItem(k) { if (opts.throws) throw new Error('SecurityError'); return m.has(k) ? m.get(k) : null; },
    setItem(k, v) { if (opts.throws) throw new Error('SecurityError'); m.set(k, String(v)); },
    removeItem(k) { m.delete(k); }
  };
}
function makeIDB(opts = {}) {
  const data = { state: new Map(), attempts: [], revision: new Map() };
  let autoId = 1;
  const db = {
    objectStoreNames: { contains: () => true },
    createObjectStore() {},
    transaction(storeName) {
      if (opts.throwOnTransaction) throw new Error('InvalidStateError');
      const tx = {};
      const mk = (fn, fail) => {
        const req = {};
        setTimeout(() => {
          if (fail) {
            req.error = new Error('request failed');
            req.onerror && req.onerror();
            tx.onerror && tx.onerror();
            tx.onabort && tx.onabort();
          } else {
            req.result = fn();
            req.onsuccess && req.onsuccess();
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
          }
        }, 0);
        return req;
      };
      tx.objectStore = () => ({
        get: k => mk(() => data[storeName].get(k), opts.failGet),
        put: v => mk(() => { if (storeName === 'state') data.state.set(v.id, v); else data.revision.set(v.conceptId, v); return v; }, opts.failPut),
        add: v => mk(() => { data.attempts.push({ id: autoId++, ...v }); }, opts.failPut),
        getAll: () => mk(() => storeName === 'attempts' ? [...data.attempts] : [...data[storeName].values()], opts.failGet)
      });
      return tx;
    }
  };
  const indexedDB = { open() { const r = {}; setTimeout(() => { r.result = db; r.onupgradeneeded && r.onupgradeneeded(); r.onsuccess && r.onsuccess(); }, 0); return r; } };
  return { indexedDB, data };
}
const env = ({ idb, ls }) => { setGlobal('window', globalThis); setGlobal('indexedDB', idb); setGlobal('localStorage', ls); };
const wait = ms => new Promise(r => setTimeout(r, ms));

const results = [];
async function t(name, fn) {
  try { await fn(); results.push(true); console.log('PASS', name); }
  catch (e) { results.push(false); console.log('FAIL', name, '-', String(e.message).split('\n')[0]); }
}

await t('fallback: state saved without IndexedDB is restored after reload', async () => {
  const ls = makeLS(); env({ idb: undefined, ls });
  await new AcademicStore().saveAppState(S);
  assert.deepEqual(await new AcademicStore().loadAppState(), S);
});
await t('fallback: malformed or non-object stored JSON gives defaults, no crash', async () => {
  for (const bad of ['{not json', '[1,2]', '"str"', 'null']) {
    const ls = makeLS(); ls.store.set(KEY, bad); env({ idb: undefined, ls });
    assert.equal((await new AcademicStore().loadAppState()).route, 'Home');
  }
});
await t('fallback: localStorage unavailable does not throw and keeps in-session state', async () => {
  const ls = makeLS({ throws: true }); env({ idb: undefined, ls });
  const a = new AcademicStore(); await a.saveAppState(S);
  assert.deepEqual(await a.loadAppState(), S);
  assert.equal((await new AcademicStore().loadAppState()).route, 'Home');
});
await t('indexeddb: normal save then reload restores state', async () => {
  const { indexedDB } = makeIDB(); env({ idb: indexedDB, ls: makeLS() });
  await new AcademicStore().saveAppState(S);
  assert.deepEqual(await new AcademicStore().loadAppState(), S);
});
await t('indexeddb: failed state read does not overwrite stored state', async () => {
  const opts = {}; const { indexedDB, data } = makeIDB(opts); env({ idb: indexedDB, ls: makeLS() });
  await new AcademicStore().saveAppState(S);
  opts.failGet = true;
  const b = new AcademicStore(); await b.loadAppState();
  await b.saveAppState({ ...S, route: 'Practice' });
  assert.equal(data.state.get('app').value.route, 'Learning');
});
await t('indexeddb: failed write falls back to localStorage backup', async () => {
  const opts = { failPut: true }; const { indexedDB } = makeIDB(opts); const ls = makeLS(); env({ idb: indexedDB, ls });
  await new AcademicStore().saveAppState(S);
  assert.equal(JSON.parse(ls.store.get(KEY)).route, 'Learning');
});
await t('indexeddb: db.transaction() throwing does not reject load or save', async () => {
  const opts = {}; const { indexedDB } = makeIDB(opts); env({ idb: indexedDB, ls: makeLS() });
  const a = new AcademicStore(); await a.init();
  opts.throwOnTransaction = true;
  await a.loadAppState(); await a.saveAppState(S);
});
await t('indexeddb: indexedDB.open() throwing does not break startup', async () => {
  const before = unhandled.length;
  env({ idb: { open() { throw new Error('SecurityError'); } }, ls: makeLS() });
  const a = new AcademicStore();
  assert.equal((await a.loadAppState()).route, 'Home');
  await wait(20);
  assert.equal(unhandled.length, before);
});
await t('indexeddb: getRevision() read error resolves to an array', async () => {
  const opts = {}; const { indexedDB } = makeIDB(opts); env({ idb: indexedDB, ls: makeLS() });
  const a = new AcademicStore(); await a.init(); opts.failGet = true;
  assert.ok(Array.isArray(await a.getRevision()));
});
await t('attempts: stored in IndexedDB and listed', async () => {
  const { indexedDB } = makeIDB(); env({ idb: indexedDB, ls: makeLS() });
  const a = new AcademicStore();
  assert.notEqual(await a.addAttempt({ q: 1 }), false);
  assert.equal((await a.getAttempts()).length, 1);
});
await t('attempts: failed write reports false and keeps the attempt in memory', async () => {
  const opts = {}; const { indexedDB } = makeIDB(opts); env({ idb: indexedDB, ls: makeLS() });
  const a = new AcademicStore(); await a.init(); opts.failPut = true;
  assert.equal(await a.addAttempt({ q: 1 }), false);
  assert.equal(a.memory.attempts.length, 1);
});

const failed = results.filter(r => !r).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
