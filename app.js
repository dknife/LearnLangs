// ============================================================
// app.js — Main application logic for Chinese Conversation Learning App
// Loaded after data.js (provides LEVEL_DATA, TOTAL_LEVELS, LEVEL_TITLES, LEVEL_ICONS)
// ============================================================

// ------------------------------------------------------------
// 1. Progress Manager
// ------------------------------------------------------------
const Progress = {
  _data: null,
  _STORAGE_KEY: 'learnChinese_progress',

  load() {
    try {
      const saved = localStorage.getItem(this._STORAGE_KEY);
      if (saved) {
        this._data = JSON.parse(saved);
      }
    } catch {
      // ignore parse errors
    }
    if (!this._data) {
      this._data = { completedLevels: [], scores: {} };
    }
  },

  save() {
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(this._data));
  },

  isLevelAvailable(level) {
    return true;
  },

  isLevelCompleted(level) {
    return this._data.completedLevels.includes(level);
  },

  completeLevel(level, score) {
    if (!this._data.completedLevels.includes(level)) {
      this._data.completedLevels.push(level);
    }
    this._data.scores[level] = score;
    this.save();
  },

  getScore(level) {
    return this._data.scores[level] ?? null;
  },

  getTotalProgress() {
    return this._data.completedLevels.length;
  },
};

