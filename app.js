// ============================================================
// app.js — Multi-language Conversation Learning App
// Supports Chinese (zh) and Spanish (es)
// ============================================================

// ------------------------------------------------------------
// 0. Language Configuration
// ------------------------------------------------------------
const LANGS = {
  zh: {
    code: 'zh',
    name: '中文',
    nameKr: '중국어',
    emoji: '🐼',
    progressKey: 'learnChinese_progress',
    ttsLang: 'zh-CN',
    ttsRate: 0.85,
    foreignField: 'chinese',
    pronField: 'pinyin',
    titleField: 'titleCn',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '중국어 → 한국어',
      kr_to_foreign: '한국어 → 중국어',
    },
  },
  es: {
    code: 'es',
    name: 'Español',
    nameKr: '스페인어',
    emoji: '🇪🇸',
    progressKey: 'learnSpanish_progress',
    ttsLang: 'es-ES',
    ttsRate: 0.9,
    foreignField: 'spanish',
    pronField: 'pronunciation',
    titleField: 'titleEs',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '스페인어 → 한국어',
      kr_to_foreign: '한국어 → 스페인어',
    },
  },
  fr: {
    code: 'fr',
    name: 'Français',
    nameKr: '프랑스어',
    emoji: '🇫🇷',
    progressKey: 'learnFrench_progress',
    ttsLang: 'fr-FR',
    ttsRate: 0.9,
    foreignField: 'french',
    pronField: 'pronunciation',
    titleField: 'titleFr',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '프랑스어 → 한국어',
      kr_to_foreign: '한국어 → 프랑스어',
    },
  },
  ja: {
    code: 'ja',
    name: '日本語',
    nameKr: '일본어',
    emoji: '🇯🇵',
    progressKey: 'learnJapanese_progress',
    ttsLang: 'ja-JP',
    ttsRate: 0.9,
    foreignField: 'japanese',
    pronField: 'reading',
    titleField: 'titleJa',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '일본어 → 한국어',
      kr_to_foreign: '한국어 → 일본어',
    },
  },
  sw: {
    code: 'sw',
    name: 'Kiswahili',
    nameKr: '스와힐리어',
    emoji: '🇰🇪',
    progressKey: 'learnSwahili_progress',
    ttsLang: 'sw',
    ttsRate: 0.9,
    foreignField: 'swahili',
    pronField: 'pronunciation',
    titleField: 'titleSw',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '스와힐리어 → 한국어',
      kr_to_foreign: '한국어 → 스와힐리어',
    },
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    nameKr: '아랍어',
    emoji: '🇸🇦',
    progressKey: 'learnArabic_progress',
    ttsLang: 'ar-SA',
    ttsRate: 0.85,
    foreignField: 'arabic',
    pronField: 'romanization',
    titleField: 'titleAr',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '아랍어 → 한국어',
      kr_to_foreign: '한국어 → 아랍어',
    },
  },
};

// ------------------------------------------------------------
// 0-1. Data Loader (fetch JSON from data/{lang}/)
// ------------------------------------------------------------
const DataLoader = {
  _metaCache: {},   // { zh: { totalLevels, titles, icons }, es: ... }
  _levelCache: {},  // { 'zh-1': { ... }, 'es-3': { ... } }

  async loadMeta(langCode) {
    if (this._metaCache[langCode]) return this._metaCache[langCode];
    const resp = await fetch(`data/${langCode}/meta.json`);
    const meta = await resp.json();
    this._metaCache[langCode] = meta;
    return meta;
  },

  async loadLevel(langCode, level) {
    const key = `${langCode}-${level}`;
    if (this._levelCache[key]) return this._levelCache[key];
    const num = String(level).padStart(2, '0');
    const resp = await fetch(`data/${langCode}/level${num}.json`);
    const data = await resp.json();
    this._levelCache[key] = data;
    return data;
  },

  async getTotal(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.totalLevels;
  },

  async getTitles(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.titles;
  },

  async getIcons(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.icons;
  },
};

let currentLang = null; // set by router

function getLang() {
  return LANGS[currentLang] || LANGS.zh;
}

