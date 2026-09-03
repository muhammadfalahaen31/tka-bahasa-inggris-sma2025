/**
 * Cashflow Keuangan Keluarga Faletsa — Firebase Realtime Cloud Sync
 * Multi-device synchronization service for Husband & Wife (Keluarga Faletsa).
 */

// Firebase Project Credentials
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

  // Initialize Firebase Firestore safely
  init: function(onRemoteUpdateCallback) {
    var self = this;
    try {
      if (typeof firebase !== 'undefined' && firebase.apps) {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        self.db = firebase.firestore();
        
        // Enable offline persistence in Firestore if possible
        try {
          self.db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
            console.warn('Firestore persistence warning:', err.code);
          });
        } catch (e) {
          // ignore if already enabled
        }

        self.isInitialized = true;
        self.isOnline = navigator.onLine;
        console.log('✅ [Firebase CloudSync] Firestore berhasil diinisialisasi.');

        // Setup Network Status Listeners
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

        // Start Realtime Cloud Listener
        if (onRemoteUpdateCallback) {
          self.startRealtimeListener(onRemoteUpdateCallback);
        }
      } else {
        console.warn('⚠️ [Firebase CloudSync] Firebase SDK tidak terdeteksi. Berjalan dalam mode offline lokal.');
        self.updateCloudStatusBadge(false);
      }
    } catch (err) {
      console.error('❌ [Firebase CloudSync] Gagal inisialisasi:', err);
      self.updateCloudStatusBadge(false);
    }
  },

  // Realtime Cloud Listener (Husband <-> Wife Auto Sync)
  startRealtimeListener: function(callback) {
    var self = this;
    if (!self.isInitialized || !self.db) return;

    try {
      self.unsubscribeListener = self.db.collection(self.collectionName).doc(self.docId)
        .onSnapshot({ includeMetadataChanges: false }, function(doc) {
          if (doc.exists) {
            var data = doc.data();
            console.log('🔄 [Firebase CloudSync] Data baru diterima dari Cloud!');
            if (typeof callback === 'function') {
              callback(data);
            }
          } else {
            console.log('ℹ️ [Firebase CloudSync] Dokumen cloud belum ada. Melakukan inisialisasi cloud...');
            self.syncLocalToCloud();
          }
        }, function(error) {
          console.warn('⚠️ [Firebase CloudSync] Listener error (kemungkinan offline):', error);
        });
    } catch (e) {
      console.error('Error starting snapshot listener:', e);
    }
  },

  // Push local data to Cloud Firestore
  pushToCloud: async function(payload) {
    var self = this;
    if (!self.isInitialized || !self.db) return false;

    try {
      var dataToSave = {
        transactions: payload.transactions || [],
        savings: payload.savings || [],
        installments: payload.installments || [],
        settings: payload.settings || {},
        lastUpdatedBy: payload.author || 'Keluarga Faletsa',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        clientTimestamp: new Date().toISOString()
      };

      await self.db.collection(self.collectionName).doc(self.docId).set(dataToSave, { merge: true });
      console.log('☁️ [Firebase CloudSync] Data berhasil disimpan ke Cloud.');
      self.updateCloudStatusBadge(true, 'Tersinkron Cloud');
      return true;
    } catch (err) {
      console.error('❌ [Firebase CloudSync] Gagal menyimpan ke cloud:', err);
      self.updateCloudStatusBadge(false, 'Gagal Sinkron Cloud');
      return false;
    }
  },

  // Sync entire local DB to Cloud
  syncLocalToCloud: async function() {
    var self = this;
    if (!self.isInitialized || !window.DB) return;
    try {
      var localData = await window.DB.exportAllData();
      await self.pushToCloud(localData);
    } catch (e) {
      console.warn('syncLocalToCloud error:', e);
    }
  },

  // Update visual sync badge in UI
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