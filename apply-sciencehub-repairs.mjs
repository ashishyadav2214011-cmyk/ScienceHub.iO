// Run from the repository root: node tools/apply-sciencehub-repairs.mjs
// Creates a timestamped backup before changing existing files.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const backupRoot=path.join(root,`.sciencehub-backup-${stamp}`);
const changed=[];
function read(rel){const p=path.join(root,rel);if(!fs.existsSync(p))throw new Error(`Required file missing: ${rel}`);return fs.readFileSync(p,'utf8')}
function backup(rel){const dest=path.join(backupRoot,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,rel),dest)}
function write(rel,content){const p=path.join(root,rel);fs.mkdirSync(path.dirname(p),{recursive:true});if(fs.existsSync(p))backup(rel);fs.writeFileSync(p,content,'utf8');changed.push(rel)}
function replaceOnce(s,a,b,label){const n=s.split(a).length-1;if(n!==1)throw new Error(`${label}: expected one exact match, found ${n}. No files have been written.`);return s.replace(a,b)}

// Prepare all source edits in memory first; refuse unexpected repository versions.
let app=read('5_app.js');
let css=read('4_styles.css');
app=replaceOnce(app,'<input id="search" class="search" placeholder="Search academic data…" aria-label="Search"></div></header>','<input id="search" class="search" placeholder="Search academic data…" aria-label="Search"><div id="searchResults" class="search-results-host" aria-live="polite"></div></div></header>','Global search host');
const oldAction=" document.querySelectorAll('[data-question]').forEach(b=>b.onclick=async()=>{current.questionId=b.dataset.question;await render()});";
const newAction=oldAction+`\n document.querySelectorAll('[data-search-id]').forEach(b=>b.onclick=async()=>{\n  const id=b.dataset.searchId;\n  const subject=DATA.subjects.find(x=>x.id===id);\n  const chapter=DATA.chapters.find(x=>x.id===id);\n  const topic=DATA.topics.find(x=>x.id===id);\n  const concept=DATA.concepts.find(x=>x.id===id);\n  const question=DATA.questions.find(x=>x.id===id);\n  const item=subject||chapter||topic||concept||question;\n  if(!item)return;\n  if(item.classId)filter.classId=item.classId;\n  current.subjectId=null;current.chapterId=null;current.topicId=null;current.conceptId=null;current.questionId=null;\n  if(subject){current.route='Learning';current.subjectId=subject.id;}\n  else if(chapter){current.route='Learning';current.subjectId=chapter.subjectId;current.chapterId=chapter.id;}\n  else if(topic){const parent=DATA.chapters.find(x=>x.id===topic.chapterId);current.route='Learning';current.subjectId=parent?.subjectId||null;current.chapterId=topic.chapterId;current.topicId=topic.id;}\n  else if(concept){const parent=DATA.chapters.find(x=>x.id===concept.chapterId);current.route='Learning';current.subjectId=parent?.subjectId||null;current.chapterId=concept.chapterId;current.topicId=concept.topicId;current.conceptId=concept.id;}\n  else if(question){current.route='Practice';current.questionId=question.id;current.conceptId=question.conceptId||null;}\n  await render();\n });`;
app=replaceOnce(app,oldAction,newAction,'Search result click handler');
app=replaceOnce(app,'current.subjectId=b.dataset.subject;current.chapterId=null;current.topicId=null;current.conceptId=null;await render()','current.subjectId=b.dataset.subject;current.chapterId=null;current.topicId=null;current.conceptId=null;current.questionId=null;await render()','Clear stale question on subject change');
const placeholder='<div id="searchResults"></div>';
const n=app.split(placeholder).length-1;
if(n!==2)throw new Error(`Expected two route-local search placeholders, found ${n}. No files have been written.`);
app=app.replaceAll(placeholder,'');
css=replaceOnce(css,'.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}','.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.search-results-host{flex:1 0 100%;max-height:45vh;overflow:auto;position:relative;z-index:10}.search-results-host:empty{display:none}','Search results styling');

