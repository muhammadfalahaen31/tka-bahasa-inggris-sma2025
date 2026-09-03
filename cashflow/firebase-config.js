/**
 * Cashflow Keuangan Keluarga Faletsa — Firebase Realtime Cloud Sync
 * Multi-device synchronization service for Husband & Wife (Keluarga Faletsa).
 * Features: Bulletproof ID-based Bi-directional Merging & Anti-Data Loss Protection.
 */

var firebaseConfig = {
  apiKey: "AIzaSyCocJJXa8oTPc5uxxvlP16I9qX-ujVaK34",
  authDomain: "tka-english-wajib-2025.firebaseapp.com",
  projectId: "tka-english-wajib-2025",
  storageBucket: "tka-english-wajib-2025.firebasestorage.app",
  messagingSenderId: "32444504637",
  appId: "1:32444504637:web:27f9b04f0095ece2312854",
  measurementId: "G-G9G2EC9VP5"
};

var CloudSync = {
  isInitialized: false,
  isOnline: false,
  db: null,
  unsubscribeListener: null,
  collectionName: 'faletsa_family_finance',
  docId: 'main_dashboard',
  _isSyncing: false,

  init: function(onRemoteUpdateCallback) {
    var self = this;
    try {
      if (typeof firebase !== 'undefined' && firebase.apps) {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        self.db = firebase.firestore();
        
        try {
          self.db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {});
        } catch (e) {}

        self.isInitialized = true;
        self.isOnline = navigator.onLine;
        console.log('✅ [Firebase CloudSync] Firestore Database berhasil terhubung.');

        window.addEventListener('online', function() {
          self.isOnline = true;
          self.updateCloudStatusBadge(true);
          self.syncLocalToCloud();
        });
        window.addEventListener('offline', function() {
          self.isOnline = false;
          self.updateCloudStatusBadge(false);
        });

        self.updateCloudStatusBadge(self.isOnline);

        if (onRemoteUpdateCallback) {
          self.startRealtimeListener(onRemoteUpdateCallback);
        }
      } else {
        console.warn('⚠️ [Firebase CloudSync] Firebase SDK offline fallback.');
        self.updateCloudStatusBadge(false);
      }
    } catch (err) {
      console.error('❌ [Firebase CloudSync] Inisialisasi error:', err);
      self.updateCloudStatusBadge(false);
    }
  },

  startRealtimeListener: function(callback) {
    var self = this;
    if (!self.isInitialized || !self.db) return;

    try {
      self.unsubscribeListener = self.db.collection(self.collectionName).doc(self.docId)
        .onSnapshot({ includeMetadataChanges: false }, function(doc) {
          if (doc.exists) {
            var cloudData = doc.data();
            console.log('🔄 [Firebase CloudSync] Menerima data realtime dari Cloud.');
            if (typeof callback === 'function') {
              callback(cloudData);
            }
          } else {
            console.log('ℹ️ [Firebase CloudSync] Inisialisasi awal dokumen cloud...');
            self.syncLocalToCloud();
          }
        }, function(error) {
          console.warn('⚠️ [Firebase CloudSync] Snapshot listener warning:', error);
        });
    } catch (e) {
      console.error('Snapshot listener error:', e);
    }
  },

  // Push with safe merging on Firestore
  pushToCloud: async function(payload) {
    var self = this;
    if (!self.isInitialized || !self.db || self._isSyncing) return false;

    self._isSyncing = true;
    try {
      var docRef = self.db.collection(self.collectionName).doc(self.docId);
      var cloudDoc = await docRef.get().catch(function() { return null; });
      var cloudData = cloudDoc && cloudDoc.exists ? cloudDoc.data() : null;

      // Merge local and cloud transactions by ID
      var mergedTxs = self.mergeArraysById(
        cloudData ? cloudData.transactions : [],
        payload.transactions || []
      );

      var mergedSav = self.mergeArraysById(
        cloudData ? cloudData.savings : [],
        payload.savings || []
      );

      var mergedInst = self.mergeArraysById(
        cloudData ? cloudData.installments : [],
        payload.installments || []
      );

      var dataToSave = {
        transactions: mergedTxs,
        savings: mergedSav,
        installments: mergedInst,
        settings: Object.assign({}, cloudData ? cloudData.settings : {}, payload.settings || {}),
        lastUpdatedBy: payload.author || 'Keluarga Faletsa',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        clientTimestamp: new Date().toISOString()
      };

      await docRef.set(dataToSave, { merge: true });
      console.log('☁️ [Firebase CloudSync] Berhasil tersimpan ke Cloud (' + mergedTxs.length + ' transaksi).');
      self.updateCloudStatusBadge(true, 'Cloud Sync Aktif');
      self._isSyncing = false;
      return true;
    } catch (err) {
      console.error('❌ [Firebase CloudSync] Gagal simpan ke cloud:', err);
      self.updateCloudStatusBadge(false, 'Gagal Sinkron Cloud');
      self._isSyncing = false;
      return false;
    }
  },

  // Smart ID-based Union Merge
  mergeArraysById: function(cloudList, localList) {
    var cList = Array.isArray(cloudList) ? cloudList : [];
    var lList = Array.isArray(localList) ? localList : [];

    var map = {};
    // Add cloud items
    cList.forEach(function(item) {
      if (item && item.id) map[item.id] = item;
    });

    // Merge local items (prefer newer updatedAt if both exist)
    lList.forEach(function(item) {
      if (!item || !item.id) return;
      if (!map[item.id]) {
        map[item.id] = item;
      } else {
        var localTime = new Date(item.updatedAt || 0).getTime();
        var cloudTime = new Date(map[item.id].updatedAt || 0).getTime();
        if (localTime >= cloudTime) {
          map[item.id] = item;
        }
      }
    });

    return Object.values(map);
  },

  syncLocalToCloud: async function() {
    var self = this;
    if (!self.isInitialized || !window.DB) return;
    try {
      var localData = await window.DB.exportAllData();
      await self.pushToCloud(localData);
    } catch (e) {
      console.warn('syncLocalToCloud warning:', e);
    }
  },

  updateCloudStatusBadge: function(isSynced, customText) {
    var badges = document.querySelectorAll('.cloud-sync-badge');
    badges.forEach(function(el) {
      if (isSynced) {
        el.className = 'cloud-sync-badge badge-cloud-online';
        el.innerHTML = '<span class="cloud-dot dot-online"></span> <span>' + (customText || 'Cloud Sync Aktif') + '</span>';
      } else {
        el.className = 'cloud-sync-badge badge-cloud-offline';
        el.innerHTML = '<span class="cloud-dot dot-offline"></span> <span>' + (customText || 'Offline Lokal') + '</span>';
      }
    });
  }
};

window.CloudSync = CloudSync;