// ------------------------------------------------------------
// 1. Progress Manager (per-language)
// ------------------------------------------------------------
const Progress = {
  _stores: {},

  _getStore(langCode) {
    const key = LANGS[langCode]?.progressKey || 'learnChinese_progress';
    if (!this._stores[key]) {
      let data = null;
      try {
        const saved = localStorage.getItem(key);
        if (saved) data = JSON.parse(saved);
      } catch {}
      this._stores[key] = data || { completedLevels: [], scores: {} };
    }
    return { key, data: this._stores[key] };
  },

  _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  isLevelAvailable() { return true; },

  isLevelCompleted(level) {
    const { data } = this._getStore(currentLang);
    return data.completedLevels.includes(level);
  },

  completeLevel(level, score) {
    const { key, data } = this._getStore(currentLang);
    if (!data.completedLevels.includes(level)) {
      data.completedLevels.push(level);
    }
    data.scores[level] = score;
    this._save(key, data);
  },

  getScore(level) {
    const { data } = this._getStore(currentLang);
    return data.scores[level] ?? null;
  },

  getTotalProgress() {
    const { data } = this._getStore(currentLang);
    return data.completedLevels.length;
  },
};

// ------------------------------------------------------------
// 2. Router
// ------------------------------------------------------------
function navigate(path) {
  window.location.hash = '#' + path;
}

async function handleRoute() {
  const hash = window.location.hash || '#/';
  let match;

  // Language-prefixed routes: #/zh/... or #/es/...
  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar)\/result\/(\d+)\??(.*)?$/);
  if (match) {
    currentLang = match[1];
    const level = parseInt(match[2]);
    const searchParams = new URLSearchParams(match[3] || '');
    await renderResult(level, searchParams);
    return;
  }

  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar)\/quiz\/(\d+)$/);
  if (match) {
    currentLang = match[1];
    await renderQuiz(parseInt(match[2]));
    return;
  }

  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar)\/lesson\/(\d+)$/);
  if (match) {
    currentLang = match[1];
    await renderLesson(parseInt(match[2]));
    return;
  }

  // Language home: #/zh or #/es (also #/chinese → #/zh, #/spanish → #/es)
  if (hash === '#/zh' || hash === '#/chinese') {
    currentLang = 'zh';
    await renderHome();
    return;
  }
  if (hash === '#/es' || hash === '#/spanish') {
    currentLang = 'es';
    await renderHome();
    return;
  }
  if (hash === '#/fr' || hash === '#/french') {
    currentLang = 'fr';
    await renderHome();
    return;
  }
  if (hash === '#/ja' || hash === '#/japanese') {
    currentLang = 'ja';
    await renderHome();
    return;
  }
  if (hash === '#/sw' || hash === '#/swahili') {
    currentLang = 'sw';
    await renderHome();
    return;
  }
  if (hash === '#/ar' || hash === '#/arabic') {
    currentLang = 'ar';
    await renderHome();
    return;
  }

  // Legacy routes without language prefix → Chinese
  match = hash.match(/^#\/result\/(\d+)\??(.*)?$/);
  if (match) {
    currentLang = 'zh';
    await renderResult(parseInt(match[1]), new URLSearchParams(match[2] || ''));
    return;
  }
  match = hash.match(/^#\/quiz\/(\d+)$/);
  if (match) {
    currentLang = 'zh';
    await renderQuiz(parseInt(match[1]));
    return;
  }
  match = hash.match(/^#\/lesson\/(\d+)$/);
  if (match) {
    currentLang = 'zh';
    await renderLesson(parseInt(match[1]));
    return;
  }

  // Landing: language selection
  currentLang = null;
  await renderLangSelect();
}

window.addEventListener('hashchange', handleRoute);

// ------------------------------------------------------------
// TTS — Multi-language speech (Web Speech API)
// ------------------------------------------------------------
const _ttsVoices = {};

function findVoice(langCode) {
  const voices = window.speechSynthesis.getVoices();
  const lang = LANGS[langCode];
  if (!lang) return null;
  const ttsLang = lang.ttsLang;

  // Exact match
  let voice = voices.find(v => v.lang === ttsLang);
  if (voice) return voice;
  // Prefix match
  voice = voices.find(v => v.lang.startsWith(ttsLang.split('-')[0]));
  if (voice) return voice;
  // For Chinese, also try cmn
  if (langCode === 'zh') {
    voice = voices.find(v => v.lang.startsWith('cmn'));
    if (voice) return voice;
  }
  return null;
}

function speakForeign(text, onEnd) {
  if (!('speechSynthesis' in window) || !currentLang) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const lang = getLang();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang.ttsLang;
  utterance.rate = lang.ttsRate;
  if (!_ttsVoices[currentLang]) _ttsVoices[currentLang] = findVoice(currentLang);
  if (_ttsVoices[currentLang]) utterance.voice = _ttsVoices[currentLang];
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

// 자동 음성 재생 설정 (localStorage에서 복원)
let _autoTTS = false;
try { _autoTTS = localStorage.getItem('learnLangs_autoTTS') === 'true'; } catch {}
function setAutoTTS(val) { _autoTTS = val; try { localStorage.setItem('learnLangs_autoTTS', val ? 'true' : 'false'); } catch {} }

// 음성 목록이 비동기로 로드되므로 미리 요청
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    Object.keys(LANGS).forEach(code => { _ttsVoices[code] = findVoice(code); });
  };
  window.speechSynthesis.getVoices();
}

function ttsButton(text) {
  return `<button class="tts-btn" data-tts="${text.replace(/"/g, '&quot;')}" title="발음 듣기">🔊</button>`;
}

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
function renderProgressBar(current, total, label) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return `
    <div class="progress-bar-wrapper">
      ${label ? `<div class="progress-label">${label}</div>` : ''}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${pct}%"></div>
      </div>
    </div>
  `;
}