const store=`const DB='sciencehub-academic-v1';
const VERSION=1;
const FALLBACK_KEYS={app:'sciencehub.phase5.app',attempts:'sciencehub.phase5.attempts',revision:'sciencehub.phase5.revision'};
function readFallback(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}}
function writeFallback(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
export class AcademicStore{
 constructor(){this.db=null;this.ready=false;this.memory={app:null,attempts:[],revision:[]};this.readyPromise=this.open();}
 open(){return new Promise(resolve=>{if(!('indexedDB' in window)){this.loadFallbackMemory();resolve();return;}let r;try{r=indexedDB.open(DB,VERSION)}catch{this.loadFallbackMemory();resolve();return;}r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('state'))db.createObjectStore('state',{keyPath:'id'});if(!db.objectStoreNames.contains('attempts'))db.createObjectStore('attempts',{keyPath:'id',autoIncrement:true});if(!db.objectStoreNames.contains('revision'))db.createObjectStore('revision',{keyPath:'conceptId'});};r.onsuccess=()=>{this.db=r.result;this.ready=true;this.db.onversionchange=()=>this.db?.close();resolve()};r.onerror=()=>{this.loadFallbackMemory();resolve()};r.onblocked=()=>{this.loadFallbackMemory();resolve()}});}
 loadFallbackMemory(){this.memory.app=readFallback(FALLBACK_KEYS.app,null);this.memory.attempts=readFallback(FALLBACK_KEYS.attempts,[]);this.memory.revision=readFallback(FALLBACK_KEYS.revision,[]);}
 async init(){await this.readyPromise;return this;}
 async loadAppState(){await this.init();const fallback={route:'Home',academic:{classId:'11',board:'UP Board',language:'en'},profile:{picture:null,pictureChangedAt:null},settings:{notifications:true,offline:true},permissions:{},history:[]};if(!this.db)return this.memory.app||fallback;return new Promise(resolve=>{try{const r=this.db.transaction('state','readonly').objectStore('state').get('app');r.onsuccess=()=>resolve(r.result?.value||fallback);r.onerror=()=>resolve(fallback)}catch{resolve(fallback)}})}
 async saveAppState(value){await this.init();if(!this.db){this.memory.app=value;writeFallback(FALLBACK_KEYS.app,value);return}return new Promise(resolve=>{try{const r=this.db.transaction('state','readwrite').objectStore('state').put({id:'app',value});r.onsuccess=resolve;r.onerror=resolve}catch{resolve()}})}
 async addAttempt(attempt){await this.init();if(!this.db){this.memory.attempts.push({...attempt,id:this.memory.attempts.length+1});writeFallback(FALLBACK_KEYS.attempts,this.memory.attempts);return}return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readwrite').objectStore('attempts').add(attempt);r.onsuccess=resolve;r.onerror=resolve}catch{resolve()}})}
 async getAttempts(){await this.init();if(!this.db)return this.memory.attempts;return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readonly').objectStore('attempts').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([])}catch{resolve([])}})}
 async setRevision(conceptId,record){await this.init();if(!this.db){this.memory.revision=this.memory.revision.filter(x=>x.conceptId!==conceptId);this.memory.revision.push({conceptId,...record});writeFallback(FALLBACK_KEYS.revision,this.memory.revision);return}return new Promise(resolve=>{try{const r=this.db.transaction('revision','readwrite').objectStore('revision').put({conceptId,...record});r.onsuccess=resolve;r.onerror=resolve}catch{resolve()}})}
 async getRevision(){await this.init();if(!this.db)return this.memory.revision;return new Promise(resolve=>{try{const r=this.db.transaction('revision','readonly').objectStore('revision').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([])}catch{resolve([])}})}
}
`;
const sw=`const CACHE='sciencehub-phase5-v2';
const LEGACY_PREFIX='sciencehub-phase5-';
const ASSETS=['./','./index.html','./3_index.html','./4_styles.css','./5_app.js','./3_manifest.webmanifest','./academic/academic-data.js','./academic/academic-store.js','./academic/academic-engine.js'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.all(ASSETS.map(async path=>{
   try{const response=await fetch(path,{cache:'reload'});if(response.ok&&response.type!=='opaque')await cache.put(path,response);}
   catch(error){console.warn('Optional offline asset unavailable:',path);}
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(LEGACY_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}return response;}
   catch{return (await caches.match(request))||(await caches.match('./index.html'))||Response.error();}
  })());
  return;
 }
 const url=new URL(request.url);
 if(!ASSETS.some(item=>new URL(item,self.location.href).pathname===url.pathname))return;
 event.respondWith((async()=>{
  const cached=await caches.match(request)||await caches.match(url.pathname);
  if(cached)return cached;
  try{const response=await fetch(request);if(response.ok&&response.type!=='opaque'){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}return response;}
  catch{return Response.error();}
 })());
});
`;

