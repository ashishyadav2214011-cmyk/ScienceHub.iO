import assert from 'node:assert/strict';
import { AcademicEngine } from '../academic/academic-engine.js';

const attempts = [];
const revisions = new Map();
const store = {
  async addAttempt(a) { attempts.push({ ...a }); return true; },
  async getAttempts() { return attempts.map(a => ({ ...a })); },
  async setRevision(id, v) { revisions.set(id, { conceptId: id, ...v }); return true; },
  async getRevision() { return [...revisions.values()]; }
};
const data = {
  questions: [], subjects: [], concepts: [
    { id: 'c1', classId: '11', title: 'Concept 1' },
    { id: 'c2', classId: '11', title: 'Concept 2' }
  ]
};
const engine = new AcademicEngine(data, store);
const q = { id: 'q1', conceptId: 'c1', classId: '11', subjectId: 'physics' };
assert.equal(engine.checkAnswer({ answer: '42' }, '42').score, 2);
assert.equal(engine.checkAnswer({ answer: '42' }, '41').score, -1);
await engine.recordAttempt(q, { correct: true, status: 'correct' });
await engine.recordAttempt(q, { correct: false, status: 'incorrect' });
await engine.recordAttempt(q, { skipped: true, status: 'skipped' });
const p = await engine.getOverallProgress({ classId: '11' });
assert.equal(p.attempts, 3);
assert.equal(p.scoredAttempts, 2);
assert.equal(p.skipped, 1);
assert.equal(p.score, 1);
assert.equal(p.accuracy, 50);
const cp = await engine.getConceptProgress('c1');
assert.equal(cp.attempts, 2);
assert.equal(cp.accuracy, 50);
assert.equal(attempts.length, 3, 'retries remain separate records');
console.log('PASS scoring: correct +2, incorrect -1, skipped 0');
console.log('PASS skipped attempts excluded from accuracy');
console.log('PASS retries stored as separate attempts');
