import { DATA } from './academic/academic-data.js';
import { AcademicStore } from './academic/academic-store.js';
import { AcademicEngine } from './academic/academic-engine.js';

const NAV=['Home','Learning','Practice','Performance','Assets','Profile','Settings'];
const store=new AcademicStore();
let state=await store.loadAppState();
let filter={classId:state.academic.classId||'11',board:state.academic.board||'UP Board',language:state.academic.language||'en'};
let current={route:state.route||'Home',subjectId:null,chapterId:null,conceptId:null,questionId:null};
const engine=new AcademicEngine(DATA,store);

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function t(en,hi){const english=String(en??'');const hindi=String(hi??'');if(filter.language==='hi')return hindi||english;if(filter.language==='bi'&&hindi)return `${english} · ${hindi}`;return english;}
function save(){state.route=current.route;state.academic={...state.academic,...filter};return store.saveAppState(state);}
function card(title,body,actions=''){return `<article class="card"><h3>${esc(title)}</h3>${body}${actions}</article>`;}
function subjects(){return DATA.subjects.filter(s=>s.classes.includes(filter.classId));}
function chapters(){return DATA.chapters.filter(c=>c.classId===filter.classId&&c.subjectId===current.subjectId);}
function concepts(){return DATA.concepts.filter(c=>c.classId===filter.classId&&c.chapterId===current.chapterId);}
function currentQuestion(){return DATA.questions.find(q=>q.id===current.questionId);}

