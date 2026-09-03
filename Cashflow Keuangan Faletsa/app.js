/**
 * Cashflow Keuangan Keluarga Faletsa — Main Application Logic
 * Modular, clean, modern, and persistent personal finance controller with PIN Security & Cloud Sync.
 */

// Global State
var AppState = {
  currentView: 'dashboard',
  filter: {
    month: new Date().getMonth(), // 0 - 11 or 'all'
    year: new Date().getFullYear(),
    category: 'all',
    search: '',
    type: 'all'
  },
  transactions: [],
  savings: [],
  installments: [],
  settings: {
    familyName: 'Keluarga Faletsa',
    currency: 'IDR',
    theme: 'light',
    isDemoActive: false,
    incomeCategories: ['Gaji', 'Bonus', 'Bisnis', 'Freelance', 'Investasi', 'Pendapatan Lainnya'],
    expenseCategories: [
      'Makanan', 'Listrik', 'Air', 'Internet', 'Transportasi',
      'Pendidikan', 'Kesehatan', 'Belanja Rumah', 'Anak', 'Hiburan',
      'Donasi', 'Lifestyle', 'Komunikasi', 'Cicilan', 'Lainnya'
    ]
  },
  editingTransactionId: null,
  charts: {
    trend: null,
    category: null,
    monthly: null
  },
  enteredPin: ''
};

var PIN_SECRET = '354313';

var MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ==========================================================================
// FORMATTERS & HELPERS
// ==========================================================================
function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return 'Rp ' + Math.round(number).toLocaleString('id-ID');
}

function parseRupiahInput(val) {
  if (!val) return 0;
  var clean = String(val).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    var d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function showToast(message, type) {
  var tType = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + tType;
  var icon = 'ℹ️';
  if (tType === 'success') icon = '✅';
  if (tType === 'error') icon = '❌';
  if (tType === 'warning') icon = '⚠️';
  toast.innerHTML = '<span>' + icon + '</span><span>' + escapeHtml(message) + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3200);
}

// ==========================================================================
// 🔒 PIN SECURITY AUTHENTICATION SYSTEM (PIN: 354313)
// ==========================================================================
function initPinSecurity() {
  var savedAuth = sessionStorage.getItem('faletsa_auth_pin');
  var overlay = document.getElementById('pin-lock-overlay');
  
  if (savedAuth === PIN_SECRET) {
    if (overlay) overlay.classList.add('unlocked');
  } else {
    if (overlay) overlay.classList.remove('unlocked');
    resetPinDisplay();
  }

  // Listen to physical keyboard typing
  window.addEventListener('keydown', function(e) {
    var lockScreen = document.getElementById('pin-lock-overlay');
    if (!lockScreen || lockScreen.classList.contains('unlocked')) return;

    if (e.key >= '0' && e.key <= '9') {
      inputPinDigit(e.key);
    } else if (e.key === 'Backspace') {
      deletePinDigit();
    } else if (e.key === 'Escape') {
      clearPin();
    } else if (e.key === 'Enter') {
      verifyPin();
    }
  });
}

function inputPinDigit(digit) {
  if (AppState.enteredPin.length >= 6) return;
  AppState.enteredPin += String(digit);
  updatePinDots();

  // Auto-verify upon reaching 6 digits
  if (AppState.enteredPin.length === 6) {
    setTimeout(verifyPin, 120);
  }
}

function deletePinDigit() {
  if (AppState.enteredPin.length > 0) {
    AppState.enteredPin = AppState.enteredPin.slice(0, -1);
    updatePinDots();
  }
}

function clearPin() {
  AppState.enteredPin = '';
  updatePinDots();
}

function updatePinDots() {
  var dots = document.querySelectorAll('.pin-dot');
  var len = AppState.enteredPin.length;
  dots.forEach(function(dot, idx) {
    if (idx < len) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });

  var errMsg = document.getElementById('pin-error-msg');
  if (errMsg && len < 6) {
    errMsg.textContent = '';
  }
}

function resetPinDisplay() {
  AppState.enteredPin = '';
  updatePinDots();
  var errMsg = document.getElementById('pin-error-msg');
  if (errMsg) errMsg.textContent = '';
}

function verifyPin() {
  var overlay = document.getElementById('pin-lock-overlay');
  var errMsg = document.getElementById('pin-error-msg');
  var dotsContainer = document.getElementById('pin-dots-container');

  if (AppState.enteredPin === PIN_SECRET) {
    sessionStorage.setItem('faletsa_auth_pin', PIN_SECRET);
    if (errMsg) errMsg.textContent = '';
    if (overlay) overlay.classList.add('unlocked');
    showToast('Selamat datang, Keluarga Faletsa!', 'success');
    resetPinDisplay();
  } else {
    if (errMsg) errMsg.textContent = 'PIN salah! Silakan masukkan 6 digit PIN yang benar.';
    if (dotsContainer) {
      dotsContainer.classList.add('shake');
      setTimeout(function() {
        dotsContainer.classList.remove('shake');
      }, 400);
    }
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setTimeout(function() {
      resetPinDisplay();
    }, 450);
  }
}

function lockApp() {
  sessionStorage.removeItem('faletsa_auth_pin');
  var overlay = document.getElementById('pin-lock-overlay');
  if (overlay) overlay.classList.remove('unlocked');
  resetPinDisplay();
  closeMobileSidebar();
  showToast('Dashboard telah dikunci.', 'info');
}

// ==========================================================================
// INITIALIZATION & STATE LOADING
// ==========================================================================
async function initCashflowApp() {
  try {
    initPinSecurity();
    await window.DB.init();

    // Load Settings
    var savedSettings = await window.DB.getAll('settings');
    if (savedSettings && savedSettings.length > 0) {
      savedSettings.forEach(function(item) {
        AppState.settings[item.key] = item.value;
      });
    }

    // Load Transactions, Savings, Installments
    await reloadStateData();

    // Initialize Firebase CloudSync with Realtime Listener
    if (window.CloudSync) {
      window.CloudSync.init(function(remoteData) {
        if (remoteData) {
          handleRemoteCloudUpdate(remoteData);
        }
      });
    }

    // Purge any remaining demo dummy data if present
    await purgeDemoDataIfPresent();

    applyTheme(AppState.settings.theme || 'light');
    setupEventListeners();
    populateFilterOptions();
    handleTxTypeChange();
    renderApp();
  } catch (e) {
    console.error('Initialization error:', e);
    renderApp();
  }
}

async function reloadStateData() {
  try {
    AppState.transactions = (await window.DB.getAll('transactions')) || [];
    AppState.savings = (await window.DB.getAll('savings')) || [];
    AppState.installments = (await window.DB.getAll('installments')) || [];
  } catch (e) {
    console.warn('Reload state warning:', e);
  }
}

// Real-time Cloud Update Handler (When spouse saves data on other device)
async function handleRemoteCloudUpdate(remoteData) {
  try {
    if (!remoteData) return;

    var prevCount = AppState.transactions.length;

    // Smart Bi-directional Merging: never lose local records!
    if (window.CloudSync && window.CloudSync.mergeArraysById) {
      if (Array.isArray(remoteData.transactions)) {
        AppState.transactions = window.CloudSync.mergeArraysById(remoteData.transactions, AppState.transactions);
      }
      if (Array.isArray(remoteData.savings)) {
        AppState.savings = window.CloudSync.mergeArraysById(remoteData.savings, AppState.savings);
      }
      if (Array.isArray(remoteData.installments)) {
        AppState.installments = window.CloudSync.mergeArraysById(remoteData.installments, AppState.installments);
      }
    } else {
      if (remoteData.transactions && remoteData.transactions.length > 0) {
        AppState.transactions = remoteData.transactions;
      }
    }

    if (remoteData.settings && typeof remoteData.settings === 'object') {
      var keys = Object.keys(remoteData.settings);
      keys.forEach(function(k) { AppState.settings[k] = remoteData.settings[k]; });
    }

    // Persist merged state to local storage & indexedDB
    localStorage.setItem('faletsa_cashflow_local_backup_v1_transactions', JSON.stringify(AppState.transactions));
    localStorage.setItem('faletsa_cashflow_local_backup_v1_savings', JSON.stringify(AppState.savings));
    localStorage.setItem('faletsa_cashflow_local_backup_v1_installments', JSON.stringify(AppState.installments));

    renderApp();
    
    if (AppState.transactions.length !== prevCount) {
      showToast('☁️ Data disinkronkan dari Cloud (' + AppState.transactions.length + ' transaksi aktif).', 'info');
    }
  } catch (err) {
    console.warn('Handle remote cloud update error:', err);
  }
}

// ==========================================================================
// NAVIGATION & ROUTING
// ==========================================================================
function setView(viewName) {
  AppState.currentView = viewName;

  document.querySelectorAll('.view-section').forEach(function(el) {
    el.classList.remove('active');
  });
  var targetView = document.getElementById('view-' + viewName);
  if (targetView) targetView.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(function(el) {
    el.classList.toggle('active', el.dataset.view === viewName);
  });

  document.querySelectorAll('.mobile-nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.view === viewName);
  });

  var titleMap = {
    dashboard: 'Dashboard Keuangan',
    income: 'Uang Masuk (Pemasukan)',
    expense: 'Uang Keluar (Pengeluaran)',
    savings: 'Tabungan & Dana Darurat',
    installments: 'Daftar Cicilan & Kewajiban',
    monthly: 'Plot Pengeluaran Bulanan',
    health: 'Financial Health Score',
    history: 'Riwayat Seluruh Transaksi',
    export: 'Backup & Ekspor Laporan',
    settings: 'Pengaturan Dashboard'
  };
  var titleEl = document.getElementById('header-page-title-text');
  if (titleEl) titleEl.textContent = titleMap[viewName] || 'Dashboard';

  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  renderCurrentView();
}

function renderCurrentView() {
  var v = AppState.currentView;
  if (v === 'dashboard') renderDashboard();
  else if (v === 'income') renderIncomeModule();
  else if (v === 'expense') renderExpenseModule();
  else if (v === 'savings') renderSavingsModule();
  else if (v === 'installments') renderInstallmentsModule();
  else if (v === 'monthly') renderMonthlyModule();
  else if (v === 'health') renderFinancialHealthModule();
  else if (v === 'history') renderHistoryModule();
  else if (v === 'export') renderExportModule();
  else if (v === 'settings') renderSettingsModule();
}

