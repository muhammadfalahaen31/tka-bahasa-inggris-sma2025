/**
 * Cashflow Keuangan Keluarga Faletsa — Storage Engine
 * Persistent Database using IndexedDB with automatic LocalStorage & Firebase Cloud synchronization.
 */

var DB_NAME = 'FaletsaCashflowDB';
var DB_VERSION = 1;
var STORAGE_KEY_BACKUP = 'faletsa_cashflow_local_backup_v1';

class FinancialStorage {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.listeners = [];
    this._syncTimer = null;
  }

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        this.isReady = true;
        resolve(this);
        return;
      }

      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('transactions')) {
            const transStore = db.createObjectStore('transactions', { keyPath: 'id' });
            transStore.createIndex('type', 'type', { unique: false });
            transStore.createIndex('date', 'date', { unique: false });
            transStore.createIndex('category', 'category', { unique: false });
          }
          if (!db.objectStoreNames.contains('savings')) {
            db.createObjectStore('savings', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('installments')) {
            db.createObjectStore('installments', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          this.isReady = true;
          console.log('IndexedDB FaletsaCashflowDB initialized successfully.');
          resolve(this);
        };

        request.onerror = (event) => {
          console.warn('IndexedDB request error, using localStorage fallback', event);
          this.isReady = true;
          resolve(this);
        };

        request.onblocked = () => {
          console.warn('IndexedDB blocked');
          this.isReady = true;
          resolve(this);
        };
      } catch (err) {
        console.warn('IndexedDB open threw error, using localStorage fallback', err);
        this.isReady = true;
        resolve(this);
      }
    });
  }

  // Generate Unique ID
  generateId(prefix) {
    var p = prefix || 'tx';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return p + '_' + crypto.randomUUID();
    }
    return p + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  // -------------------------------------------------------------
  // GENERIC STORE OPERATIONS
  // -------------------------------------------------------------
  async getAll(storeName) {
    if (!this.db) {
      try {
        var raw = localStorage.getItem(STORAGE_KEY_BACKUP + '_' + storeName);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        var tx = this.db.transaction([storeName], 'readonly');
        var store = tx.objectStore(storeName);
        var req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => {
          try {
            var raw = localStorage.getItem(STORAGE_KEY_BACKUP + '_' + storeName);
            resolve(raw ? JSON.parse(raw) : []);
          } catch (e) {
            resolve([]);
          }
        };
      } catch (err) {
        try {
          var raw = localStorage.getItem(STORAGE_KEY_BACKUP + '_' + storeName);
          resolve(raw ? JSON.parse(raw) : []);
        } catch (e) {
          resolve([]);
        }
      }
    });
  }

  async put(storeName, item) {
    // 1. LocalStorage
    try {
      var raw = localStorage.getItem(STORAGE_KEY_BACKUP + '_' + storeName);
      var all = raw ? JSON.parse(raw) : [];
      var idx = all.findIndex((x) => (x.id && x.id === item.id) || (x.key && x.key === item.key));
      if (idx >= 0) all[idx] = item;
      else all.push(item);
      localStorage.setItem(STORAGE_KEY_BACKUP + '_' + storeName, JSON.stringify(all));
    } catch (e) {
      console.warn('localStorage save warning', e);
    }

    // 2. IndexedDB
    if (this.db) {
      try {
        var tx = this.db.transaction([storeName], 'readwrite');
        var store = tx.objectStore(storeName);
        store.put(item);
      } catch (err) {
        console.warn('IndexedDB put error', err);
      }
    }

    this.notify();
    return item;
  }

  async delete(storeName, key) {
    // 1. LocalStorage
    try {
      var raw = localStorage.getItem(STORAGE_KEY_BACKUP + '_' + storeName);
      var all = raw ? JSON.parse(raw) : [];
      all = all.filter((x) => x.id !== key && x.key !== key);
      localStorage.setItem(STORAGE_KEY_BACKUP + '_' + storeName, JSON.stringify(all));
    } catch (e) {
      console.warn('localStorage delete warning', e);
    }

    // 2. IndexedDB
    if (this.db) {
      try {
        var tx = this.db.transaction([storeName], 'readwrite');
        var store = tx.objectStore(storeName);
        store.delete(key);
      } catch (err) {
        console.warn('IndexedDB delete error', err);
      }
    }

    this.notify();
    return true;
  }

  async clear(storeName) {
    try {
      localStorage.removeItem(STORAGE_KEY_BACKUP + '_' + storeName);
    } catch (e) {}

    if (this.db) {
      try {
        var tx = this.db.transaction([storeName], 'readwrite');
        var store = tx.objectStore(storeName);
        store.clear();
      } catch (err) {}
    }

    this.notify();
  }

  // -------------------------------------------------------------
  // FULL BACKUP / RESTORE / CLOUD SYNC
  // -------------------------------------------------------------
  async exportAllData() {
    var txs = await this.getAll('transactions');
    var savings = await this.getAll('savings');
    var installments = await this.getAll('installments');
    var settings = await this.getAll('settings');

    var settingsMap = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions: txs,
      savings: savings,
      installments: installments,
      settings: settingsMap
    };
  }

  async importAllData(data) {
    if (!data) return false;

    if (data.transactions && Array.isArray(data.transactions)) {
      await this.clear('transactions');
      for (var i = 0; i < data.transactions.length; i++) {
        await this.put('transactions', data.transactions[i]);
      }
    }

    if (data.savings && Array.isArray(data.savings)) {
      await this.clear('savings');
      for (var j = 0; j < data.savings.length; j++) {
        await this.put('savings', data.savings[j]);
      }
    }

    if (data.installments && Array.isArray(data.installments)) {
      await this.clear('installments');
      for (var k = 0; k < data.installments.length; k++) {
        await this.put('installments', data.installments[k]);
      }
    }

    if (data.settings && typeof data.settings === 'object') {
      var keys = Object.keys(data.settings);
      for (var s = 0; s < keys.length; s++) {
        var key = keys[s];
        await this.put('settings', { key: key, value: data.settings[key] });
      }
    }

    this.notify();
    return true;
  }

  onChange(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn);
    }
  }

  notify() {
    this.listeners.forEach((fn) => {
      try { fn(); } catch (e) {}
    });

    // Auto-sync to Firebase Cloud when online
    if (window.CloudSync && window.CloudSync.isInitialized) {
      clearTimeout(this._syncTimer);
      this._syncTimer = setTimeout(() => {
        window.CloudSync.syncLocalToCloud();
      }, 1000);
    }
  }
}

// Global Storage Singleton
window.DB = new FinancialStorage();