function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#FA5D29', '#222222', '#EDEDED', '#0693E3', '#7BDCB5', '#FFF083', '#BE185D', '#3B5998'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 3000);
}

// ------------------------------------------------------------
// renderLangSelect() — Language selection landing page
// ------------------------------------------------------------
async function renderLangSelect() {
  hideLessonBg();
  const app = document.getElementById('app');
  const langCodes = Object.keys(LANGS);
  const metas = await Promise.all(langCodes.map(code => DataLoader.loadMeta(code)));

  const langData = langCodes.map((code, i) => {
    const lang = LANGS[code];
    const progress = Progress._getStore(code).data.completedLevels.length;
    const total = metas[i].totalLevels;
    return { code, lang, progress, total };
  });

  // Build wheel items
  let itemsHTML = langData.map((d, i) => `
    <div class="wheel-item" data-index="${i}" data-code="${d.code}">
      <span class="wheel-item-emoji">${d.lang.emoji}</span>
      <div class="wheel-item-info">
        <span class="wheel-item-name">${d.lang.name}</span>
        <span class="wheel-item-kr">${d.lang.nameKr}</span>
      </div>
      <span class="wheel-item-progress">${d.progress}/${d.total}</span>
    </div>
  `).join('');

  app.innerHTML = `
    <div class="lang-select-page">
      <h1 class="lang-select-title">어떤 언어를 배울까요?</h1>
      <p class="lang-select-subtitle">스크롤하여 언어를 선택하세요</p>
      <div class="wheel-container">
        <div class="wheel-highlight"></div>
        <div class="wheel-mask wheel-mask-top"></div>
        <div class="wheel-mask wheel-mask-bottom"></div>
        <div class="wheel-track" id="wheelTrack">
          ${itemsHTML}
        </div>
      </div>
      <a id="wheelSelectBtn" class="wheel-select-btn" href="#/${langData[0].code}">
        ${langData[0].lang.nameKr} 시작하기
      </a>
      <div class="lang-select-tts-toggle">
        <label class="tts-switch">
          <input type="checkbox" id="langSelectAutoTTS" ${_autoTTS ? 'checked' : ''}>
          <span class="tts-slider"></span>
        </label>
        <span class="lang-select-tts-label" id="langSelectTTSLabel">자동 음성 ${_autoTTS ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  `;

  // --- Wheel scroll logic ---
  const track = document.getElementById('wheelTrack');
  const btn = document.getElementById('wheelSelectBtn');
  const ITEM_H = 72; // must match CSS .wheel-item height
  const count = langData.length;
  let currentIndex = 0;
  let scrollY = 0;
  let startY = 0;
  let dragging = false;
  let velocity = 0;
  let lastY = 0;
  let lastTime = 0;
  let animFrame = null;

  function clampIndex(idx) { return Math.max(0, Math.min(count - 1, idx)); }

  function updateWheel(animate) {
    const targetY = -currentIndex * ITEM_H;
    if (animate) {
      scrollY = targetY;
      track.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateY(${scrollY}px)`;

    // Update items opacity/scale
    track.querySelectorAll('.wheel-item').forEach((el, i) => {
      const dist = Math.abs(i - currentIndex);
      if (dist === 0) {
        el.classList.add('wheel-item-active');
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      } else if (dist === 1) {
        el.classList.remove('wheel-item-active');
        el.style.opacity = '0.45';
        el.style.transform = 'scale(0.88)';
      } else {
        el.classList.remove('wheel-item-active');
        el.style.opacity = '0.2';
        el.style.transform = 'scale(0.78)';
      }
    });

    // Update button
    const d = langData[currentIndex];
    btn.href = `#/${d.code}`;
    btn.textContent = `${d.lang.nameKr} 시작하기`;
    btn.style.background = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#1a1a1a';
  }

  function snapToNearest() {
    currentIndex = clampIndex(Math.round(-scrollY / ITEM_H));
    scrollY = -currentIndex * ITEM_H;
    updateWheel(true);
  }

  // Touch events
  track.addEventListener('touchstart', (e) => {
    dragging = true;
    startY = e.touches[0].clientY;
    lastY = startY;
    lastTime = Date.now();
    velocity = 0;
    track.style.transition = 'none';
    if (animFrame) cancelAnimationFrame(animFrame);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const y = e.touches[0].clientY;
    const dy = y - lastY;
    const now = Date.now();
    velocity = dy / (now - lastTime || 1);
    lastY = y;
    lastTime = now;
    scrollY += dy;
    track.style.transform = `translateY(${scrollY}px)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    dragging = false;
    // Apply momentum
    const fling = velocity * 120;
    scrollY += fling;
    snapToNearest();
  });

  // Mouse wheel
  track.parentElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    currentIndex = clampIndex(currentIndex + (e.deltaY > 0 ? 1 : -1));
    scrollY = -currentIndex * ITEM_H;
    updateWheel(true);
  }, { passive: false });

  // Click on item to select
  track.querySelectorAll('.wheel-item').forEach(el => {
    el.addEventListener('click', () => {
      currentIndex = parseInt(el.dataset.index);
      scrollY = -currentIndex * ITEM_H;
      updateWheel(true);
    });
  });

  // Mouse drag
  let mouseDown = false, mouseStartY = 0;
  track.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseStartY = e.clientY;
    lastY = e.clientY;
    lastTime = Date.now();
    velocity = 0;
    track.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    const dy = e.clientY - lastY;
    const now = Date.now();
    velocity = dy / (now - lastTime || 1);
    lastY = e.clientY;
    lastTime = now;
    scrollY += dy;
    track.style.transform = `translateY(${scrollY}px)`;
  });
  document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    const fling = velocity * 120;
    scrollY += fling;
    snapToNearest();
  });

  // Initial render
  updateWheel(false);

  // TTS toggle
  const langTTSSwitch = document.getElementById('langSelectAutoTTS');
  if (langTTSSwitch) {
    langTTSSwitch.addEventListener('change', (e) => {
      setAutoTTS(e.target.checked);
      const label = document.getElementById('langSelectTTSLabel');
      if (label) label.textContent = '자동 음성 ' + (_autoTTS ? 'ON' : 'OFF');
    });
  }
}

// ------------------------------------------------------------
// renderHome() — Level grid (language-aware)
// ------------------------------------------------------------
async function renderHome() {
  hideLessonBg();
  const app = document.getElementById('app');
  const lang = getLang();
  const completedCount = Progress.getTotalProgress();
  const meta = await DataLoader.loadMeta(currentLang);
  const TOTAL = meta.totalLevels;
  const titles = meta.titles;
  const icons = meta.icons;

  const levels = Array.from({ length: TOTAL }, (_, i) => i + 1);
  const rows = [];
  for (let i = 0; i < levels.length; i += 5) {
    rows.push(levels.slice(i, i + 5));
  }

  let gridHTML = '';
  rows.forEach((row, rowIndex) => {
    const orderedRow = rowIndex % 2 === 0 ? row : [...row].reverse();
    gridHTML += '<div class="level-row">';
    orderedRow.forEach((level) => {
      const completed = Progress.isLevelCompleted(level);
      const available = Progress.isLevelAvailable(level);
      const status = completed ? 'completed' : available ? 'available' : 'locked';
      const icon = icons[level - 1] || '📚';
      const title = titles[level] || '';
      const statusClass = { locked: 'level-locked', available: 'level-available', completed: 'level-completed' }[status];
      const clickable = status !== 'locked';

      gridHTML += `
        <div class="level-card" ${clickable ? `data-level="${level}"` : ''}>
          <div class="level-node-wrapper">
            <div class="level-node ${statusClass}">
              ${status === 'locked' ? '<span class="level-icon">🔒</span>' : `<span class="level-icon">${icon}</span>`}
            </div>
            ${status === 'completed' ? '<div class="pass-ribbon"><span>PASS</span></div>' : ''}
          </div>
          <span class="level-label">
            ${status === 'locked'
              ? `<span class="level-label-locked">Lv.${level}</span>`
              : `<span class="level-label-${status}">${title}</span>`
            }
          </span>
        </div>
      `;
    });
    gridHTML += '</div>';
  });

  app.innerHTML = `
    <div class="home-page">
      <div class="home-header">
        <h1 class="home-title">${lang.emoji} ${lang.name} — ${lang.nameKr} 레벨 선택</h1>
        <div class="home-progress">
          ${renderProgressBar(completedCount, TOTAL, `${completedCount} / ${TOTAL} 레벨 완료`)}
        </div>
      </div>
      <div class="level-grid">
        ${gridHTML}
      </div>
    </div>
  `;

  const grid = app.querySelector('.level-grid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      const card = e.target.closest('[data-level]');
      if (card) {
        const level = parseInt(card.getAttribute('data-level'));
        navigate(`/${currentLang}/lesson/${level}`);
      }
    });
  }
}

// ------------------------------------------------------------
// renderLesson(level) — Conversation lesson (language-aware)
// ------------------------------------------------------------
async function renderLesson(level) {
  showLessonBg(currentLang);
  const app = document.getElementById('app');
  const lang = getLang();
  const levelData = await DataLoader.loadLevel(currentLang, level);
  const ff = lang.foreignField; // e.g. 'chinese' or 'spanish'
  const pf = lang.pronField;   // e.g. 'pinyin' or 'pronunciation'
  const titles = await DataLoader.getTitles(currentLang);

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😥</div>
        <h2 class="error-title">레벨을 찾을 수 없습니다</h2>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/${currentLang}" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  const rawConversations = levelData.conversations || [];
  const vocabulary = levelData.vocabulary || [];
  const TOTAL_ROUNDS = 3;
  let currentRound = 1;
  let conversations = pickVariants(rawConversations);
  const totalBubbles = conversations.length;
  let visibleCount = 0;

  function pickVariants(raw) {
    return raw.map(conv => {
      if (conv.variants && conv.variants.length > 0) {
        const pick = conv.variants[Math.floor(Math.random() * conv.variants.length)];
        return { speaker: conv.speaker, ...pick };
      }
      return conv;
    });
  }

  function render() {
    const allRevealed = visibleCount >= totalBubbles;
    const isLastRound = currentRound >= TOTAL_ROUNDS;

    let bubblesHTML = '';
    conversations.slice(0, visibleCount).forEach((conv) => {
      const isA = conv.speaker === 'A';
      const foreignText = conv[ff];
      const pronText = conv[pf];
      bubblesHTML += `
        <div class="bubble-row ${isA ? 'bubble-row-left' : 'bubble-row-right'}">
          <div class="bubble ${isA ? 'bubble-a' : 'bubble-b'}">
            <div class="bubble-speaker">${isA ? '👤 A' : '👥 B'}</div>
            <p class="bubble-chinese ${conv.highlight ? 'bubble-highlight' : ''}">${foreignText} ${ttsButton(foreignText)}</p>
            <p class="bubble-pinyin">${pronText}</p>
            <p class="bubble-korean">${conv.korean}</p>
          </div>
        </div>
      `;
    });

    let vocabHTML = '';
    if (allRevealed && isLastRound && vocabulary.length > 0) {
      vocabHTML = `
        <div class="vocab-section animate-slide-up">
          <div class="vocab-header">
            <span class="vocab-icon">📝</span>
            <h2 class="vocab-title">핵심 단어</h2>
          </div>
          <div class="vocab-grid">
            ${vocabulary.map((word) => `
              <div class="vocab-card card-game">
                <p class="vocab-chinese">${word[ff]} ${ttsButton(word[ff])}</p>
                <p class="vocab-pinyin">${word[pf]}</p>
                <p class="vocab-korean">${word.korean}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let bottomBtnHTML = '';
    if (allRevealed && isLastRound) {
      bottomBtnHTML = `
        <div class="lesson-quiz-btn animate-slide-up">
          <button class="btn-game btn-success quiz-start-btn" id="startQuizBtn">🎯 퀴즈 시작</button>
        </div>
      `;
    } else if (allRevealed && !isLastRound) {
      bottomBtnHTML = `
        <div class="lesson-quiz-btn animate-slide-up">
          <button class="btn-game btn-next-round" id="nextRoundBtn">다음 대화 시나리오로 (${currentRound} / ${TOTAL_ROUNDS})</button>
        </div>
      `;
    }

    let revealBtnHTML = '';
    if (!allRevealed) {
      revealBtnHTML = `
        <div class="lesson-reveal-btn">
          <button class="btn-game btn-primary reveal-next-btn" id="revealNextBtn">
            다음 대화 보기 (${visibleCount + 1} / ${totalBubbles})
          </button>
        </div>
      `;
    }

    let roundDots = '';
    for (let i = 1; i <= TOTAL_ROUNDS; i++) {
      const cls = i < currentRound ? 'round-dot completed' : i === currentRound ? 'round-dot active' : 'round-dot';
      roundDots += `<span class="${cls}">${i}</span>`;
    }

    const foreignTitle = levelData[lang.titleField] || '';

    app.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-container">
          <a href="#/${currentLang}" class="back-link">&larr; 레벨 선택</a>

          <div class="lesson-header card-game">
            <div class="lesson-header-top">
              <span class="lesson-level-badge">${level}</span>
              <div class="lesson-header-info">
                <h1 class="lesson-title">${levelData.title}</h1>
                <p class="lesson-title-cn">${foreignTitle}</p>
              </div>
            </div>
            ${levelData.description ? `<p class="lesson-description">${levelData.description}</p>` : ''}
            <div class="lesson-header-bottom">
              <div class="round-indicator">
                <span class="round-label">대화</span>
                ${roundDots}
              </div>
              <div class="auto-tts-toggle">
                <label class="tts-switch">
                  <input type="checkbox" id="autoTTSSwitch" ${_autoTTS ? 'checked' : ''}>
                  <span class="tts-slider"></span>
                </label>
                <span class="auto-tts-label">자동 음성 ${_autoTTS ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>

          ${renderProgressBar(visibleCount, totalBubbles, `대화 ${currentRound}/${TOTAL_ROUNDS} — 진행: ${visibleCount} / ${totalBubbles}`)}
        </div>

        <div class="lesson-container bubbles-container">
          ${bubblesHTML}
        </div>

        <div class="lesson-container">
          ${revealBtnHTML}
          ${vocabHTML}
          ${bottomBtnHTML}
        </div>
      </div>
    `;

    const autoTTSSwitch = document.getElementById('autoTTSSwitch');
    if (autoTTSSwitch) {
      autoTTSSwitch.addEventListener('change', (e) => {
        setAutoTTS(e.target.checked);
        const label = document.querySelector('.auto-tts-label');
        if (label) label.textContent = '자동 음성 ' + (_autoTTS ? 'ON' : 'OFF');
      });
    }

    const revealBtn = document.getElementById('revealNextBtn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        if (visibleCount < totalBubbles) {
          visibleCount++;
          render();
          setTimeout(() => {
            const bubbles = document.querySelectorAll('.bubble-row');
            if (bubbles.length > 0) {
              bubbles[bubbles.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (_autoTTS && visibleCount > 0) {
              speakForeign(conversations[visibleCount - 1][ff]);
            }
          }, 50);
        }
      });
    }

    const nextRoundBtn = document.getElementById('nextRoundBtn');
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener('click', () => {
        currentRound++;
        conversations = pickVariants(rawConversations);
        visibleCount = 1;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (_autoTTS) speakForeign(conversations[0][ff]);
        }, 300);
      });
    }

    const quizBtn = document.getElementById('startQuizBtn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        navigate(`/${currentLang}/quiz/${level}`);
      });
    }
  }

  visibleCount = 1;
  render();
  if (_autoTTS) {
    const speakFirst = () => speakForeign(conversations[0][ff]);
    // 음성 목록이 이미 로드되었으면 바로 재생, 아니면 로드 후 재생
    if (window.speechSynthesis && window.speechSynthesis.getVoices().length > 0) {
      setTimeout(speakFirst, 400);
    } else if (window.speechSynthesis) {
      const onReady = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onReady);
        setTimeout(speakFirst, 200);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onReady);
    }
  }
}