function renderApp() {
  renderCurrentView();
}

async function purgeDemoDataIfPresent() {
  try {
    var hasDemo = false;
    var filteredTxs = AppState.transactions.filter(function(t) {
      if (t.isDemo || (t.id && t.id.startsWith('tx_demo_'))) {
        hasDemo = true;
        return false;
      }
      return true;
    });

    var filteredSav = AppState.savings.filter(function(s) {
      if (s.isDemo || (s.id && s.id.startsWith('sav_demo_'))) {
        hasDemo = true;
        return false;
      }
      return true;
    });

    var filteredInst = AppState.installments.filter(function(i) {
      if (i.isDemo || (i.id && i.id.startsWith('inst_demo_'))) {
        hasDemo = true;
        return false;
      }
      return true;
    });

    if (hasDemo) {
      AppState.transactions = filteredTxs;
      AppState.savings = filteredSav;
      AppState.installments = filteredInst;
      AppState.settings.isDemoActive = false;

      // Update local storage
      await window.DB.clear('transactions');
      for (var t = 0; t < filteredTxs.length; t++) {
        await window.DB.put('transactions', filteredTxs[t]);
      }
      await window.DB.clear('savings');
      for (var s = 0; s < filteredSav.length; s++) {
        await window.DB.put('savings', filteredSav[s]);
      }
      await window.DB.clear('installments');
      for (var k = 0; k < filteredInst.length; k++) {
        await window.DB.put('installments', filteredInst[k]);
      }
      console.log('✅ [Data Clean] Seluruh data demo berhasil dibersihkan.');
    }
  } catch (e) {
    console.warn('Purge demo data error:', e);
  }
}

// ==========================================================================
// CORE FINANCIAL CALCULATIONS
// ==========================================================================
function getFilteredTransactions() {
  var filterMonth = AppState.filter.month;
  var filterYear = AppState.filter.year;

  return AppState.transactions.filter(function(tx) {
    if (!tx.date) return false;
    var d = new Date(tx.date);
    var txYear = d.getFullYear();
    var txMonth = d.getMonth();

    if (filterYear !== 'all' && txYear !== parseInt(filterYear, 10)) return false;
    if (filterMonth !== 'all' && txMonth !== parseInt(filterMonth, 10)) return false;
    return true;
  });
}

function calculateCashflowSummary(monthVal, yearVal) {
  var mVal = monthVal !== undefined ? monthVal : AppState.filter.month;
  var yVal = yearVal !== undefined ? yearVal : AppState.filter.year;

  var txs = AppState.transactions.filter(function(tx) {
    if (!tx.date) return false;
    var d = new Date(tx.date);
    var y = d.getFullYear();
    var m = d.getMonth();
    if (yVal !== 'all' && y !== parseInt(yVal, 10)) return false;
    if (mVal !== 'all' && m !== parseInt(mVal, 10)) return false;
    return true;
  });

  var totalIncome = 0;
  var totalExpense = 0;
  var totalSavings = 0;
  var totalDebt = 0;

  txs.forEach(function(tx) {
    var amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
    } else if (tx.type === 'expense') {
      totalExpense += amt;
      if (tx.category === 'Cicilan' || tx.isInstallment) {
        totalDebt += amt;
      }
    } else if (tx.type === 'saving') {
      totalSavings += amt;
    }
  });

  var remainingBalance = totalIncome - totalExpense - totalSavings;

  return {
    income: totalIncome,
    expense: totalExpense,
    savings: totalSavings,
    debt: totalDebt,
    balance: remainingBalance
  };
}

// -------------------------------------------------------------
// FINANCIAL HEALTH ENGINE (0–100 SCORE)
// -------------------------------------------------------------
function calculateFinancialHealth() {
  var summary = calculateCashflowSummary();
  var income = summary.income;
  var expense = summary.expense;
  var savings = summary.savings;
  var debt = summary.debt;
  var balance = summary.balance;

  var savingsRate = income > 0 ? (savings / income) * 100 : 0;
  var expenseRatio = income > 0 ? (expense / income) * 100 : 0;
  var debtRatio = income > 0 ? (debt / income) * 100 : 0;

  var emergencyFundTotal = 0;
  AppState.savings.forEach(function(s) {
    if (s.isEmergencyFund || (s.name && s.name.toLowerCase().includes('darurat'))) {
      emergencyFundTotal += Number(s.currentAmount) || 0;
    }
  });

  var recent3MonthExpenses = [];
  var currYear = typeof AppState.filter.year === 'number' ? AppState.filter.year : new Date().getFullYear();
  for (var m = 0; m < 12; m++) {
    var s = calculateCashflowSummary(m, currYear);
    if (s.expense > 0) recent3MonthExpenses.push(s.expense);
  }
  var avgMonthlyExpense = recent3MonthExpenses.length > 0
    ? recent3MonthExpenses.reduce(function(a, b) { return a + b; }, 0) / recent3MonthExpenses.length
    : (expense || 1);

  var emergencyFundRunwayMonths = avgMonthlyExpense > 0
    ? (emergencyFundTotal / avgMonthlyExpense).toFixed(1)
    : '0.0';

  var score = 0;

  // 1. Cashflow Solvency (Max 30 pts)
  if (balance > 0) {
    var margin = income > 0 ? (balance / income) * 100 : 0;
    if (margin >= 20) score += 30;
    else if (margin >= 10) score += 25;
    else score += 18;
  } else if (balance === 0 && income > 0) {
    score += 15;
  } else {
    score += 5;
  }

  // 2. Savings Rate (Max 25 pts)
  if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 15) score += 20;
  else if (savingsRate >= 10) score += 15;
  else if (savingsRate >= 5) score += 8;
  else score += 2;

  // 3. Debt-to-Income Ratio (Max 25 pts)
  if (debtRatio === 0) score += 25;
  else if (debtRatio <= 20) score += 23;
  else if (debtRatio <= 30) score += 18;
  else if (debtRatio <= 40) score += 10;
  else score += 2;

  // 4. Emergency Fund Cushion (Max 20 pts)
  var runway = parseFloat(emergencyFundRunwayMonths);
  if (runway >= 6) score += 20;
  else if (runway >= 3) score += 16;
  else if (runway >= 1) score += 10;
  else score += 3;

  score = Math.min(100, Math.max(0, Math.round(score)));

  var category = '';
  var badgeClass = '';
  var color = '';
  var interpretation = '';

  if (score >= 80) {
    category = 'Keuangan Sehat';
    badgeClass = 'badge-green';
    color = '#10b981';
    interpretation = 'Kondisi finansial keluarga Faletsa sangat kokoh dan stabil. Cashflow positif dengan porsi tabungan dan proteksi dana darurat yang optimal.';
  } else if (score >= 60) {
    category = 'Keuangan Cukup Sehat';
    badgeClass = 'badge-blue';
    color = '#2563eb';
    interpretation = 'Kondisi keuangan berada dalam batas aman, namun alokasi tabungan rutin atau rasio cicilan masih dapat dioptimalkan lebih lanjut.';
  } else if (score >= 40) {
    category = 'Perlu Perhatian';
    badgeClass = 'badge-amber';
    color = '#f59e0b';
    interpretation = 'Cashflow mulai menipis atau rasio cicilan bulanan mendekati ambang batas wajar. Disarankan menekan pengeluaran kategori keinginan.';
  } else {
    category = 'Berisiko';
    badgeClass = 'badge-rose';
    color = '#f43f5e';
    interpretation = 'Kondisi keuangan mengalami defisit atau beban utang terlalu berat. Segera lakukan pengetatan anggaran dan evaluasi prioritas pengeluaran.';
  }

  return {
    score: score,
    category: category,
    badgeClass: badgeClass,
    color: color,
    interpretation: interpretation,
    savingsRate: savingsRate.toFixed(1),
    expenseRatio: expenseRatio.toFixed(1),
    debtRatio: debtRatio.toFixed(1),
    emergencyFundTotal: emergencyFundTotal,
    emergencyFundRunwayMonths: emergencyFundRunwayMonths,
    balanceStatus: balance > 0 ? 'Positif' : (balance === 0 ? 'Hampir Seimbang' : 'Defisit')
  };
}

// ==========================================================================
// DASHBOARD VIEW RENDERING
// ==========================================================================
function renderDashboard() {
  var summary = calculateCashflowSummary();
  var health = calculateFinancialHealth();

  var elIncome = document.getElementById('dash-val-income');
  var elExpense = document.getElementById('dash-val-expense');
  var elSavings = document.getElementById('dash-val-savings');
  var elDebt = document.getElementById('dash-val-debt');
  var elBalance = document.getElementById('dash-val-balance');
  var elHealthScore = document.getElementById('dash-val-health-score');
  var elHealthBadge = document.getElementById('dash-badge-health');

  if (elIncome) elIncome.textContent = formatRupiah(summary.income);
  if (elExpense) elExpense.textContent = formatRupiah(summary.expense);
  if (elSavings) elSavings.textContent = formatRupiah(summary.savings);
  if (elDebt) elDebt.textContent = formatRupiah(summary.debt);
  if (elBalance) {
    elBalance.textContent = formatRupiah(summary.balance);
    elBalance.style.color = summary.balance >= 0 ? 'var(--primary-blue)' : 'var(--accent-rose)';
  }
  if (elHealthScore) elHealthScore.textContent = health.score + '/100';
  if (elHealthBadge) {
    elHealthBadge.className = 'badge ' + health.badgeClass;
    elHealthBadge.textContent = health.category;
  }

  // Check if current month has 0 transactions to show smart copy prompt banner
  var filteredTxs = getFilteredTransactions();
  var emptyBanner = document.getElementById('dash-empty-month-banner');
  if (emptyBanner) {
    if (filteredTxs.length === 0 && AppState.filter.month !== 'all' && AppState.transactions.length > 0) {
      emptyBanner.style.display = 'flex';
    } else {
      emptyBanner.style.display = 'none';
    }
  }

  renderTrendBadges(summary);
  renderDashboardCharts();
  renderTop5Expenses();
  renderSmartInsights(summary, health);
}

