// ==========================================
// MPI TKA BAHASA INGGRIS SMA 2025 (20 SOAL) - APPLICATION LOGIC (MODE TEACHER / MASTER)
// With Split Side-by-Side Workspace & Global Vocab/Strategy Hub
// ==========================================

const STORAGE_KEY = 'mpi_tka_20soal_teacher_v1';
const THEME_KEY = 'mpi_tka_theme';

const AppState = {
  currentView: 'landing', // 'landing', 'dashboard', 'text_workspace', 'vocab_lab', 'tka_strategy', 'final_review', 'full_test'
  selectedTextId: 1,
  currentQuestionIndex: 0,
  
  // Theme & Readability settings
  theme: 'light',
  fontSizeLevel: 0, // -1, 0, 1, 2
  fontFamily: 'serif',

  // Storage data
  progress: {
    userAnswers: {}, // { [qId]: { answer: any, isCorrect: bool, timestamp: number } }
    completedTexts: {}
  },

  // Global Vocabulary Lab state
  vocabFilter: 'all', // 'all', 1, 2, 3, 4
  vocabActivity: 'flipcard', // 'flipcard', 'matching', 'context', 'list'
  matchingState: { selectedLeft: null, selectedRight: null, matchedPairs: [] },
  contextQuizState: { currentIndex: 0, score: 0, answered: false },

  // Full test / Challenge modes
  testMode: 'normal',
  testQuestions: [],
  testAnswers: {},
  fullTestCompleted: false
};

// ==========================================
// INITIALIZATION & THEME HANDLING
// ==========================================
function initApp() {
  loadTheme();
  loadProgress();
  setupGlobalEvents();
  initLiveSubmissionsListener();
  renderApp();
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  AppState.theme = savedTheme;
  applyTheme(savedTheme);
}

function toggleTheme() {
  const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
  AppState.theme = newTheme;
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  if (themeIcon && themeLabel) {
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light Mode';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark Mode';
    }
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      AppState.progress = Object.assign(AppState.progress, parsed);
    }
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

function showToast(message, type = 'info') {
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
  }, 3200);
}

// Web Speech API for Word Pronunciation
function speakWord(word) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    showToast('Speech synthesis not supported in this browser.', 'error');
  }
}

// ==========================================
// ROUTING & VIEW SWITCHING
// ==========================================
function setView(viewName, textId = null) {
  AppState.currentView = viewName;
  if (textId) AppState.selectedTextId = textId;

  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const activeViewEl = document.getElementById(`view-${viewName}`);
  if (activeViewEl) activeViewEl.classList.add('active');

  const activeNavEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNavEl) activeNavEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// ==========================================
// RENDER DISPATCHER
// ==========================================
function renderApp() {
  if (AppState.currentView === 'dashboard') {
    renderDashboard();
  } else if (AppState.currentView === 'live_submissions') {
    renderLiveSubmissions();
  } else if (AppState.currentView === 'text_workspace') {
    renderTextWorkspace();
  } else if (AppState.currentView === 'vocab_lab') {
    renderGlobalVocabLab();
  } else if (AppState.currentView === 'tka_strategy') {
    renderGlobalTKAStrategy();
  } else if (AppState.currentView === 'final_review') {
    renderFinalReview();
  } else if (AppState.currentView === 'full_test') {
    renderFullTestMode();
  }
}

