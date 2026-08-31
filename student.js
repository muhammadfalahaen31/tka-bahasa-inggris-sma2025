// ==========================================
// MPI TKA BAHASA INGGRIS SMA 2025 (20 SOAL) — STUDENT MODE LOGIC
// Student Worksheet & Critical Reasoning Engine
// ==========================================

const STUDENT_STORAGE_KEY = 'mpi_student_worksheet_20soal_v1';
const THEME_KEY = 'mpi_tka_theme';

const StudentState = {
  currentView: 'dashboard', // 'dashboard', 'student_workspace', 'vocab_lab', 'tka_strategy', 'worksheet_summary'
  selectedTextId: 1,
  currentQuestionIndex: 0,

  // Student Identity
  profile: {
    name: '',
    class: '',
    school: 'SMA Plus PGRI Cibinong'
  },

  // Student Answers & Written Reason
  answers: {}, // { [qId]: { answer: any, reason: string, timestamp: number } }

  // Mobile View Switcher
  mobileActiveTab: 'read', // 'read' or 'quiz'

  // Typography
  fontSizeLevel: 0,
  fontFamily: 'serif',
  theme: 'light',

  // Vocab Lab state
  vocabFilter: 'all',
  vocabActivity: 'flipcard',
  matchingState: { selectedLeft: null, selectedRight: null, matchedPairs: [] },
  contextQuizState: { currentIndex: 0, score: 0, answered: false }
};

// ==========================================
// INITIALIZATION
// ==========================================
function initStudentApp() {
  loadStudentTheme();
  loadStudentData();
  setupStudentEvents();
  renderStudentApp();
}

function loadStudentTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  StudentState.theme = savedTheme;
  applyStudentTheme(savedTheme);
}

function toggleStudentTheme() {
  const newTheme = StudentState.theme === 'light' ? 'dark' : 'light';
  StudentState.theme = newTheme;
  localStorage.setItem(THEME_KEY, newTheme);
  applyStudentTheme(newTheme);
}

function applyStudentTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  if (themeIcon && themeLabel) {
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark';
    }
  }
}

function loadStudentData() {
  try {
    const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.profile) StudentState.profile = parsed.profile;
      if (parsed.answers) StudentState.answers = parsed.answers;
    }
  } catch (e) {
    console.error('Failed to load student progress', e);
  }

  // Restore input fields
  const nameInp = document.getElementById('input-student-name');
  const classInp = document.getElementById('input-student-class');
  if (nameInp && StudentState.profile.name) nameInp.value = StudentState.profile.name;
  if (classInp && StudentState.profile.class) classInp.value = StudentState.profile.class;
}

function saveStudentData() {
  try {
    const payload = {
      profile: StudentState.profile,
      answers: StudentState.answers
    };
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save student progress', e);
  }
}

function saveStudentProfile() {
  const nameInp = document.getElementById('input-student-name');
  const classInp = document.getElementById('input-student-class');
  if (nameInp) StudentState.profile.name = nameInp.value.trim();
  if (classInp) StudentState.profile.class = classInp.value.trim();
  saveStudentData();
}

function showStudentToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Audio Pronunciation
function speakWord(word) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    showStudentToast('Speech synthesis not supported in this browser.', 'error');
  }
}

// ==========================================
// ROUTING & VIEW CONTROLLERS
// ==========================================
function setStudentView(viewName, textId = null) {
  StudentState.currentView = viewName;
  if (textId) StudentState.selectedTextId = textId;

  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const activeViewEl = document.getElementById(`view-${viewName}`);
  if (activeViewEl) activeViewEl.classList.add('active');

  const activeNavEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNavEl) activeNavEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderStudentApp();
}

function renderStudentApp() {
  if (StudentState.currentView === 'dashboard') {
    renderStudentDashboard();
  } else if (StudentState.currentView === 'student_workspace') {
    renderStudentWorkspace();
  } else if (StudentState.currentView === 'vocab_lab') {
    renderStudentVocabLab();
  } else if (StudentState.currentView === 'tka_strategy') {
    renderStudentTKAStrategy();
  } else if (StudentState.currentView === 'worksheet_summary') {
    renderStudentWorksheetSummary();
  }
}

