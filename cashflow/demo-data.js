/**
 * Cashflow Keuangan Keluarga Faletsa — Demo Dataset
 * Realistic sample data to visualize the financial dashboard immediately.
 * Marked as DEMO data so users can clear it with 1-click once ready for real usage.
 */

const DEMO_DATA = {
  isDemo: true,
  settings: [
    { key: 'familyName', value: 'Keluarga Faletsa' },
    { key: 'currency', value: 'IDR' },
    { key: 'theme', value: 'light' },
    { key: 'isDemoActive', value: true },
    {
      key: 'incomeCategories',
      value: ['Gaji', 'Bonus', 'Bisnis', 'Freelance', 'Investasi', 'Pendapatan Lainnya']
    },
    {
      key: 'expenseCategories',
      value: [
        'Makanan', 'Listrik', 'Air', 'Internet', 'Transportasi',
        'Pendidikan', 'Kesehatan', 'Belanja Rumah', 'Anak', 'Hiburan',
        'Donasi', 'Lifestyle', 'Komunikasi', 'Lainnya'
      ]
    }
  ],
  savings: [
    {
      id: 'sav_demo_1',
      name: 'Dana Darurat Keluarga',
      targetAmount: 45000000,
      currentAmount: 28500000,
      deadline: '2026-12-31',
      notes: 'Target 6 bulan pengeluaran wajib keluarga Faletsa',
      isEmergencyFund: true,
      isDemo: true
    },
    {
      id: 'sav_demo_2',
      name: 'Tabungan Pendidikan Anak',
      targetAmount: 30000000,
      currentAmount: 14000000,
      deadline: '2027-06-30',
      notes: 'Persiapan tahun ajaran baru sekolah',
      isEmergencyFund: false,
      isDemo: true
    },
    {
      id: 'sav_demo_3',
      name: 'Liburan Akhir Tahun',
      targetAmount: 15000000,
      currentAmount: 9500000,
      deadline: '2026-11-30',
      notes: 'Liburan keluarga ke Yogyakarta',
      isEmergencyFund: false,
      isDemo: true
    }
  ],
  installments: [
    {
      id: 'inst_demo_1',
      name: 'KPR Rumah Faletsa',
      type: 'Rumah',
      totalLoan: 480000000,
      remainingLoan: 320000000,
      monthlyAmount: 3600000,
      paymentDate: '10',
      dueDate: '2034-08-10',
      duration: '15 Tahun',
      status: 'Aktif',
      notes: 'Auto-debit Bank BTN setiap tanggal 10',
      isDemo: true
    },
    {
      id: 'inst_demo_2',
      name: 'Cicilan Motor Matic',
      type: 'Kendaraan',
      totalLoan: 24000000,
      remainingLoan: 7200000,
      monthlyAmount: 850000,
      paymentDate: '15',
      dueDate: '2027-04-15',
      duration: '3 Tahun',
      status: 'Aktif',
      notes: 'Kendaraan operasional harian',
      isDemo: true
    }
  ],
  transactions: [
    // Month: September 2026 (Current Month)
    { id: 'tx_demo_101', type: 'income', date: '2026-09-01', source: 'Gaji Utama Suami', category: 'Gaji', amount: 12500000, notes: 'Gaji bulanan kantor', isDemo: true },
    { id: 'tx_demo_102', type: 'income', date: '2026-09-01', source: 'Gaji Istri', category: 'Gaji', amount: 8000000, notes: 'Gaji bulanan', isDemo: true },
    { id: 'tx_demo_103', type: 'income', date: '2026-09-05', source: 'Honor Proyek Freelance Web', category: 'Freelance', amount: 3500000, notes: 'Klien edukasi', isDemo: true },
    { id: 'tx_demo_104', type: 'expense', date: '2026-09-02', name: 'Belanja Bulanan Supermarket', category: 'Belanja Rumah', expenseType: 'Kebutuhan', amount: 2400000, notes: 'Bahan pokok dapur & sabun', isDemo: true },
    { id: 'tx_demo_105', type: 'expense', date: '2026-09-03', name: 'Token Listrik PLN 2200VA', category: 'Listrik', expenseType: 'Wajib', amount: 650000, notes: 'Listrik rumah', isDemo: true },
    { id: 'tx_demo_106', type: 'expense', date: '2026-09-03', name: 'Tagihan Air PDAM', category: 'Air', expenseType: 'Wajib', amount: 180000, notes: 'Pemakaian Agustus', isDemo: true },
    { id: 'tx_demo_107', type: 'expense', date: '2026-09-04', name: 'Wifi IndiHome 50 Mbps', category: 'Internet', expenseType: 'Wajib', amount: 380000, notes: 'Internet rumah & kerja', isDemo: true },
    { id: 'tx_demo_108', type: 'expense', date: '2026-09-06', name: 'BBM Pertamax & Tol Mingguan', category: 'Transportasi', expenseType: 'Kebutuhan', amount: 550000, notes: 'Mobil & motor', isDemo: true },
    { id: 'tx_demo_109', type: 'expense', date: '2026-09-07', name: 'Makan Bersama Keluarga Weekend', category: 'Makanan', expenseType: 'Keinginan', amount: 480000, notes: 'Resto Sunda', isDemo: true },
    { id: 'tx_demo_110', type: 'expense', date: '2026-09-08', name: 'SPP Sekolah Anak & Buku', category: 'Pendidikan', expenseType: 'Wajib', amount: 1500000, notes: 'SMA Plus PGRI Cibinong', isDemo: true },
    { id: 'tx_demo_111', type: 'expense', date: '2026-09-10', name: 'Bayar Cicilan KPR BTN', category: 'Cicilan', expenseType: 'Wajib', amount: 3600000, notes: 'KPR Rumah September', isDemo: true },
    { id: 'tx_demo_112', type: 'expense', date: '2026-09-15', name: 'Bayar Cicilan Motor', category: 'Cicilan', expenseType: 'Wajib', amount: 850000, notes: 'Cicilan motor ke-28', isDemo: true },
    { id: 'tx_demo_113', type: 'saving', date: '2026-09-02', name: 'Alokasi Dana Darurat', category: 'Tabungan', amount: 2000000, notes: 'Transfer ke Reksadana Pasar Uang', targetId: 'sav_demo_1', isDemo: true },
    { id: 'tx_demo_114', type: 'saving', date: '2026-09-02', name: 'Alokasi Tabungan Pendidikan', category: 'Tabungan', amount: 1500000, notes: 'Transfer tabungan rencana', targetId: 'sav_demo_2', isDemo: true },
    { id: 'tx_demo_115', type: 'expense', date: '2026-09-18', name: 'Pemeriksaan Dokter Gigi & Vitamin', category: 'Kesehatan', expenseType: 'Kebutuhan', amount: 650000, notes: 'Scaling & suplemen imun', isDemo: true },
    { id: 'tx_demo_116', type: 'expense', date: '2026-09-20', name: 'Sedekah & Donasi Jumat', category: 'Donasi', expenseType: 'Kebutuhan', amount: 300000, notes: 'Infaq masjid & panti', isDemo: true },
    { id: 'tx_demo_117', type: 'expense', date: '2026-09-22', name: 'Kebutuhan Popok & Perlengkapan Bayi', category: 'Anak', expenseType: 'Kebutuhan', amount: 750000, notes: 'Susu & toiletries', isDemo: true },

    // Month: Agustus 2026 (Previous Month for Trend Comparison)
    { id: 'tx_demo_201', type: 'income', date: '2026-08-01', source: 'Gaji Utama Suami', category: 'Gaji', amount: 12500000, notes: 'Gaji Agustus', isDemo: true },
    { id: 'tx_demo_202', type: 'income', date: '2026-08-01', source: 'Gaji Istri', category: 'Gaji', amount: 8000000, notes: 'Gaji Agustus', isDemo: true },
    { id: 'tx_demo_203', type: 'income', date: '2026-08-17', source: 'Bonus Kinerja Kemerdekaan', category: 'Bonus', amount: 2500000, notes: 'Bonus kantor', isDemo: true },
    { id: 'tx_demo_204', type: 'expense', date: '2026-08-03', name: 'Belanja Bulanan Dapur', category: 'Belanja Rumah', expenseType: 'Kebutuhan', amount: 2600000, notes: 'Supermarket', isDemo: true },
    { id: 'tx_demo_205', type: 'expense', date: '2026-08-04', name: 'Listrik, Air & Internet', category: 'Listrik', expenseType: 'Wajib', amount: 1250000, notes: 'Utilitas rumah', isDemo: true },
    { id: 'tx_demo_206', type: 'expense', date: '2026-08-08', name: 'SPP Sekolah', category: 'Pendidikan', expenseType: 'Wajib', amount: 1500000, notes: 'SPP', isDemo: true },
    { id: 'tx_demo_207', type: 'expense', date: '2026-08-10', name: 'Cicilan KPR BTN', category: 'Cicilan', expenseType: 'Wajib', amount: 3600000, notes: 'KPR', isDemo: true },
    { id: 'tx_demo_208', type: 'expense', date: '2026-08-15', name: 'Cicilan Motor', category: 'Cicilan', expenseType: 'Wajib', amount: 850000, notes: 'Motor', isDemo: true },
    { id: 'tx_demo_209', type: 'expense', date: '2026-08-18', name: 'Perayaan 17 Agustus & Kuliner', category: 'Hiburan', expenseType: 'Keinginan', amount: 1100000, notes: 'Acara warga & jalan-jalan', isDemo: true },
    { id: 'tx_demo_210', type: 'expense', date: '2026-08-25', name: 'Transportasi & Servis Mobil', category: 'Transportasi', expenseType: 'Kebutuhan', amount: 1350000, notes: 'Ganti oli & bensin', isDemo: true },
    { id: 'tx_demo_211', type: 'saving', date: '2026-08-02', name: 'Alokasi Tabungan Rutin', category: 'Tabungan', amount: 3000000, notes: 'Tabungan Agustus', targetId: 'sav_demo_1', isDemo: true },

    // Month: Juli 2026
    { id: 'tx_demo_301', type: 'income', date: '2026-07-01', source: 'Gaji Suami & Istri', category: 'Gaji', amount: 20500000, notes: 'Gaji Juli', isDemo: true },
    { id: 'tx_demo_302', type: 'expense', date: '2026-07-05', name: 'Daftar Ulang & Seragam Sekolah', category: 'Pendidikan', expenseType: 'Wajib', amount: 3200000, notes: 'Tahun ajaran baru', isDemo: true },
    { id: 'tx_demo_303', type: 'expense', date: '2026-07-06', name: 'Belanja Rumah & Dapur', category: 'Belanja Rumah', expenseType: 'Kebutuhan', amount: 2300000, notes: 'Kebutuhan rumah', isDemo: true },
    { id: 'tx_demo_304', type: 'expense', date: '2026-07-10', name: 'Cicilan KPR & Motor', category: 'Cicilan', expenseType: 'Wajib', amount: 4450000, notes: 'Total cicilan bulanan', isDemo: true },
    { id: 'tx_demo_305', type: 'expense', date: '2026-07-15', name: 'Utilitas Listrik & Internet', category: 'Listrik', expenseType: 'Wajib', amount: 1150000, notes: 'Utilitas', isDemo: true },
    { id: 'tx_demo_306', type: 'saving', date: '2026-07-02', name: 'Tabungan Pendidikan Anak', category: 'Tabungan', amount: 2500000, notes: 'Tabungan Juli', targetId: 'sav_demo_2', isDemo: true }
  ]
};

window.DEMO_DATA = DEMO_DATA;