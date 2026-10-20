const DB='sciencehub-academic-v1';
const VERSION=1;
const APP_STATE_KEY='sciencehub.phase5.app';

function readFallbackAppState(fallback){
  try{
    const raw=globalThis.localStorage?.getItem(APP_STATE_KEY);
    if(!raw)return fallback;
    const value=JSON.parse(raw);
    return value && typeof value==='object' && !Array.isArray(value) ? value : fallback;
  }catch{return fallback;}
}
function writeFallbackAppState(value){
  try{globalThis.localStorage?.setItem(APP_STATE_KEY,JSON.stringify(value));return true;}
  catch{return false;}
}

export class AcademicStore{
  constructor(){
    this.db=null;this.ready=false;
    this.memory={app:null,attempts:[],revision:[]};
    this.readyPromise=this.open();
  }
  open(){
    return new Promise(resolve=>{
      if(typeof window==='undefined'||!('indexedDB' in window)){resolve();return;}
      try{
        const request=indexedDB.open(DB,VERSION);
        request.onupgradeneeded=()=>{
          const db=request.result;
          if(!db.objectStoreNames.contains('state'))db.createObjectStore('state',{keyPath:'id'});
          if(!db.objectStoreNames.contains('attempts'))db.createObjectStore('attempts',{keyPath:'id',autoIncrement:true});
          if(!db.objectStoreNames.contains('revision'))db.createObjectStore('revision',{keyPath:'conceptId'});
        };
        request.onsuccess=()=>{this.db=request.result;this.ready=true;this.db.onversionchange=()=>{this.db?.close();this.db=null;this.ready=false;};resolve();};
        request.onerror=()=>resolve();request.onblocked=()=>resolve();
      }catch{resolve();}
    });
  }
  async init(){await this.readyPromise;return this;}
  defaultAppState(){return {route:'Home',academic:{classId:'11',board:'UP Board',language:'en'},profile:{picture:null,pictureChangedAt:null},settings:{notifications:true,offline:true},permissions:{},history:[]};}
  async loadAppState(){
    await this.init();
    const fallback=this.defaultAppState();
    if(!this.db){if(this.memory.app)return this.memory.app;return readFallbackAppState(fallback);}
    return new Promise(resolve=>{
      const useLocal=()=>{const value=readFallbackAppState(fallback);this.memory.app=value;resolve(value);};
      try{
        const request=this.db.transaction('state','readonly').objectStore('state').get('app');
        request.onsuccess=()=>{
          const saved=request.result?.value;
          if(saved&&typeof saved==='object'){this.memory.app=saved;resolve(saved);}
          else useLocal();
        };
        request.onerror=useLocal;
      }catch{useLocal();}
    });
  }
  async saveAppState(value){
    await this.init();this.memory.app=value;
    if(!this.db){writeFallbackAppState(value);return;}
    return new Promise(resolve=>{
      let settled=false;
      const finish=()=>{if(!settled){settled=true;resolve();}};
      const useLocal=()=>{writeFallbackAppState(value);finish();};
      try{
        const request=this.db.transaction('state','readwrite').objectStore('state').put({id:'app',value});
        request.onsuccess=finish;request.onerror=useLocal;request.onabort=useLocal;
      }catch{useLocal();}
    });
  }
  async addAttempt(attempt){
    await this.init();if(!this.db){this.memory.attempts.push(attempt);return;}
    return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readwrite').objectStore('attempts').add(attempt);r.onsuccess=resolve;r.onerror=resolve;r.onabort=resolve;}catch{resolve();}});
  }
  async getAttempts(){
    await this.init();if(!this.db)return this.memory.attempts;
    return new Promise(resolve=>{try{const r=this.db.transaction('attempts','readonly').objectStore('attempts').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([]);}catch{resolve([]);}});
  }
  async setRevision(conceptId,record){
    await this.init();if(!this.db){this.memory.revision=this.memory.revision.filter(x=>x.conceptId!==conceptId);this.memory.revision.push({conceptId,...record});return;}
    return new Promise(resolve=>{try{const r=this.db.transaction('revision','readwrite').objectStore('revision').put({conceptId,...record});r.onsuccess=resolve;r.onerror=resolve;r.onabort=resolve;}catch{resolve();}});
  }
  async getRevision(){
    await this.init();if(!this.db)return this.memory.revision;
    return new Promise(resolve=>{try{const r=this.db.transaction('revision','readonly').objectStore('revision').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([]);}catch{resolve([]);}});
  }
}
