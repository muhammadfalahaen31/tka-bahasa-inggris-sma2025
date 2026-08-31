// =============================================================================
// FIREBASE CONFIGURATION & FIRESTORE DATABASE SERVICE
// Media Pembelajaran Interaktif (MPI) TKA Bahasa Inggris SMA 2025
// Pengembang: Muhammad Falahaen Jiddan, M.Pd. Gr. (SMA Plus PGRI Cibinong)
// =============================================================================

// Petunjuk:
// Ganti nilai di bawah ini dengan konfigurasi dari Firebase Console Anda (100% Gratis dari Google)
// Buka https://console.firebase.google.com -> Buat Project -> Web App (</>) -> Salin firebaseConfig
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// State Status Firebase
let isFirebaseInitialized = false;
let db = null;

// Inisialisasi Firebase secara aman
try {
  if (typeof firebase !== 'undefined' && firebase.apps) {
    if (!firebase.apps.length) {
      if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseInitialized = true;
        console.log("✅ [Firebase] Firestore Database berhasil terhubung.");
      } else {
        console.warn("⚠️ [Firebase] firebaseConfig masih menggunakan nilai placeholder. Silakan isi API Key Anda.");
      }
    } else {
      db = firebase.firestore();
      isFirebaseInitialized = true;
    }
  }
} catch (err) {
  console.error("❌ [Firebase] Gagal inisialisasi Firebase:", err);
}

// =============================================================================
// SERVICE API: FIRESTORE OPERATIONS
// =============================================================================

const FirebaseService = {
  isReady: () => isFirebaseInitialized && db !== null,

  // 1. Kirim data lembar kerja siswa ke koleksi 'tka_submissions_2025'
  submitStudentWorksheet: async (submissionData) => {
    if (!FirebaseService.isReady()) {
      throw new Error("Firebase belum dikonfigurasi. Silakan lengkapi API Key di firebase-config.js.");
    }
    
    // Tambahkan metadata waktu server
    const payload = {
      ...submissionData,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    };

    const docRef = await db.collection("tka_submissions_2025").add(payload);
    return docRef.id;
  },

  // 2. Listener Realtime untuk Dashboard Guru (onSnapshot)
  listenToSubmissions: (callback, errorCallback) => {
    if (!FirebaseService.isReady()) {
      if (errorCallback) errorCallback("Firebase belum dikonfigurasi.");
      return () => {};
    }

    return db.collection("tka_submissions_2025")
      .orderBy("submittedAt", "desc")
      .onSnapshot((snapshot) => {
        const submissions = [];
        snapshot.forEach((doc) => {
          submissions.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(submissions);
      }, (error) => {
        console.error("Firestore Listen Error:", error);
        if (errorCallback) errorCallback(error);
      });
  },

  // 3. Hapus data submission (Khusus Guru jika ingin reset data murid)
  deleteSubmission: async (docId) => {
    if (!FirebaseService.isReady()) {
      throw new Error("Firebase belum dikonfigurasi.");
    }
    await db.collection("tka_submissions_2025").doc(docId).delete();
  }
};