async function render(){
  await save();
  const app=document.querySelector('#app');
  app.innerHTML=`<div class="shell"><header class="top"><div><div class="brand">ScienceHub.io</div><small class="muted">Phase 5 Academic Runtime</small></div><div class="toolbar"><select id="classSelect" aria-label="Class"><option value="11">Class 11</option><option value="12">Class 12</option></select><select id="langSelect" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="bi">Bilingual</option></select><input id="search" class="search" placeholder="Search academic data…" aria-label="Search"></div></header><main class="panel"><h1>${esc(current.route)}</h1>${await routeContent(current.route)}</main><nav class="nav">${NAV.map(n=>`<button class="${n===current.route?'active':''}" data-route="${n}">${n}</button>`).join('')}</nav></div>`;
  document.getElementById('classSelect').value=filter.classId;
  document.getElementById('langSelect').value=filter.language;
  document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',async()=>{current.route=b.dataset.route;current.subjectId=null;current.chapterId=null;current.conceptId=null;current.questionId=null;await render();}));
  document.getElementById('classSelect').addEventListener('change',async e=>{filter.classId=e.target.value;current.subjectId=null;current.chapterId=null;current.conceptId=null;current.questionId=null;await render();});
  document.getElementById('langSelect').addEventListener('change',async e=>{filter.language=e.target.value;await render();});
  document.getElementById('search').addEventListener('input',e=>renderSearch(e.target.value));
  bindActions();
}
function renderSearch(q){
 const box=document.getElementById('searchResults'); if(!box)return;
 q=q.trim().toLowerCase(); if(!q){box.innerHTML='';return;}
 const rows=[...DATA.subjects,...DATA.chapters,...DATA.topics,...DATA.concepts,...DATA.questions].filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,12);
 box.innerHTML=rows.length?`<div class="search-results">${rows.map(x=>`<button class="search-item" data-search-id="${esc(x.id)}">${esc(t(x.title||x.text||x.name,x.titleHi||x.textHi||x.nameHi))} <small>${esc(x.type||'academic')}</small></button>`).join('')}</div>`:`<div class="muted">No permitted academic result found.</div>`;
}
async function routeContent(r){
 if(r==='Home') return home();
 if(r==='Learning') return learning();
 if(r==='Practice') return practice();
 if(r==='Performance') return performance();
 if(r==='Assets') return card('Assets & Gallery',`<p class="muted">Phase 5 keeps academic resources separate from the visual asset system. ${esc(DATA.resources.length)} NCERT/resource metadata records are available in this runtime.</p>`);
 if(r==='Profile') return profile();
 return settings();
}
async function home(){
 try{
  const [p,rec]=await Promise.all([engine.getOverallProgress(filter),engine.getRecommendations(filter)]);
  return `<div id="searchResults"></div><div class="grid">${card(t('Academic Context','शैक्षणिक संदर्भ'),`<p>${esc(filter.classId)} · ${esc(filter.board)} · ${filter.language==='bi'?'Bilingual':filter.language==='hi'?'हिन्दी':'English'}</p><p class="muted">PCB is a pathway; subjects remain Physics, Chemistry, Biology, English and Hindi.</p>`)}${card(t('Today’s Overview','आज का अवलोकन'),`<p>${p.attempts} attempts · ${p.accuracy}% accuracy · ${p.completedConcepts} concepts attempted</p>`)}${card(t('Continue Learning','पढ़ाई जारी रखें'),`<p class="muted">${esc(rec[0]?.title||'Choose a subject to begin.')}</p>`,`<button class="action" data-route2="Learning">Open Learning</button>`)}${card('Learning Pipeline',`<p class="muted">Subject → Chapter → Topic → Concept → Practice → PYQ → Performance → Analysis → Revision → Mastery</p>`)}${card('Phase 5 Runtime',`<p class="status">IndexedDB: ${store.ready?'ready':'unavailable'} · Offline data: local · Practice engine: ready · Performance engine: ready</p>`)}${card('Recommended Next',rec.length?`<ul>${rec.slice(0,4).map(x=>`<li>${esc(x.title)} — ${esc(x.reason)}</li>`).join('')}</ul>`:`<p class="muted">Complete an attempt to generate a recommendation.</p>`)}</div>`;
 }catch(error){
  console.error('Unable to load academic home data:',error);
  return `<div id="searchResults"></div>${card('Academic data unavailable',`<p class="muted">Progress and recommendations could not be loaded. Please try again.</p>`)}`;
 }
}
async function learning(){
 if(!current.subjectId)return `<div class="grid">${subjects().map(s=>card(t(s.name,s.nameHi),`<p class="muted">${esc(t(s.description,s.descriptionHi))}</p>`,`<button class="action" data-subject="${s.id}">Open</button>`)).join('')}</div>`;
 if(!current.chapterId)return `<button class="action" data-back="subject">← Subjects</button><div class="grid">${chapters().map(c=>card(t(c.title,c.titleHi),`<p class="muted">${esc(t(c.description,c.descriptionHi))}</p>`,`<button class="action" data-chapter="${c.id}">Open</button>`)).join('')}</div>`;
 if(!current.conceptId)return `<button class="action" data-back="chapter">← Chapters</button><div class="grid">${concepts().map(c=>card(t(c.title,c.titleHi),`<p>${esc(t(c.summary,c.summaryHi))}</p><p class="muted">${esc(t(c.topic,c.topicHi))}</p>`,`<button class="action" data-concept="${c.id}">Study concept</button>`)).join('')}</div>`;
 const c=DATA.concepts.find(x=>x.id===current.conceptId); let progressHtml;
 try{const prog=await engine.getConceptProgress(c.id);progressHtml=`<p class="muted">Progress: ${prog.accuracy}% accuracy · ${prog.attempts} attempts · mastery ${prog.mastery}%</p>`;}
 catch(error){console.error('Unable to load concept progress:',error);progressHtml='<p class="muted">Progress is temporarily unavailable.</p>';}
 return `<button class="action" data-back="concept">← Concepts</button>${card(t(c.title,c.titleHi),`<p>${esc(t(c.summary,c.summaryHi))}</p>${progressHtml}`,`<button class="action" data-practice-concept="${c.id}">Practice this concept</button> <button class="action" data-revise="${c.id}">Add to revision</button>`)}`;
}
function practice(){
 const qs=engine.getPracticeQuestions(filter,current.conceptId); if(current.questionId){const q=currentQuestion();return questionView(q);}
 return `<div class="grid">${qs.map(q=>card(t(q.title,q.titleHi),`<p>${esc(t(q.text,q.textHi))}</p><p class="muted">${esc(t(q.subjectName,q.subjectNameHi))} · ${esc(t(q.conceptTitle,q.conceptTitleHi))} · ${esc(q.type)}${q.aiGenerated?' · AI-generated':''}</p>`,`<button class="action" data-question="${q.id}">Attempt</button>`)).join('')||card('No questions available','Select a concept or check another class.')}</div>`;
}
function questionView(q){return card(t(q.title,q.titleHi),`<p>${esc(t(q.text,q.textHi))}</p><form id="answerForm"><label>Answer<input id="answer" required autocomplete="off"></label><button class="action" type="submit">Check answer</button></form><div id="answerResult"></div>`);}
async function performance(){
 try{
  const [p,weak,revisionQueue]=await Promise.all([engine.getOverallProgress(filter),engine.getWeakConcepts(filter),engine.getRevisionQueue()]);
  return `<div class="grid">${card('Overall Performance',`<p><strong>${p.accuracy}%</strong> accuracy</p><p>${p.attempts} attempts · ${p.correct} correct · ${p.incorrect} incorrect</p>`)}${card('Concept Progress',`<p>${p.completedConcepts} concepts attempted across ${subjects().length} subjects.</p>`)}${card('Weak Concepts',weak.length?`<ul>${weak.slice(0,8).map(x=>`<li>${esc(t(x.title,x.titleHi))} — ${x.accuracy}%</li>`).join('')}</ul>`:`<p class="muted">No weak concept detected yet.</p>`)}${card('Revision Queue',`<p>${revisionQueue.length} concepts queued.</p>`,`<button class="action" data-route2="Learning">Open Learning</button>`)}</div>`;
 }catch(error){
  console.error('Unable to load academic performance data:',error);
  return card('Performance unavailable',`<p class="muted">Performance and revision data could not be loaded. Please try again.</p>`);
 }
}
function profile(){const last=state.profile.pictureChangedAt;return card('User Control Center',`<p class="muted">Profile picture changes are user-controlled and blocked for 15 days after each change.</p><p>${last?`Last change: ${esc(new Date(last).toLocaleString())}`:'No profile picture change recorded.'}</p><p>Academic data is stored locally in this Phase 5 runtime.</p>`);}
function settings(){return `<div class="grid">${card('Notifications',`<p>${state.settings.notifications?'Enabled':'Disabled'}</p>`,`<button class="action" id="toggleNotify">Toggle</button>`)}${card('Storage',`<p>IndexedDB academic store: ${store.ready?'Ready':'Unavailable'}</p><p class="muted">LocalStorage remains for small app preferences.</p>`)}${card('Upgrade Guard',`<p class="muted">Phase 5 exposes compatibility/status information only. Upgrade execution remains outside this phase.</p>`)}${card('Activity History',`<p>${state.history.length} relevant events recorded.</p>`)}</div>`;}
function bindActions(){
 document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=async()=>{current.subjectId=b.dataset.subject;await render()});
 document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=async()=>{current.chapterId=b.dataset.chapter;await render()});
 document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=async()=>{current.conceptId=b.dataset.concept;await render()});
 document.querySelectorAll('[data-question]').forEach(b=>b.onclick=async()=>{current.questionId=b.dataset.question;await render()});
 document.querySelectorAll('[data-practice-concept]').forEach(b=>b.onclick=async()=>{current.route='Practice';current.questionId=null;await render()});
 document.querySelectorAll('[data-revise]').forEach(b=>b.onclick=async()=>{await engine.queueRevision(b.dataset.revise);alert('Concept added to revision queue.');await render()});
 document.querySelectorAll('[data-route2]').forEach(b=>b.onclick=async()=>{current.route=b.dataset.route2;await render()});
 document.querySelectorAll('[data-back]').forEach(b=>b.onclick=async()=>{if(b.dataset.back==='subject'){current.subjectId=null;current.chapterId=null;current.conceptId=null}if(b.dataset.back==='chapter')current.conceptId=null;if(b.dataset.back==='concept')current.conceptId=null;await render()});
 const form=document.getElementById('answerForm'); if(form)form.onsubmit=async e=>{e.preventDefault();const q=currentQuestion();const result=engine.checkAnswer(q,document.getElementById('answer').value);await engine.recordAttempt(q,result);document.getElementById('answerResult').innerHTML=`<div class="result ${result.correct?'good':'danger'}"><strong>${result.correct?'Correct':'Needs review'}</strong><p>${esc(t(result.explanation,result.explanationHi))}</p><p>Concept progress updated.</p><button class="action" id="nextQ">Continue</button></div>`;document.getElementById('nextQ').onclick=async()=>{current.questionId=null;await render()};};
 const n=document.getElementById('toggleNotify');if(n)n.onclick=async()=>{state.settings.notifications=!state.settings.notifications;state.history.push({time:new Date().toISOString(),type:'settings',detail:'Notification preference changed'});await render()};
}
window.addEventListener('online',render);window.addEventListener('offline',render);
document.getElementById('sukoon').onclick=()=>alert('Sukoon.Brain visual shell is available. Live AI routing belongs to Phase 6.');
if('serviceWorker' in navigator)navigator.serviceWorker.register('./6_sw.js').catch(()=>{});
await render();
