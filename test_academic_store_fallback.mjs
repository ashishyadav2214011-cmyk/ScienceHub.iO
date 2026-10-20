import assert from 'node:assert/strict';
import { AcademicStore } from '../academic/academic-store.js';

const backing = new Map();
globalThis.localStorage = {
  getItem(key) { return backing.has(key) ? backing.get(key) : null; },
  setItem(key, value) { backing.set(key, String(value)); },
};
// No `window.indexedDB` is supplied: exercise the localStorage fallback path.
const first = new AcademicStore();
const initial = await first.loadAppState();
assert.equal(initial.route, 'Home');
const saved = { route: 'Practice', academic: { classId: '12', board: 'UP Board', language: 'hi' }, history: [{ type: 'test' }] };
await first.saveAppState(saved);
const second = new AcademicStore();
const restored = await second.loadAppState();
assert.deepEqual(restored, saved);
backing.set('sciencehub.phase5.app', '{broken');
const third = new AcademicStore();
assert.equal((await third.loadAppState()).route, 'Home');
console.log('PASS: default state when storage is empty');
console.log('PASS: saved state restored by a fresh store instance without IndexedDB');
console.log('PASS: malformed localStorage JSON falls back safely');