function renderTrendBadges(currentSummary) {
  var currMonth = AppState.filter.month === 'all' ? new Date().getMonth() : parseInt(AppState.filter.month, 10);
  var currYear = AppState.filter.year === 'all' ? new Date().getFullYear() : parseInt(AppState.filter.year, 10);

  var prevMonth = currMonth - 1;
  var prevYear = currYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }

  var prevSummary = calculateCashflowSummary(prevMonth, prevYear);

  var expTrendEl = document.getElementById('trend-expense-badge');
  if (expTrendEl) {
    if (prevSummary.expense > 0) {
      var diff = ((currentSummary.expense - prevSummary.expense) / prevSummary.expense) * 100;
      var absDiff = Math.abs(diff).toFixed(1);
      if (diff > 0) {
        expTrendEl.className = 'trend-badge trend-up-red';
        expTrendEl.innerHTML = '⬆️ +' + absDiff + '% vs bln lalu';
      } else if (diff < 0) {
        expTrendEl.className = 'trend-badge trend-down-green';
        expTrendEl.innerHTML = '⬇️ -' + absDiff + '% vs bln lalu';
      } else {
        expTrendEl.className = 'trend-badge trend-neutral';
        expTrendEl.innerHTML = '➡️ Stabil';
      }
    } else {
      expTrendEl.className = 'trend-badge trend-neutral';
      expTrendEl.innerHTML = 'Data baru';
    }
  }

  var incTrendEl = document.getElementById('trend-income-badge');
  if (incTrendEl) {
    if (prevSummary.income > 0) {
      var diffInc = ((currentSummary.income - prevSummary.income) / prevSummary.income) * 100;
      var absDiffInc = Math.abs(diffInc).toFixed(1);
      if (diffInc >= 0) {
        incTrendEl.className = 'trend-badge trend-up-green';
        incTrendEl.innerHTML = '⬆️ +' + absDiffInc + '% vs bln lalu';
      } else {
        incTrendEl.className = 'trend-badge trend-down-red';
        incTrendEl.innerHTML = '⬇️ -' + absDiffInc + '% vs bln lalu';
      }
    } else {
      incTrendEl.className = 'trend-badge trend-neutral';
      incTrendEl.innerHTML = 'Data baru';
    }
  }
}

// -------------------------------------------------------------
// CHARTS (Chart.js via CDN)
// -------------------------------------------------------------
function renderDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  var yearVal = AppState.filter.year === 'all' ? new Date().getFullYear() : parseInt(AppState.filter.year, 10);

  // 1. Monthly Cashflow Trend Line Chart
  var monthlyData = [];
  for (var m = 0; m < 12; m++) {
    var s = calculateCashflowSummary(m, yearVal);
    monthlyData.push({
      income: s.income,
      expense: s.expense,
      savings: s.savings
    });
  }

  var ctxTrend = document.getElementById('chart-cashflow-trend');
  if (ctxTrend) {
    if (AppState.charts.trend) AppState.charts.trend.destroy();

    AppState.charts.trend = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: MONTH_NAMES.map(function(name) { return name.substring(0, 3); }),
        datasets: [
          {
            label: 'Uang Masuk',
            data: monthlyData.map(function(d) { return d.income; }),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          },
          {
            label: 'Uang Keluar',
            data: monthlyData.map(function(d) { return d.expense; }),
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '600' } } },
          tooltip: {
            callbacks: {
              label: function(item) { return item.dataset.label + ': ' + formatRupiah(item.raw); }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(val) { return 'Rp ' + (val >= 1000000 ? (val / 1000000) + ' Jt' : val); }
            }
          }
        }
      }
    });
  }

  // 2. Expense Category Donut Chart
  var filteredTxs = getFilteredTransactions().filter(function(tx) { return tx.type === 'expense'; });
  var catTotals = {};
  filteredTxs.forEach(function(tx) {
    catTotals[tx.category] = (catTotals[tx.category] || 0) + (Number(tx.amount) || 0);
  });

  var catLabels = Object.keys(catTotals);
  var catValues = Object.values(catTotals);

  var ctxCat = document.getElementById('chart-expense-category');
  if (ctxCat) {
    if (AppState.charts.category) AppState.charts.category.destroy();

    var palette = ['#2563eb', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b', '#14b8a6', '#f97316'];
    
    var chartLabels = catLabels.length > 0 ? catLabels : ['Belum Ada Pengeluaran'];
    var chartValues = catValues.length > 0 ? catValues : [1];
    var chartColors = catValues.length > 0 ? palette.slice(0, catLabels.length) : ['#e2e8f0'];

    AppState.charts.category = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: chartColors,
            borderWidth: 2,
            borderColor: 'var(--bg-surface)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: function(item) {
                if (catValues.length === 0) return 'Belum ada transaksi';
                return item.label + ': ' + formatRupiah(item.raw);
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }
}

