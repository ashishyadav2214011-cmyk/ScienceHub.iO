import { DATA } from './academic/academic-data.js';
import { AcademicStore } from './academic/academic-store.js';
import { AcademicEngine } from './academic/academic-engine.js';

const NAV=['Home','Learning','Practice','Performance','Assets','Profile','Settings'];
const store=new AcademicStore();
let state=await store.loadAppState();
state={route:'Home',academic:{classId:'11',board:'UP Board',language:'en'},profile:{picture:null,pictureChangedAt:null},settings:{notifications:true,offline:true},permissions:{},history:[],...state};
state.academic={classId:'11',board:'UP Board',language:'en',...(state.academic||{})};
state.profile={picture:null,pictureChangedAt:null,...(state.profile||{})};
state.settings={notifications:true,offline:true,...(state.settings||{})};
state.history=Array.isArray(state.history)?state.history:[];
let filter={classId:state.academic.classId||'11',board:state.academic.board||'UP Board',language:state.academic.language||'en'};
let current={route:state.route||'Home',subjectId:null,chapterId:null,topicId:null,conceptId:null,questionId:null};
const engine=new AcademicEngine(DATA,store);
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function t(en,hi){const english=String(en??''),hindi=String(hi??'');if(filter.language==='hi')return hindi||(english?`${english} · हिन्दी अनुवाद लंबित`:'');if(filter.language==='bi')return hindi?`${english} · ${hindi}`:english?`${english} · हिन्दी अनुवाद लंबित`:'';return english;}
function save(){state.route=current.route;state.academic={...state.academic,...filter};return store.saveAppState(state);}
function card(title,body,actions=''){return `<article class="card"><h3>${esc(title)}</h3>${body}${actions}</article>`;}
function subjects(){return DATA.subjects.filter(s=>s.classes.includes(filter.classId));}
function chapters(){return DATA.chapters.filter(c=>c.classId===filter.classId&&c.subjectId===current.subjectId);}
function topics(){return DATA.topics.filter(x=>x.classId===filter.classId&&x.chapterId===current.chapterId);}
function concepts(){return DATA.concepts.filter(x=>x.classId===filter.classId&&x.chapterId===current.chapterId&&x.topicId===current.topicId);}
function currentQuestion(){return DATA.questions.find(q=>q.id===current.questionId);}
async function render(){
 await save();
 const app=document.querySelector('#app');
 app.innerHTML=`<div class="shell"><header class="top"><div><div class="brand">ScienceHub.io</div><small class="muted">Phase 5 Academic Runtime</small></div><div class="toolbar"><select id="classSelect" aria-label="Class"><option value="11">Class 11</option><option value="12">Class 12</option></select><select id="langSelect" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="bi">Bilingual</option></select><input id="search" class="search" placeholder="Search subjects, chapters, concepts…" aria-label="Search" autocomplete="off"></div><div id="searchResults" class="search-results" role="listbox" aria-label="Search results"></div></header><main class="panel"><h1>${esc(current.route)}</h1>${await routeContent(current.route)}</main><nav class="nav">${NAV.map(n=>`<button class="${n===current.route?'active':''}" data-route="${n}">${n}</button>`).join('')}</nav></div>`;
 document.getElementById('classSelect').value=filter.classId;document.getElementById('langSelect').value=filter.language;
 document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',async()=>{current.route=b.dataset.route;await render();}));
 document.getElementById('classSelect').addEventListener('change',async e=>{filter.classId=e.target.value;current.subjectId=current.chapterId=current.topicId=current.conceptId=current.questionId=null;await render();});
 document.getElementById('langSelect').addEventListener('change',async e=>{filter.language=e.target.value;await render();});
 const search=document.getElementById('search');search.addEventListener('input',e=>renderSearch(e.target.value));
 search.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('searchResults').innerHTML='';search.blur();}if(e.key==='Enter'){const first=document.querySelector('[data-search-index="0"]');if(first){e.preventDefault();first.click();}}});
 bindActions();
}
function searchableRows(){
 return [
  ...DATA.subjects.map(x=>({...x,_kind:'subject',_label:x.name,_labelHi:x.nameHi})),
  ...DATA.chapters.map(x=>({...x,_kind:'chapter',_label:x.title,_labelHi:x.titleHi})),
  ...DATA.topics.map(x=>({...x,_kind:'topic',_label:x.title,_labelHi:x.titleHi})),
  ...DATA.concepts.map(x=>({...x,_kind:'concept',_label:x.title,_labelHi:x.titleHi})),
  ...DATA.questions.map(x=>({...x,_kind:'question',_label:x.title||x.text,_labelHi:x.titleHi||x.textHi}))
 ].filter(x=>x.classId===filter.classId);
}
function renderSearch(query){
 const box=document.getElementById('searchResults');if(!box)return;
 const q=query.trim().toLocaleLowerCase();if(!q){box.innerHTML='';return;}
 const rows=searchableRows().filter(x=>[x._label,x._labelHi,x.text,x.textHi,x.description,x.topic].some(v=>String(v||'').toLocaleLowerCase().includes(q))).slice(0,12);
 box.innerHTML=rows.length?rows.map((x,i)=>`<button class="search-item" role="option" data-search-index="${i}" data-search-kind="${x._kind}" data-search-id="${esc(x.id)}"><span>${esc(t(x._label,x._labelHi))}</span><small>${esc(x._kind)}</small></button>`).join(''):`<p class="muted">No matching academic results.</p>`;
 box.querySelectorAll('[data-search-id]').forEach(b=>b.addEventListener('click',async()=>{
  const row=rows[Number(b.dataset.searchIndex)];if(!row)return;
  current.questionId=null;current.subjectId=null;current.chapterId=null;current.topicId=null;current.conceptId=null;
  if(row._kind==='subject'){current.route='Learning';current.subjectId=row.id;}
  else if(row._kind==='chapter'){current.route='Learning';current.subjectId=row.subjectId;current.chapterId=row.id;}
  else if(row._kind==='topic'){current.route='Learning';current.subjectId=row.subjectId;current.chapterId=row.chapterId;current.topicId=row.id;}
  else if(row._kind==='concept'){current.route='Learning';current.subjectId=row.subjectId;current.chapterId=row.chapterId;current.topicId=row.topicId;current.conceptId=row.id;}
  else {current.route='Practice';current.questionId=row.id;}
  await render();
 }));
}
async function routeContent(r){if(r==='Home')return home();if(r==='Learning')return learning();if(r==='Practice')return practice();if(r==='Performance')return performance();if(r==='Assets')return card('Assets & Gallery',`<p class="muted">${esc(DATA.resources.length)} resource metadata records are available.</p>`);if(r==='Profile')return profile();return settings();}
async function home(){
 try{const [p,rec]=await Promise.all([engine.getOverallProgress(filter),engine.getRecommendations(filter)]);
 return `<div class="grid">${card('Academic Context',`<p>${esc(filter.classId)} · ${esc(filter.board)} · ${esc(filter.language)}</p><p class="muted">Physics, Chemistry, Biology, English and Hindi.</p>`)}${card('Today’s Overview',`<p>${p.attempts} attempts · ${p.accuracy}% accuracy · ${p.completedConcepts} concepts attempted</p>`)}${card('Continue Learning',`<p class="muted">${esc(rec[0]?.title||'Choose a subject to begin.')}</p>`,`<button class="action" data-route2="Learning">Open Learning</button>`)}${card('Learning Pipeline',`<p class="muted">Subject → Chapter → Topic → Concept → Practice → PYQ → Performance → Analysis → Revision</p>`)}${card('Phase 5 Runtime',`<p class="status">IndexedDB: ${store.ready?'ready':'unavailable'} · Offline data: local</p>`)}${card('Recommended Next',rec.length?`<ul>${rec.slice(0,4).map(x=>`<li>${esc(x.title)} — ${esc(x.reason)}</li>`).join('')}</ul>`:`<p class="muted">Complete an attempt to generate a recommendation.</p>`)}</div>`;
 }catch(error){console.error(error);return card('Academic data unavailable','<p class="muted">Please try again.</p>');}
}
async function learning(){
 if(!current.subjectId)return `<div class="grid">${subjects().map(s=>card(t(s.name,s.nameHi),`<p class="muted">${esc(t(s.description,s.descriptionHi))}</p>`,`<button class="action" data-subject="${s.id}">Open</button>`)).join('')}</div>`;
 if(!current.chapterId)return `<button class="action" data-back="subject">← Subjects</button><div class="grid">${chapters().map(c=>card(t(c.title,c.titleHi),`<p class="muted">${esc(t(c.description,c.descriptionHi))}</p>`,`<button class="action" data-chapter="${c.id}">Open</button>`)).join('')}</div>`;
 if(!current.topicId)return `<button class="action" data-back="chapter">← Chapters</button><div class="grid">${topics().map(x=>card(t(x.title,x.titleHi),`<p class="muted">${esc(t(x.description,x.descriptionHi))}</p>`,`<button class="action" data-topic="${x.id}">Open</button>`)).join('')||card('No topics mapped','<p class="muted">Topic mapping is pending for this chapter.</p>')}</div>`;
 if(!current.conceptId)return `<button class="action" data-back="topic">← Topics</button><div class="grid">${concepts().map(c=>card(t(c.title,c.titleHi),`<p>${esc(t(c.summary,c.summaryHi))}</p>`,`<button class="action" data-concept="${c.id}">Study concept</button>`)).join('')||card('No concepts mapped','<p class="muted">Concept mapping is pending for this topic.</p>')}</div>`;
 const c=DATA.concepts.find(x=>x.id===current.conceptId);if(!c)return card('Concept unavailable','<p>Please search again.</p>');
 let progressHtml='';try{const p=await engine.getConceptProgress(c.id);progressHtml=`<p class="muted">Progress: ${p.accuracy}% accuracy · ${p.attempts} attempts · estimated mastery ${p.mastery}%</p>`;}catch{progressHtml='<p class="muted">Progress unavailable.</p>';}
 return `<button class="action" data-back="concept">← Concepts</button>${card(t(c.title,c.titleHi),`<p>${esc(t(c.summary,c.summaryHi))}</p>${progressHtml}`,`<button class="action" data-practice-concept="${c.id}">Practice this concept</button> <button class="action" data-revise="${c.id}">Add to revision</button>`)}`;
}
function practice(){const qs=engine.getPracticeQuestions(filter,current.conceptId);if(current.questionId){const q=currentQuestion();return q?questionView(q):card('Question unavailable','<p>Choose another question.</p>');}return `<div class="grid">${qs.map(q=>card(t(q.title,q.titleHi),`<p>${esc(t(q.text,q.textHi))}</p><p class="muted">${esc(t(q.subjectName,q.subjectNameHi))} · ${esc(t(q.conceptTitle,q.conceptTitleHi))} · ${esc(q.type)}</p>`,`<button class="action" data-question="${q.id}">Attempt</button>`)).join('')||card('No questions available','<p>Select another class or concept.</p>')}</div>`;}
function questionView(q){return card(t(q.title,q.titleHi),`<p>${esc(t(q.text,q.textHi))}</p><form id="answerForm"><label>Answer<input id="answer" required autocomplete="off"></label><button class="action" type="submit">Check answer</button></form><div id="answerResult" aria-live="polite"></div>`);}
async function performance(){try{const [p,weak,queue]=await Promise.all([engine.getOverallProgress(filter),engine.getWeakConcepts(filter),engine.getRevisionQueue()]);return `<div class="grid">${card('Overall Performance',`<p><strong>${p.accuracy}%</strong> accuracy</p><p>${p.attempts} attempts · ${p.correct} correct · ${p.incorrect} incorrect</p>`)}${card('Concept Progress',`<p>${p.completedConcepts} concepts attempted across ${subjects().length} subjects.</p>`)}${card('Weak Concepts',weak.length?`<ul>${weak.slice(0,8).map(x=>`<li>${esc(t(x.title,x.titleHi))} — ${x.accuracy}%</li>`).join('')}</ul>`:'<p class="muted">No weak concept detected yet.</p>')}${card('Revision Queue',`<p>${queue.length} concepts queued.</p>`,`<button class="action" data-route2="Learning">Open Learning</button>`)}</div>`;}catch{return card('Performance unavailable','<p>Please try again.</p>');}}
function profile(){const last=state.profile.pictureChangedAt;return card('User Control Center',`<p class="muted">Profile picture controls are not yet available in this build.</p><p>${last?`Last change: ${esc(new Date(last).toLocaleString())}`:'No profile picture change recorded.'}</p><p>Academic data is stored locally where browser storage is available.</p>`);}
function settings(){return `<div class="grid">${card('Notifications',`<p>${state.settings.notifications?'Enabled':'Disabled'} (preference only; reminders are not delivered by this build)</p>`,`<button class="action" id="toggleNotify">Toggle</button>`)}${card('Storage',`<p>IndexedDB: ${store.ready?'Ready':'Unavailable'}</p><p class="muted">Fallback storage is used when IndexedDB is unavailable.</p>`)}${card('Upgrade Guard','<p class="muted">Upgrade execution remains outside this phase.</p>')}${card('Activity History',`<p>${state.history.length} relevant events recorded.</p>`)}</div>`;}
function bindActions(){
 document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=async()=>{current.subjectId=b.dataset.subject;current.chapterId=current.topicId=current.conceptId=null;await render();});
 document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=async()=>{current.chapterId=b.dataset.chapter;current.topicId=current.conceptId=null;await render();});
 document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=async()=>{current.topicId=b.dataset.topic;current.conceptId=null;await render();});
 document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=async()=>{current.conceptId=b.dataset.concept;await render();});
 document.querySelectorAll('[data-question]').forEach(b=>b.onclick=async()=>{current.questionId=b.dataset.question;await render();});
 document.querySelectorAll('[data-practice-concept]').forEach(b=>b.onclick=async()=>{current.route='Practice';current.questionId=null;await render();});
 document.querySelectorAll('[data-revise]').forEach(b=>b.onclick=async()=>{await engine.queueRevision(b.dataset.revise);alert('Concept added to revision queue.');await render();});
 document.querySelectorAll('[data-route2]').forEach(b=>b.onclick=async()=>{current.route=b.dataset.route2;await render();});
 document.querySelectorAll('[data-back]').forEach(b=>b.onclick=async()=>{if(b.dataset.back==='subject')current.subjectId=current.chapterId=current.topicId=current.conceptId=null;if(b.dataset.back==='chapter')current.chapterId=current.topicId=current.conceptId=null;if(b.dataset.back==='topic')current.topicId=current.conceptId=null;if(b.dataset.back==='concept')current.conceptId=null;await render();});
 const form=document.getElementById('answerForm');if(form)form.onsubmit=async e=>{e.preventDefault();const q=currentQuestion();const result=engine.checkAnswer(q,document.getElementById('answer').value);await engine.recordAttempt(q,result);document.getElementById('answerResult').innerHTML=`<div class="result ${result.correct?'good':'danger'}"><strong>${result.correct?'Correct':'Needs review'}</strong><p>${esc(t(result.explanation,result.explanationHi))}</p><p>Attempt recorded.</p><button class="action" id="nextQ">Continue</button></div>`;document.getElementById('nextQ').onclick=async()=>{current.questionId=null;await render();};};
 const n=document.getElementById('toggleNotify');if(n)n.onclick=async()=>{state.settings.notifications=!state.settings.notifications;state.history.push({time:new Date().toISOString(),type:'settings',detail:'Notification preference changed'});await render();};
}
document.getElementById('sukoon').onclick=()=>{const existing=document.getElementById('sukoonPanel');if(existing){existing.remove();return;}const panel=document.createElement('aside');panel.id='sukoonPanel';panel.className='sukoon-panel';panel.innerHTML=`<img src="./12_SUKOON-BRAIN-REALTIME-ICON.png" alt="Sukoon.Brain icon"><div><strong>Sukoon.Brain</strong><p>Visual concept integrated. Live AI routing is not connected in this build.</p></div><button type="button" aria-label="Close Sukoon panel">×</button>`;document.body.appendChild(panel);panel.querySelector('button').onclick=()=>panel.remove();};
if('serviceWorker' in navigator)navigator.serviceWorker.register('./6_sw.js').catch(()=>{});
await render();