// ------------------------------------------------------------
// 2. Router
// ------------------------------------------------------------
function navigate(path) {
  window.location.hash = '#' + path;
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');

  // Parse routes
  let match;

  // Result: #/result/2?score=4&total=5
  match = hash.match(/^#\/result\/(\d+)\??(.*)?$/);
  if (match) {
    const level = parseInt(match[1]);
    const searchParams = new URLSearchParams(match[2] || '');
    renderResult(level, searchParams);
    return;
  }

  // Quiz: #/quiz/3
  match = hash.match(/^#\/quiz\/(\d+)$/);
  if (match) {
    renderQuiz(parseInt(match[1]));
    return;
  }

  // Lesson: #/lesson/5
  match = hash.match(/^#\/lesson\/(\d+)$/);
  if (match) {
    renderLesson(parseInt(match[1]));
    return;
  }

  // Home: "" or "#/" or "#"
  renderHome();
}

window.addEventListener('hashchange', handleRoute);

// ------------------------------------------------------------
// TTS — 중국어 음성 재생 (Web Speech API)
// ------------------------------------------------------------
let _zhCNVoice = null;

function findMandarinVoice() {
  const voices = window.speechSynthesis.getVoices();
  // 1순위: 정확히 zh-CN
  const exact = voices.find(v => v.lang === 'zh-CN');
  if (exact) return exact;
  // 2순위: zh-CN 변형 (예: zh-CN-XiaoxiaoNeural)
  const cnVariant = voices.find(v => v.lang.startsWith('zh-CN'));
  if (cnVariant) return cnVariant;
  // 3순위: cmn (Mandarin 코드)
  const cmn = voices.find(v => v.lang.startsWith('cmn'));
  if (cmn) return cmn;
  // 4순위: zh (광동어 zh-HK, zh-TW 제외)
  const zhGeneric = voices.find(v => v.lang === 'zh' || (v.lang.startsWith('zh') && !v.lang.includes('HK') && !v.lang.includes('TW') && !v.lang.includes('yue')));
  if (zhGeneric) return zhGeneric;
  return null;
}

function speakChinese(text, onEnd) {
  if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;
  if (!_zhCNVoice) _zhCNVoice = findMandarinVoice();
  if (_zhCNVoice) utterance.voice = _zhCNVoice;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

// 자동 음성 재생 설정 (기본값 OFF)
let _autoTTS = localStorage.getItem('learnChinese_autoTTS') === 'on';
function setAutoTTS(val) {
  _autoTTS = val;
  localStorage.setItem('learnChinese_autoTTS', val ? 'on' : 'off');
}

// 음성 목록이 비동기로 로드되므로 미리 요청
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { _zhCNVoice = findMandarinVoice(); };
  window.speechSynthesis.getVoices();
}

function ttsButton(text) {
  return `<button class="tts-btn" data-tts="${text.replace(/"/g, '&quot;')}" title="발음 듣기">🔊</button>`;
}

// ------------------------------------------------------------
// 7. Helper functions
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
  const colors = ['#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];
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
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 3000);
}

// ------------------------------------------------------------
// 3. renderHome()
// ------------------------------------------------------------
function renderHome() {
  const app = document.getElementById('app');
  const completedCount = Progress.getTotalProgress();
  const TOTAL = window.TOTAL_LEVELS;

  // Build levels 1..25
  const levels = Array.from({ length: TOTAL }, (_, i) => i + 1);

  // Split into rows of 5
  const rows = [];
  for (let i = 0; i < levels.length; i += 5) {
    rows.push(levels.slice(i, i + 5));
  }

  let gridHTML = '';
  rows.forEach((row, rowIndex) => {
    // Even rows left-to-right, odd rows right-to-left (snake path)
    const orderedRow = rowIndex % 2 === 0 ? row : [...row].reverse();

    gridHTML += '<div class="level-row">';
    orderedRow.forEach((level) => {
      const completed = Progress.isLevelCompleted(level);
      const available = Progress.isLevelAvailable(level);
      const status = completed ? 'completed' : available ? 'available' : 'locked';
      const icon = window.LEVEL_ICONS[level - 1] || '📚';
      const score = completed ? Progress.getScore(level) : null;
      const title = window.LEVEL_TITLES[level] || '';

      const statusClass = {
        locked: 'level-locked',
        available: 'level-available',
        completed: 'level-completed',
      }[status];

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
        <h1 class="home-title">레벨 선택</h1>
        <div class="home-progress">
          ${renderProgressBar(completedCount, TOTAL, `${completedCount} / ${TOTAL} 레벨 완료`)}
        </div>
      </div>
      <div class="level-grid">
        ${gridHTML}
      </div>
    </div>
  `;

  // Event delegation for level clicks
  const grid = app.querySelector('.level-grid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      const card = e.target.closest('[data-level]');
      if (card) {
        const level = parseInt(card.getAttribute('data-level'));
        navigate('/lesson/' + level);
      }
    });
  }
}

// ------------------------------------------------------------
// 4. renderLesson(level)
// ------------------------------------------------------------
function renderLesson(level) {
  const app = document.getElementById('app');
  const levelData = window.LEVEL_DATA[level];

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😥</div>
        <h2 class="error-title">레벨을 찾을 수 없습니다</h2>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/" class="btn-game btn-primary">홈으로 돌아가기</a>
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

  // variants에서 랜덤으로 하나씩 선택하여 대화 생성
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
    conversations.slice(0, visibleCount).forEach((conv, index) => {
      const isA = conv.speaker === 'A';
      bubblesHTML += `
        <div class="bubble-row ${isA ? 'bubble-row-left' : 'bubble-row-right'}">
          <div class="bubble ${isA ? 'bubble-a' : 'bubble-b'}">
            <div class="bubble-speaker">
              ${isA ? '👤 A' : '👥 B'}
            </div>
            <p class="bubble-chinese ${conv.highlight ? 'bubble-highlight' : ''}">${conv.chinese} ${ttsButton(conv.chinese)}</p>
            <p class="bubble-pinyin">${conv.pinyin}</p>
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
                <p class="vocab-chinese">${word.chinese} ${ttsButton(word.chinese)}</p>
                <p class="vocab-pinyin">${word.pinyin}</p>
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

    // 라운드 인디케이터
    let roundDots = '';
    for (let i = 1; i <= TOTAL_ROUNDS; i++) {
      const cls = i < currentRound ? 'round-dot completed' : i === currentRound ? 'round-dot active' : 'round-dot';
      roundDots += `<span class="${cls}">${i}</span>`;
    }

    app.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-container">
          <a href="#/" class="back-link">&larr; 레벨 선택</a>

          <div class="lesson-header card-game">
            <div class="lesson-header-top">
              <span class="lesson-level-badge">${level}</span>
              <div class="lesson-header-info">
                <h1 class="lesson-title">${levelData.title}</h1>
                <p class="lesson-title-cn">${levelData.titleCn}</p>
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

    // Attach event listeners
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
              speakChinese(conversations[visibleCount - 1].chinese);
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
          if (_autoTTS) {
            speakChinese(conversations[0].chinese);
          }
        }, 300);
      });
    }

    const quizBtn = document.getElementById('startQuizBtn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        navigate('/quiz/' + level);
      });
    }
  }

  // 첫 진입 시 첫 대화를 열고 음성 재생
  visibleCount = 1;
  render();
  setTimeout(() => {
    if (_autoTTS) {
      speakChinese(conversations[0].chinese);
    }
  }, 300);
}

