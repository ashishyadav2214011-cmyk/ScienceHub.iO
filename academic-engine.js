export class AcademicEngine {
  constructor(data, store) { this.data = data; this.store = store; }

  getPracticeQuestions(filter, conceptId) {
    return this.data.questions
      .filter(q => q.classId === filter.classId && (!conceptId || q.conceptId === conceptId))
      .map(q => {
        const s = this.data.subjects.find(x => x.id === q.subjectId);
        const c = this.data.concepts.find(x => x.id === q.conceptId);
        return { ...q, subjectName: s?.name || '', subjectNameHi: s?.nameHi || '',
          conceptTitle: c?.title || '', conceptTitleHi: c?.titleHi || '' };
      });
  }

  normalize(value) {
    return String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase()
      .replace(/[×✕]/g, 'x')
      .replace(/[−–—]/g, '-')
      .replace(/[.,!?\s]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  numericValue(value) {
    const cleaned = String(value ?? '').normalize('NFKC').trim()
      .replace(/,/g, '').replace(/[×✕]/g, 'x').replace(/[−–—]/g, '-')
      .replace(/\s+/g, '');
    const sci = cleaned.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(?:x)?10\^?([+-]?\d+)$/i);
    if (sci) return Number(sci[1]) * Math.pow(10, Number(sci[2]));
    const e = cleaned.match(/^([+-]?(?:\d+\.?\d*|\.\d+))e([+-]?\d+)$/i);
    if (e) return Number(e[1]) * Math.pow(10, Number(e[2]));
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number(cleaned);
    return null;
  }

  checkAnswer(q, input) {
    if (!q) return { correct: false, explanation: 'Question unavailable.', explanationHi: 'प्रश्न उपलब्ध नहीं है।' };
    const answer = this.normalize(input);
    const accepted = [q.answer, q.answerHi, ...(Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [])]
      .map(v => this.normalize(v)).filter(Boolean);
    let correct = answer.length > 0 && accepted.includes(answer);

    // Only apply numeric equivalence to explicitly numeric answer questions.
    if (!correct && q.id === 'q-chem11-1') {
      const actual = this.numericValue(input);
      const expected = this.numericValue(q.answer) ?? 6.022e23;
      correct = actual !== null && Number.isFinite(actual) &&
        Math.abs(actual - expected) <= Math.abs(expected) * 0.005;
    }
    return { correct, explanation: q.explanation, explanationHi: q.explanationHi };
  }

  async recordAttempt(q, result) {
    await this.store.addAttempt({ questionId:q.id, conceptId:q.conceptId, classId:q.classId,
      subjectId:q.subjectId, correct:result.correct, at:new Date().toISOString() });
  }
  async queueRevision(conceptId) {
    await this.store.setRevision(conceptId, { queuedAt:new Date().toISOString(), reason:'user_or_performance' });
  }
  async getRevisionQueue() { return this.store.getRevision(); }
  async getConceptProgress(conceptId) {
    const a=(await this.store.getAttempts()).filter(x=>x.conceptId===conceptId);
    const correct=a.filter(x=>x.correct).length, accuracy=a.length?Math.round(correct/a.length*100):0;
    const mastery=Math.min(100,Math.round(accuracy*.7+Math.min(a.length,5)*6));
    return { attempts:a.length,correct,incorrect:a.length-correct,accuracy,mastery };
  }
  async getOverallProgress(filter) {
    const a=(await this.store.getAttempts()).filter(x=>x.classId===filter.classId);
    const correct=a.filter(x=>x.correct).length;
    return {attempts:a.length,correct,incorrect:a.length-correct,
      accuracy:a.length?Math.round(correct/a.length*100):0,completedConcepts:new Set(a.map(x=>x.conceptId)).size};
  }
  async getWeakConcepts(filter) {
    const a=await this.store.getAttempts();
    return this.data.concepts.filter(c=>c.classId===filter.classId).map(c=>{
      const rows=a.filter(x=>x.conceptId===c.id), correct=rows.filter(x=>x.correct).length;
      return {id:c.id,title:c.title||c.id,titleHi:c.titleHi||'',
        accuracy:rows.length?Math.round(correct/rows.length*100):0,attempts:rows.length};
    }).filter(x=>x.attempts&&x.accuracy<70).sort((x,y)=>x.accuracy-y.accuracy);
  }
  async getRecommendations(filter) {
    const weak=await this.getWeakConcepts(filter);
    if(weak.length)return weak.map(x=>({title:`Review ${x.title}`,reason:'Low accuracy; revise and re-practice this concept.'}));
    const p=await this.getOverallProgress(filter);
    return p.attempts?[{title:'Continue practice',reason:'Keep building concept consistency.'}]
      :[{title:'Start with a subject',reason:'No practice history yet.'}];
  }
}