const audit=`# ScienceHub.io — end-to-end audit and repair record

Audit target: current [main] root entry point and Phase 5 academic runtime. Preserve the existing product and data model; repair runtime defects rather than replacing the app.

## Baseline verified
- Root [index.html] already points to [3_manifest.webmanifest], [4_styles.css], and [5_app.js].
- Runtime pages include Home, Learning, Practice, Performance, Assets, Profile and Settings.
- Academic data, engine and store are separated under [academic/].
- Both manifest icon paths exist. Keep them unchanged.
- Root registers [6_sw.js]; [sw.js] is a legacy artifact and is not registered by the current root page.

## P1 findings and fixes
1. **Search not navigable:** search was shown in every route but its results container only existed on Home, and result buttons had no click handler. Repair moves results to the shared header and routes results to subject, chapter, topic, concept or practice question.
2. **Fallback persistence incomplete:** when IndexedDB was unavailable, app preferences were saved to localStorage but not restored; attempts and revision items remained in memory. Repair restores and persists app state, attempts and revision queue under separate namespaced localStorage keys. IndexedDB remains primary.
3. **Service-worker cache too broad:** the prior worker deleted every cache except its own and intercepted arbitrary GET requests, potentially returning HTML for unrelated failed requests. Repair limits handling to same-origin known app assets, uses shell fallback only for navigation, tolerates individual precache failures and only deletes older caches in the ScienceHub cache family.

## Preserved
- Existing root HTML, manifest, icons, styles, app data and legacy files.
- Classes 11/12, board/language controls, hierarchy, question engine, answer checks, performance and revision APIs.
- IndexedDB primary storage and localStorage fallback.
- No broad cleanup, data deletion or visual redesign.

## Release verification gates
- [x] Root HTML references expected runtime files.
- [x] Manifest icon paths confirmed in repository tree.
- [x] Search container/handler defect identified.
- [x] Store fallback and service-worker scope reviewed.
- [ ] JavaScript syntax checks in Node/browser.
- [ ] Browser smoke tests for Home, both classes, all search result types, answer submission, Performance, revision and Settings.
- [ ] Offline load/refresh/navigation after a successful online load.
- [ ] Deployed root URL and browser console/network verification after commit.

This is a targeted repair, not a claim that every Phase 0–6 feature is production-complete. Live AI routing, camera/voice permissions, full syllabus mapping, PYQ provenance and backup/import must be verified separately. Browser and deployment tests remain mandatory.
`;
const readme=`ScienceHub.io repair bundle\n\n1. Extract this ZIP into the root of your existing ScienceHub.iO repository.\n2. Run from that repository root: node tools/apply-sciencehub-repairs.mjs\n3. Review the generated .sciencehub-backup-<timestamp> folder and the changed files.\n4. Run JavaScript syntax checks and browser tests before committing/deploying.\n\nThe script validates expected source fragments before writing, backs up existing files, and leaves index.html, the manifest, icons, academic data and legacy files intact. It repairs search navigation, localStorage fallback persistence and service-worker cache scope, and adds AUDIT_AND_REPAIR_PLAN.md.\n\nGitHub connector writes returned HTTP 403 in this session, so this is an in-repository apply path; changes are not live until applied and committed.\n`;

// All validation is complete. Back up then write the prepared changes.
write('5_app.js',app);
write('4_styles.css',css);
write('academic/academic-store.js',store);
write('6_sw.js',sw);
write('AUDIT_AND_REPAIR_PLAN.md',audit);
console.log('ScienceHub repair complete. Changed:',changed.join(', '));
console.log('Backup folder:',backupRoot);
console.log('Next: run node --check tools/apply-sciencehub-repairs.mjs, then browser smoke tests.');