// ------------------------------------------------------------
// 5. renderQuiz(level)
// ------------------------------------------------------------
function renderQuiz(level) {
  const app = document.getElementById('app');
  const levelData = window.LEVEL_DATA[level];

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😵</div>
        <h1 class="error-title">퀴즈를 찾을 수 없습니다</h1>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  // --- 단어 시험 4문제: vocabulary에서 자동 생성 (복수 정답 불가) ---
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
      question: `${word.chinese} (${word.pinyin})`,
      options: options,
      answer: answerIdx
    };
  });

  // --- 문장 채우기 6문제: fill_blank 풀에서 선택 ---
  const allFillBlank = (levelData.quiz || []).filter(q => q.type === 'fill_blank');
  const fillQuestions = [...allFillBlank].sort(() => Math.random() - 0.5).slice(0, 6);

  const questions = [...vocabQuestions, ...fillQuestions];
  const totalQuestions = questions.length;

  if (!questions.length) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😵</div>
        <h1 class="error-title">퀴즈를 찾을 수 없습니다</h1>
        <p class="error-text">레벨 ${level} 퀴즈 데이터가 부족합니다.</p>
        <a href="#/" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  const TYPE_LABELS = {
    vocab: '단어 시험',
    fill_blank: '빈칸 채우기',
  };

  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  let currentQuestion = 0;
  let selected = null;
  let score = 0;

  function render() {
    const question = questions[currentQuestion];
    const typeLabel = TYPE_LABELS[question.type] || question.type;

    let optionsHTML = '';
    question.options.forEach((option, index) => {
      let optClass = 'quiz-option';

      if (selected !== null) {
        if (selected === index && index === question.answer) {
          optClass += ' quiz-correct';
        } else if (selected === index && index !== question.answer) {
          optClass += ' quiz-wrong';
        } else if (index === question.answer) {
          optClass += ' quiz-correct';
        } else {
          optClass += ' quiz-option-default';
        }
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
          <span class="quiz-level-info">레벨 ${level} — ${window.LEVEL_TITLES[level] || ''}</span>
          <span class="quiz-counter">${currentQuestion + 1} / ${totalQuestions}</span>
        </div>

        ${renderProgressBar(currentQuestion + 1, totalQuestions)}

        <div class="quiz-type-badge-wrapper">
          <span class="quiz-type-badge">${typeLabel}</span>
        </div>

        <div class="quiz-question">
          <h2 class="quiz-question-text">${question.question}</h2>
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

    // Event delegation for options
    const optionsContainer = document.getElementById('quizOptions');
    if (optionsContainer) {
      optionsContainer.addEventListener('click', function (e) {
        if (selected !== null) return;
        const btn = e.target.closest('[data-option]');
        if (!btn) return;

        const index = parseInt(btn.getAttribute('data-option'));
        selected = index;
        const isCorrect = index === question.answer;
        if (isCorrect) score++;
        const newScore = score;

        render();

        setTimeout(() => {
          if (currentQuestion + 1 < totalQuestions) {
            currentQuestion++;
            selected = null;
            render();
          } else {
            navigate(`/result/${level}?score=${newScore}&total=${totalQuestions}`);
          }
        }, 1200);
      });
    }
  }

  render();
}

// ------------------------------------------------------------
// 6. renderResult(level, searchParams)
// ------------------------------------------------------------
function renderResult(level, searchParams) {
  const app = document.getElementById('app');
  const scoreVal = parseInt(searchParams.get('score')) || 0;
  const total = parseInt(searchParams.get('total')) || 5;
  const PASS_THRESHOLD = 8;
  const TOTAL_QUESTIONS = 10;
  const passed = scoreVal >= PASS_THRESHOLD;
  const isLastLevel = level >= window.TOTAL_LEVELS;
  const nextLevel = level + 1;

  if (passed) {
    Progress.completeLevel(level, scoreVal);
    createConfetti();
  }

  let buttonsHTML = '';
  if (passed) {
    if (!isLastLevel) {
      buttonsHTML += `
        <button class="result-btn result-btn-next" data-action="next">다음 레벨 &rarr;</button>
      `;
    }
    buttonsHTML += `
      <button class="result-btn result-btn-home-pass" data-action="home">홈으로</button>
    `;
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
            <div class="result-emoji animate-bounce">
              ${passed ? '🎉' : '😅'}
            </div>

            <h1 class="result-title ${passed ? 'result-title-pass' : 'result-title-fail'}">
              ${passed ? '축하합니다!' : '아쉬워요!'}
            </h1>

            <p class="result-subtitle">
              ${passed
                ? `레벨 ${level}을 통과했어요!`
                : `레벨 ${level} 통과 기준에 못 미쳤어요.`
              }
            </p>

            <div class="result-score-circle ${passed ? 'result-score-pass' : 'result-score-fail'}">
              <div>
                <span class="result-score-num ${passed ? 'result-score-num-pass' : 'result-score-num-fail'}">${scoreVal}</span>
                <span class="result-score-total ${passed ? 'result-score-total-pass' : 'result-score-total-fail'}">/${total}</span>
              </div>
            </div>

            <p class="result-pass-info">
              통과 기준: ${PASS_THRESHOLD}/${TOTAL_QUESTIONS} (${Math.round((PASS_THRESHOLD / TOTAL_QUESTIONS) * 100)}%)
            </p>

            <div class="result-buttons" id="resultButtons">
              ${buttonsHTML}
            </div>
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

  // Event delegation for buttons
  const btnContainer = document.getElementById('resultButtons');
  if (btnContainer) {
    btnContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'next':
          navigate('/lesson/' + nextLevel);
          break;
        case 'retry':
          navigate('/quiz/' + level);
          break;
        case 'review':
          navigate('/lesson/' + level);
          break;
        case 'home':
          navigate('/');
          break;
      }
    });
  }
}

// ------------------------------------------------------------
// Init on DOMContentLoaded
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  Progress.load();
  handleRoute();

  // Global TTS click delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tts-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      speakChinese(btn.getAttribute('data-tts'));
    }
  });
});