// ------------------------------------------------------------
// renderQuiz(level) — Quiz (language-aware)
// ------------------------------------------------------------
async function renderQuiz(level) {
  showLessonBg(currentLang);
  const app = document.getElementById('app');
  const lang = getLang();
  const levelData = await DataLoader.loadLevel(currentLang, level);
  const ff = lang.foreignField;
  const pf = lang.pronField;
  const titles = await DataLoader.getTitles(currentLang);

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😵</div>
        <h1 class="error-title">퀴즈를 찾을 수 없습니다</h1>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/${currentLang}" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  const rawConvs = levelData.conversations || [];
  const allSentences = rawConvs.map(conv => {
    if (conv.variants && conv.variants.length > 0) {
      const pick = conv.variants[Math.floor(Math.random() * conv.variants.length)];
      return { speaker: conv.speaker, ...pick };
    }
    return conv;
  });

  // 1) 단어 시험 4문제
  const vocab = levelData.vocabulary || [];
  const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);
  const vocabQuestions = shuffledVocab.slice(0, 4).map(word => {
    const wrongAnswers = vocab
      .filter(w => w.korean !== word.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.korean);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, word.korean);
    return {
      type: 'vocab',
      question: `${word[ff]} (${word[pf]})`,
      tts: word[ff],
      options,
      answer: answerIdx
    };
  });

  // 2) 외국어→한국어 3문제
  const shuffledSentences = [...allSentences].sort(() => Math.random() - 0.5);
  const foreignToKrQuestions = shuffledSentences.slice(0, 3).map(sent => {
    const wrongAnswers = allSentences
      .filter(s => s.korean !== sent.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s.korean);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, sent.korean);
    return {
      type: 'foreign_to_kr',
      question: sent[ff],
      tts: sent[ff],
      options,
      answer: answerIdx
    };
  });

  // 3) 한국어→외국어 3문제
  const remainingSentences = shuffledSentences.slice(3);
  const krToForeignPool = remainingSentences.length >= 3 ? remainingSentences : [...allSentences].sort(() => Math.random() - 0.5);
  const krToForeignQuestions = krToForeignPool.slice(0, 3).map(sent => {
    const wrongAnswers = allSentences
      .filter(s => s[ff] !== sent[ff])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s[ff]);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, sent[ff]);
    return {
      type: 'kr_to_foreign',
      question: sent.korean,
      options,
      answer: answerIdx
    };
  });

  const questions = [...vocabQuestions, ...foreignToKrQuestions, ...krToForeignQuestions];
  const totalQuestions = questions.length;
  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  let currentQuestion = 0;
  let selected = null;
  let score = 0;

  function render() {
    const question = questions[currentQuestion];
    const typeLabel = lang.quizLabels[question.type] || question.type;

    let optionsHTML = '';
    question.options.forEach((option, index) => {
      let optClass = 'quiz-option';
      if (selected !== null) {
        if (selected === index && index === question.answer) optClass += ' quiz-correct';
        else if (selected === index) optClass += ' quiz-wrong';
        else if (index === question.answer) optClass += ' quiz-correct';
        else optClass += ' quiz-option-default';
      } else {
        optClass += ' quiz-option-default';
      }
      optionsHTML += `
        <button class="${optClass}" data-option="${index}" ${selected !== null ? 'disabled' : ''}>
          <span class="quiz-option-label">${OPTION_LABELS[index]}</span>
          <span>${option}</span>
        </button>
      `;
    });

    let feedbackHTML = '';
    if (selected !== null) {
      if (selected === question.answer) {
        feedbackHTML = '<div class="quiz-feedback animate-fade-in"><p class="quiz-feedback-correct">정답입니다! 🎉</p></div>';
      } else {
        feedbackHTML = `<div class="quiz-feedback animate-fade-in"><p class="quiz-feedback-wrong">오답! 정답은 <span class="quiz-feedback-answer">${question.options[question.answer]}</span></p></div>`;
      }
    }

    app.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-header">
          <span class="quiz-level-info">레벨 ${level} — ${titles[level] || ''}</span>
          <span class="quiz-counter">${currentQuestion + 1} / ${totalQuestions}</span>
        </div>

        ${renderProgressBar(currentQuestion + 1, totalQuestions)}

        <div class="quiz-type-badge-wrapper">
          <span class="quiz-type-badge">${typeLabel}</span>
        </div>

        <div class="quiz-question">
          <h2 class="quiz-question-text">${question.question}${question.tts ? ' ' + ttsButton(question.tts) : ''}</h2>
        </div>

        <div class="quiz-options" id="quizOptions">
          ${optionsHTML}
        </div>

        ${feedbackHTML}

        <div class="quiz-score-indicator">
          현재 점수: ${score} / ${currentQuestion + (selected !== null ? 1 : 0)}
        </div>
      </div>
    `;

    if (_autoTTS && selected === null && question.tts) {
      setTimeout(() => speakForeign(question.tts), 100);
    }

    const optionsContainer = document.getElementById('quizOptions');
    if (optionsContainer) {
      optionsContainer.addEventListener('click', function (e) {
        if (selected !== null) return;
        const btn = e.target.closest('[data-option]');
        if (!btn) return;

        const index = parseInt(btn.getAttribute('data-option'));
        selected = index;
        if (index === question.answer) score++;
        const newScore = score;
        render();

        if (_autoTTS && question.tts) speakForeign(question.tts);

        setTimeout(() => {
          if (currentQuestion + 1 < totalQuestions) {
            currentQuestion++;
            selected = null;
            render();
          } else {
            navigate(`/${currentLang}/result/${level}?score=${newScore}&total=${totalQuestions}`);
          }
        }, 1500);
      });
    }
  }

  render();
}

// ------------------------------------------------------------
// renderResult(level, searchParams) — Result (language-aware)
// ------------------------------------------------------------
async function renderResult(level, searchParams) {
  const app = document.getElementById('app');
  const lang = getLang();
  const scoreVal = parseInt(searchParams.get('score')) || 0;
  const total = parseInt(searchParams.get('total')) || 5;
  const PASS_THRESHOLD = 8;
  const TOTAL_QUESTIONS = 10;
  const passed = scoreVal >= PASS_THRESHOLD;
  const totalLevels = await DataLoader.getTotal(currentLang);
  const isLastLevel = level >= totalLevels;
  const nextLevel = level + 1;

  if (passed) {
    Progress.completeLevel(level, scoreVal);
    createConfetti();
  }

  let buttonsHTML = '';
  if (passed) {
    if (!isLastLevel) {
      buttonsHTML += `<button class="result-btn result-btn-next" data-action="next">다음 레벨 &rarr;</button>`;
    }
    buttonsHTML += `<button class="result-btn result-btn-home-pass" data-action="home">홈으로</button>`;
  } else {
    buttonsHTML += `
      <button class="result-btn result-btn-retry" data-action="retry">다시 도전</button>
      <button class="result-btn result-btn-review" data-action="review">복습하기</button>
      <button class="result-btn result-btn-home-fail" data-action="home">홈으로</button>
    `;
  }

  app.innerHTML = `
    <div class="result-page">
      <div class="result-card-wrapper">
        <div class="result-card ${passed ? 'result-card-pass' : 'result-card-fail'}">
          <div class="result-top-bar ${passed ? 'result-top-bar-pass' : 'result-top-bar-fail'}"></div>
          <div class="result-content">
            <div class="result-emoji animate-bounce">${passed ? '🎉' : '😅'}</div>
            <h1 class="result-title ${passed ? 'result-title-pass' : 'result-title-fail'}">
              ${passed ? '축하합니다!' : '아쉬워요!'}
            </h1>
            <p class="result-subtitle">
              ${passed ? `레벨 ${level}을 통과했어요!` : `레벨 ${level} 통과 기준에 못 미쳤어요.`}
            </p>
            <div class="result-score-circle ${passed ? 'result-score-pass' : 'result-score-fail'}">
              <div>
                <span class="result-score-num ${passed ? 'result-score-num-pass' : 'result-score-num-fail'}">${scoreVal}</span>
                <span class="result-score-total ${passed ? 'result-score-total-pass' : 'result-score-total-fail'}">/${total}</span>
              </div>
            </div>
            <p class="result-pass-info">통과 기준: ${PASS_THRESHOLD}/${TOTAL_QUESTIONS} (${Math.round((PASS_THRESHOLD / TOTAL_QUESTIONS) * 100)}%)</p>
            <div class="result-buttons" id="resultButtons">${buttonsHTML}</div>
          </div>
          <div class="result-corner result-corner-left">
            <div class="result-corner-shape ${passed ? 'result-corner-pass' : 'result-corner-fail-left'}"></div>
          </div>
          <div class="result-corner result-corner-right">
            <div class="result-corner-shape ${passed ? 'result-corner-pass-right' : 'result-corner-fail-right'}"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnContainer = document.getElementById('resultButtons');
  if (btnContainer) {
    btnContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      switch (btn.getAttribute('data-action')) {
        case 'next': navigate(`/${currentLang}/lesson/${nextLevel}`); break;
        case 'retry': navigate(`/${currentLang}/quiz/${level}`); break;
        case 'review': navigate(`/${currentLang}/lesson/${level}`); break;
        case 'home': navigate(`/${currentLang}`); break;
      }
    });
  }
}

// ------------------------------------------------------------
// Background image overlay
// ------------------------------------------------------------
let _bgOverlay = null;

function showLessonBg(langCode) {
  if (!_bgOverlay) {
    _bgOverlay = document.createElement('div');
    _bgOverlay.id = 'lesson-bg-overlay';
    document.body.appendChild(_bgOverlay);
  }
  const num = String(Math.floor(Math.random() * 5) + 1).padStart(3, '0');
  _bgOverlay.style.backgroundImage = `url('data/${langCode}/images/${num}.jpg')`;
  _bgOverlay.style.display = 'block';
}

function hideLessonBg() {
  if (_bgOverlay) _bgOverlay.style.display = 'none';
}

// ------------------------------------------------------------
// Init on DOMContentLoaded
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  handleRoute();

  // Global TTS click delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tts-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      speakForeign(btn.getAttribute('data-tts'));
    }
  });
});
