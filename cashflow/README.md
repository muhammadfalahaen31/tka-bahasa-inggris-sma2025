# 💰 Cashflow Keuangan Keluarga Faletsa

Website **Personal Family Financial Dashboard** modern, responsif, elegan, dan persisten untuk mencatat, memantau, dan menganalisis kondisi keuangan rumah tangga Keluarga Faletsa.

---

## 🌟 Fitur Utama

1. **Dashboard Utama (6 Summary Cards)**:
   - 💵 **Uang Masuk**: Total seluruh pemasukan bulan berjalan.
   - 💸 **Uang Keluar**: Total seluruh pengeluaran bulan berjalan.
   - 🏦 **Tabungan**: Total alokasi simpanan bulan berjalan.
   - 💳 **Cicilan**: Total kewajiban cicilan bulan berjalan.
   - ⚖️ **Sisa Cashflow**: Pemasukan - Pengeluaran - Tabungan - Cicilan.
   - ❤️ **Financial Health Score (0–100)**: Indikator kesehatan finansial berbasis 5 rasio objektif (🟢 Sehat, 🟡 Cukup Sehat, 🟠 Perlu Perhatian, 🔴 Berisiko).

2. **Visualisasi Data Interaktif**:
   - 📈 Grafik Garis Tren Cashflow Bulanan (Uang Masuk vs Uang Keluar).
   - 🍩 Diagram Donut Komposisi Pengeluaran per Kategori.
   - 📊 Top 5 Pengeluaran Terbesar dengan progress bar persentase.
   - 💡 Smart Financial Insights & Rekomendasi otomatis berbasis data riil.

3. **Modul Uang Masuk**:
   - Form input: Tanggal, Sumber Pemasukan, Kategori, Nominal, Catatan.
   - Rekap Total Pemasukan Bulan ini & Tahun ini.

4. **Modul Uang Keluar & Kategori Kustom**:
   - Form input: Tanggal, Nama Pengeluaran, Kategori, Klasifikasi Kebutuhan (Wajib, Kebutuhan, Keinginan, Darurat), Nominal, Catatan.
   - **Kategori Dinamis Tanpa Batas**: Pengguna bebas menambah, mengubah, atau menghapus kategori pengeluaran rumah tangga sendiri di menu Pengaturan.

5. **Modul Tabungan & Dana Darurat**:
   - Manajemen target tabungan (Dana Darurat, Rumah, Pendidikan, Liburan, dll).
   - Progress bar pencapaian (Rp Terkumpul / Target, persentase, deadline).
   - Tombol Setor Dana langsung meng-update saldo dan mencatat alokasi tabungan.

6. **Modul Cicilan & Utang**:
   - Pencatatan KPR, kendaraan, elektronik, pinjaman bank, kartu kredit.
   - Pemantauan sisa utang dan cicilan per bulan.
   - Tombol **💳 Bayar Cicilan** yang otomatis mengurangi sisa pinjaman dan mencatat ke pengeluaran bulanan.

7. **Matriks Pengeluaran Bulanan (Januari – Desember)**:
   - Tabel perbandingan 12 bulan lengkap: Pemasukan, Pengeluaran, Tabungan, Cicilan, dan Sisa Cashflow.
   - Grafik batang perbandingan bulanan.

8. **Riwayat Transaksi (Ledger)**:
   - Pencarian kata kunci cepat.
   - Filter berdasarkan Tipe (Pemasukan, Pengeluaran, Tabungan), Kategori, dan Tanggal.
   - Fitur Edit dan Hapus transaksi dengan dialog konfirmasi aman.

9. **Keamanan & Persistensi Data (Anti Hilang)**:
   - Database persisten **IndexedDB** dengan sinkronisasi cadangan ke **LocalStorage**.
   - Data tetap aman dan utuh saat browser ditutup, halaman di-refresh, atau dibuka berhari-hari kemudian.
   - Fitur **Backup JSON** dan **Restore JSON** mandiri.
   - Fitur **Ekspor Laporan ke CSV / Excel** dan **Cetak / Simpan PDF**.

10. **Desain Mobile-First & Dark Mode**:
    - Nyaman digunakan di layar HP smartphone dengan *Bottom Navigation Bar* dan *Floating Action Button (+)*.
    - Mode Gelap (Dark Mode) dan Mode Terang (Light Mode) yang elegan.
    - Tersedia data demo realistis yang dapat dihapus sekali klik.

---

## 🚀 Cara Menjalankan

Cukup buka file index.html langsung di browser mana pun (Google Chrome, Microsoft Edge, Safari, Firefox), baik di laptop maupun di HP. Tidak memerlukan instalasi server tambahan!