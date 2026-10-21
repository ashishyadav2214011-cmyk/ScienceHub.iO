import assert from 'node:assert/strict';
import { AcademicStore } from '../academic/academic-store.js';
const map = new Map();
globalThis.localStorage = {
  getItem(k) { return map.has(k) ? map.get(k) : null; },
  setItem(k, v) { map.set(k, String(v)); },
  removeItem(k) { map.delete(k); }
};
// No IndexedDB: fallback should persist across store instances.
const saved = { route: 'Practice', academic: { classId: '12', board: 'UP Board', language: 'hi' }, history: [{ type: 'test' }] };
await new AcademicStore().saveAppState(saved);
assert.deepEqual(await new AcademicStore().loadAppState(), saved);
map.set('sciencehub.phase5.app', '{broken');
assert.equal((await new AcademicStore().loadAppState()).route, 'Home');
console.log('PASS fallback: restores state from localStorage');
console.log('PASS fallback: malformed JSON returns safe defaults');