// ==========================================
// STUDENT DASHBOARD
// ==========================================
function renderStudentDashboard() {
  const totalQuestions = TKA_DATA.questions.length;
  let answeredCount = 0;
  let reasonedCount = 0;

  TKA_DATA.questions.forEach(q => {
    const rec = StudentState.answers[q.id];
    if (rec && rec.answer !== undefined && rec.answer !== null) {
      answeredCount++;
      if (rec.reason && rec.reason.trim().length > 0) {
        reasonedCount++;
      }
    }
  });

  const ansEl = document.getElementById('student-stat-answered');
  if (ansEl) ansEl.textContent = `${answeredCount}/${totalQuestions}`;
  const resEl = document.getElementById('student-stat-reasoned');
  if (resEl) resEl.textContent = `${reasonedCount}/${totalQuestions}`;

  const cardsContainer = document.getElementById('student-dashboard-cards');
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';

  const genreMeta = [
    { genre: "Narrative Text (Fable)", barClass: "theme-bar-1", excerpt: "Once upon a time, in a thick jungle in Africa, there lived a strong and fierce lion. Every afternoon, the lion would rest under the cool shade..." },
    { genre: "Infographic / Procedure Text", barClass: "theme-bar-2", excerpt: "Rangkuman Elemen & Poin Infografis 'Effective Study Techniques': Know your learning style, Pomodoro technique, comfortable study space..." },
    { genre: "Narrative Text (Fable / Story)", barClass: "theme-bar-3", excerpt: "Once upon a time, in Africa, there lived two lion kings. One was named Hera and the other was Shero. Hera was very strong and handsome..." },
    { genre: "Descriptive Text", barClass: "theme-bar-4", excerpt: "The Great Barrier Reef is one of the most beautiful places in the world. It is located in the Pacific Ocean, near the northeast coast of Australia..." }
  ];

  TKA_DATA.texts.forEach((text, idx) => {
    const textQuestions = TKA_DATA.questions.filter(q => q.textId === text.id);
    let tAnswered = 0;
    let tReasoned = 0;

    textQuestions.forEach(q => {
      const rec = StudentState.answers[q.id];
      if (rec && rec.answer !== undefined && rec.answer !== null) {
        tAnswered++;
        if (rec.reason && rec.reason.trim().length > 0) tReasoned++;
      }
    });

    const isCompleted = tAnswered === textQuestions.length;
    const progressPercent = Math.round((tAnswered / textQuestions.length) * 100);
    const meta = genreMeta[idx] || { genre: text.genre, barClass: "theme-bar-1", excerpt: "" };

    let statusBadge = `<span class="badge badge-gray">Belum Dikerjakan</span>`;
    if (isCompleted) {
      statusBadge = `<span class="badge badge-green">✓ Selesai (${tAnswered}/${textQuestions.length})</span>`;
    } else if (tAnswered > 0) {
      statusBadge = `<span class="badge badge-blue">⚡ Sedang Dikerjakan (${tAnswered}/${textQuestions.length})</span>`;
    }

    const card = document.createElement('div');
    card.className = 'text-module-card';
    card.innerHTML = `
      <div class="card-theme-bar ${meta.barClass}"></div>
      <div>
        <div class="card-top">
          <span class="badge badge-cyan">${text.number}</span>
          ${statusBadge}
        </div>
        <div class="text-module-genre">${meta.genre}</div>
        <h3 class="text-module-title">${text.title}</h3>
        <p class="text-module-excerpt">"${meta.excerpt}"</p>
        
        <div class="card-meta-chips">
          <span class="meta-chip">📝 ${text.questionRange}</span>
          <span class="meta-chip">✍️ ${tReasoned}/${textQuestions.length} Alasan</span>
          <span class="meta-chip">📖 ${text.paragraphs.length} Paragraf / Poin</span>
        </div>

        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;" onclick="openStudentWorkspace(${text.id})">
          ✏️ Buka Lembar Kerja & Jawab Soal →
        </button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// ==========================================
// STUDENT WORKSPACE (SIDE-BY-SIDE + MOBILE FRIENDLY)
// ==========================================
function openStudentWorkspace(textId, qIndex = 0) {
  StudentState.selectedTextId = textId;
  StudentState.currentQuestionIndex = qIndex;
  setStudentView('student_workspace', textId);
}

function renderStudentWorkspace() {
  const text = TKA_DATA.texts.find(t => t.id === StudentState.selectedTextId);
  if (!text) return;

  const headerTitleEl = document.getElementById('student-ws-title');
  if (headerTitleEl) {
    headerTitleEl.innerHTML = `<strong>${text.number}</strong>: ${text.title} <span class="badge badge-blue" style="margin-left: 8px;">${text.questionRange}</span>`;
  }

  // Render Left Reading Panel
  renderStudentReading(text);

  // Render Right Questions & Reasoning Panel
  renderStudentQuestions(text);

  // Apply mobile responsive tab state
  updateMobileViewVisibility();
}

function renderStudentReading(text) {
  const titleEl = document.getElementById('student-reading-title');
  const citEl = document.getElementById('student-reading-citation');
  const contentEl = document.getElementById('student-reading-content');

  if (titleEl) titleEl.textContent = `${text.number}: ${text.title}`;
  if (citEl) citEl.textContent = text.sourceCitation;

  if (contentEl) {
    let html = '';
    text.paragraphs.forEach((para, idx) => {
      html += `
        <div class="reading-paragraph" id="student-reading-p-${idx}">
          <span class="p-number">¶ P${idx + 1}</span>
          <span class="p-text-body">${escapeHtml(para)}</span>
        </div>
      `;
    });
    contentEl.innerHTML = html;
  }

  applyStudentReadingFontStyles();
}

function renderStudentQuestions(text) {
  const questions = TKA_DATA.questions.filter(q => q.textId === text.id);
  const qIndex = StudentState.currentQuestionIndex;
  const currentQ = questions[qIndex];
  if (!currentQ) return;

  // Nav pills
  const navContainer = document.getElementById('student-practice-q-nav');
  if (navContainer) {
    navContainer.innerHTML = questions.map((q, idx) => {
      const rec = StudentState.answers[q.id];
      let stateClass = '';
      if (rec && rec.answer !== undefined && rec.answer !== null) {
        stateClass = 'answered-correct'; // Blue/green pill indicating completed answer
      }
      return `
        <button class="q-nav-pill ${stateClass} ${idx === qIndex ? 'active' : ''}" onclick="jumpStudentQuestion(${idx})">
          ${q.number}
        </button>
      `;
    }).join('');
  }

  const canvas = document.getElementById('student-practice-canvas');
  if (!canvas) return;

  const savedRecord = StudentState.answers[currentQ.id] || { answer: null, reason: '' };

  let contentHtml = `
    <div class="q-badge-row">
      <span class="badge badge-blue">${currentQ.type}</span>
      <span style="font-size: 0.9rem; font-weight: 800; color: var(--text-muted);">Question ${currentQ.number} of ${TKA_DATA.questions.length}</span>
    </div>

    ${currentQ.indicator ? `<div style="font-size: 0.82rem; font-weight: 700; color: var(--academic-blue); margin-bottom: 4px;">${currentQ.indicator}</div>` : ''}

    <div class="q-title-text" style="white-space: pre-line;">${escapeHtml(currentQ.question)}</div>
  `;

  // Render question options without answer keys
  if (currentQ.format === 'multiple_choice') {
    contentHtml += renderStudentMCOptions(currentQ, savedRecord.answer);
  } else if (currentQ.format === 'multi_select') {
    contentHtml += renderStudentMSOptions(currentQ, savedRecord.answer || []);
  } else if (currentQ.format === 'categorization') {
    contentHtml += renderStudentCatTable(currentQ, savedRecord.answer || {});
  }

  // Mandatory Student Reasoning & Evidence Box
  contentHtml += `
    <div class="reasoning-box-wrapper">
      <div class="reasoning-header">
        <span>✍️ Mengapa Anda memilih jawaban ini? (Alasan & Bukti Teks):</span>
      </div>
      <p class="reasoning-subtext">
        Tuliskan alasan analitis Anda dan kutip petunjuk kalimat/kata dari teks untuk mempertanggungjawabkan pilihan Anda:
      </p>
      <textarea id="student-reason-input-${currentQ.id}" 
                class="student-reason-textarea" 
                placeholder="Contoh: Saya memilih opsi ini karena pada poin/paragraf ke-X dinyatakan bahwa... dan bukti kata kuncinya adalah..."
                oninput="handleStudentReasonInput(${currentQ.id}, this.value)">${escapeHtml(savedRecord.reason || '')}</textarea>
    </div>
  `;

  // Action footer
  contentHtml += `
    <div class="q-action-footer">
      <button class="btn btn-secondary" onclick="prevStudentQuestion()" ${qIndex === 0 ? 'disabled' : ''}>← Sebelumnya</button>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${qIndex < questions.length - 1 ? `
          <button class="btn btn-primary" onclick="saveAndNextStudentQuestion(${currentQ.id})">Simpan & Lanjut →</button>
        ` : `
          <button class="btn btn-success btn-lg" onclick="finishStudentText(${text.id}, ${currentQ.id})">🏁 Simpan & Selesai Text ${text.id}</button>
        `}
      </div>
    </div>
  `;

  canvas.innerHTML = contentHtml;
}

// ------------------------------------------
// STUDENT OPTION SELECTION (NO ANSWER KEYS EXPOSED)
// ------------------------------------------
function renderStudentMCOptions(q, selectedKey) {
  return `
    <div class="options-list" id="student-mc-options">
      ${q.options.map(opt => `
        <div class="option-card ${selectedKey === opt.key ? 'selected' : ''}" 
             data-key="${opt.key}" 
             onclick="selectStudentMCOption(${q.id}, '${opt.key}')">
          <div class="opt-radio-circle"></div>
          <div class="opt-text" style="white-space: pre-line;"><strong>(${opt.key})</strong> ${opt.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function selectStudentMCOption(qId, key) {
  if (!StudentState.answers[qId]) StudentState.answers[qId] = { answer: null, reason: '' };
  StudentState.answers[qId].answer = key;
  StudentState.answers[qId].timestamp = Date.now();
  saveStudentData();

  document.querySelectorAll('#student-mc-options .option-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.key === key);
  });
}

function renderStudentMSOptions(q, selectedKeys) {
  return `
    <div class="options-list" id="student-ms-options">
      ${q.options.map(opt => {
        const isChecked = selectedKeys.includes(opt.key);
        return `
          <div class="checkbox-option-card ${isChecked ? 'selected' : ''}" 
               data-key="${opt.key}" 
               onclick="toggleStudentMSOption(${q.id}, '${opt.key}')">
            <div class="custom-checkbox-box">${isChecked ? '✓' : ''}</div>
            <div class="opt-text">${opt.text}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleStudentMSOption(qId, key) {
  if (!StudentState.answers[qId]) StudentState.answers[qId] = { answer: [], reason: '' };
  if (!Array.isArray(StudentState.answers[qId].answer)) StudentState.answers[qId].answer = [];

  const arr = StudentState.answers[qId].answer;
  const idx = arr.indexOf(key);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(key);

  StudentState.answers[qId].timestamp = Date.now();
  saveStudentData();

  const card = document.querySelector(`#student-ms-options .checkbox-option-card[data-key="${key}"]`);
  if (card) {
    const isSel = card.classList.toggle('selected');
    card.querySelector('.custom-checkbox-box').textContent = isSel ? '✓' : '';
  }
}

function renderStudentCatTable(q, savedAnswers) {
  const catA = q.categories[0];
  const catB = q.categories[1];

  return `
    <div class="interactive-table-wrapper">
      <table class="interactive-table">
        <thead>
          <tr>
            <th style="width: 60%;">Technique / Deskripsi</th>
            <th style="width: 20%; text-align: center;">${catA}</th>
            <th style="width: 20%; text-align: center;">${catB}</th>
          </tr>
        </thead>
        <tbody>
          ${q.items.map(item => {
            const userVal = savedAnswers[item.id];
            return `
              <tr>
                <td>${item.statement}</td>
                <td class="center-align">
                  <input type="radio" name="st_cat_${item.id}" value="${catA}" ${userVal === catA ? 'checked' : ''} onchange="setStudentCat(${q.id}, '${item.id}', '${catA}')">
                </td>
                <td class="center-align">
                  <input type="radio" name="st_cat_${item.id}" value="${catB}" ${userVal === catB ? 'checked' : ''} onchange="setStudentCat(${q.id}, '${item.id}', '${catB}')">
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function setStudentCat(qId, itemId, val) {
  if (!StudentState.answers[qId]) StudentState.answers[qId] = { answer: {}, reason: '' };
  if (typeof StudentState.answers[qId].answer !== 'object' || Array.isArray(StudentState.answers[qId].answer)) {
    StudentState.answers[qId].answer = {};
  }
  StudentState.answers[qId].answer[itemId] = val;
  StudentState.answers[qId].timestamp = Date.now();
  saveStudentData();
}

function handleStudentReasonInput(qId, text) {
  if (!StudentState.answers[qId]) StudentState.answers[qId] = { answer: null, reason: '' };
  StudentState.answers[qId].reason = text;
  StudentState.answers[qId].timestamp = Date.now();
  saveStudentData();
}

function jumpStudentQuestion(idx) {
  StudentState.currentQuestionIndex = idx;
  const text = TKA_DATA.texts.find(t => t.id === StudentState.selectedTextId);
  if (text) renderStudentQuestions(text);
}

function prevStudentQuestion() {
  if (StudentState.currentQuestionIndex > 0) {
    StudentState.currentQuestionIndex--;
    const text = TKA_DATA.texts.find(t => t.id === StudentState.selectedTextId);
    if (text) renderStudentQuestions(text);
  }
}

function saveAndNextStudentQuestion(qId) {
  const text = TKA_DATA.texts.find(t => t.id === StudentState.selectedTextId);
  const questions = TKA_DATA.questions.filter(q => q.textId === text.id);
  if (StudentState.currentQuestionIndex < questions.length - 1) {
    StudentState.currentQuestionIndex++;
    renderStudentQuestions(text);
    showStudentToast('Jawaban tersimpan!', 'success');
  }
}

function finishStudentText(textId, qId) {
  saveStudentData();
  showStudentToast(`Lembar Kerja Text ${textId} berhasil disimpan!`, 'success');
  setStudentView('worksheet_summary');
}

// ------------------------------------------
// MOBILE VIEW TOGGLE (HP / TABLET)
// ------------------------------------------
function setMobileViewTab(tab) {
  StudentState.mobileActiveTab = tab;
  updateMobileViewVisibility();
}

function updateMobileViewVisibility() {
  const btnRead = document.getElementById('btn-mobile-read');
  const btnQuiz = document.getElementById('btn-mobile-quiz');
  const panelRead = document.getElementById('student-reading-panel');
  const panelQuiz = document.getElementById('student-practice-panel');

  if (btnRead && btnQuiz && panelRead && panelQuiz) {
    if (window.innerWidth <= 900) {
      if (StudentState.mobileActiveTab === 'read') {
        btnRead.classList.add('active');
        btnQuiz.classList.remove('active');
        panelRead.classList.remove('mobile-hidden');
        panelQuiz.classList.add('mobile-hidden');
      } else {
        btnQuiz.classList.add('active');
        btnRead.classList.remove('active');
        panelQuiz.classList.remove('mobile-hidden');
        panelRead.classList.add('mobile-hidden');
      }
    } else {
      panelRead.classList.remove('mobile-hidden');
      panelQuiz.classList.remove('mobile-hidden');
    }
  }
}

window.addEventListener('resize', updateMobileViewVisibility);

// ------------------------------------------
// FONT SIZE & FAMILY CONTROLS
// ------------------------------------------
function changeStudentFontSize(delta) {
  if (delta === 0) StudentState.fontSizeLevel = 0;
  else StudentState.fontSizeLevel = Math.max(-1, Math.min(2, StudentState.fontSizeLevel + delta));
  applyStudentReadingFontStyles();
  showStudentToast('Ukuran teks disesuaikan', 'info');
}

function toggleStudentFontFamily() {
  StudentState.fontFamily = StudentState.fontFamily === 'serif' ? 'sans' : 'serif';
  const label = document.getElementById('student-font-label');
  if (label) label.textContent = StudentState.fontFamily === 'serif' ? 'Serif' : 'Sans-Serif';
  applyStudentReadingFontStyles();
}

function applyStudentReadingFontStyles() {
  const sizeMap = { '-1': '1.02rem', '0': '1.18rem', '1': '1.32rem', '2': '1.48rem' };
  const currentSize = sizeMap[StudentState.fontSizeLevel.toString()] || '1.18rem';
  const currentFont = StudentState.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)';

  document.querySelectorAll('#student-reading-content .reading-paragraph').forEach(p => {
    p.style.fontSize = currentSize;
    p.style.fontFamily = currentFont;
  });
}

// ==========================================
// WORKSHEET SUMMARY & SUBMISSION SHEET
// ==========================================
function renderStudentWorksheetSummary() {
  const container = document.getElementById('student-summary-container');
  if (!container) return;

  const total = TKA_DATA.questions.length;
  let answeredCount = 0;
  let reasonedCount = 0;

  TKA_DATA.questions.forEach(q => {
    const rec = StudentState.answers[q.id];
    if (rec && rec.answer !== undefined && rec.answer !== null) {
      answeredCount++;
      if (rec.reason && rec.reason.trim().length > 0) reasonedCount++;
    }
  });

  const studentName = StudentState.profile.name || '(Belum Diisi)';
  const studentClass = StudentState.profile.class || '(Belum Diisi)';

  let html = `
    <div style="background: var(--bg-card); border-radius: 18px; border: 1px solid var(--border-color); padding: 36px; box-shadow: var(--shadow-md); margin-bottom: 30px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <span class="badge badge-green" style="margin-bottom: 8px;">LEMBAR JAWABAN SISWA (STUDENT WORKSHEET)</span>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: var(--text-main); margin-bottom: 4px;">TKA Bahasa Inggris SMA 2025 (Wajib)</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted);">Laporan Jawaban Mandiri & Justifikasi Alasan Bukti Teks (Questions 1–20)</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-submit-online" onclick="submitStudentWorksheetOnline()" style="background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);">
            🚀 Kirim Lembar Jawaban ke Guru (Online)
          </button>
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Cetak / PDF</button>
          <button class="btn btn-outline" onclick="setStudentView('dashboard')">← Dashboard</button>
        </div>
      </div>

      <!-- Identity Meta Box -->
      <div style="background: var(--bg-card-alt); border-radius: 12px; padding: 18px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Nama Siswa:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">${escapeHtml(studentName)}</div>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Kelas:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">${escapeHtml(studentClass)}</div>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Sekolah:</div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">SMA Plus PGRI Cibinong</div>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Guru Pembimbing:</div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">M. Falahaen Jiddan, M.Pd. Gr.</div>
        </div>
      </div>

      <!-- Questions & Justifications List -->
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 18px;">📋 Rincian Jawaban & Alasan Pemilihan Siswa:</h3>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${TKA_DATA.questions.map(q => {
          const rec = StudentState.answers[q.id] || { answer: null, reason: '' };
          let answerDisplay = '<em>(Belum Dijawab)</em>';

          if (rec.answer !== null && rec.answer !== undefined) {
            if (q.format === 'multiple_choice') {
              const optObj = q.options.find(o => o.key === rec.answer);
              answerDisplay = `<strong>Opsi (${rec.answer}):</strong> ${optObj ? optObj.text : ''}`;
            } else if (q.format === 'multi_select') {
              answerDisplay = `<strong>Pilihan:</strong> Pernyataan [${rec.answer.join(', ')}]`;
            } else if (q.format === 'categorization') {
              answerDisplay = `<strong>Kategori:</strong> ` + Object.keys(rec.answer).map(k => `${k}: ${rec.answer[k]}`).join(' | ');
            }
          }

          const hasReason = rec.reason && rec.reason.trim().length > 0;

          return `
            <div style="background: var(--bg-card-alt); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge badge-blue">Text ${q.textId} • Soal #${q.number} (${q.type})</span>
                <span class="badge ${rec.answer ? 'badge-green' : 'badge-gray'}">${rec.answer ? '✓ Terisi' : '○ Kosong'}</span>
              </div>
              
              <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-main); margin-bottom: 10px; white-space: pre-line;">${escapeHtml(q.question)}</div>
              
              <div style="background: var(--bg-card); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 12px; font-size: 0.95rem; color: var(--text-main); white-space: pre-line;">
                ${answerDisplay}
              </div>

              <div style="background: var(--accent-cyan-light); border-left: 4px solid var(--academic-blue); padding: 12px 16px; border-radius: 6px;">
                <strong style="font-size: 0.88rem; color: var(--academic-blue);">✍️ Alasan & Bukti Teks dari Siswa:</strong>
                <p style="font-size: 0.92rem; color: var(--text-main); margin-top: 4px; line-height: 1.5; font-style: ${hasReason ? 'normal' : 'italic'};">
                  ${hasReason ? escapeHtml(rec.reason) : 'Siswa belum menuliskan alasan untuk soal ini.'}
                </p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  container.innerHTML = html;
}

// ==========================================
// VOCABULARY LAB & STRATEGY IN STUDENT MODE
// ==========================================
function renderStudentVocabLab() {
  const container = document.getElementById('student-vocab-content-area');
  if (!container) return;

  let vocabList = [];
  if (StudentState.vocabFilter === 'all') {
    TKA_DATA.texts.forEach(t => {
      t.vocabulary.forEach(v => vocabList.push({ ...v, textNumber: t.number }));
    });
  } else {
    const text = TKA_DATA.texts.find(t => t.id === Number(StudentState.vocabFilter));
    if (text) vocabList = text.vocabulary.map(v => ({ ...v, textNumber: text.number }));
  }

  document.querySelectorAll('.vocab-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.textfilter === String(StudentState.vocabFilter));
  });

  document.querySelectorAll('.vocab-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === StudentState.vocabActivity);
  });

  if (StudentState.vocabActivity === 'flipcard') {
    renderStudentVocabFlipcards(vocabList, container);
  } else if (StudentState.vocabActivity === 'matching') {
    renderStudentVocabMatching(vocabList, container);
  } else if (StudentState.vocabActivity === 'context') {
    renderStudentVocabContextQuiz(vocabList, container);
  } else if (StudentState.vocabActivity === 'list') {
    renderStudentVocabTable(vocabList, container);
  }
}

function filterStudentVocab(filterVal) {
  StudentState.vocabFilter = filterVal;
  renderStudentVocabLab();
}

function setStudentVocabActivity(activity) {
  StudentState.vocabActivity = activity;
  renderStudentVocabLab();
}

function renderStudentVocabFlipcards(vocabList, container) {
  let cardsHtml = '<div class="flip-cards-grid">';
  vocabList.forEach((v, idx) => {
    cardsHtml += `
      <div class="flip-card-wrapper">
        <div class="flip-card-inner" id="st-flip-card-${idx}" onclick="this.classList.toggle('flipped')">
          <div class="flip-card-front">
            <span class="badge badge-blue">${v.textNumber || 'Word'} #${idx + 1}</span>
            <div>
              <div class="word-title">${v.word}</div>
              <div class="pos-tag">${v.pos}</div>
            </div>
            <div class="hint-text">👆 Klik untuk melihat arti & contoh</div>
          </div>
          <div class="flip-card-back">
            <div>
              <div class="back-meaning">${v.meaning}</div>
              <div class="back-ipa">
                <span>${v.pronunciation}</span>
                <button class="btn-listen" onclick="event.stopPropagation(); speakWord('${v.word}')">🔊 Listen</button>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 8px;"><strong>Context:</strong> <em>"${v.context}"</em></p>
            </div>
            <div class="back-example">
              <strong>Example:</strong> ${v.example}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  cardsHtml += '</div>';
  container.innerHTML = cardsHtml;
}

function renderStudentVocabMatching(vocabList, container) {
  const vocabSample = vocabList.slice(0, 6);
  const shuffledMeanings = [...vocabSample].sort(() => Math.random() - 0.5);

  let html = `
    <div style="background: var(--bg-card); padding: 26px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: 20px;">
      <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 6px; font-weight: 800;">🧩 Activity 2 — Match the Word</h3>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 22px;">Pilih kata bahasa Inggris di kiri, lalu pasangkan dengan artinya di kanan!</p>
      
      <div class="matching-game-grid">
        <div class="match-column" id="st-match-col-left">
          ${vocabSample.map(v => `
            <div class="match-item" data-word="${v.word}" onclick="handleStudentMatchSelect('left', '${v.word}')">
              ${v.word} <span style="font-size: 0.8rem; color: var(--text-muted);">(${v.pos})</span>
            </div>
          `).join('')}
        </div>
        <div class="match-column" id="st-match-col-right">
          ${shuffledMeanings.map(v => `
            <div class="match-item" data-word="${v.word}" onclick="handleStudentMatchSelect('right', '${v.word}')">
              ${v.meaning}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="renderStudentVocabLab()">🔄 Reset Game</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
  StudentState.matchingState = { selectedLeft: null, selectedRight: null, matchedPairs: [] };
}

function handleStudentMatchSelect(col, word) {
  if (StudentState.matchingState.matchedPairs.includes(word)) return;

  if (col === 'left') {
    StudentState.matchingState.selectedLeft = word;
    document.querySelectorAll('#st-match-col-left .match-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.word === word && !StudentState.matchingState.matchedPairs.includes(word));
    });
  } else {
    StudentState.matchingState.selectedRight = word;
    document.querySelectorAll('#st-match-col-right .match-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.word === word && !StudentState.matchingState.matchedPairs.includes(word));
    });
  }

  if (StudentState.matchingState.selectedLeft && StudentState.matchingState.selectedRight) {
    if (StudentState.matchingState.selectedLeft === StudentState.matchingState.selectedRight) {
      const matched = StudentState.matchingState.selectedLeft;
      StudentState.matchingState.matchedPairs.push(matched);
      
      const leftEl = document.querySelector(`#st-match-col-left [data-word="${matched}"]`);
      const rightEl = document.querySelector(`#st-match-col-right [data-word="${matched}"]`);
      if (leftEl) { leftEl.classList.remove('selected'); leftEl.classList.add('matched'); leftEl.innerHTML += ' ✓'; }
      if (rightEl) { rightEl.classList.remove('selected'); rightEl.classList.add('matched'); rightEl.innerHTML += ' ✓'; }

      showStudentToast(`Benar: "${matched}"!`, 'success');
      StudentState.matchingState.selectedLeft = null;
      StudentState.matchingState.selectedRight = null;
    } else {
      showStudentToast('Belum tepat. Coba lagi!', 'error');
      setTimeout(() => {
        document.querySelectorAll('.match-item.selected').forEach(el => el.classList.remove('selected'));
        StudentState.matchingState.selectedLeft = null;
        StudentState.matchingState.selectedRight = null;
      }, 500);
    }
  }
}

function renderStudentVocabContextQuiz(vocabList, container) {
  const currentIdx = StudentState.contextQuizState.currentIndex % vocabList.length;
  const currentV = vocabList[currentIdx];

  const otherMeanings = vocabList.filter(item => item.word !== currentV.word).map(item => item.meaning);
  const options = [currentV.meaning, ...otherMeanings.slice(0, 3)].sort(() => Math.random() - 0.5);

  let html = `
    <div style="background: var(--bg-card); padding: 34px; border-radius: 14px; border: 1px solid var(--border-color); max-width: 780px; margin: 0 auto; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <span class="badge badge-amber">Context Challenge (${currentV.textNumber || 'Text'})</span>
        <span style="font-size: 0.92rem; color: var(--text-muted); font-weight: 700;">Word ${currentIdx + 1} of ${vocabList.length}</span>
      </div>

      <h3 style="font-size: 1.3rem; color: var(--text-main); margin-bottom: 16px; font-weight: 800;">Apa makna kata "<span style="color: var(--academic-blue);">${currentV.word}</span>" dalam konteks kalimat ini?</h3>
      
      <div style="background: var(--bg-card-alt); border-left: 4px solid var(--academic-blue); padding: 18px; border-radius: 8px; font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 26px; color: var(--text-main);">
        "${currentV.context}"
      </div>

      <div class="options-list" id="st-context-options-list">
        ${options.map(opt => `
          <div class="option-card" onclick="checkStudentContextAnswer('${escapeHtml(opt)}', '${escapeHtml(currentV.meaning)}', this)">
            <div class="opt-radio-circle"></div>
            <div class="opt-text">${opt}</div>
          </div>
        `).join('')}
      </div>

      <div id="st-context-feedback-box" style="display: none; margin-top: 20px;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-color);">
        <button class="btn btn-outline btn-sm" onclick="speakWord('${currentV.word}')">🔊 Listen Word</button>
        <button class="btn btn-primary" id="btn-st-next-context" style="display: none;" onclick="nextStudentContextQuiz(${vocabList.length})">Next Word →</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function checkStudentContextAnswer(chosen, correct, el) {
  if (StudentState.contextQuizState.answered) return;
  StudentState.contextQuizState.answered = true;

  const isRight = chosen === correct;
  const feedbackBox = document.getElementById('st-context-feedback-box');
  const nextBtn = document.getElementById('btn-st-next-context');

  document.querySelectorAll('#st-context-options-list .option-card').forEach(card => {
    card.style.pointerEvents = 'none';
    if (card.querySelector('.opt-text').textContent.trim() === correct) {
      card.style.borderColor = 'var(--accent-green)';
      card.style.background = 'var(--accent-green-light)';
    } else if (card === el && !isRight) {
      card.style.borderColor = 'var(--accent-red)';
      card.style.background = 'var(--accent-red-light)';
    }
  });

  if (feedbackBox) {
    feedbackBox.style.display = 'block';
    if (isRight) {
      feedbackBox.innerHTML = `
        <div style="background: var(--accent-green-light); color: var(--accent-green); padding: 16px; border-radius: 8px; font-weight: 700;">
          ✓ Tepat! <strong>${correct}</strong> adalah makna kontekstual yang paling sesuai.
        </div>
      `;
    } else {
      feedbackBox.innerHTML = `
        <div style="background: var(--accent-red-light); color: var(--accent-red); padding: 16px; border-radius: 8px; font-weight: 700;">
          ✗ Belum tepat. Makna yang benar adalah: <strong>${correct}</strong>.
        </div>
      `;
    }
  }

  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function nextStudentContextQuiz(total) {
  StudentState.contextQuizState.answered = false;
  StudentState.contextQuizState.currentIndex = (StudentState.contextQuizState.currentIndex + 1) % total;
  renderStudentVocabLab();
}

function renderStudentVocabTable(vocabList, container) {
  let html = `
    <table class="vocab-table">
      <thead>
        <tr>
          <th>Word & IPA</th>
          <th>Text</th>
          <th>PoS</th>
          <th>Indonesian Meaning</th>
          <th>Context in Text</th>
          <th>Example</th>
          <th>Audio</th>
        </tr>
      </thead>
      <tbody>
  `;
  vocabList.forEach(v => {
    html += `
      <tr>
        <td><strong>${v.word}</strong><br><span style="font-size: 0.82rem; color: var(--text-muted);">${v.pronunciation}</span></td>
        <td><span class="badge badge-gray">${v.textNumber || 'Text'}</span></td>
        <td><span class="badge badge-cyan">${v.pos}</span></td>
        <td><strong>${v.meaning}</strong></td>
        <td style="font-size: 0.88rem; font-style: italic;">"${v.context}"</td>
        <td style="font-size: 0.88rem;">${v.example}</td>
        <td><button class="btn-listen" onclick="speakWord('${v.word}')">🔊</button></td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Strategy
function renderStudentTKAStrategy() {
  const container = document.getElementById('student-strategy-cards-container');
  if (!container) return;

  let html = '';
  TKA_DATA.strategies.forEach(strat => {
    html += `
      <div class="strategy-card">
        <div>
          <h3 class="strategy-card-title">${strat.name}</h3>
          ${strat.quickQuestion ? `<div class="strategy-quick-q">❓ ${strat.quickQuestion}</div>` : ''}
          <ol class="strategy-steps-list">
            ${strat.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
        ${strat.formula ? `<div class="strategy-formula-badge">📐 FORMULA: ${strat.formula}</div>` : ''}
      </div>
    `;
  });
  container.innerHTML = html;
}

// ==========================================
// ONLINE SUBMISSION TO FIREBASE
// ==========================================
async function submitStudentWorksheetOnline() {
  const name = (StudentState.profile.name || '').trim();
  const studentClass = (StudentState.profile.class || '').trim();

  if (!name) {
    showStudentToast('Mohon isi Nama Lengkap Anda terlebih dahulu di bagian atas halaman.', 'error');
    const nameInput = document.getElementById('input-student-name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth' });
      nameInput.focus();
    }
    return;
  }

  if (!studentClass) {
    showStudentToast('Mohon isi Kelas Anda terlebih dahulu di bagian atas halaman.', 'error');
    const classInput = document.getElementById('input-student-class');
    if (classInput) {
      classInput.scrollIntoView({ behavior: 'smooth' });
      classInput.focus();
    }
    return;
  }

  const submitBtn = document.getElementById('btn-submit-online');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sedang Mengirim Data...';
  }

  // Calculate scores and bundle payload
  let score = 0;
  let reasonedCount = 0;
  const processedAnswers = {};

  TKA_DATA.questions.forEach(q => {
    const studentRec = StudentState.answers[q.id] || { answer: null, reason: '' };
    const correct = q.officialAnswer || q.correctAnswer;
    let isCorrect = false;

    if (studentRec.answer !== null && studentRec.answer !== undefined && correct !== undefined && correct !== null) {
      if (q.format === 'multiple_choice') {
        isCorrect = String(studentRec.answer).trim().toUpperCase() === String(correct).trim().toUpperCase();
      } else if (q.format === 'multi_select') {
        const studentArr = Array.isArray(studentRec.answer) ? studentRec.answer.map(s => String(s).trim().toUpperCase()) : [];
        const correctArr = Array.isArray(correct) ? correct.map(s => String(s).trim().toUpperCase()) : [];
        const studentSet = new Set(studentArr);
        const correctSet = new Set(correctArr);
        isCorrect = studentSet.size === correctSet.size && [...studentSet].every(val => correctSet.has(val));
      } else if (q.format === 'categorization') {
        if (typeof studentRec.answer === 'object' && studentRec.answer !== null && typeof correct === 'object' && correct !== null) {
          const keys = Object.keys(correct);
          isCorrect = keys.length > 0 && keys.every(k => String(studentRec.answer[k]).trim() === String(correct[k]).trim());
        }
      }

      if (isCorrect) score++;
    }

    if (studentRec.reason && studentRec.reason.trim().length > 0) {
      reasonedCount++;
    }

    processedAnswers[q.id] = {
      questionNumber: q.number,
      type: q.type,
      answer: studentRec.answer,
      reason: studentRec.reason || '',
      isCorrect: isCorrect
    };
  });

  const payload = {
    studentName: name,
    studentClass: studentClass,
    school: "SMA Plus PGRI Cibinong",
    score: score,
    totalQuestions: TKA_DATA.questions.length,
    reasonedCount: reasonedCount,
    answers: processedAnswers
  };

  try {
    if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
      await FirebaseService.submitStudentWorksheet(payload);
      showStudentToast('🎉 Lembar jawaban Anda berhasil dikirimkan ke Guru!', 'success');
      if (submitBtn) {
        submitBtn.innerHTML = '✅ Terkirim ke Guru!';
        submitBtn.style.background = '#10b981';
      }
    } else {
      // Offline fallback: save locally and inform student
      console.log("Offline local record submission:", payload);
      showStudentToast('⚠️ Kunci Firebase belum diisi di firebase-config.js. Jawaban disimpan lokal.', 'warning');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Kirim Lembar Jawaban ke Guru (Online)';
      }
    }
  } catch (err) {
    console.error("Submission error:", err);
    showStudentToast('Gagal mengirim jawaban: ' + (err.message || 'Terjadi kesalahan jaringan.'), 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '🚀 Coba Kirim Ulang';
    }
  }
}

// Modals
function openStudentResetModal() {
  const m = document.getElementById('student-reset-modal');
  if (m) m.classList.add('active');
}

function closeStudentModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

function confirmStudentReset() {
  StudentState.answers = {};
  localStorage.removeItem(STUDENT_STORAGE_KEY);
  closeStudentModal('student-reset-modal');
  showStudentToast('Lembar kerja siswa berhasil direset.', 'info');
  setStudentView('dashboard');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function setupStudentEvents() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', initStudentApp);