// ==========================================
// DASHBOARD RENDERING
// ==========================================
function renderDashboard() {
  const totalQuestions = TKA_DATA.questions.length;
  let answeredCount = 0;
  let correctCount = 0;

  TKA_DATA.questions.forEach(q => {
    const rec = AppState.progress.userAnswers[q.id];
    if (rec) {
      answeredCount++;
      if (rec.isCorrect) correctCount++;
    }
  });

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const totalQEl = document.getElementById('stat-total-questions');
  if (totalQEl) totalQEl.textContent = `${answeredCount}/${totalQuestions}`;
  const totalAccEl = document.getElementById('stat-total-accuracy');
  if (totalAccEl) totalAccEl.textContent = `${accuracy}%`;

  const cardsContainer = document.getElementById('dashboard-text-cards');
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
    let tCorrect = 0;
    textQuestions.forEach(q => {
      const rec = AppState.progress.userAnswers[q.id];
      if (rec) {
        tAnswered++;
        if (rec.isCorrect) tCorrect++;
      }
    });

    const isCompleted = tAnswered === textQuestions.length;
    const progressPercent = Math.round((tAnswered / textQuestions.length) * 100);
    const meta = genreMeta[idx] || { genre: text.genre, barClass: "theme-bar-1", excerpt: "" };

    let statusBadge = `<span class="badge badge-gray">Not Started</span>`;
    if (isCompleted) {
      statusBadge = `<span class="badge badge-green">✓ Completed (${tCorrect}/${textQuestions.length})</span>`;
    } else if (tAnswered > 0) {
      statusBadge = `<span class="badge badge-blue">⚡ In Progress (${tAnswered}/${textQuestions.length})</span>`;
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
          <span class="meta-chip">📚 ${text.vocabulary.length} Vocabularies</span>
          <span class="meta-chip">📖 ${text.paragraphs.length} Paragraphs / Points</span>
        </div>

        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;" onclick="openTextWorkspace(${text.id})">
          ✏️ Practice & Read (Split View) →
        </button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// ==========================================
// SIDE-BY-SIDE TEXT WORKSPACE (LEFT: READ | RIGHT: PRACTICE)
// ==========================================
function openTextWorkspace(textId, questionIndex = 0) {
  AppState.selectedTextId = textId;
  AppState.currentQuestionIndex = questionIndex;
  setView('text_workspace', textId);
}

function renderTextWorkspace() {
  const text = TKA_DATA.texts.find(t => t.id === AppState.selectedTextId);
  if (!text) return;

  const headerTitleEl = document.getElementById('workspace-text-title');
  if (headerTitleEl) {
    headerTitleEl.innerHTML = `<strong>${text.number}</strong>: ${text.title} <span class="badge badge-blue" style="margin-left: 8px;">${text.questionRange}</span>`;
  }

  // Render Left Panel (Reading Text)
  renderWorkspaceReading(text);

  // Render Right Panel (Practice Questions)
  renderWorkspacePractice(text);
}

function renderWorkspaceReading(text) {
  const titleEl = document.getElementById('ws-reading-title');
  const citEl = document.getElementById('ws-reading-citation');
  const contentEl = document.getElementById('ws-reading-content');

  if (titleEl) titleEl.textContent = `${text.number}: ${text.title}`;
  if (citEl) citEl.textContent = text.sourceCitation;

  if (contentEl) {
    let html = '';
    text.paragraphs.forEach((para, idx) => {
      html += `
        <div class="reading-paragraph" id="reading-p-${idx}">
          <span class="p-number">¶ P${idx + 1}</span>
          <span class="p-text-body">${escapeHtml(para)}</span>
        </div>
      `;
    });
    contentEl.innerHTML = html;
  }

  applyReadingFontStyles();
}

function renderWorkspacePractice(text) {
  const questions = TKA_DATA.questions.filter(q => q.textId === text.id);
  const qIndex = AppState.currentQuestionIndex;
  const currentQ = questions[qIndex];
  if (!currentQ) return;

  // Render Q nav pills
  const navContainer = document.getElementById('ws-practice-q-nav');
  if (navContainer) {
    navContainer.innerHTML = questions.map((q, idx) => {
      const rec = AppState.progress.userAnswers[q.id];
      let stateClass = '';
      if (rec) {
        stateClass = rec.isCorrect ? 'answered-correct' : 'answered-incorrect';
      }
      return `
        <button class="q-nav-pill ${stateClass} ${idx === qIndex ? 'active' : ''}" onclick="jumpToPracticeQuestion(${idx})">
          ${q.number}
        </button>
      `;
    }).join('');
  }

  const canvas = document.getElementById('ws-practice-canvas');
  if (!canvas) return;

  const savedRecord = AppState.progress.userAnswers[currentQ.id];
  const isAnswered = !!savedRecord;

  let contentHtml = `
    <div class="q-badge-row">
      <span class="badge badge-blue">${currentQ.type}</span>
      <span style="font-size: 0.9rem; font-weight: 800; color: var(--text-muted);">Question ${currentQ.number} of ${TKA_DATA.questions.length}</span>
    </div>

    ${currentQ.indicator ? `<div style="font-size: 0.82rem; font-weight: 700; color: var(--academic-blue); margin-bottom: 4px;">${currentQ.indicator}</div>` : ''}
    ${currentQ.code ? `<div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">${currentQ.code}</div>` : ''}

    <div class="q-title-text" style="white-space: pre-line;">${escapeHtml(currentQ.question)}</div>
  `;

  if (currentQ.format === 'multiple_choice') {
    contentHtml += renderMultipleChoiceOptions(currentQ, savedRecord);
  } else if (currentQ.format === 'multi_select') {
    contentHtml += renderMultiSelectOptions(currentQ, savedRecord);
  } else if (currentQ.format === 'true_false') {
    contentHtml += renderTrueFalseTable(currentQ, savedRecord);
  } else if (currentQ.format === 'categorization') {
    contentHtml += renderCategorizationTable(currentQ, savedRecord);
  }

  // Action Footer
  contentHtml += `
    <div class="q-action-footer">
      <button class="btn btn-secondary" onclick="prevPracticeQuestion()" ${qIndex === 0 ? 'disabled' : ''}>← Prev</button>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${!isAnswered ? `
          <button class="btn btn-primary" id="btn-check-answer" onclick="submitCurrentAnswer(${currentQ.id})">CHECK ANSWER</button>
        ` : `
          <button class="btn btn-outline btn-sm" onclick="toggleDiscussionDetails(${currentQ.id})">📖 DISCUSSION</button>
          ${qIndex < questions.length - 1 ? `
            <button class="btn btn-primary btn-sm" onclick="nextPracticeQuestion()">NEXT QUESTION →</button>
          ` : `
            <button class="btn btn-success btn-sm" onclick="renderWorkspaceTextSummary(${text.id})">TEXT SUMMARY →</button>
          `}
        `}
      </div>
    </div>
  `;

  if (isAnswered) {
    contentHtml += renderFeedbackBox(currentQ, savedRecord);
  }

  canvas.innerHTML = contentHtml;
}

function renderWorkspaceTextSummary(textId) {
  const text = TKA_DATA.texts.find(t => t.id === textId);
  const questions = TKA_DATA.questions.filter(q => q.textId === textId);
  let correctCount = 0;
  let answeredCount = 0;
  const wrongQuestions = [];

  questions.forEach(q => {
    const rec = AppState.progress.userAnswers[q.id];
    if (rec) {
      answeredCount++;
      if (rec.isCorrect) correctCount++;
      else wrongQuestions.push(q);
    }
  });

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const nextTextId = textId + 1;
  const hasNextText = TKA_DATA.texts.some(t => t.id === nextTextId);

  const canvas = document.getElementById('ws-practice-canvas');
  if (!canvas) return;

  canvas.innerHTML = `
    <div style="text-align: center; padding: 18px 10px;">
      <span class="badge badge-green" style="margin-bottom: 12px;">${text.number} COMPLETE</span>
      <h2 style="font-size: 1.6rem; color: var(--text-main); font-weight: 900; margin-bottom: 10px;">Great Effort!</h2>
      
      <div style="font-size: 3.2rem; font-weight: 900; color: var(--academic-blue); line-height: 1; margin-bottom: 8px;">${accuracy}%</div>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 20px;">
        You answered <strong>${correctCount}</strong> of <strong>${questions.length}</strong> questions correctly.
      </p>

      <div style="display: flex; flex-direction: column; gap: 8px; text-align: left; margin-bottom: 22px;">
        ${questions.map(q => {
          const rec = AppState.progress.userAnswers[q.id];
          const isRight = rec && rec.isCorrect;
          return `
            <div style="background: var(--bg-card-alt); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
              <span><strong>Q${q.number}</strong> (${q.type})</span>
              <span class="badge ${isRight ? 'badge-green' : 'badge-amber'}">${isRight ? '✓ Strong' : '⚠ Review'}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${wrongQuestions.length > 0 ? `
          <button class="btn btn-outline btn-sm" onclick="openMistakeReviewModal(${text.id})">🔍 Review Mistakes (${wrongQuestions.length})</button>
        ` : ''}
        ${hasNextText ? `
          <button class="btn btn-primary btn-sm" onclick="openTextWorkspace(${nextTextId})">Next Text (${TKA_DATA.texts.find(t=>t.id===nextTextId).number}) →</button>
        ` : `
          <button class="btn btn-success btn-sm" onclick="setView('final_review')">Final TKA Report →</button>
        `}
      </div>
    </div>
  `;
}

// ------------------------------------------
// EVIDENCE SPOTLIGHT IN READING TEXT (LEFT PANEL)
// ------------------------------------------
function viewEvidenceInText(textId, snippet, paragraphIndex) {
  const leftPanel = document.getElementById('workspace-left-reading-panel');
  if (!leftPanel) return;

  const targetP = document.getElementById(`reading-p-${paragraphIndex}`);
  if (targetP) {
    targetP.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    const bodySpan = targetP.querySelector('.p-text-body');
    if (bodySpan) {
      const fullText = bodySpan.textContent;
      const cleanSnippet = snippet.replace(/[".]/g, '').trim().substring(0, 40);
      const matchIdx = fullText.toLowerCase().indexOf(cleanSnippet.toLowerCase());
      
      if (matchIdx !== -1) {
        const matchedLen = Math.min(snippet.length, fullText.length - matchIdx);
        const before = fullText.substring(0, matchIdx);
        const match = fullText.substring(matchIdx, matchIdx + matchedLen);
        const after = fullText.substring(matchIdx + matchedLen);

        bodySpan.innerHTML = `${escapeHtml(before)}<span class="evidence-highlight-target"><span class="evidence-badge-tag">TEXTUAL EVIDENCE</span>${escapeHtml(match)}</span>${escapeHtml(after)}`;
      } else {
        targetP.classList.add('evidence-highlight-target');
      }
    }
    showToast('Textual evidence spotlighted in left reading panel!', 'success');
  }
}

// ------------------------------------------
// QUESTION NAVIGATION
// ------------------------------------------
function jumpToPracticeQuestion(idx) {
  AppState.currentQuestionIndex = idx;
  const text = TKA_DATA.texts.find(t => t.id === AppState.selectedTextId);
  if (text) renderWorkspacePractice(text);
}

function prevPracticeQuestion() {
  if (AppState.currentQuestionIndex > 0) {
    AppState.currentQuestionIndex--;
    const text = TKA_DATA.texts.find(t => t.id === AppState.selectedTextId);
    if (text) renderWorkspacePractice(text);
  }
}

function nextPracticeQuestion() {
  const text = TKA_DATA.texts.find(t => t.id === AppState.selectedTextId);
  const questions = TKA_DATA.questions.filter(q => q.textId === text.id);
  if (AppState.currentQuestionIndex < questions.length - 1) {
    AppState.currentQuestionIndex++;
    renderWorkspacePractice(text);
  }
}

// ------------------------------------------
// FORMAT RENDERERS
// ------------------------------------------
function renderMultipleChoiceOptions(q, savedRecord) {
  const selectedKey = savedRecord ? savedRecord.answer : null;
  return `
    <div class="options-list" id="mc-options-list">
      ${q.options.map(opt => `
        <div class="option-card ${selectedKey === opt.key ? 'selected' : ''}" 
             data-key="${opt.key}" 
             onclick="${savedRecord ? '' : `selectMCOption('${opt.key}')`}">
          <div class="opt-radio-circle"></div>
          <div class="opt-text" style="white-space: pre-line;"><strong>(${opt.key})</strong> ${opt.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function selectMCOption(key) {
  document.querySelectorAll('#mc-options-list .option-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.key === key);
  });
}

function renderMultiSelectOptions(q, savedRecord) {
  const selectedKeys = savedRecord ? savedRecord.answer : [];
  return `
    <div class="options-list" id="ms-options-list">
      ${q.options.map(opt => {
        const isChecked = selectedKeys.includes(opt.key);
        return `
          <div class="checkbox-option-card ${isChecked ? 'selected' : ''}" 
               data-key="${opt.key}" 
               onclick="${savedRecord ? '' : `toggleMSOption('${opt.key}')`}">
            <div class="custom-checkbox-box">${isChecked ? '✓' : ''}</div>
            <div class="opt-text">${opt.text}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleMSOption(key) {
  const card = document.querySelector(`#ms-options-list .checkbox-option-card[data-key="${key}"]`);
  if (!card) return;
  const isSelected = card.classList.toggle('selected');
  card.querySelector('.custom-checkbox-box').textContent = isSelected ? '✓' : '';
}

function renderTrueFalseTable(q, savedRecord) {
  const answers = savedRecord ? savedRecord.answer : {};
  return `
    <div class="interactive-table-wrapper">
      <table class="interactive-table">
        <thead>
          <tr>
            <th style="width: 70%;">Statement</th>
            <th style="width: 15%; text-align: center;">TRUE (T)</th>
            <th style="width: 15%; text-align: center;">FALSE (F)</th>
          </tr>
        </thead>
        <tbody id="tf-table-body">
          ${q.statements.map(s => {
            const userVal = answers[s.id];
            return `
              <tr data-sid="${s.id}">
                <td>${s.text}</td>
                <td class="center-align">
                  <label class="choice-radio-cell">
                    <input type="radio" name="tf_${s.id}" value="T" ${userVal === 'T' ? 'checked' : ''} ${savedRecord ? 'disabled' : ''}>
                  </label>
                </td>
                <td class="center-align">
                  <label class="choice-radio-cell">
                    <input type="radio" name="tf_${s.id}" value="F" ${userVal === 'F' ? 'checked' : ''} ${savedRecord ? 'disabled' : ''}>
                  </label>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderCategorizationTable(q, savedRecord) {
  const answers = savedRecord ? savedRecord.answer : {};
  const catA = q.categories[0];
  const catB = q.categories[1];

  return `
    <div class="interactive-table-wrapper">
      <table class="interactive-table">
        <thead>
          <tr>
            <th style="width: 60%;">Technique / Description</th>
            <th style="width: 20%; text-align: center;">${catA}</th>
            <th style="width: 20%; text-align: center;">${catB}</th>
          </tr>
        </thead>
        <tbody id="cat-table-body">
          ${q.items.map(item => {
            const userVal = answers[item.id];
            return `
              <tr data-itemid="${item.id}">
                <td>${item.statement}</td>
                <td class="center-align">
                  <label class="choice-radio-cell">
                    <input type="radio" name="cat_${item.id}" value="${catA}" ${userVal === catA ? 'checked' : ''} ${savedRecord ? 'disabled' : ''}>
                  </label>
                </td>
                <td class="center-align">
                  <label class="choice-radio-cell">
                    <input type="radio" name="cat_${item.id}" value="${catB}" ${userVal === catB ? 'checked' : ''} ${savedRecord ? 'disabled' : ''}>
                  </label>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ------------------------------------------
// ANSWER SUBMISSION & VERIFICATION
// ------------------------------------------
function submitCurrentAnswer(qId) {
  const q = TKA_DATA.questions.find(item => item.id === qId);
  if (!q) return;

  let userAnswer = null;
  let isCorrect = false;

  if (q.format === 'multiple_choice') {
    const selected = document.querySelector('#mc-options-list .option-card.selected');
    if (!selected) {
      showToast('Please select an answer option first.', 'error');
      return;
    }
    userAnswer = selected.dataset.key;
    isCorrect = (userAnswer === q.officialAnswer);
  } 
  else if (q.format === 'multi_select') {
    const selectedCards = document.querySelectorAll('#ms-options-list .checkbox-option-card.selected');
    if (selectedCards.length === 0) {
      showToast('Please select at least one statement.', 'error');
      return;
    }
    userAnswer = Array.from(selectedCards).map(c => c.dataset.key).sort();
    const officialSorted = [...q.officialAnswer].sort();
    isCorrect = (JSON.stringify(userAnswer) === JSON.stringify(officialSorted));
  } 
  else if (q.format === 'true_false') {
    const answers = {};
    let allSelected = true;
    q.statements.forEach(s => {
      const radio = document.querySelector(`input[name="tf_${s.id}"]:checked`);
      if (!radio) allSelected = false;
      else answers[s.id] = radio.value;
    });
    if (!allSelected) {
      showToast('Please mark True or False for every statement.', 'error');
      return;
    }
    userAnswer = answers;
    isCorrect = q.statements.every(s => answers[s.id] === s.key);
  } 
  else if (q.format === 'categorization') {
    const answers = {};
    let allSelected = true;
    q.items.forEach(item => {
      const radio = document.querySelector(`input[name="cat_${item.id}"]:checked`);
      if (!radio) allSelected = false;
      else answers[item.id] = radio.value;
    });
    if (!allSelected) {
      showToast('Please categorize every item.', 'error');
      return;
    }
    userAnswer = answers;
    isCorrect = q.items.every(item => answers[item.id] === item.correctCategory);
  }

  AppState.progress.userAnswers[q.id] = {
    answer: userAnswer,
    isCorrect: isCorrect,
    timestamp: Date.now()
  };
  saveProgress();

  const text = TKA_DATA.texts.find(t => t.id === q.textId);
  if (text) renderWorkspacePractice(text);
}

// ------------------------------------------
// DIRECT FEEDBACK
// ------------------------------------------
function renderFeedbackBox(q, record) {
  const isCorrect = record.isCorrect;
  const stratObj = TKA_DATA.strategies.find(s => s.type.toLowerCase().includes(q.type.toLowerCase()) || q.type.toLowerCase().includes(s.type.toLowerCase())) || TKA_DATA.strategies[0];

  let bannerHtml = '';
  if (isCorrect) {
    bannerHtml = `
      <div class="feedback-banner banner-correct">
        <div class="feedback-banner-title">✓ CORRECT! Your answer matches official answer.</div>
        <button class="btn btn-outline btn-sm" onclick="toggleDiscussionDetails(${q.id})">🔍 SHOW DISCUSSION</button>
      </div>
    `;
  } else {
    bannerHtml = `
      <div class="feedback-banner banner-incorrect">
        <div>
          <div class="feedback-banner-title">NOT QUITE. LET'S REVIEW THE EVIDENCE.</div>
          <div style="font-size: 0.9rem; margin-top: 4px;">Official Answer: <strong>${q.officialAnswerText}</strong></div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="toggleDiscussionDetails(${q.id})">🔍 SHOW DISCUSSION</button>
      </div>
    `;
  }

  let stepsHtml = `
    <div class="discussion-details-box" id="discussion-box-${q.id}">
      <!-- Step 1: Textual Evidence -->
      <div class="step-card">
        <div class="step-header">STEP 1 — FIND THE EVIDENCE</div>
        <div class="step-content">
          <strong>Bukti Tekstual:</strong>
          <div class="evidence-box" style="white-space: pre-line;">${escapeHtml(q.textualEvidence)}</div>
        </div>
        <div style="margin-top: 12px;">
          <button class="btn btn-primary btn-sm" onclick="viewEvidenceInText(${q.textId}, '${escapeAttr(q.evidenceSnippet || '')}', ${q.evidenceParagraphIndex || 0})">
            👁️ SPOTLIGHT EVIDENCE IN READING TEXT
          </button>
        </div>
      </div>

      <!-- Step 2: Understand the Answer -->
      <div class="step-card">
        <div class="step-header">STEP 2 — UNDERSTAND THE ANSWER (PENJELASAN BUKU RESMI)</div>
        <div class="step-content" style="white-space: pre-line;">${escapeHtml(q.officialExplanation)}</div>
      </div>

      <!-- Step 3: Distractor Analysis -->
      ${q.distractorAnalysis && q.distractorAnalysis.length > 0 ? `
        <div class="step-card" style="border-left-color: var(--accent-amber);">
          <div class="step-header" style="color: var(--accent-amber);">STEP 3 — WHY OTHER OPTIONS ARE NOT CORRECT (ANALISIS & ALASAN OPSI LAIN SALAH)</div>
          <div class="step-content">
            <ul style="list-style: none; padding-left: 0;">
              ${q.distractorAnalysis.map(d => `
                <li style="margin-bottom: 8px; padding-left: 12px; border-left: 2px solid var(--accent-amber);">
                  <strong>(${d.option})</strong> ${escapeHtml(d.analysis)}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <!-- Step 4: TKA Strategy -->
      <div class="step-card" style="border-left-color: var(--accent-green);">
        <div class="step-header" style="color: var(--accent-green);">STEP 4 — TKA STRATEGY (${stratObj.name})</div>
        <div class="step-content">
          ${stratObj.formula ? `<div class="strategy-formula-badge" style="margin-bottom: 10px;">📐 ${stratObj.formula}</div>` : ''}
          <ol class="strategy-steps-list" style="margin-bottom: 0;">
            ${stratObj.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
  `;

  return `
    <div class="feedback-container">
      ${bannerHtml}
      ${stepsHtml}
    </div>
  `;
}

function toggleDiscussionDetails(qId) {
  const box = document.getElementById(`discussion-box-${qId}`);
  if (box) {
    box.style.display = (box.style.display === 'none') ? 'flex' : 'none';
  }
}

// ------------------------------------------
// FONT SIZE & FAMILY CONTROLS
// ------------------------------------------
function changeFontSize(delta) {
  if (delta === 0) {
    AppState.fontSizeLevel = 0;
  } else {
    AppState.fontSizeLevel = Math.max(-1, Math.min(2, AppState.fontSizeLevel + delta));
  }
  applyReadingFontStyles();
  showToast(`Text size adjusted`, 'info');
}

function toggleFontFamily() {
  AppState.fontFamily = AppState.fontFamily === 'serif' ? 'sans' : 'serif';
  const label = document.getElementById('font-family-label');
  if (label) label.textContent = AppState.fontFamily === 'serif' ? 'Serif' : 'Sans-Serif';
  applyReadingFontStyles();
}

function applyReadingFontStyles() {
  const sizeMap = {
    '-1': '1.02rem',
    '0': '1.18rem',
    '1': '1.32rem',
    '2': '1.48rem'
  };

  const currentSize = sizeMap[AppState.fontSizeLevel.toString()] || '1.18rem';
  const currentFont = AppState.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)';

  document.querySelectorAll('.reading-paragraph').forEach(p => {
    p.style.fontSize = currentSize;
    p.style.fontFamily = currentFont;
  });
}

// ==========================================
// GLOBAL VOCABULARY LAB
// ==========================================
function renderGlobalVocabLab() {
  const container = document.getElementById('global-vocab-content-area');
  if (!container) return;

  // Filter vocabulary by text
  let vocabList = [];
  if (AppState.vocabFilter === 'all') {
    TKA_DATA.texts.forEach(t => {
      t.vocabulary.forEach(v => vocabList.push({ ...v, textNumber: t.number }));
    });
  } else {
    const text = TKA_DATA.texts.find(t => t.id === Number(AppState.vocabFilter));
    if (text) {
      vocabList = text.vocabulary.map(v => ({ ...v, textNumber: text.number }));
    }
  }

  // Update pills active states
  document.querySelectorAll('.vocab-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.textfilter === String(AppState.vocabFilter));
  });

  document.querySelectorAll('.vocab-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === AppState.vocabActivity);
  });

  if (AppState.vocabActivity === 'flipcard') {
    renderGlobalVocabFlipcards(vocabList, container);
  } else if (AppState.vocabActivity === 'matching') {
    renderGlobalVocabMatching(vocabList, container);
  } else if (AppState.vocabActivity === 'context') {
    renderGlobalVocabContextQuiz(vocabList, container);
  } else if (AppState.vocabActivity === 'list') {
    renderGlobalVocabTable(vocabList, container);
  }
}

function filterVocabByText(filterVal) {
  AppState.vocabFilter = filterVal;
  renderGlobalVocabLab();
}

function setGlobalVocabActivity(activity) {
  AppState.vocabActivity = activity;
  renderGlobalVocabLab();
}

function renderGlobalVocabFlipcards(vocabList, container) {
  let cardsHtml = '<div class="flip-cards-grid">';
  vocabList.forEach((v, idx) => {
    cardsHtml += `
      <div class="flip-card-wrapper">
        <div class="flip-card-inner" id="flip-card-${idx}" onclick="this.classList.toggle('flipped')">
          <div class="flip-card-front">
            <span class="badge badge-blue">${v.textNumber || 'Word'} #${idx + 1}</span>
            <div>
              <div class="word-title">${v.word}</div>
              <div class="pos-tag">${v.pos}</div>
            </div>
            <div class="hint-text">👆 Click to flip & view meaning</div>
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

function renderGlobalVocabMatching(vocabList, container) {
  const vocabSample = vocabList.slice(0, 6);
  const shuffledMeanings = [...vocabSample].sort(() => Math.random() - 0.5);

  let html = `
    <div style="background: var(--bg-card); padding: 26px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: 20px;">
      <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 6px; font-weight: 800;">🧩 Activity 2 — Match the Word</h3>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 22px;">Click a word on the left, then click its matching Indonesian meaning on the right!</p>
      
      <div class="matching-game-grid">
        <div class="match-column" id="match-col-left">
          ${vocabSample.map(v => `
            <div class="match-item" data-word="${v.word}" onclick="handleMatchSelect('left', '${v.word}')">
              ${v.word} <span style="font-size: 0.8rem; color: var(--text-muted);">(${v.pos})</span>
            </div>
          `).join('')}
        </div>
        <div class="match-column" id="match-col-right">
          ${shuffledMeanings.map(v => `
            <div class="match-item" data-word="${v.word}" onclick="handleMatchSelect('right', '${v.word}')">
              ${v.meaning}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="renderGlobalVocabLab()">🔄 Reset Game</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
  AppState.matchingState = { selectedLeft: null, selectedRight: null, matchedPairs: [] };
}

function handleMatchSelect(col, word) {
  if (AppState.matchingState.matchedPairs.includes(word)) return;

  if (col === 'left') {
    AppState.matchingState.selectedLeft = word;
    document.querySelectorAll('#match-col-left .match-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.word === word && !AppState.matchingState.matchedPairs.includes(word));
    });
  } else {
    AppState.matchingState.selectedRight = word;
    document.querySelectorAll('#match-col-right .match-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.word === word && !AppState.matchingState.matchedPairs.includes(word));
    });
  }

  if (AppState.matchingState.selectedLeft && AppState.matchingState.selectedRight) {
    if (AppState.matchingState.selectedLeft === AppState.matchingState.selectedRight) {
      const matched = AppState.matchingState.selectedLeft;
      AppState.matchingState.matchedPairs.push(matched);
      
      const leftEl = document.querySelector(`#match-col-left [data-word="${matched}"]`);
      const rightEl = document.querySelector(`#match-col-right [data-word="${matched}"]`);
      if (leftEl) { leftEl.classList.remove('selected'); leftEl.classList.add('matched'); leftEl.innerHTML += ' ✓'; }
      if (rightEl) { rightEl.classList.remove('selected'); rightEl.classList.add('matched'); rightEl.innerHTML += ' ✓'; }

      showToast(`Correct match: "${matched}"!`, 'success');
      AppState.matchingState.selectedLeft = null;
      AppState.matchingState.selectedRight = null;

      if (AppState.matchingState.matchedPairs.length === 6) {
        showToast('🎉 Awesome! You matched all vocabulary pairs!', 'success');
      }
    } else {
      showToast('Not quite a match. Try again!', 'error');
      setTimeout(() => {
        document.querySelectorAll('.match-item.selected').forEach(el => el.classList.remove('selected'));
        AppState.matchingState.selectedLeft = null;
        AppState.matchingState.selectedRight = null;
      }, 500);
    }
  }
}

function renderGlobalVocabContextQuiz(vocabList, container) {
  const currentIdx = AppState.contextQuizState.currentIndex % vocabList.length;
  const currentV = vocabList[currentIdx];

  const otherMeanings = vocabList.filter(item => item.word !== currentV.word).map(item => item.meaning);
  const options = [currentV.meaning, ...otherMeanings.slice(0, 3)].sort(() => Math.random() - 0.5);

  let html = `
    <div style="background: var(--bg-card); padding: 34px; border-radius: 14px; border: 1px solid var(--border-color); max-width: 780px; margin: 0 auto; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <span class="badge badge-amber">Context Challenge (${currentV.textNumber || 'Text'})</span>
        <span style="font-size: 0.92rem; color: var(--text-muted); font-weight: 700;">Word ${currentIdx + 1} of ${vocabList.length}</span>
      </div>

      <h3 style="font-size: 1.3rem; color: var(--text-main); margin-bottom: 16px; font-weight: 800;">What is the meaning of "<span style="color: var(--academic-blue);">${currentV.word}</span>" in this context?</h3>
      
      <div style="background: var(--bg-card-alt); border-left: 4px solid var(--academic-blue); padding: 18px; border-radius: 8px; font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 26px; color: var(--text-main);">
        "${currentV.context}"
      </div>

      <div class="options-list" id="context-options-list">
        ${options.map(opt => `
          <div class="option-card" onclick="checkContextAnswer('${escapeHtml(opt)}', '${escapeHtml(currentV.meaning)}', this)">
            <div class="opt-radio-circle"></div>
            <div class="opt-text">${opt}</div>
          </div>
        `).join('')}
      </div>

      <div id="context-feedback-box" style="display: none; margin-top: 20px;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-color);">
        <button class="btn btn-outline btn-sm" onclick="speakWord('${currentV.word}')">🔊 Listen Word</button>
        <button class="btn btn-primary" id="btn-next-context" style="display: none;" onclick="nextGlobalContextQuiz(${vocabList.length})">Next Word →</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function checkContextAnswer(chosen, correct, el) {
  if (AppState.contextQuizState.answered) return;
  AppState.contextQuizState.answered = true;

  const isRight = chosen === correct;
  const feedbackBox = document.getElementById('context-feedback-box');
  const nextBtn = document.getElementById('btn-next-context');

  document.querySelectorAll('#context-options-list .option-card').forEach(card => {
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
          ✓ Correct! <strong>${correct}</strong> fits the context perfectly.
        </div>
      `;
    } else {
      feedbackBox.innerHTML = `
        <div style="background: var(--accent-red-light); color: var(--accent-red); padding: 16px; border-radius: 8px; font-weight: 700;">
          ✗ Incorrect. The contextual meaning is: <strong>${correct}</strong>.
        </div>
      `;
    }
  }

  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function nextGlobalContextQuiz(total) {
  AppState.contextQuizState.answered = false;
  AppState.contextQuizState.currentIndex = (AppState.contextQuizState.currentIndex + 1) % total;
  renderGlobalVocabLab();
}

function renderGlobalVocabTable(vocabList, container) {
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

// ==========================================
// GLOBAL TKA STRATEGY GUIDE
// ==========================================
function renderGlobalTKAStrategy() {
  const container = document.getElementById('global-strategy-cards-container');
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
// FINAL TKA REVIEW & REPORT
// ==========================================
function renderFinalReview() {
  const total = TKA_DATA.questions.length;
  let correct = 0;
  let answered = 0;
  const typeMap = {};

  TKA_DATA.questions.forEach(q => {
    if (!typeMap[q.type]) typeMap[q.type] = { total: 0, correct: 0 };
    typeMap[q.type].total++;

    const rec = AppState.progress.userAnswers[q.id];
    if (rec) {
      answered++;
      if (rec.isCorrect) {
        correct++;
        typeMap[q.type].correct++;
      }
    }
  });

  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  let weakestType = null;
  let lowestAcc = 100;
  Object.keys(typeMap).forEach(t => {
    const acc = Math.round((typeMap[t].correct / typeMap[t].total) * 100);
    if (acc < lowestAcc) {
      lowestAcc = acc;
      weakestType = t;
    }
  });

  const strat = TKA_DATA.strategies.find(s => s.type.toLowerCase().includes((weakestType || '').toLowerCase())) || TKA_DATA.strategies[2];

  const container = document.getElementById('final-review-container');
  if (!container) return;

  container.innerHTML = `
    <div class="dashboard-header" style="margin-bottom: 24px;">
      <h2 class="dashboard-title">🎓 FINAL TKA COMPREHENSIVE REPORT</h2>
      <p class="dashboard-subtitle">Senior High School TKA English Evaluation (Questions 1–20)</p>
    </div>

    <div class="final-review-grid">
      <!-- Left: Overall Scores & Type Analysis -->
      <div style="background: var(--bg-card); border-radius: 18px; padding: 36px; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="font-size: 4rem; font-weight: 900; color: var(--academic-blue); line-height: 1;">${correct}/${total}</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-top: 10px;">Overall Accuracy: ${accuracy}%</div>
          <p style="font-size: 0.92rem; color: var(--text-muted);">Completed ${answered} of ${total} Questions</p>
        </div>

        <h3 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; font-weight: 800;">📊 QUESTION TYPE MASTERY</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${Object.keys(typeMap).map(t => {
            const tTotal = typeMap[t].total;
            const tCorr = typeMap[t].correct;
            const tPct = Math.round((tCorr / tTotal) * 100);
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: var(--text-main);">${t}</span>
                  <span style="color: var(--text-muted); font-weight: 600;">${tCorr}/${tTotal} (${tPct}%)</span>
                </div>
                <div style="height: 8px; background: var(--bg-card-alt); border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${tPct}%; background: ${tPct >= 80 ? 'var(--accent-green)' : tPct >= 50 ? 'var(--academic-blue)' : 'var(--accent-amber)'};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right: Recommendation & Challenge Modes -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="recommendation-card">
          <div class="rec-title">💡 PERSONALIZED STUDY RECOMMENDATION</div>
          <div class="rec-body">
            <p style="margin-bottom: 14px;">
              Based on your question breakdown, you should focus on: <br>
              <strong style="color: #fef08a; font-size: 1.25rem;">${weakestType || 'Inference'} Questions</strong>
            </p>
            <p style="margin-bottom: 16px;">
              <strong>Reason:</strong> You need more practice connecting explicit details with unspoken deductions and thematic conclusions.
            </p>
            <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 10px; border-left: 4px solid #38bdf8;">
              <strong>Recommended Strategy (${strat.name}):</strong><br>
              ${strat.formula ? `<span style="color: #6ee7b7; font-weight: 800;">${strat.formula}</span><br>` : ''}
              <span style="font-size: 0.9rem;">${strat.steps.join(' • ')}</span>
            </div>
          </div>
        </div>

        <div style="background: var(--bg-card); border-radius: 18px; padding: 30px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 16px; font-weight: 800;">🚀 PRACTICE AGAIN</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <button class="btn btn-outline" onclick="startTestMode('random')">🎲 Random Mode</button>
            <button class="btn btn-outline" onclick="startTestMode('review_mistakes')">⚠️ Review Mistakes</button>
            <button class="btn btn-primary" onclick="startTestMode('full_test')">⏱️ Full Test (20 Qs)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function startTestMode(mode) {
  AppState.testMode = mode;
  AppState.testAnswers = {};
  AppState.fullTestCompleted = false;

  if (mode === 'random') {
    AppState.testQuestions = [...TKA_DATA.questions].sort(() => Math.random() - 0.5);
  } else if (mode === 'review_mistakes') {
    AppState.testQuestions = TKA_DATA.questions.filter(q => {
      const rec = AppState.progress.userAnswers[q.id];
      return rec && !rec.isCorrect;
    });
    if (AppState.testQuestions.length === 0) {
      showToast('Great job! You have no recorded mistakes.', 'success');
      return;
    }
  } else if (mode === 'full_test') {
    AppState.testQuestions = [...TKA_DATA.questions];
  }

  AppState.currentQuestionIndex = 0;
  setView('full_test');
}

// ==========================================
// FULL TEST / CHALLENGE MODE ENGINE
// ==========================================
function renderFullTestMode() {
  const container = document.getElementById('full-test-container');
  if (!container) return;

  const questions = AppState.testQuestions;
  const qIndex = AppState.currentQuestionIndex;
  const currentQ = questions[qIndex];

  if (!currentQ) return;

  let modeTitle = 'Full Test Mode (20 Questions)';
  if (AppState.testMode === 'random') modeTitle = '🎲 Random Mode';
  if (AppState.testMode === 'review_mistakes') modeTitle = '⚠️ Review Mistakes Mode';

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="font-size: 1.7rem; font-weight: 900; color: var(--text-main);">${modeTitle}</h2>
        <p style="font-size: 0.92rem; color: var(--text-muted);">Answer questions without immediate answers until full submission.</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="setView('dashboard')">✕ Exit Test</button>
    </div>

    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px;">
      ${questions.map((q, idx) => `
        <button class="q-nav-pill ${AppState.testAnswers[q.id] ? 'answered-correct' : ''} ${idx === qIndex ? 'active' : ''}" onclick="jumpToTestQuestion(${idx})">
          ${idx + 1}
        </button>
      `).join('')}
    </div>

    <div class="question-main-card">
      <div class="q-badge-row">
        <span class="badge badge-blue">Text ${currentQ.textId} • ${currentQ.type}</span>
        <span style="font-size: 0.92rem; font-weight: 800; color: var(--text-muted);">Question ${qIndex + 1} of ${questions.length}</span>
      </div>

      <div class="q-title-text" style="white-space: pre-line;">${escapeHtml(currentQ.question)}</div>
  `;

  if (currentQ.format === 'multiple_choice') {
    const userSel = AppState.testAnswers[currentQ.id];
    html += `
      <div class="options-list" id="test-mc-options">
        ${currentQ.options.map(opt => `
          <div class="option-card ${userSel === opt.key ? 'selected' : ''}" onclick="selectTestMCOption(${currentQ.id}, '${opt.key}')">
            <div class="opt-radio-circle"></div>
            <div class="opt-text" style="white-space: pre-line;"><strong>(${opt.key})</strong> ${opt.text}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentQ.format === 'multi_select') {
    const userSel = AppState.testAnswers[currentQ.id] || [];
    html += `
      <div class="options-list" id="test-ms-options">
        ${currentQ.options.map(opt => `
          <div class="checkbox-option-card ${userSel.includes(opt.key) ? 'selected' : ''}" onclick="toggleTestMSOption(${currentQ.id}, '${opt.key}')">
            <div class="custom-checkbox-box">${userSel.includes(opt.key) ? '✓' : ''}</div>
            <div class="opt-text">${opt.text}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentQ.format === 'categorization') {
    const userSel = AppState.testAnswers[currentQ.id] || {};
    html += `
      <div class="interactive-table-wrapper">
        <table class="interactive-table">
          <thead><tr><th>Technique</th><th style="text-align:center;">${currentQ.categories[0]}</th><th style="text-align:center;">${currentQ.categories[1]}</th></tr></thead>
          <tbody>
            ${currentQ.items.map(item => `
              <tr>
                <td>${item.statement}</td>
                <td class="center-align"><input type="radio" name="test_cat_${item.id}" value="${currentQ.categories[0]}" ${userSel[item.id] === currentQ.categories[0] ? 'checked' : ''} onchange="setTestCat(${currentQ.id}, '${item.id}', '${currentQ.categories[0]}')"></td>
                <td class="center-align"><input type="radio" name="test_cat_${item.id}" value="${currentQ.categories[1]}" ${userSel[item.id] === currentQ.categories[1] ? 'checked' : ''} onchange="setTestCat(${currentQ.id}, '${item.id}', '${currentQ.categories[1]}')"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  html += `
      <div class="q-action-footer">
        <button class="btn btn-secondary" onclick="prevTestQuestion()" ${qIndex === 0 ? 'disabled' : ''}>← Previous</button>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${qIndex < questions.length - 1 ? `
            <button class="btn btn-primary" onclick="nextTestQuestion()">Next Question →</button>
          ` : `
            <button class="btn btn-success btn-lg" onclick="finishFullTest()">FINISH & SUBMIT TEST 🏁</button>
          `}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function jumpToTestQuestion(idx) {
  AppState.currentQuestionIndex = idx;
  renderFullTestMode();
}

function prevTestQuestion() {
  if (AppState.currentQuestionIndex > 0) {
    AppState.currentQuestionIndex--;
    renderFullTestMode();
  }
}

function nextTestQuestion() {
  if (AppState.currentQuestionIndex < AppState.testQuestions.length - 1) {
    AppState.currentQuestionIndex++;
    renderFullTestMode();
  }
}

function selectTestMCOption(qId, key) {
  AppState.testAnswers[qId] = key;
  renderFullTestMode();
}

function toggleTestMSOption(qId, key) {
  if (!AppState.testAnswers[qId]) AppState.testAnswers[qId] = [];
  const idx = AppState.testAnswers[qId].indexOf(key);
  if (idx > -1) AppState.testAnswers[qId].splice(idx, 1);
  else AppState.testAnswers[qId].push(key);
  renderFullTestMode();
}

function setTestCat(qId, itemId, val) {
  if (!AppState.testAnswers[qId]) AppState.testAnswers[qId] = {};
  AppState.testAnswers[qId][itemId] = val;
}

function finishFullTest() {
  AppState.testQuestions.forEach(q => {
    const userAns = AppState.testAnswers[q.id];
    if (userAns !== undefined) {
      let isCorrect = false;
      if (q.format === 'multiple_choice') isCorrect = (userAns === q.officialAnswer);
      else if (q.format === 'multi_select') isCorrect = (JSON.stringify([...userAns].sort()) === JSON.stringify([...q.officialAnswer].sort()));
      else if (q.format === 'categorization') isCorrect = q.items.every(item => userAns[item.id] === item.correctCategory);

      AppState.progress.userAnswers[q.id] = {
        answer: userAns,
        isCorrect: isCorrect,
        timestamp: Date.now()
      };
    }
  });

  saveProgress();
  showToast('Test successfully completed and scored!', 'success');
  setView('final_review');
}

// ==========================================
// MISTAKE REVIEW & RESET MODAL
// ==========================================
function openMistakeReviewModal(textId) {
  const questions = TKA_DATA.questions.filter(q => q.textId === textId);
  const wrongQuestions = questions.filter(q => {
    const rec = AppState.progress.userAnswers[q.id];
    return rec && !rec.isCorrect;
  });

  const modalBody = document.getElementById('generic-modal-body');
  const modalTitle = document.getElementById('generic-modal-title');
  if (!modalBody || !modalTitle) return;

  modalTitle.textContent = `Mistake Review - Text ${textId}`;
  
  let html = `<div style="display: flex; flex-direction: column; gap: 20px; max-height: 65vh; overflow-y: auto; padding-right: 6px;">`;
  wrongQuestions.forEach(q => {
    html += `
      <div style="background: var(--bg-card-alt); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span class="badge badge-amber">Question ${q.number} • ${q.type}</span>
        </div>
        <p style="font-weight: 700; color: var(--text-main); margin-bottom: 8px;">${q.question}</p>
        <div style="font-size: 0.95rem; margin-bottom: 8px; color: var(--text-main);">Official Answer: <strong>${q.officialAnswerText}</strong></div>
        <div style="font-size: 0.88rem; color: var(--text-secondary); background: var(--bg-card); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color); margin-bottom: 12px;">
          <strong>Explanation:</strong> ${q.officialExplanation}
        </div>
        <button class="btn btn-sm btn-outline" onclick="retryQuestion(${q.id})">🔄 Try Again</button>
      </div>
    `;
  });
  html += `</div>`;

  modalBody.innerHTML = html;
  openModal('generic-modal');
}

function retryQuestion(qId) {
  delete AppState.progress.userAnswers[qId];
  saveProgress();
  closeModal('generic-modal');
  
  const q = TKA_DATA.questions.find(item => item.id === qId);
  if (q) {
    const textQuestions = TKA_DATA.questions.filter(item => item.textId === q.textId);
    const qIdx = textQuestions.findIndex(item => item.id === qId);
    openTextWorkspace(q.textId, qIdx);
  }
}

function openResetModal() {
  openModal('reset-confirm-modal');
}

function confirmResetProgress() {
  AppState.progress = {
    userAnswers: {},
    completedTexts: {}
  };
  localStorage.removeItem(STORAGE_KEY);
  closeModal('reset-confirm-modal');
  showToast('Progress has been completely reset.', 'info');
  setView('dashboard');
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

// ==========================================
// LIVE REKAP SISWA (TEACHER FIRESTORE SYNC)
// ==========================================
AppState.submissions = [];
AppState.unsubscribeLiveSubmissions = null;

function initLiveSubmissionsListener() {
  if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
    AppState.unsubscribeLiveSubmissions = FirebaseService.listenToSubmissions(
      (submissions) => {
        AppState.submissions = submissions;
        updateLiveBadgeCount();
        if (AppState.currentView === 'live_submissions') {
          renderLiveSubmissions();
        }
      },
      (error) => {
        console.warn("Live submissions listen error:", error);
      }
    );
  } else {
    // Check if there are local demo submissions or prompt setup
    updateLiveBadgeCount();
  }
}

function updateLiveBadgeCount() {
  const countBadge = document.getElementById('badge-submission-count');
  if (countBadge) {
    if (AppState.submissions.length > 0) {
      countBadge.textContent = AppState.submissions.length;
      countBadge.style.display = 'inline-block';
    } else {
      countBadge.style.display = 'none';
    }
  }
}

function refreshSubmissionsManually() {
  if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
    showToast('Menyegarkan data dari Firebase...', 'info');
    initLiveSubmissionsListener();
  } else {
    showToast('Firebase belum terhubung. Silakan isi API Key di firebase-config.js.', 'warning');
  }
}

function renderLiveSubmissions() {
  const container = document.getElementById('live-submissions-table-area');
  if (!container) return;

  const totalSubs = AppState.submissions.length;
  let totalScoreSum = 0;
  let highestScore = 0;
  let totalReasonsCount = 0;
  const classesSet = new Set();

  AppState.submissions.forEach(sub => {
    const score = sub.score || 0;
    totalScoreSum += score;
    if (score > highestScore) highestScore = score;
    totalReasonsCount += (sub.reasonedCount || 0);
    if (sub.studentClass) classesSet.add(sub.studentClass.trim());
  });

  const avgAccuracy = totalSubs > 0 ? Math.round((totalScoreSum / (totalSubs * 20)) * 100) : 0;
  const avgReasonPercent = totalSubs > 0 ? Math.round((totalReasonsCount / (totalSubs * 20)) * 100) : 0;

  // Update Stats Cards
  const totalEl = document.getElementById('live-stat-total');
  if (totalEl) totalEl.textContent = totalSubs;
  const avgEl = document.getElementById('live-stat-avg');
  if (avgEl) avgEl.textContent = `${avgAccuracy}%`;
  const highEl = document.getElementById('live-stat-highest');
  if (highEl) highEl.textContent = `${highestScore}/20`;
  const resEl = document.getElementById('live-stat-reasons');
  if (resEl) resEl.textContent = `${avgReasonPercent}%`;

  // Update Class Filter Options
  const classFilterSelect = document.getElementById('live-class-filter');
  if (classFilterSelect) {
    const currentVal = classFilterSelect.value;
    let optHtml = '<option value="all">Semua Kelas</option>';
    Array.from(classesSet).sort().forEach(cls => {
      optHtml += `<option value="${escapeHtml(cls)}" ${cls === currentVal ? 'selected' : ''}>${escapeHtml(cls)}</option>`;
    });
    classFilterSelect.innerHTML = optHtml;
  }

  filterLiveSubmissionsTable();
}

function filterLiveSubmissionsTable() {
  const container = document.getElementById('live-submissions-table-area');
  if (!container) return;

  const searchVal = (document.getElementById('live-search-input')?.value || '').toLowerCase().trim();
  const classVal = document.getElementById('live-class-filter')?.value || 'all';
  const sortVal = document.getElementById('live-sort-filter')?.value || 'time_desc';

  let filtered = [...AppState.submissions];

  // Filter Search
  if (searchVal) {
    filtered = filtered.filter(s => (s.studentName || '').toLowerCase().includes(searchVal));
  }

  // Filter Class
  if (classVal !== 'all') {
    filtered = filtered.filter(s => (s.studentClass || '').trim() === classVal);
  }

  // Sort
  if (sortVal === 'score_desc') {
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else if (sortVal === 'score_asc') {
    filtered.sort((a, b) => (a.score || 0) - (b.score || 0));
  } else if (sortVal === 'name_asc') {
    filtered.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));
  } else {
    // time_desc
    filtered.sort((a, b) => {
      const timeA = a.clientTimestamp ? new Date(a.clientTimestamp).getTime() : 0;
      const timeB = b.clientTimestamp ? new Date(b.clientTimestamp).getTime() : 0;
      return timeB - timeA;
    });
  }

  if (filtered.length === 0) {
    const isConfigured = typeof FirebaseService !== 'undefined' && FirebaseService.isReady();
    container.innerHTML = `
      <div style="padding: 48px 24px; text-align: center; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">📡</div>
        <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">
          ${isConfigured ? 'Belum Ada Lembar Jawaban Siswa Masuk' : 'Firebase Database Belum Dikonfigurasi'}
        </h4>
        <p style="font-size: 0.92rem; max-width: 540px; margin: 0 auto; line-height: 1.6;">
          ${isConfigured 
            ? 'Ketika siswa menyelesaikan pengerjaan di Lembar Kerja Siswa (student.html) dan menekan tombol Kirim, datanya akan langsung otomatis muncul di sini secara realtime.' 
            : 'Silakan hubungkan API Key Firebase Anda pada file <code>firebase-config.js</code> untuk mengaktifkan sinkronisasi realtime cloud gratis dari Google.'}
        </p>
      </div>
    `;
    return;
  }

  let tableHtml = `
    <table class="vocab-table" style="margin: 0;">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Siswa</th>
          <th>Kelas</th>
          <th>Skor Akhir</th>
          <th>Akurasi</th>
          <th>Alasan HOTS</th>
          <th>Waktu Kirim</th>
          <th style="text-align: center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;

  filtered.forEach((sub, idx) => {
    const score = sub.score || 0;
    const accuracy = Math.round((score / 20) * 100);
    const reasoned = sub.reasonedCount || 0;
    
    let scoreBadge = `<span class="badge badge-green">${score}/20 (${accuracy}%)</span>`;
    if (accuracy < 60) scoreBadge = `<span class="badge badge-amber">${score}/20 (${accuracy}%)</span>`;
    if (accuracy < 40) scoreBadge = `<span class="badge" style="background:#fee2e2; color:#ef4444;">${score}/20 (${accuracy}%)</span>`;

    let timeFormatted = '-';
    if (sub.clientTimestamp) {
      const d = new Date(sub.clientTimestamp);
      timeFormatted = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }

    tableHtml += `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td><strong style="color: var(--text-main); font-size: 1.02rem;">${escapeHtml(sub.studentName || '-')}</strong></td>
        <td><span class="badge badge-cyan">${escapeHtml(sub.studentClass || '-')}</span></td>
        <td>${scoreBadge}</td>
        <td><strong>${accuracy}%</strong></td>
        <td><span class="badge badge-purple">${reasoned}/20 Terisi</span></td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${timeFormatted}</td>
        <td style="text-align: center;">
          <button class="btn btn-primary btn-sm" onclick="openStudentSubmissionDetail('${sub.id}')" style="padding: 5px 10px; font-size: 0.82rem;">
            🔍 Lihat Rincian
          </button>
        </td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;
  container.innerHTML = tableHtml;
}

function openStudentSubmissionDetail(submissionId) {
  const sub = AppState.submissions.find(s => s.id === submissionId);
  if (!sub) return;

  const modalTitle = document.getElementById('sub-modal-student-name');
  const modalBody = document.getElementById('sub-modal-content-body');
  if (!modalTitle || !modalBody) return;

  modalTitle.textContent = `${sub.studentName || 'Siswa'} (${sub.studentClass || '-'})`;

  const score = sub.score || 0;
  const accuracy = Math.round((score / 20) * 100);
  const reasoned = sub.reasonedCount || 0;

  let bodyHtml = `
    <!-- Top Meta Stats -->
    <div style="background: var(--bg-card-alt); border-radius: 12px; padding: 18px 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px; border: 1px solid var(--border-color);">
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Total Skor:</div>
        <div style="font-size: 1.4rem; font-weight: 900; color: var(--academic-blue);">${score}/20 (${accuracy}%)</div>
      </div>
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Kelengkapan Alasan:</div>
        <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-green);">${reasoned}/20 Soal</div>
      </div>
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Waktu Pengiriman:</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">${sub.clientTimestamp ? new Date(sub.clientTimestamp).toLocaleString('id-ID') : '-'}</div>
      </div>
    </div>

    <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 14px;">📋 Pemeriksaan Jawaban & Bukti Teks Siswa:</h4>
    <div style="display: flex; flex-direction: column; gap: 16px;">
  `;

  TKA_DATA.questions.forEach(q => {
    const qRecord = (sub.answers && sub.answers[q.id]) || { answer: null, reason: '', isCorrect: false };
    const isCorrect = qRecord.isCorrect;
    const hasReason = qRecord.reason && qRecord.reason.trim().length > 0;

    let ansDisplay = '<em>(Tidak Dijawab)</em>';
    if (qRecord.answer !== null && qRecord.answer !== undefined) {
      if (q.format === 'multiple_choice') {
        const opt = q.options.find(o => o.key === qRecord.answer);
        ansDisplay = `<strong>Opsi (${qRecord.answer}):</strong> ${opt ? escapeHtml(opt.text) : ''}`;
      } else if (q.format === 'multi_select') {
        ansDisplay = `<strong>Pilihan:</strong> [${qRecord.answer.join(', ')}]`;
      } else if (q.format === 'categorization') {
        ansDisplay = Object.keys(qRecord.answer).map(k => `${k}: ${qRecord.answer[k]}`).join(' | ');
      }
    }

    bodyHtml += `
      <div style="background: var(--bg-card-alt); border-radius: 10px; border: 1.5px solid ${isCorrect ? '#86efac' : '#fca5a5'}; padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge badge-blue">Soal #${q.number} (${q.type})</span>
          <span class="badge ${isCorrect ? 'badge-green' : 'badge-amber'}">${isCorrect ? '✓ Benar' : '✗ Salah'}</span>
        </div>
        <div style="font-weight: 700; font-size: 0.98rem; color: var(--text-main); margin-bottom: 10px;">${escapeHtml(q.question)}</div>
        
        <div style="background: var(--bg-card); padding: 10px 14px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.92rem; margin-bottom: 10px;">
          <span style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; font-weight: 800;">Jawaban Siswa:</span><br>
          ${ansDisplay}
        </div>

        <div style="background: ${hasReason ? 'var(--accent-cyan-light)' : '#f1f5f9'}; border-left: 3px solid var(--academic-blue); padding: 10px 14px; border-radius: 6px; font-size: 0.9rem;">
          <strong style="color: var(--academic-blue); font-size: 0.82rem;">✍️ Alasan & Bukti Teks dari Siswa:</strong>
          <p style="margin-top: 3px; color: var(--text-main); font-style: ${hasReason ? 'normal' : 'italic'};">
            ${hasReason ? escapeHtml(qRecord.reason) : 'Siswa tidak mencantumkan alasan.'}
          </p>
        </div>
      </div>
    `;
  });

  bodyHtml += `</div>`;
  modalBody.innerHTML = bodyHtml;
  openModal('submission-detail-modal');
}

function exportSubmissionsToCSV() {
  if (!AppState.submissions || AppState.submissions.length === 0) {
    showToast('Belum ada data nilai siswa untuk diunduh.', 'warning');
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "No,Nama Siswa,Kelas,Skor (dari 20),Persentase Akurasi,Jumlah Alasan HOTS,Waktu Submit\n";

  AppState.submissions.forEach((s, idx) => {
    const accuracy = Math.round(((s.score || 0) / 20) * 100);
    const dateStr = s.clientTimestamp ? new Date(s.clientTimestamp).toLocaleString('id-ID') : '-';
    csvContent += `"${idx + 1}","${(s.studentName || '').replace(/"/g, '""')}","${(s.studentClass || '').replace(/"/g, '""')}","${s.score || 0}","${accuracy}%","${s.reasonedCount || 0}","${dateStr}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Rekap_Nilai_TKA_2025_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('File Rekap Nilai CSV berhasil diunduh.', 'success');
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function setupGlobalEvents() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', initApp);