function renderTop5Expenses() {
  var container = document.getElementById('top-expenses-list');
  if (!container) return;

  var filteredTxs = getFilteredTransactions().filter(function(tx) { return tx.type === 'expense'; });
  var totalExp = 0;
  var catTotals = {};

  filteredTxs.forEach(function(tx) {
    var amt = Number(tx.amount) || 0;
    totalExp += amt;
    catTotals[tx.category] = (catTotals[tx.category] || 0) + amt;
  });

  var sortedCats = Object.entries(catTotals)
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 5);

  if (sortedCats.length === 0) {
    container.innerHTML = '<p style="font-size: 0.88rem; color: var(--text-muted); text-align: center; padding: 20px 0;">Belum ada data pengeluaran untuk periode ini.</p>';
    return;
  }

  var html = '';
  sortedCats.forEach(function(entry, idx) {
    var cat = entry[0];
    var amount = entry[1];
    var pct = totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0;
    html += '<div style="margin-bottom: 12px;">' +
      '<div style="display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 700; margin-bottom: 4px;">' +
      '<span>' + (idx + 1) + '. ' + escapeHtml(cat) + '</span>' +
      '<span>' + formatRupiah(amount) + ' (' + pct + '%)</span>' +
      '</div>' +
      '<div class="progress-bar-bg">' +
      '<div class="progress-bar-fill fill-rose" style="width: ' + pct + '%;"></div>' +
      '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

// -------------------------------------------------------------
// SMART FINANCIAL INSIGHTS & RECOMMENDATIONS
// -------------------------------------------------------------
function renderSmartInsights(summary, health) {
  var insightsContainer = document.getElementById('dash-insights-list');
  var recoContainer = document.getElementById('dash-recommendations-list');
  if (!insightsContainer || !recoContainer) return;

  var filteredExp = getFilteredTransactions().filter(function(tx) { return tx.type === 'expense'; });

  if (AppState.transactions.length === 0) {
    insightsContainer.innerHTML = '<div class="insight-item">ℹ️ Tambahkan transaksi terlebih dahulu agar sistem dapat menganalisis kesehatan keuangan keluarga.</div>';
    recoContainer.innerHTML = '<div class="insight-item">💡 Mulai dengan mencatat pemasukan bulanan dan daftar pengeluaran rutin Anda.</div>';
    return;
  }

  var insights = [];
  var recos = [];

  if (summary.balance > 0) {
    insights.push({
      type: 'positive',
      text: 'Cashflow bulan ini positif sebesar <strong>' + formatRupiah(summary.balance) + '</strong>. Sisa surplus ini sangat baik untuk memperkuat tabungan atau investasi.'
    });
  } else if (summary.balance < 0) {
    insights.push({
      type: 'danger',
      text: 'Cashflow bulan ini mengalami defisit sebesar <strong>' + formatRupiah(Math.abs(summary.balance)) + '</strong>. Pengeluaran melebihi total uang masuk.'
    });
    recos.push({
      text: 'Prioritaskan memotong pengeluaran kategori Keinginan atau Lifestyle untuk mengembalikan cashflow ke zona positif.'
    });
  }

  var catTotals = {};
  filteredExp.forEach(function(tx) {
    catTotals[tx.category] = (catTotals[tx.category] || 0) + (Number(tx.amount) || 0);
  });
  var sortedCats = Object.entries(catTotals).sort(function(a, b) { return b[1] - a[1]; });
  var topCat = sortedCats.length > 0 ? sortedCats[0] : null;

  if (topCat && summary.expense > 0) {
    var pct = Math.round((topCat[1] / summary.expense) * 100);
    insights.push({
      type: 'warning',
      text: 'Pengeluaran <strong>' + escapeHtml(topCat[0]) + '</strong> menjadi kategori terbesar bulan ini sebesar <strong>' + formatRupiah(topCat[1]) + '</strong> (' + pct + '% dari total pengeluaran).'
    });
  }

  if (Number(health.debtRatio) > 35) {
    insights.push({
      type: 'danger',
      text: 'Porsi cicilan mengambil <strong>' + health.debtRatio + '%</strong> dari total pemasukan (Ambang aman yang disarankan adalah maksimal 30%).'
    });
    recos.push({
      text: 'Hindari mengambil pinjaman atau cicilan konsumtif baru sebelum cicilan saat ini selesai dilunasi.'
    });
  } else if (summary.debt > 0) {
    insights.push({
      type: 'positive',
      text: 'Rasio cicilan berada pada level sehat sebesar <strong>' + health.debtRatio + '%</strong> dari pemasukan bulanan.'
    });
  }

  if (Number(health.savingsRate) >= 15) {
    insights.push({
      type: 'positive',
      text: 'Tingkat tabungan (Savings Rate) keluarga Faletsa mencapai <strong>' + health.savingsRate + '%</strong>, melampaui target ideal 10-20%.'
    });
  } else {
    recos.push({
      text: 'Alokasikan tabungan di awal bulan begitu gaji diterima (metode pay yourself first), minimal 10% dari total penghasilan.'
    });
  }

  if (parseFloat(health.emergencyFundRunwayMonths) < 3) {
    recos.push({
      text: 'Dana darurat keluarga saat ini baru dapat menutup <strong>' + health.emergencyFundRunwayMonths + ' bulan</strong> pengeluaran. Targetkan setidaknya 3 hingga 6 bulan pengeluaran rutin.'
    });
  } else {
    recos.push({
      text: 'Ketahanan dana darurat sangat baik (dapat menutup <strong>' + health.emergencyFundRunwayMonths + ' bulan</strong>). Kelebihan dana dapat dialihkan ke instrumen investasi jangka panjang.'
    });
  }

  insightsContainer.innerHTML = insights.map(function(item) {
    return '<div class="insight-item ' + item.type + '">' +
      '<span>💡</span>' +
      '<div>' + item.text + '</div>' +
      '</div>';
  }).join('');

  recoContainer.innerHTML = recos.map(function(item) {
    return '<div class="insight-item positive">' +
      '<span>🎯</span>' +
      '<div>' + item.text + '</div>' +
      '</div>';
  }).join('');
}

// ==========================================================================
// INCOME MODULE
// ==========================================================================
function renderIncomeModule() {
  var container = document.getElementById('income-table-body');
  if (!container) return;

  var currentMonthTxs = getFilteredTransactions().filter(function(tx) { return tx.type === 'income'; });

  var currSummary = calculateCashflowSummary();
  var yearVal = AppState.filter.year === 'all' ? new Date().getFullYear() : parseInt(AppState.filter.year, 10);
  var totalYearIncome = 0;
  AppState.transactions.forEach(function(tx) {
    if (tx.type === 'income' && tx.date) {
      if (new Date(tx.date).getFullYear() === yearVal) totalYearIncome += (Number(tx.amount) || 0);
    }
  });

  var elMonthTot = document.getElementById('income-stat-month');
  var elYearTot = document.getElementById('income-stat-year');
  if (elMonthTot) elMonthTot.textContent = formatRupiah(currSummary.income);
  if (elYearTot) elYearTot.textContent = formatRupiah(totalYearIncome);

  if (currentMonthTxs.length === 0) {
    container.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">' +
      'Belum ada data uang masuk untuk periode ini. Klik <strong>+ Tambah Pemasukan</strong> atau <strong>🔁 Salin Bulan Lalu</strong>.' +
      '</td></tr>';
    return;
  }

  container.innerHTML = currentMonthTxs.map(function(tx, idx) {
    return '<tr>' +
      '<td>' + (idx + 1) + '</td>' +
      '<td><strong>' + formatDateIndo(tx.date) + '</strong></td>' +
      '<td>' + escapeHtml(tx.source || tx.name || '-') + '</td>' +
      '<td><span class="badge badge-green">' + escapeHtml(tx.category) + '</span></td>' +
      '<td><strong style="color: var(--accent-green);">' + formatRupiah(tx.amount) + '</strong></td>' +
      '<td style="color: var(--text-muted); font-size: 0.84rem;">' + escapeHtml(tx.notes || '-') + '</td>' +
      '<td>' +
      '<div style="display: flex; gap: 6px;">' +
      '<button class="btn btn-secondary btn-sm" data-id="' + tx.id + '" onclick="openEditTransactionModal(this.dataset.id)">✏️</button>' +
      '<button class="btn btn-danger btn-sm" data-id="' + tx.id + '" onclick="confirmDeleteTransaction(this.dataset.id)">🗑️</button>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }).join('');
}

// ==========================================================================
// EXPENSE MODULE & DYNAMIC CATEGORIES
// ==========================================================================
function renderExpenseModule() {
  var container = document.getElementById('expense-table-body');
  if (!container) return;

  var currentMonthTxs = getFilteredTransactions().filter(function(tx) { return tx.type === 'expense'; });
  var currSummary = calculateCashflowSummary();

  var elMonthTot = document.getElementById('expense-stat-month');
  if (elMonthTot) elMonthTot.textContent = formatRupiah(currSummary.expense);

  if (currentMonthTxs.length === 0) {
    container.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">' +
      'Belum ada data uang keluar untuk periode ini. Klik <strong>+ Tambah Pengeluaran</strong> atau <strong>🔁 Salin Bulan Lalu</strong>.' +
      '</td></tr>';
    return;
  }

  container.innerHTML = currentMonthTxs.map(function(tx, idx) {
    var typeBadgeClass = 'badge-gray';
    if (tx.expenseType === 'Wajib') typeBadgeClass = 'badge-rose';
    if (tx.expenseType === 'Kebutuhan') typeBadgeClass = 'badge-blue';
    if (tx.expenseType === 'Keinginan') typeBadgeClass = 'badge-amber';
    if (tx.expenseType === 'Darurat') typeBadgeClass = 'badge-purple';

    return '<tr>' +
      '<td>' + (idx + 1) + '</td>' +
      '<td><strong>' + formatDateIndo(tx.date) + '</strong></td>' +
      '<td>' + escapeHtml(tx.name || '-') + '</td>' +
      '<td><span class="badge badge-rose">' + escapeHtml(tx.category) + '</span></td>' +
      '<td><span class="badge ' + typeBadgeClass + '">' + escapeHtml(tx.expenseType || 'Kebutuhan') + '</span></td>' +
      '<td><strong style="color: var(--accent-rose);">' + formatRupiah(tx.amount) + '</strong></td>' +
      '<td style="color: var(--text-muted); font-size: 0.84rem;">' + escapeHtml(tx.notes || '-') + '</td>' +
      '<td>' +
      '<div style="display: flex; gap: 6px;">' +
      '<button class="btn btn-secondary btn-sm" data-id="' + tx.id + '" onclick="openEditTransactionModal(this.dataset.id)">✏️</button>' +
      '<button class="btn btn-danger btn-sm" data-id="' + tx.id + '" onclick="confirmDeleteTransaction(this.dataset.id)">🗑️</button>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }).join('');
}

// -------------------------------------------------------------
// SAVINGS MODULE
// -------------------------------------------------------------
function renderSavingsModule() {
  var container = document.getElementById('savings-cards-grid');
  if (!container) return;

  if (AppState.savings.length === 0) {
    container.innerHTML = '<div class="empty-state-box" style="grid-column: 1 / -1;">' +
      '<div class="empty-state-icon">🏦</div>' +
      '<div class="empty-state-title">Belum ada target tabungan</div>' +
      '<p class="empty-state-text">Buat target tabungan seperti Dana Darurat, Tabungan Rumah, atau Pendidikan.</p>' +
      '<button class="btn btn-primary" onclick="openModal(\'modal-add-saving\')">+ Buat Target Tabungan</button>' +
      '</div>';
    return;
  }

  container.innerHTML = AppState.savings.map(function(s) {
    var cur = Number(s.currentAmount) || 0;
    var tgt = Number(s.targetAmount) || 1;
    var pct = Math.min(100, Math.round((cur / tgt) * 100));

    return '<div class="dash-panel-card" style="display: flex; flex-direction: column; justify-content: space-between;">' +
      '<div>' +
      '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">' +
      '<span class="badge ' + (s.isEmergencyFund ? 'badge-purple' : 'badge-blue') + '">' + (s.isEmergencyFund ? '🛡️ Dana Darurat' : '🎯 Target Tabungan') + '</span>' +
      '<button class="btn btn-secondary btn-sm" data-id="' + s.id + '" onclick="confirmDeleteSaving(this.dataset.id)" title="Hapus">✕</button>' +
      '</div>' +
      '<h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">' + escapeHtml(s.name) + '</h3>' +
      '<p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">' + escapeHtml(s.notes || '-') + '</p>' +
      '<div style="font-size: 1.4rem; font-weight: 900; color: var(--accent-purple); margin-bottom: 2px;">' + formatRupiah(cur) + '</div>' +
      '<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">Target: ' + formatRupiah(tgt) + ' (Sisa ' + formatRupiah(Math.max(0, tgt - cur)) + ')</div>' +
      '<div class="progress-bar-bg">' +
      '<div class="progress-bar-fill fill-purple" style="width: ' + pct + '%;"></div>' +
      '</div>' +
      '<div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">' +
      '<span>Terkumpul ' + pct + '%</span>' +
      '<span>Deadline: ' + (s.deadline ? formatDateIndo(s.deadline) : '-') + '</span>' +
      '</div>' +
      '</div>' +
      '<div style="display: flex; gap: 8px; margin-top: 18px;">' +
      '<button class="btn btn-outline btn-sm" style="flex: 1;" data-id="' + s.id + '" onclick="openDepositSavingModal(this.dataset.id)">➕ Setor Dana</button>' +
      '</div>' +
      '</div>';
  }).join('');
}

// -------------------------------------------------------------
// INSTALLMENTS MODULE
// -------------------------------------------------------------
function renderInstallmentsModule() {
  var container = document.getElementById('installments-table-body');
  if (!container) return;

  var totalActive = AppState.installments.filter(function(i) { return i.status === 'Aktif'; }).length;
  var totalMonthlyPayment = 0;
  var totalRemainingDebt = 0;

  AppState.installments.forEach(function(i) {
    if (i.status === 'Aktif') {
      totalMonthlyPayment += Number(i.monthlyAmount) || 0;
      totalRemainingDebt += Number(i.remainingLoan) || 0;
    }
  });

  var elActive = document.getElementById('inst-stat-active');
  var elMonthly = document.getElementById('inst-stat-monthly');
  var elRemaining = document.getElementById('inst-stat-remaining');

  if (elActive) elActive.textContent = totalActive + ' Cicilan';
  if (elMonthly) elMonthly.textContent = formatRupiah(totalMonthlyPayment);
  if (elRemaining) elRemaining.textContent = formatRupiah(totalRemainingDebt);

  if (AppState.installments.length === 0) {
    container.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">' +
      'Belum ada cicilan tercatat. Klik <strong>+ Tambah Cicilan</strong> jika memiliki kewajiban pinjaman/KPR.' +
      '</td></tr>';
    return;
  }

  container.innerHTML = AppState.installments.map(function(i, idx) {
    return '<tr>' +
      '<td>' + (idx + 1) + '</td>' +
      '<td><strong>' + escapeHtml(i.name) + '</strong></td>' +
      '<td><span class="badge badge-amber">' + escapeHtml(i.type) + '</span></td>' +
      '<td>' + formatRupiah(i.totalLoan) + '</td>' +
      '<td><strong style="color: var(--accent-rose);">' + formatRupiah(i.remainingLoan) + '</strong></td>' +
      '<td><strong>' + formatRupiah(i.monthlyAmount) + '</strong> / bln</td>' +
      '<td>Setiap Tgl <strong>' + escapeHtml(i.paymentDate || '10') + '</strong></td>' +
      '<td>' +
      '<div style="display: flex; gap: 6px;">' +
      '<button class="btn btn-primary btn-sm" data-id="' + i.id + '" onclick="payInstallmentPrompt(this.dataset.id)" title="Catat Pembayaran Bulan Ini">💳 Bayar</button>' +
      '<button class="btn btn-danger btn-sm" data-id="' + i.id + '" onclick="confirmDeleteInstallment(this.dataset.id)">🗑️</button>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }).join('');
}

// -------------------------------------------------------------
// MONTHLY PLOT MODULE (12 MONTHS MATRIX TABLE & CHART)
// -------------------------------------------------------------
function renderMonthlyModule() {
  var tableBody = document.getElementById('monthly-matrix-body');
  if (!tableBody) return;

  var yearVal = AppState.filter.year === 'all' ? new Date().getFullYear() : parseInt(AppState.filter.year, 10);
  var lbl = document.getElementById('monthly-plot-year-label');
  if (lbl) lbl.textContent = 'Tahun ' + yearVal;

  var monthlyList = [];
  var sumInc = 0, sumExp = 0, sumSav = 0, sumDebt = 0, sumBal = 0;

  for (var m = 0; m < 12; m++) {
    var s = calculateCashflowSummary(m, yearVal);
    monthlyList.push({ month: MONTH_NAMES[m], income: s.income, expense: s.expense, savings: s.savings, debt: s.debt, balance: s.balance });
    sumInc += s.income;
    sumExp += s.expense;
    sumSav += s.savings;
    sumDebt += s.debt;
    sumBal += s.balance;
  }

  tableBody.innerHTML = monthlyList.map(function(row) {
    return '<tr>' +
      '<td><strong>' + row.month + '</strong></td>' +
      '<td style="color: var(--accent-green); font-weight: 700;">' + formatRupiah(row.income) + '</td>' +
      '<td style="color: var(--accent-rose); font-weight: 700;">' + formatRupiah(row.expense) + '</td>' +
      '<td style="color: var(--accent-purple);">' + formatRupiah(row.savings) + '</td>' +
      '<td style="color: var(--accent-amber);">' + formatRupiah(row.debt) + '</td>' +
      '<td><strong style="color: ' + (row.balance >= 0 ? 'var(--primary-blue)' : 'var(--accent-rose)') + ';">' + formatRupiah(row.balance) + '</strong></td>' +
      '</tr>';
  }).join('') +
    '<tr style="background-color: var(--bg-surface-alt); font-weight: 800;">' +
    '<td>TOTAL ' + yearVal + '</td>' +
    '<td style="color: var(--accent-green);">' + formatRupiah(sumInc) + '</td>' +
    '<td style="color: var(--accent-rose);">' + formatRupiah(sumExp) + '</td>' +
    '<td style="color: var(--accent-purple);">' + formatRupiah(sumSav) + '</td>' +
    '<td style="color: var(--accent-amber);">' + formatRupiah(sumDebt) + '</td>' +
    '<td style="color: ' + (sumBal >= 0 ? 'var(--primary-blue)' : 'var(--accent-rose)') + ';">' + formatRupiah(sumBal) + '</td>' +
    '</tr>';

  var ctx = document.getElementById('chart-monthly-comparison');
  if (ctx && typeof Chart !== 'undefined') {
    if (AppState.charts.monthly) AppState.charts.monthly.destroy();

    AppState.charts.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTH_NAMES.map(function(name) { return name.substring(0, 3); }),
        datasets: [
          {
            label: 'Pemasukan',
            data: monthlyList.map(function(d) { return d.income; }),
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: 'Pengeluaran',
            data: monthlyList.map(function(d) { return d.expense; }),
            backgroundColor: '#f43f5e',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(item) { return item.dataset.label + ': ' + formatRupiah(item.raw); }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(val) { return 'Rp ' + (val >= 1000000 ? (val / 1000000) + ' Jt' : val); }
            }
          }
        }
      }
    });
  }
}

// -------------------------------------------------------------
// FINANCIAL HEALTH MODULE
// -------------------------------------------------------------
function renderFinancialHealthModule() {
  var health = calculateFinancialHealth();

  var scoreEl = document.getElementById('health-score-large');
  var badgeEl = document.getElementById('health-badge-status');
  var interpEl = document.getElementById('health-interpretation-text');

  if (scoreEl) scoreEl.textContent = health.score;
  if (badgeEl) {
    badgeEl.className = 'badge ' + health.badgeClass;
    badgeEl.textContent = health.category;
  }
  if (interpEl) interpEl.textContent = health.interpretation;

  var elCashflow = document.getElementById('health-metric-cashflow');
  var elSavRate = document.getElementById('health-metric-savings-rate');
  var elExpRatio = document.getElementById('health-metric-expense-ratio');
  var elDebtRatio = document.getElementById('health-metric-debt-ratio');
  var elRunway = document.getElementById('health-metric-runway');

  if (elCashflow) elCashflow.textContent = health.balanceStatus;
  if (elSavRate) elSavRate.textContent = health.savingsRate + '% (Target: >= 15%)';
  if (elExpRatio) elExpRatio.textContent = health.expenseRatio + '% (Target: <= 60%)';
  if (elDebtRatio) elDebtRatio.textContent = health.debtRatio + '% (Target: <= 30%)';
  if (elRunway) elRunway.textContent = health.emergencyFundRunwayMonths + ' Bulan (Target: 3–6 bln)';

  var scoreBar = document.getElementById('health-score-progress-fill');
  if (scoreBar) {
    scoreBar.style.width = health.score + '%';
    scoreBar.style.backgroundColor = health.color;
  }
}

// -------------------------------------------------------------
// HISTORY / LEDGER MODULE
// -------------------------------------------------------------
function renderHistoryModule() {
  var container = document.getElementById('history-table-body');
  if (!container) return;

  var txs = AppState.transactions.slice();

  var searchInput = document.getElementById('history-search');
  var searchVal = (searchInput ? searchInput.value : '').toLowerCase().trim();
  var typeSelect = document.getElementById('history-filter-type');
  var typeVal = typeSelect ? typeSelect.value : 'all';
  var catSelect = document.getElementById('history-filter-category');
  var catVal = catSelect ? catSelect.value : 'all';

  if (searchVal) {
    txs = txs.filter(function(t) {
      return (t.name || t.source || '').toLowerCase().includes(searchVal) || (t.notes || '').toLowerCase().includes(searchVal);
    });
  }
  if (typeVal !== 'all') {
    txs = txs.filter(function(t) { return t.type === typeVal; });
  }
  if (catVal !== 'all') {
    txs = txs.filter(function(t) { return t.category === catVal; });
  }

  txs.sort(function(a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });

  if (txs.length === 0) {
    container.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">' +
      'Tidak ada transaksi yang cocok dengan filter.' +
      '</td></tr>';
    return;
  }

  container.innerHTML = txs.map(function(tx, idx) {
    var typeBadge = '<span class="badge badge-green">Pemasukan</span>';
    var amtColor = 'var(--accent-green)';
    var prefix = '+ ';

    if (tx.type === 'expense') {
      typeBadge = '<span class="badge badge-rose">Pengeluaran</span>';
      amtColor = 'var(--accent-rose)';
      prefix = '- ';
    } else if (tx.type === 'saving') {
      typeBadge = '<span class="badge badge-purple">Tabungan</span>';
      amtColor = 'var(--accent-purple)';
      prefix = '→ ';
    }

    return '<tr>' +
      '<td>' + (idx + 1) + '</td>' +
      '<td><strong>' + formatDateIndo(tx.date) + '</strong></td>' +
      '<td>' + escapeHtml(tx.name || tx.source || '-') + '</td>' +
      '<td>' + typeBadge + '</td>' +
      '<td><span class="badge badge-gray">' + escapeHtml(tx.category) + '</span></td>' +
      '<td><strong style="color: ' + amtColor + ';">' + prefix + formatRupiah(tx.amount) + '</strong></td>' +
      '<td style="color: var(--text-muted); font-size: 0.84rem;">' + escapeHtml(tx.notes || '-') + '</td>' +
      '<td>' +
      '<div style="display: flex; gap: 6px;">' +
      '<button class="btn btn-secondary btn-sm" data-id="' + tx.id + '" onclick="openEditTransactionModal(this.dataset.id)">✏️</button>' +
      '<button class="btn btn-danger btn-sm" data-id="' + tx.id + '" onclick="confirmDeleteTransaction(this.dataset.id)">🗑️</button>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }).join('');
}

// -------------------------------------------------------------
// EXPORT & BACKUP MODULE
// -------------------------------------------------------------
function renderExportModule() {
  var elTx = document.getElementById('export-total-tx');
  var elSav = document.getElementById('export-total-sav');
  var elInst = document.getElementById('export-total-inst');

  if (elTx) elTx.textContent = AppState.transactions.length + ' Transaksi';
  if (elSav) elSav.textContent = AppState.savings.length + ' Target Tabungan';
  if (elInst) elInst.textContent = AppState.installments.length + ' Cicilan Terdaftar';
}

// -------------------------------------------------------------
// SETTINGS MODULE
// -------------------------------------------------------------
function renderSettingsModule() {
  var nameInp = document.getElementById('setting-family-name');
  if (nameInp) nameInp.value = AppState.settings.familyName || 'Keluarga Faletsa';

  renderCategoryPills('expense');
  renderCategoryPills('income');
}

function renderCategoryPills(type) {
  var container = document.getElementById('settings-' + type + '-categories');
  if (!container) return;

  var cats = type === 'expense' ? AppState.settings.expenseCategories : AppState.settings.incomeCategories;

  container.innerHTML = cats.map(function(cat) {
    return '<div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); padding: 5px 12px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">' +
      '<span>' + escapeHtml(cat) + '</span>' +
      '<button style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 0.9rem;" data-type="' + type + '" data-cat="' + escapeAttr(cat) + '" onclick="removeCustomCategory(this.dataset.type, this.dataset.cat)">✕</button>' +
      '</div>';
  }).join('');
}

async function addCustomCategory(type) {
  var inp = document.getElementById('input-new-' + type + '-category');
  if (!inp || !inp.value.trim()) return;

  var newCat = inp.value.trim();
  var key = type === 'expense' ? 'expenseCategories' : 'incomeCategories';

  if (!AppState.settings[key].includes(newCat)) {
    AppState.settings[key].push(newCat);
    await window.DB.put('settings', { key: key, value: AppState.settings[key] });
    inp.value = '';
    renderCategoryPills(type);
    populateFilterOptions();
    handleTxTypeChange();
    showToast('Kategori ' + newCat + ' berhasil ditambahkan!', 'success');
  } else {
    showToast('Kategori sudah ada.', 'warning');
  }
}

async function removeCustomCategory(type, catName) {
  var key = type === 'expense' ? 'expenseCategories' : 'incomeCategories';
  AppState.settings[key] = AppState.settings[key].filter(function(c) { return c !== catName; });
  await window.DB.put('settings', { key: key, value: AppState.settings[key] });
  renderCategoryPills(type);
  populateFilterOptions();
  handleTxTypeChange();
  showToast('Kategori ' + catName + ' dihapus.', 'info');
}

// ==========================================================================
// TRANSACTIONS CRUD (ADD, EDIT, DELETE)
// ==========================================================================
async function handleTransactionFormSubmit(e) {
  if (e) e.preventDefault();

  try {
    var type = document.getElementById('tx-type').value;
    var date = document.getElementById('tx-date').value;
    var name = document.getElementById('tx-name').value.trim();
    var categorySelect = document.getElementById('tx-category');
    var category = categorySelect ? categorySelect.value : '';
    var amount = parseRupiahInput(document.getElementById('tx-amount').value);
    var notes = document.getElementById('tx-notes').value.trim();
    var expTypeSelect = document.getElementById('tx-expense-type');
    var expenseType = expTypeSelect ? expTypeSelect.value : 'Kebutuhan';

    if (!date) {
      showToast('Tanggal transaksi wajib diisi.', 'error');
      return;
    }
    if (!name) {
      showToast('Nama / Sumber transaksi wajib diisi.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Nominal harus lebih besar dari Rp 0.', 'error');
      return;
    }

    if (!category) {
      category = type === 'income' ? 'Gaji' : (type === 'saving' ? 'Tabungan' : 'Lainnya');
    }

    var id = AppState.editingTransactionId || window.DB.generateId('tx');

    var txData = {
      id: id,
      type: type,
      date: date,
      name: name,
      source: name,
      category: category,
      amount: amount,
      notes: notes,
      expenseType: type === 'expense' ? expenseType : null,
      updatedAt: new Date().toISOString()
    };

    var existingIdx = AppState.transactions.findIndex(function(t) { return t.id === id; });
    if (existingIdx >= 0) {
      AppState.transactions[existingIdx] = txData;
    } else {
      AppState.transactions.unshift(txData);
    }

    await window.DB.put('transactions', txData);

    closeModal('modal-add-transaction');
    showToast(AppState.editingTransactionId ? 'Transaksi berhasil diperbarui!' : 'Transaksi berhasil dicatat!', 'success');
    AppState.editingTransactionId = null;

    renderApp();
  } catch (err) {
    console.error('Submit transaction error:', err);
    showToast('Gagal menyimpan transaksi: ' + (err.message || 'Error internal'), 'error');
  }
}

function openAddTransactionModal(presetType) {
  var pType = presetType || 'expense';
  AppState.editingTransactionId = null;
  var titleEl = document.getElementById('tx-modal-title');
  if (titleEl) titleEl.textContent = 'Tambah Transaksi Baru';

  var form = document.getElementById('form-transaction');
  if (form) form.reset();

  var typeSelect = document.getElementById('tx-type');
  if (typeSelect) {
    typeSelect.value = pType;
  }
  handleTxTypeChange();

  var dateInp = document.getElementById('tx-date');
  if (dateInp) dateInp.value = new Date().toISOString().split('T')[0];

  openModal('modal-add-transaction');
}

function openEditTransactionModal(id) {
  var tx = AppState.transactions.find(function(t) { return t.id === id; });
  if (!tx) return;

  AppState.editingTransactionId = id;
  var titleEl = document.getElementById('tx-modal-title');
  if (titleEl) titleEl.textContent = 'Edit Transaksi';

  var typeSelect = document.getElementById('tx-type');
  if (typeSelect) typeSelect.value = tx.type;
  handleTxTypeChange();

  var dateInp = document.getElementById('tx-date');
  if (dateInp) dateInp.value = tx.date;

  var nameInp = document.getElementById('tx-name');
  if (nameInp) nameInp.value = tx.name || tx.source || '';

  var amtInp = document.getElementById('tx-amount');
  if (amtInp) amtInp.value = formatRupiah(tx.amount);

  var notesInp = document.getElementById('tx-notes');
  if (notesInp) notesInp.value = tx.notes || '';

  var catSelect = document.getElementById('tx-category');
  if (catSelect) catSelect.value = tx.category;

  var expTypeSelect = document.getElementById('tx-expense-type');
  if (expTypeSelect && tx.expenseType) expTypeSelect.value = tx.expenseType;

  openModal('modal-add-transaction');
}

async function confirmDeleteTransaction(id) {
  if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Data tidak dapat dikembalikan.')) {
    AppState.transactions = AppState.transactions.filter(function(t) { return t.id !== id; });
    await window.DB.delete('transactions', id);
    showToast('Transaksi berhasil dihapus.', 'info');
    renderApp();
  }
}

function handleTxTypeChange() {
  var typeSelect = document.getElementById('tx-type');
  var type = typeSelect ? typeSelect.value : 'expense';
  var catSelect = document.getElementById('tx-category');
  var expTypeGroup = document.getElementById('group-expense-type');

  if (!catSelect) return;

  var categories = [];
  if (type === 'income') {
    categories = AppState.settings.incomeCategories || [];
    if (expTypeGroup) expTypeGroup.style.display = 'none';
  } else if (type === 'expense') {
    categories = AppState.settings.expenseCategories || [];
    if (expTypeGroup) expTypeGroup.style.display = 'block';
  } else if (type === 'saving') {
    categories = ['Tabungan', 'Dana Darurat', 'Investasi'];
    if (expTypeGroup) expTypeGroup.style.display = 'none';
  }

  catSelect.innerHTML = categories.map(function(c) {
    return '<option value="' + escapeAttr(c) + '">' + escapeHtml(c) + '</option>';
  }).join('');
}

// ==========================================================================
// 🔁 SMART FEATURE: SALIN TRANSAKSI DARI BULAN SEBELUMNYA
// ==========================================================================
function openCopyPreviousMonthModal(presetFilter) {
  var currMonth = AppState.filter.month === 'all' ? new Date().getMonth() : parseInt(AppState.filter.month, 10);
  var currYear = AppState.filter.year === 'all' ? new Date().getFullYear() : parseInt(AppState.filter.year, 10);

  var srcMonth = currMonth - 1;
  var srcYear = currYear;
  if (srcMonth < 0) {
    srcMonth = 11;
    srcYear -= 1;
  }

  var srcMonthSelect = document.getElementById('copy-src-month');
  var tgtMonthSelect = document.getElementById('copy-target-month');
  var srcYearSelect = document.getElementById('copy-src-year');
  var tgtYearSelect = document.getElementById('copy-target-year');

  var monthOpts = MONTH_NAMES.map(function(name, idx) {
    return '<option value="' + idx + '">' + name + '</option>';
  }).join('');

  var yearOpts = '<option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option>';

  if (srcMonthSelect) {
    srcMonthSelect.innerHTML = monthOpts;
    srcMonthSelect.value = srcMonth;
  }
  if (tgtMonthSelect) {
    tgtMonthSelect.innerHTML = monthOpts;
    tgtMonthSelect.value = currMonth;
  }
  if (srcYearSelect) {
    srcYearSelect.innerHTML = yearOpts;
    srcYearSelect.value = srcYear;
  }
  if (tgtYearSelect) {
    tgtYearSelect.innerHTML = yearOpts;
    tgtYearSelect.value = currYear;
  }

  var chkInc = document.getElementById('copy-filter-inc');
  var chkExp = document.getElementById('copy-filter-exp');
  var chkSav = document.getElementById('copy-filter-sav');

  if (presetFilter === 'income') {
    if (chkInc) chkInc.checked = true;
    if (chkExp) chkExp.checked = false;
    if (chkSav) chkSav.checked = false;
  } else if (presetFilter === 'expense') {
    if (chkInc) chkInc.checked = false;
    if (chkExp) chkExp.checked = true;
    if (chkSav) chkSav.checked = false;
  } else {
    if (chkInc) chkInc.checked = true;
    if (chkExp) chkExp.checked = true;
    if (chkSav) chkSav.checked = true;
  }

  renderCopyMonthPreview();
  openModal('modal-copy-month');
}

function calculateTargetDate(sourceDateStr, targetYear, targetMonthIndex) {
  var d = new Date(sourceDateStr);
  var day = isNaN(d.getDate()) ? 1 : d.getDate();
  var maxDays = new Date(targetYear, targetMonthIndex + 1, 0).getDate();
  var finalDay = Math.min(day, maxDays);
  var padMonth = String(targetMonthIndex + 1);
  if (padMonth.length === 1) padMonth = '0' + padMonth;
  var padDay = String(finalDay);
  if (padDay.length === 1) padDay = '0' + padDay;
  return targetYear + '-' + padMonth + '-' + padDay;
}

function renderCopyMonthPreview() {
  var srcMonth = parseInt(document.getElementById('copy-src-month').value, 10);
  var srcYear = parseInt(document.getElementById('copy-src-year').value, 10);
  var tgtMonth = parseInt(document.getElementById('copy-target-month').value, 10);
  var tgtYear = parseInt(document.getElementById('copy-target-year').value, 10);

  var incChecked = document.getElementById('copy-filter-inc').checked;
  var expChecked = document.getElementById('copy-filter-exp').checked;
  var savChecked = document.getElementById('copy-filter-sav').checked;

  var sourceTxs = AppState.transactions.filter(function(tx) {
    if (!tx.date) return false;
    var d = new Date(tx.date);
    if (d.getFullYear() !== srcYear || d.getMonth() !== srcMonth) return false;
    if (tx.type === 'income' && !incChecked) return false;
    if (tx.type === 'expense' && !expChecked) return false;
    if (tx.type === 'saving' && !savChecked) return false;
    return true;
  });

  var tableBody = document.getElementById('copy-preview-table-body');
  if (!tableBody) return;

  if (sourceTxs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: var(--text-muted);">' +
      'Tidak ada transaksi di <strong>' + MONTH_NAMES[srcMonth] + ' ' + srcYear + '</strong> yang sesuai kriteria filter.' +
      '</td></tr>';
    updateCopySelectionSummary(0, 0, 0);
    return;
  }

  tableBody.innerHTML = sourceTxs.map(function(tx, idx) {
    var targetDate = calculateTargetDate(tx.date, tgtYear, tgtMonth);
    var typeBadge = '<span class="badge badge-green">Masuk</span>';
    var amtColor = 'var(--accent-green)';
    if (tx.type === 'expense') {
      typeBadge = '<span class="badge badge-rose">Keluar</span>';
      amtColor = 'var(--accent-rose)';
    } else if (tx.type === 'saving') {
      typeBadge = '<span class="badge badge-purple">Tabungan</span>';
      amtColor = 'var(--accent-purple)';
    }

    return '<tr>' +
      '<td style="text-align: center;">' +
      '<input type="checkbox" class="copy-item-checkbox" data-txid="' + tx.id + '" data-type="' + tx.type + '" data-amount="' + tx.amount + '" checked onchange="updateCopySelectionSummary()">' +
      '</td>' +
      '<td><strong style="color: var(--primary-blue);">' + formatDateIndo(targetDate) + '</strong></td>' +
      '<td>' + escapeHtml(tx.name || tx.source || '-') + '</td>' +
      '<td>' + typeBadge + ' <span class="badge badge-gray">' + escapeHtml(tx.category) + '</span></td>' +
      '<td><strong style="color: ' + amtColor + ';">' + formatRupiah(tx.amount) + '</strong></td>' +
      '</tr>';
  }).join('');

  updateCopySelectionSummary();
}

function toggleSelectAllCopy(isChecked) {
  document.querySelectorAll('.copy-item-checkbox').forEach(function(cb) {
    cb.checked = isChecked;
  });
  var masterCb = document.getElementById('copy-master-checkbox');
  if (masterCb) masterCb.checked = isChecked;
  updateCopySelectionSummary();
}

function updateCopySelectionSummary() {
  var checkboxes = document.querySelectorAll('.copy-item-checkbox:checked');
  var totalSelected = checkboxes.length;

  var totalInc = 0;
  var totalExp = 0;

  checkboxes.forEach(function(cb) {
    var type = cb.dataset.type;
    var amt = Number(cb.dataset.amount) || 0;
    if (type === 'income') totalInc += amt;
    else if (type === 'expense') totalExp += amt;
  });

  var countEl = document.getElementById('copy-selected-count');
  var totalsEl = document.getElementById('copy-selected-totals');
  var btnText = document.getElementById('copy-btn-text');
  var btnExec = document.getElementById('btn-execute-copy');

  if (countEl) countEl.textContent = totalSelected + ' transaksi dipilih untuk disalin';
  if (totalsEl) totalsEl.textContent = 'Total Masuk: ' + formatRupiah(totalInc) + ' • Total Keluar: ' + formatRupiah(totalExp);
  if (btnText) btnText.textContent = totalSelected > 0 ? 'Salin ' + totalSelected + ' Transaksi Sekarang' : 'Pilih Transaksi';
  if (btnExec) btnExec.disabled = totalSelected === 0;
}

async function executeCopyMonthTransactions() {
  var checkboxes = document.querySelectorAll('.copy-item-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('Pilih setidaknya 1 transaksi untuk disalin.', 'warning');
    return;
  }

  var tgtMonth = parseInt(document.getElementById('copy-target-month').value, 10);
  var tgtYear = parseInt(document.getElementById('copy-target-year').value, 10);

  var selectedIds = [];
  checkboxes.forEach(function(cb) {
    selectedIds.push(cb.dataset.txid);
  });

  var copiedCount = 0;
  for (var i = 0; i < selectedIds.length; i++) {
    var srcTx = AppState.transactions.find(function(t) { return t.id === selectedIds[i]; });
    if (!srcTx) continue;

    var targetDate = calculateTargetDate(srcTx.date, tgtYear, tgtMonth);

    var newTx = {
      id: window.DB.generateId('tx'),
      type: srcTx.type,
      date: targetDate,
      name: srcTx.name || srcTx.source,
      source: srcTx.source || srcTx.name,
      category: srcTx.category,
      amount: srcTx.amount,
      expenseType: srcTx.expenseType || null,
      isInstallment: srcTx.isInstallment || false,
      targetId: srcTx.targetId || null,
      notes: srcTx.notes ? srcTx.notes + ' (Disalin otomatis)' : 'Disalin dari bulan lalu',
      isCopied: true,
      updatedAt: new Date().toISOString()
    };

    AppState.transactions.unshift(newTx);
    await window.DB.put('transactions', newTx);
    copiedCount++;
  }

  closeModal('modal-copy-month');
  showToast('Berhasil menyalin ' + copiedCount + ' transaksi ke ' + MONTH_NAMES[tgtMonth] + ' ' + tgtYear + '!', 'success');

  AppState.filter.month = tgtMonth;
  AppState.filter.year = tgtYear;
  var fMonth = document.getElementById('filter-month');
  var fYear = document.getElementById('filter-year');
  if (fMonth) fMonth.value = tgtMonth;
  if (fYear) fYear.value = tgtYear;

  renderApp();
}

// -------------------------------------------------------------
// SAVINGS CRUD & SETOR DANA
// -------------------------------------------------------------
async function handleSavingFormSubmit(e) {
  if (e) e.preventDefault();
  try {
    var name = document.getElementById('saving-name').value.trim();
    var target = parseRupiahInput(document.getElementById('saving-target').value);
    var current = parseRupiahInput(document.getElementById('saving-current').value);
    var deadline = document.getElementById('saving-deadline').value;
    var notes = document.getElementById('saving-notes').value.trim();
    var isEmergency = document.getElementById('saving-is-emergency').checked;

    if (!name || target <= 0) {
      showToast('Nama target dan nominal target wajib diisi.', 'error');
      return;
    }

    var savingObj = {
      id: window.DB.generateId('sav'),
      name: name,
      targetAmount: target,
      currentAmount: current,
      deadline: deadline,
      notes: notes,
      isEmergencyFund: isEmergency,
      createdAt: new Date().toISOString()
    };

    AppState.savings.push(savingObj);
    await window.DB.put('savings', savingObj);
    closeModal('modal-add-saving');
    showToast('Target tabungan berhasil dibuat!', 'success');
    renderApp();
  } catch (err) {
    showToast('Gagal membuat target tabungan: ' + err.message, 'error');
  }
}

function openDepositSavingModal(savingId) {
  var saving = AppState.savings.find(function(s) { return s.id === savingId; });
  if (!saving) return;

  document.getElementById('deposit-saving-id').value = savingId;
  document.getElementById('deposit-saving-name').textContent = saving.name;
  document.getElementById('deposit-amount').value = '';
  openModal('modal-deposit-saving');
}

async function handleDepositSavingSubmit(e) {
  if (e) e.preventDefault();
  try {
    var savingId = document.getElementById('deposit-saving-id').value;
    var amount = parseRupiahInput(document.getElementById('deposit-amount').value);
    var recordExpense = document.getElementById('deposit-record-expense').checked;

    if (amount <= 0) {
      showToast('Masukkan nominal setoran yang valid.', 'error');
      return;
    }

    var saving = AppState.savings.find(function(s) { return s.id === savingId; });
    if (!saving) return;

    saving.currentAmount = (Number(saving.currentAmount) || 0) + amount;
    await window.DB.put('savings', saving);

    if (recordExpense) {
      var txSaving = {
        id: window.DB.generateId('tx'),
        type: 'saving',
        date: new Date().toISOString().split('T')[0],
        name: 'Setoran: ' + saving.name,
        source: 'Setoran: ' + saving.name,
        category: 'Tabungan',
        amount: amount,
        targetId: savingId,
        notes: 'Setoran tabungan via modul tabungan'
      };
      AppState.transactions.unshift(txSaving);
      await window.DB.put('transactions', txSaving);
    }

    closeModal('modal-deposit-saving');
    showToast('Berhasil menyetor ' + formatRupiah(amount) + ' ke ' + saving.name + '!', 'success');
    renderApp();
  } catch (err) {
    showToast('Gagal menyetor dana: ' + err.message, 'error');
  }
}

async function confirmDeleteSaving(id) {
  if (confirm('Hapus target tabungan ini?')) {
    AppState.savings = AppState.savings.filter(function(s) { return s.id !== id; });
    await window.DB.delete('savings', id);
    showToast('Target tabungan dihapus.', 'info');
    renderApp();
  }
}

// -------------------------------------------------------------
// INSTALLMENTS CRUD & BAYAR CICILAN
// -------------------------------------------------------------
async function handleInstallmentFormSubmit(e) {
  if (e) e.preventDefault();
  try {
    var name = document.getElementById('inst-name').value.trim();
    var type = document.getElementById('inst-type').value;
    var totalLoan = parseRupiahInput(document.getElementById('inst-total').value);
    var remainingLoan = parseRupiahInput(document.getElementById('inst-remaining').value);
    var monthlyAmount = parseRupiahInput(document.getElementById('inst-monthly').value);
    var paymentDate = document.getElementById('inst-date').value.trim();
    var notes = document.getElementById('inst-notes').value.trim();

    if (!name || monthlyAmount <= 0) {
      showToast('Nama dan nominal cicilan per bulan wajib diisi.', 'error');
      return;
    }

    var instObj = {
      id: window.DB.generateId('inst'),
      name: name,
      type: type,
      totalLoan: totalLoan,
      remainingLoan: remainingLoan || totalLoan,
      monthlyAmount: monthlyAmount,
      paymentDate: paymentDate || '10',
      status: 'Aktif',
      notes: notes,
      createdAt: new Date().toISOString()
    };

    AppState.installments.push(instObj);
    await window.DB.put('installments', instObj);
    closeModal('modal-add-installment');
    showToast('Cicilan berhasil ditambahkan!', 'success');
    renderApp();
  } catch (err) {
    showToast('Gagal menambahkan cicilan: ' + err.message, 'error');
  }
}

async function payInstallmentPrompt(installmentId) {
  var inst = AppState.installments.find(function(i) { return i.id === installmentId; });
  if (!inst) return;

  if (confirm('Catat pembayaran cicilan "' + inst.name + '" sebesar ' + formatRupiah(inst.monthlyAmount) + ' ke pengeluaran bulan ini?')) {
    inst.remainingLoan = Math.max(0, (Number(inst.remainingLoan) || 0) - Number(inst.monthlyAmount));
    if (inst.remainingLoan === 0) inst.status = 'Lunas';
    await window.DB.put('installments', inst);

    var txExp = {
      id: window.DB.generateId('tx'),
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      name: 'Bayar Cicilan: ' + inst.name,
      category: 'Cicilan',
      expenseType: 'Wajib',
      amount: inst.monthlyAmount,
      isInstallment: true,
      notes: 'Pembayaran cicilan bulanan'
    };
    AppState.transactions.unshift(txExp);
    await window.DB.put('transactions', txExp);

    showToast('Pembayaran cicilan ' + inst.name + ' berhasil dicatat ke pengeluaran!', 'success');
    renderApp();
  }
}

async function confirmDeleteInstallment(id) {
  if (confirm('Hapus pencatatan cicilan ini?')) {
    AppState.installments = AppState.installments.filter(function(i) { return i.id !== id; });
    await window.DB.delete('installments', id);
    showToast('Cicilan dihapus.', 'info');
    renderApp();
  }
}

// ==========================================================================
// BACKUP, RESTORE & EXPORTS
// ==========================================================================
async function exportToCSV() {
  var txs = AppState.transactions;
  if (txs.length === 0) {
    showToast('Belum ada transaksi untuk diekspor.', 'warning');
    return;
  }

  var csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'No,Tanggal,Tipe,Kategori,Nama/Sumber,Nominal,Tipe Pengeluaran,Catatan\n';

  txs.forEach(function(t, idx) {
    csvContent += '"' + (idx + 1) + '","' + (t.date || '') + '","' + t.type + '","' + t.category + '","' + (t.name || t.source || '').replace(/"/g, '""') + '","' + t.amount + '","' + (t.expenseType || '') + '","' + (t.notes || '').replace(/"/g, '""') + '"\n';
  });

  downloadFile(csvContent, 'Cashflow_Faletsa_' + new Date().toISOString().slice(0, 10) + '.csv');
  showToast('File CSV berhasil diunduh.', 'success');
}

async function backupToJSON() {
  var backup = await window.DB.exportAllData();
  var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  downloadFile(dataStr, 'Backup_Cashflow_Faletsa_' + new Date().toISOString().slice(0, 10) + '.json');
  showToast('Backup data JSON berhasil diunduh!', 'success');
}

async function handleRestoreJSON(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = async function(e) {
    try {
      var parsed = JSON.parse(e.target.result);
      if (confirm('Restore data akan menimpa data yang ada saat ini. Lanjutkan restore?')) {
        await window.DB.importAllData(parsed);
        await reloadStateData();
        showToast('Data berhasil dipulihkan dari file backup!', 'success');
        renderApp();
      }
    } catch (err) {
      showToast('Gagal memulihkan data: Format file tidak sesuai.', 'error');
    }
  };
  reader.readAsText(file);
}

function printReport() {
  window.print();
}

function downloadFile(content, fileName) {
  var link = document.createElement('a');
  link.setAttribute('href', content);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// DEMO DATA MANAGEMENT
// ==========================================================================
async function loadDemoData(silent) {
  if (typeof DEMO_DATA === 'undefined') return;

  for (var i = 0; i < DEMO_DATA.settings.length; i++) {
    var s = DEMO_DATA.settings[i];
    await window.DB.put('settings', s);
    AppState.settings[s.key] = s.value;
  }
  for (var j = 0; j < DEMO_DATA.savings.length; j++) {
    await window.DB.put('savings', DEMO_DATA.savings[j]);
  }
  for (var k = 0; k < DEMO_DATA.installments.length; k++) {
    await window.DB.put('installments', DEMO_DATA.installments[k]);
  }
  for (var t = 0; t < DEMO_DATA.transactions.length; t++) {
    await window.DB.put('transactions', DEMO_DATA.transactions[t]);
  }

  await reloadStateData();
  if (!silent) showToast('Data demo Keluarga Faletsa berhasil dimuat!', 'success');
  renderApp();
}

async function clearAllDemoData() {
  if (confirm('Hapus seluruh data demo? Data demo akan dihapus permanen agar Anda dapat mencatat data riil.')) {
    var txs = await window.DB.getAll('transactions');
    for (var i = 0; i < txs.length; i++) {
      if (txs[i].isDemo) await window.DB.delete('transactions', txs[i].id);
    }
    var savs = await window.DB.getAll('savings');
    for (var j = 0; j < savs.length; j++) {
      if (savs[j].isDemo) await window.DB.delete('savings', savs[j].id);
    }
    var insts = await window.DB.getAll('installments');
    for (var k = 0; k < insts.length; k++) {
      if (insts[k].isDemo) await window.DB.delete('installments', insts[k].id);
    }

    AppState.settings.isDemoActive = false;
    await window.DB.put('settings', { key: 'isDemoActive', value: false });

    await reloadStateData();
    showToast('Seluruh data demo berhasil dibersihkan.', 'success');
    renderApp();
  }
}

async function resetAllData() {
  if (confirm('⚠️ PERINGATAN: Seluruh transaksi, tabungan, cicilan, dan kategori akan DIHAPUS TOTAL. Lanjutkan?')) {
    await window.DB.clear('transactions');
    await window.DB.clear('savings');
    await window.DB.clear('installments');
    await window.DB.clear('settings');

    AppState.settings.isDemoActive = false;
    await reloadStateData();
    showToast('Aplikasi berhasil di-reset bersih.', 'info');
    renderApp();
  }
}

// ==========================================================================
// THEME & UI HELPERS
// ==========================================================================
function toggleTheme() {
  var current = AppState.settings.theme || 'light';
  var newTheme = current === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  AppState.settings.theme = newTheme;
  window.DB.put('settings', { key: 'theme', value: newTheme });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleMobileSidebar() {
  var sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  var sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
}

function openModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function populateFilterOptions() {
  var monthSelect = document.getElementById('filter-month');
  if (monthSelect) {
    var curr = AppState.filter.month;
    var html = '<option value="all">Semua Bulan</option>';
    MONTH_NAMES.forEach(function(name, idx) {
      html += '<option value="' + idx + '" ' + (curr === idx ? 'selected' : '') + '>' + name + '</option>';
    });
    monthSelect.innerHTML = html;
  }

  var catFilter = document.getElementById('history-filter-category');
  if (catFilter) {
    var allCats = (AppState.settings.expenseCategories || []).concat(AppState.settings.incomeCategories || []);
    var uniqueCats = Array.from(new Set(allCats));
    catFilter.innerHTML = '<option value="all">Semua Kategori</option>' +
      uniqueCats.map(function(c) { return '<option value="' + escapeAttr(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
  }

  // Currency auto-format on input
  document.querySelectorAll('.input-currency').forEach(function(input) {
    input.addEventListener('input', function(e) {
      var val = parseRupiahInput(e.target.value);
      e.target.value = val > 0 ? formatRupiah(val) : '';
    });
  });
}

function setupEventListeners() {
  var monthSelect = document.getElementById('filter-month');
  var yearSelect = document.getElementById('filter-year');

  if (monthSelect) {
    monthSelect.addEventListener('change', function(e) {
      AppState.filter.month = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
      renderApp();
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', function(e) {
      AppState.filter.year = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
      renderApp();
    });
  }

  document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
    backdrop.addEventListener('click', function(e) {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  });
}

// Explicit global bindings for inline HTML event handlers
window.setView = setView;
window.openAddTransactionModal = openAddTransactionModal;
window.openEditTransactionModal = openEditTransactionModal;
window.confirmDeleteTransaction = confirmDeleteTransaction;
window.handleTransactionFormSubmit = handleTransactionFormSubmit;
window.handleTxTypeChange = handleTxTypeChange;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleTheme = toggleTheme;
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.handleSavingFormSubmit = handleSavingFormSubmit;
window.openDepositSavingModal = openDepositSavingModal;
window.handleDepositSavingSubmit = handleDepositSavingSubmit;
window.confirmDeleteSaving = confirmDeleteSaving;
window.handleInstallmentFormSubmit = handleInstallmentFormSubmit;
window.payInstallmentPrompt = payInstallmentPrompt;
window.confirmDeleteInstallment = confirmDeleteInstallment;
window.exportToCSV = exportToCSV;
window.backupToJSON = backupToJSON;
window.handleRestoreJSON = handleRestoreJSON;
window.printReport = printReport;
window.loadDemoData = loadDemoData;
window.clearAllDemoData = clearAllDemoData;
window.resetAllData = resetAllData;
window.addCustomCategory = addCustomCategory;
window.removeCustomCategory = removeCustomCategory;
window.renderHistoryModule = renderHistoryModule;

// Copy Previous Month Bindings
window.openCopyPreviousMonthModal = openCopyPreviousMonthModal;
window.renderCopyMonthPreview = renderCopyMonthPreview;
window.toggleSelectAllCopy = toggleSelectAllCopy;
window.updateCopySelectionSummary = updateCopySelectionSummary;
window.executeCopyMonthTransactions = executeCopyMonthTransactions;

// PIN Security Bindings
window.inputPinDigit = inputPinDigit;
window.deletePinDigit = deletePinDigit;
window.clearPin = clearPin;
window.verifyPin = verifyPin;
window.lockApp = lockApp;

// Initialize on DOMContentLoaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCashflowApp);
} else {
  initCashflowApp();
}