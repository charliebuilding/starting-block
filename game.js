// Starting Block — Game Logic

(function () {
  'use strict';

  // ─── Date helpers ─────────────────────────────────────
  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Deterministic daily question based on date
  function getDayIndex() {
    const epoch = new Date('2026-03-17'); // launch date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    epoch.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
    return ((diff % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length;
  }

  function getDayNumber() {
    const epoch = new Date('2026-03-17');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    epoch.setHours(0, 0, 0, 0);
    return Math.floor((today - epoch) / (1000 * 60 * 60 * 24)) + 1;
  }

  // ─── Storage ──────────────────────────────────────────
  function getStats() {
    const raw = localStorage.getItem('sb_stats');
    if (!raw) return { played: 0, correct: 0, streak: 0, lastPlayed: null, lastCorrect: false };
    return JSON.parse(raw);
  }

  function saveStats(stats) {
    localStorage.setItem('sb_stats', JSON.stringify(stats));
  }

  function getTodayResult() {
    const raw = localStorage.getItem('sb_today');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return null;
    return data;
  }

  function saveTodayResult(correct, chosenIndex) {
    localStorage.setItem('sb_today', JSON.stringify({
      date: getTodayKey(),
      correct: correct,
      chosenIndex: chosenIndex
    }));
  }

  // ─── Render stats ─────────────────────────────────────
  function renderStats() {
    const stats = getStats();
    document.getElementById('streak').textContent = stats.streak;
    document.getElementById('played').textContent = stats.played;
    document.getElementById('pct').textContent = stats.played > 0
      ? Math.round((stats.correct / stats.played) * 100) + '%'
      : '0%';
  }

  // ─── Countdown to midnight ────────────────────────────
  function startCountdown(elId) {
    const el = document.getElementById(elId);
    if (!el) return;

    function update() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;

      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      el.textContent = `${h}:${m}:${s}`;
    }

    update();
    setInterval(update, 1000);
  }

  // ─── Share ────────────────────────────────────────────
  window.shareResult = function () {
    const todayResult = getTodayResult();
    if (!todayResult) return;

    const stats = getStats();
    const dayNum = getDayNumber();
    const emoji = todayResult.correct ? '🟩' : '🟥';
    const word = todayResult.correct ? 'Nailed it' : 'Missed it';

    const text = `Starting Block #${dayNum} ${emoji}\n${word}\n🔥 ${stats.streak} day streak\n\nstartingblock.netlify.app`;

    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(function () {
      const btns = document.querySelectorAll('.share-btn');
      btns.forEach(function (btn) {
        btn.classList.add('copied');
        btn.innerHTML = 'Copied!';
      });
      setTimeout(function () {
        btns.forEach(function (btn) {
          btn.classList.remove('copied');
          btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share';
        });
      }, 2000);
    });
  }

  // ─── Handle answer ────────────────────────────────────
  function handleAnswer(chosenIndex, correctIndex, question) {
    const buttons = document.querySelectorAll('.option-btn');
    const isCorrect = chosenIndex === correctIndex;

    // Disable all buttons
    buttons.forEach(function (btn, i) {
      btn.classList.add('answered');
      if (i === correctIndex) {
        btn.classList.add('correct');
      }
      if (i === chosenIndex && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });

    // Update stats
    const stats = getStats();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    stats.played++;
    if (isCorrect) {
      stats.correct++;
      if (stats.lastPlayed === yesterdayKey || stats.played === 1) {
        stats.streak++;
      } else if (stats.lastPlayed !== getTodayKey()) {
        stats.streak = 1;
      }
    } else {
      stats.streak = 0;
    }
    stats.lastPlayed = getTodayKey();
    stats.lastCorrect = isCorrect;
    saveStats(stats);
    saveTodayResult(isCorrect, chosenIndex);
    renderStats();

    // Show fact
    if (question.fact) {
      document.getElementById('fun-fact-text').textContent = question.fact;
      document.getElementById('fun-fact').classList.add('show');
    }

    // Show result
    const resultSection = document.getElementById('result-section');
    document.getElementById('result-emoji').textContent = isCorrect ? '🟩' : '🟥';
    document.getElementById('result-text').innerHTML = isCorrect
      ? '<span class="neon">Nailed it.</span>'
      : '<span class="miss">Not today.</span>';
    resultSection.classList.add('show');

    startCountdown('countdown');
  }

  // ─── Show already-played state ────────────────────────
  function showAlreadyPlayed(todayResult) {
    const question = QUESTIONS[getDayIndex()];
    const dayNum = getDayNumber();

    document.getElementById('game-area').style.display = 'none';
    document.getElementById('already-played').classList.add('show');

    document.getElementById('ap-q-number').textContent = `#${dayNum}`;
    document.getElementById('ap-q-text').textContent = question.question;

    // Show the answer
    const answerEl = document.getElementById('ap-answer');
    const answerText = question.options[question.answer];
    const chosenText = question.options[todayResult.chosenIndex];

    if (todayResult.correct) {
      answerEl.innerHTML = `<div class="option-btn correct answered" style="opacity:1">${answerText}</div>`;
    } else {
      answerEl.innerHTML = `<div class="option-btn incorrect answered" style="opacity:1">${chosenText}</div><div class="option-btn correct answered" style="opacity:1; margin-top:10px">${answerText}</div>`;
    }

    document.getElementById('ap-fun-fact-text').textContent = question.fact;
    document.getElementById('ap-result-emoji').textContent = todayResult.correct ? '🟩' : '🟥';
    document.getElementById('ap-result-text').innerHTML = todayResult.correct
      ? '<span class="neon">Nailed it.</span>'
      : '<span class="miss">Not today.</span>';

    startCountdown('ap-countdown');
  }

  // ─── Init ─────────────────────────────────────────────
  function init() {
    renderStats();

    // Check if already played today
    const todayResult = getTodayResult();
    if (todayResult) {
      showAlreadyPlayed(todayResult);
      return;
    }

    // Load today's question
    const idx = getDayIndex();
    const question = QUESTIONS[idx];
    const dayNum = getDayNumber();

    document.getElementById('category').textContent = question.category;
    document.getElementById('q-number').textContent = `#${dayNum}`;
    document.getElementById('q-text').textContent = question.question;

    const optionsEl = document.getElementById('options');
    question.options.forEach(function (opt, i) {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        if (btn.classList.contains('answered')) return;
        handleAnswer(i, question.answer, question);
      });
      optionsEl.appendChild(btn);
    });
  }

  // Go
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
