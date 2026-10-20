// ScienceHub.io academic store — storage stabilization fix.
// Fixes vs. previous version:
//  1. localStorage fallback is now READ as well as written (state survived a save but was never restored).
//  2. Malformed / non-object localStorage JSON is ignored instead of crashing.
//  3. If the IndexedDB state read fails, the store will NOT overwrite the unreadable stored state with defaults.
//  4. Synchronous IndexedDB exceptions (indexedDB.open / db.transaction) no longer reject startup.
//  5. IndexedDB write errors fall back to the localStorage backup instead of being silently dropped.
//  6. getRevision() resolved with an Event object on read error; it now resolves with [].
// Public API and storage names are unchanged.
const DB='sciencehub-academic-v1';
const VERSION=1;
const LS_KEY='sciencehub.phase5.app';
const LOAD_FAILED=Symbol('load-failed');
const defaultState=()=>({route:'Home',academic:{classId:'11',board:'UP Board',language:'en'},profile:{picture:null,pictureChangedAt:null},settings:{notifications:true,offline:true},permissions:{},history:[]});

export class AcademicStore{
 constructor(){this.db=null;this.ready=false;this.stateReadFailed=false;this.memory={app:null,attempts:[],revision:[]};this.readyPromise=this.open();}

 open(){return new Promise(resolve=>{
  try{
   if(typeof window==='undefined'||!('indexedDB' in window)){resolve();return;}
   const r=indexedDB.open(DB,VERSION);
   r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('state'))db.createObjectStore('state',{keyPath:'id'});if(!db.objectStoreNames.contains('attempts'))db.createObjectStore('attempts',{keyPath:'id',autoIncrement:true});if(!db.objectStoreNames.contains('revision'))db.createObjectStore('revision',{keyPath:'conceptId'});};
   r.onsuccess=()=>{this.db=r.result;this.ready=true;resolve()};
   r.onerror=()=>resolve();
   r.onblocked=()=>resolve();
  }catch{resolve();}
 });}

 async init(){await this.readyPromise;return this;}

 // ---- localStorage backup (used when IndexedDB is unavailable or failing) ----
 _readBackup(){
  try{
   const raw=localStorage.getItem(LS_KEY);
   if(!raw)return null;
   const v=JSON.parse(raw);
   return v&&typeof v==='object'&&!Array.isArray(v)?v:null;
  }catch{return null;}
 }
 _writeBackup(value){
  try{localStorage.setItem(LS_KEY,JSON.stringify(value));return true;}catch{return false;}
 }

 // ---- single safe IndexedDB request helper ----
 // readonly: resolves map(result), or `fallback` on error. readwrite: resolves true once committed, false on error/abort.
 _req(storeName,mode,make,map=x=>x,fallback=false){
  return new Promise(resolve=>{
   try{
    const tx=this.db.transaction(storeName,mode);
    const req=make(tx.objectStore(storeName));
    if(mode==='readonly'){
     req.onsuccess=()=>resolve(map(req.result));
     req.onerror=()=>resolve(fallback);
    }else{
     tx.oncomplete=()=>resolve(true);
     tx.onerror=()=>resolve(false);
     tx.onabort=()=>resolve(false);
    }
   }catch{resolve(mode==='readonly'?fallback:false);}
  });
 }

 async loadAppState(){
  await this.init();
  if(!this.db)return this.memory.app||this._readBackup()||defaultState();
  const v=await this._req('state','readonly',s=>s.get('app'),r=>r?.value||null,LOAD_FAILED);
  if(v===LOAD_FAILED){this.stateReadFailed=true;return this._readBackup()||defaultState();}
  return v||this._readBackup()||defaultState();
 }

 // Resolves true if the state was stored (IndexedDB, or the localStorage backup), false if it could not be stored anywhere.
 async saveAppState(value){
  await this.init();
  this.memory.app=value;
  // If we could not read stored state, do not overwrite it with a possibly-empty state.
  if(!this.db||this.stateReadFailed)return this._writeBackup(value);
  const ok=await this._req('state','readwrite',s=>s.put({id:'app',value}));
  return ok?true:this._writeBackup(value);
 }

 // Resolves true when stored in IndexedDB; false when only kept in memory (lost on reload).
 async addAttempt(attempt){
  await this.init();
  if(this.db&&await this._req('attempts','readwrite',s=>s.add(attempt)))return true;
  this.memory.attempts.push(attempt);
  return false;
 }
 async getAttempts(){
  await this.init();
  if(!this.db)return this.memory.attempts;
  return this._req('attempts','readonly',s=>s.getAll(),r=>r||[],[]);
 }
 async setRevision(conceptId,record){
  await this.init();
  if(this.db&&await this._req('revision','readwrite',s=>s.put({conceptId,...record})))return true;
  this.memory.revision=this.memory.revision.filter(x=>x.conceptId!==conceptId);
  this.memory.revision.push(record);
  return false;
 }
 async getRevision(){
  await this.init();
  if(!this.db)return this.memory.revision;
  return this._req('revision','readonly',s=>s.getAll(),r=>r||[],[]);
 }
}
