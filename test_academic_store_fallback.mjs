// Node 18+ smoke test for the localStorage fallback when IndexedDB is unavailable.
// Run from the repository root: node tests/test_academic_store_fallback.mjs
import assert from 'node:assert/strict';
import { AcademicStore } from '../academic/academic-store.js';

const backing = new Map();
globalThis.localStorage = {
  getItem(key) { return backing.has(key) ? backing.get(key) : null; },
  setItem(key, value) { backing.set(key, String(value)); },
};

const initial = await new AcademicStore().loadAppState();
assert.equal(initial.route, 'Home', 'empty storage should return defaults');

const saved = {
  route: 'Practice',
  academic: { classId: '12', board: 'UP Board', language: 'hi' },
  history: [{ type: 'test' }],
};
await new AcademicStore().saveAppState(saved);
const restored = await new AcademicStore().loadAppState();
assert.equal(restored.route, 'Practice');
assert.equal(restored.academic.classId, '12');
assert.equal(restored.history.length, 1);

backing.set('sciencehub.phase5.app', '{broken');
const recovered = await new AcademicStore().loadAppState();
assert.equal(recovered.route, 'Home', 'invalid JSON should fall back safely');

console.log('PASS defaults when no stored value exists');
console.log('PASS localStorage save/load across store instances without IndexedDB');
console.log('PASS malformed stored JSON safely falls back to defaults');
