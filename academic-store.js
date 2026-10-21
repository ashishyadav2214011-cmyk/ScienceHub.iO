const DB = 'sciencehub-academic-v1';
const VERSION = 1;
const FALLBACK_KEY = 'sciencehub.phase5.app';

function defaultState() {
  return {
    route: 'Home',
    academic: { classId: '11', board: 'UP Board', language: 'en' },
    profile: { picture: null, pictureChangedAt: null },
    settings: { notifications: true, offline: true },
    permissions: {},
    history: []
  };
}

function validState(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export class AcademicStore {
  constructor() {
    this.db = null;
    this.ready = false;
    this.memory = { app: null, attempts: [], revision: [] };
    this.readyPromise = this.open();
  }

  open() {
    return new Promise(resolve => {
      try {
        if (typeof indexedDB === 'undefined' || !indexedDB?.open) return resolve();
        const request = indexedDB.open(DB, VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('state')) db.createObjectStore('state', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('attempts')) db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
          if (!db.objectStoreNames.contains('revision')) db.createObjectStore('revision', { keyPath: 'conceptId' });
        };
        request.onsuccess = () => { this.db = request.result; this.ready = true; resolve(); };
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      } catch { resolve(); }
    });
  }

  async init() { await this.readyPromise; return this; }

  readFallback() {
    try {
      const raw = globalThis.localStorage?.getItem(FALLBACK_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return validState(parsed) ? parsed : null;
    } catch { return null; }
  }

  writeFallback(value) {
    try { globalThis.localStorage?.setItem(FALLBACK_KEY, JSON.stringify(value)); } catch { /* memory fallback remains available */ }
  }

  async loadAppState() {
    await this.init();
    const fallback = this.memory.app || this.readFallback() || defaultState();
    if (!this.db) return fallback;
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('state', 'readonly').objectStore('state').get('app');
        request.onsuccess = () => {
          const value = request.result?.value;
          if (validState(value)) { this.memory.app = value; resolve(value); }
          else resolve(fallback);
        };
        request.onerror = () => resolve(fallback);
      } catch { resolve(fallback); }
    });
  }

  async saveAppState(value) {
    await this.init();
    this.memory.app = value;
    this.writeFallback(value);
    if (!this.db) return true;
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('state', 'readwrite').objectStore('state').put({ id: 'app', value });
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch { resolve(false); }
    });
  }

  async addAttempt(attempt) {
    await this.init();
    if (!this.db) { this.memory.attempts.push({ ...attempt }); return true; }
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('attempts', 'readwrite').objectStore('attempts').add(attempt);
        request.onsuccess = () => resolve(true);
        request.onerror = () => { this.memory.attempts.push({ ...attempt }); resolve(false); };
      } catch { this.memory.attempts.push({ ...attempt }); resolve(false); }
    });
  }

  async getAttempts() {
    await this.init();
    if (!this.db) return [...this.memory.attempts];
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('attempts', 'readonly').objectStore('attempts').getAll();
        request.onsuccess = () => resolve(request.result || [...this.memory.attempts]);
        request.onerror = () => resolve([...this.memory.attempts]);
      } catch { resolve([...this.memory.attempts]); }
    });
  }

  async setRevision(conceptId, record) {
    await this.init();
    const value = { conceptId, ...record };
    this.memory.revision = [...this.memory.revision.filter(x => x.conceptId !== conceptId), value];
    if (!this.db) return true;
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('revision', 'readwrite').objectStore('revision').put(value);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch { resolve(false); }
    });
  }

  async getRevision() {
    await this.init();
    if (!this.db) return [...this.memory.revision];
    return new Promise(resolve => {
      try {
        const request = this.db.transaction('revision', 'readonly').objectStore('revision').getAll();
        request.onsuccess = () => resolve(request.result || [...this.memory.revision]);
        request.onerror = () => resolve([...this.memory.revision]);
      } catch { resolve([...this.memory.revision]); }
    });
  }
}
