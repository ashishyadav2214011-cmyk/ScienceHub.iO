const DB='sciencehub-academic-v1';
const VERSION=1;
const APP_STATE_KEY='sciencehub.phase5.app';

function readFallbackAppState(fallback){
 try{
  const raw=localStorage.getItem(APP_STATE_KEY);
  if(!raw)return fallback;
  const value=JSON.parse(raw);
  return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback;
 }catch{return fallback;}
}

export class AcademicStore{
 constructor(){this.db=null;this.ready=false;this.memory={app:null,attempts:[],revision:[]};this.readyPromise=this.open();}
 open(){
  return new Promise(resolve=>{
   if(typeof window==='undefined'||!('indexedDB' in window)){resolve();return;}
   try{
    const r=indexedDB.open(DB,VERSION);
    r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('state'))db.createObjectStore('state',{keyPath:'id'});if(!db.objectStoreNames.contains('attempts'))db.createObjectStore('attempts',{keyPath:'id',autoIncrement:true});if(!db.objectStoreNames.contains('revision'))db.createObjectStore('revision',{keyPath:'conceptId'});};
    r.onsuccess=()=>{this.db=r.result;this.ready=true;resolve();};r.onerror=()=>resolve();r.onblocked=()=>resolve();
   }catch{resolve();}
  });
 }
 async init(){await this.readyPromise;return this;}
 async loadAppState(){
  await this.init();
  const fallback={route:'Home',academic:{classId:'11',board:'UP Board',language:'en'},profile:{picture:null,pictureChangedAt:null},settings:{notifications:true,offline:true},permissions:{},history:[]};
  if(!this.db)return this.memory.app||readFallbackAppState(fallback);
  return new Promise(resolve=>{try{const r=this.db.transaction('state','readonly').objectStore('state').get('app');r.onsuccess=()=>resolve(r.result?.value||readFallbackAppState(fallback));r.onerror=()=>resolve(readFallbackAppState(fallback));}catch{resolve(readFallbackAppState(fallback));}});
 }
 async saveAppState(value){
  await this.init();
  if(!this.db){this.memory.app=value;try{localStorage.setItem(APP_STATE_KEY,JSON.stringify(value));}catch{}return;}
  return new Promise(resolve=>{try{const tx=this.db.transaction('state','readwrite');tx.objectStore('state').put({id:'app',value});tx.oncomplete=resolve;tx.onerror=()=>{try{localStorage.setItem(APP_STATE_KEY,JSON.stringify(value));}catch{}resolve();};tx.onabort=()=>{try{localStorage.setItem(APP_STATE_KEY,JSON.stringify(value));}catch{}resolve();};}catch{try{localStorage.setItem(APP_STATE_KEY,JSON.stringify(value));}catch{}resolve();}});
 }
 async addAttempt(attempt){await this.init();if(!this.db){this.memory.attempts.push(attempt);return;}return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readwrite').objectStore('attempts').add(attempt);r.onsuccess=resolve;r.onerror=resolve;}catch{resolve();}});}
 async getAttempts(){await this.init();if(!this.db)return this.memory.attempts;return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readonly').objectStore('attempts').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([]);}catch{resolve([]);}});}
 async setRevision(conceptId,record){await this.init();if(!this.db){this.memory.revision=this.memory.revision.filter(x=>x.conceptId!==conceptId);this.memory.revision.push(record);return;}return new Promise(resolve=>{try{const r=this.db.transaction('revision','readwrite').objectStore('revision').put({conceptId,...record});r.onsuccess=resolve;r.onerror=resolve;}catch{resolve();}});}
 async getRevision(){await this.init();if(!this.db)return this.memory.revision;return new Promise(resolve=>{try{const r=this.db.transaction('revision','readonly').objectStore('revision').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([]);}catch{resolve([]);}});}
}
