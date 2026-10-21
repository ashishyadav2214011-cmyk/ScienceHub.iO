export class AcademicEngine {
  constructor(data, store) { this.data = data; this.store = store; }

  getPracticeQuestions(filter, conceptId) {
    return this.data.questions
      .filter(q => q.classId === filter.classId && (!conceptId || q.conceptId === conceptId))
      .map(q => {
        const s = this.data.subjects.find(x => x.id === q.subjectId);
        const c = this.data.concepts.find(x => x.id === q.conceptId);
        return { ...q, subjectName: s?.name || '', subjectNameHi: s?.nameHi || '', conceptTitle: c?.title || '', conceptTitleHi: c?.titleHi || '' };
      });
  }

  normalize(value) { return String(value ?? '').trim().toLocaleLowerCase().replace(/[.,!?\s]+/g, ' '); }

  checkAnswer(question, input) {
    const answer = this.normalize(input);
    const accepted = [question.answer, question.answerHi].map(v => this.normalize(v)).filter(Boolean);
    const correct = accepted.includes(answer);
    return { correct, score: correct ? 2 : -1, status: correct ? 'correct' : 'incorrect', explanation: question.explanation, explanationHi: question.explanationHi };
  }

  async recordAttempt(question, result) {
    const skipped = result?.status === 'skipped' || result?.skipped === true;
    const correct = !skipped && result?.correct === true;
    const attempt = {
      questionId: question.id, conceptId: question.conceptId, classId: question.classId,
      subjectId: question.subjectId, correct, skipped,
      score: skipped ? 0 : (correct ? 2 : -1),
      status: skipped ? 'skipped' : (correct ? 'correct' : 'incorrect'),
      at: new Date().toISOString()
    };
    return this.store.addAttempt(attempt);
  }

  async queueRevision(conceptId, reason = 'user_or_performance') {
    return this.store.setRevision(conceptId, { queuedAt: new Date().toISOString(), reason });
  }

  async getRevisionQueue() { return this.store.getRevision(); }

  async getConceptProgress(conceptId) {
    const attempts = (await this.store.getAttempts()).filter(x => x.conceptId === conceptId && !x.skipped);
    const correct = attempts.filter(x => x.correct).length;
    const accuracy = attempts.length ? Math.round(correct / attempts.length * 100) : 0;
    const mastery = Math.min(100, Math.round(accuracy * 0.7 + Math.min(attempts.length, 5) * 6));
    return { attempts: attempts.length, correct, incorrect: attempts.length - correct, accuracy, mastery };
  }

  async getOverallProgress(filter) {
    const attempts = (await this.store.getAttempts()).filter(x => x.classId === filter.classId);
    const scored = attempts.filter(x => !x.skipped);
    const correct = scored.filter(x => x.correct).length;
    const concepts = new Set(attempts.map(x => x.conceptId).filter(Boolean));
    const score = attempts.reduce((sum, x) => sum + (Number.isFinite(x.score) ? x.score : (x.skipped ? 0 : (x.correct ? 2 : -1))), 0);
    return { attempts: attempts.length, scoredAttempts: scored.length, skipped: attempts.length - scored.length, correct, incorrect: scored.length - correct, score, accuracy: scored.length ? Math.round(correct / scored.length * 100) : 0, completedConcepts: concepts.size };
  }

  async getWeakConcepts(filter) {
    const attempts = await this.store.getAttempts();
    const ids = this.data.concepts.filter(c => c.classId === filter.classId).map(c => c.id);
    return ids.map(id => {
      const rows = attempts.filter(x => x.conceptId === id && !x.skipped);
      const correct = rows.filter(x => x.correct).length;
      const concept = this.data.concepts.find(c => c.id === id);
      return { id, title: concept?.title || id, titleHi: concept?.titleHi || '', accuracy: rows.length ? Math.round(correct / rows.length * 100) : 0, attempts: rows.length };
    }).filter(x => x.attempts >= 2 && x.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);
  }

  async getRecommendations(filter) {
    const weak = await this.getWeakConcepts(filter);
    if (weak.length) return weak.map(x => ({ title: `Review ${x.title}`, reason: 'Repeated low accuracy; revise and re-practice this concept.' }));
    const progress = await this.getOverallProgress(filter);
    if (!progress.attempts) return [{ title: 'Start with a Class 11/12 subject', reason: 'No practice history yet.' }];
    return [{ title: 'Continue practice', reason: 'Keep building concept consistency.' }];
  }
}
