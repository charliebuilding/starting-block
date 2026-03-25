// Runnerdle — Game Logic
// Firebase + Speed Tracking + Weekly Leaderboard + Streak Tiers

(function () {
  'use strict';

  // ─── Firebase Setup ───────────────────────────────────
  // Config loaded from config.js (gitignored)
  firebase.initializeApp(FIREBASE_CONFIG);
  var db = firebase.database();

  // ─── Constants ────────────────────────────────────────
  var PENALTY_SECONDS = 30;
  var STREAK_REWARD_THRESHOLD = 25;
  var STREAK_REWARD_CODE = 'RTWkoi879xh';

  // Upcoming events for promo rotation (closest first)
  var PROMO_EVENTS = [
    { name: 'RUN THE', highlight: 'WHARF', details: 'Canary Wharf · 3 Sep 2026 · 5K', date: '2026-09-03', url: 'https://fridaynightlights.run' },
    { name: 'BATTERSEA PARK', highlight: '5K', details: 'Battersea Park · 24 Apr 2026 · 5K', date: '2026-04-24', url: 'https://fridaynightlights.run' },
    { name: 'HACKNEY QUARTER', highlight: '10K', details: 'Hackney · 14 May 2026 · 10K', date: '2026-05-14', url: 'https://fridaynightlights.run' }
  ];

  var STREAK_TIERS = [
    { min: 3, name: 'Off the blocks', css: 'tier-1' },
    { min: 7, name: 'In the zone', css: 'tier-2' },
    { min: 14, name: 'On form', css: 'tier-3' },
    { min: 30, name: 'Untouchable', css: 'tier-4' },
    { min: 50, name: 'Hall of fame', css: 'tier-5' }
  ];

  // ─── Timer state ──────────────────────────────────────
  var questionStartTime = null;
  var timerInterval = null;
  var answerTimeSeconds = null;

  // ─── Date helpers ─────────────────────────────────────
  function getTodayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getDayIndex() {
    var epoch = new Date('2026-03-17');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    epoch.setHours(0, 0, 0, 0);
    var diff = Math.floor((today - epoch) / 86400000);
    return ((diff % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length;
  }

  function getDayNumber() {
    var epoch = new Date('2026-03-17');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    epoch.setHours(0, 0, 0, 0);
    return Math.floor((today - epoch) / 86400000) + 1;
  }

  // Week key: ISO week number + year (resets every Monday)
  function getWeekKey() {
    var now = new Date();
    var jan1 = new Date(now.getFullYear(), 0, 1);
    var dayOfYear = Math.floor((now - jan1) / 86400000) + 1;
    var weekNum = Math.ceil((dayOfYear + jan1.getDay()) / 7);
    return now.getFullYear() + '-W' + String(weekNum).padStart(2, '0');
  }

  function getWeekLabel() {
    var now = new Date();
    var monday = new Date(now);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    var sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    var fmt = function (d) {
      return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
    };
    return fmt(monday) + ' — ' + fmt(sunday);
  }

  // ─── Cookie helpers (backup for WhatsApp in-app browser) ──
  function setCookie(key, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(key) {
    var match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
  }

  // ─── Player ID ────────────────────────────────────────
  function getPlayerId() {
    var id = localStorage.getItem('sb_player_id') || getCookie('sb_pid');
    if (!id) {
      id = 'sb_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    }
    // Always persist in both localStorage and cookie
    localStorage.setItem('sb_player_id', id);
    setCookie('sb_pid', id, 365);
    return id;
  }

  function getPlayerName() {
    return localStorage.getItem('sb_player_name') || getCookie('sb_pname') || '';
  }

  function setPlayerName(name) {
    var clean = name.trim().substring(0, 20);
    localStorage.setItem('sb_player_name', clean);
    setCookie('sb_pname', clean, 365);
  }

  // ─── Restore from Firebase if localStorage was wiped ──
  function restoreFromFirebase(callback) {
    var playerId = getPlayerId();
    var localStats = localStorage.getItem('sb_stats');

    // If we have a player ID (from cookie) but no local stats, pull from Firebase
    if (!localStats) {
      db.ref('starting-block/players/' + playerId).once('value', function (snap) {
        var remote = snap.val();
        if (remote && remote.name) {
          // Restore name
          setPlayerName(remote.name);
          // Restore stats from what Firebase has
          var stats = getStats();
          stats.streak = remote.streak || 0;
          stats.longestStreak = remote.longestStreak || 0;
          stats.lastPlayed = remote.lastPlayed || null;
          saveStats(stats);
        }
        callback();
      });
    } else {
      callback();
    }
  }

  // ─── Storage ──────────────────────────────────────────
  function getStats() {
    var raw = localStorage.getItem('sb_stats');
    if (!raw) return { played: 0, correct: 0, streak: 0, longestStreak: 0, pb: null, lastPlayed: null, lastCorrect: false };
    var stats = JSON.parse(raw);
    // Migration: add fields if missing from older saves
    if (stats.longestStreak === undefined) stats.longestStreak = stats.streak || 0;
    if (stats.pb === undefined) stats.pb = null;
    return stats;
  }

  function saveStats(stats) {
    localStorage.setItem('sb_stats', JSON.stringify(stats));
  }

  function getTodayResult() {
    var raw = localStorage.getItem('sb_today');
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return null;
    return data;
  }

  function saveTodayResult(correct, chosenIndex, timeSec) {
    localStorage.setItem('sb_today', JSON.stringify({
      date: getTodayKey(),
      correct: correct,
      chosenIndex: chosenIndex,
      time: timeSec
    }));
  }

  // ─── Streak tier ──────────────────────────────────────
  function getStreakTier(streak) {
    var tier = null;
    for (var i = STREAK_TIERS.length - 1; i >= 0; i--) {
      if (streak >= STREAK_TIERS[i].min) { tier = STREAK_TIERS[i]; break; }
    }
    return tier;
  }

  function renderStreakTier(streak) {
    var el = document.getElementById('streak-tier');
    var tier = getStreakTier(streak);
    if (!tier) {
      el.classList.remove('show');
      return;
    }
    el.textContent = tier.name;
    el.className = 'streak-tier show ' + tier.css;
  }

  // ─── Render stats ─────────────────────────────────────
  function renderStats() {
    var stats = getStats();
    document.getElementById('streak').textContent = stats.streak;
    document.getElementById('longest').textContent = stats.longestStreak || 0;
    document.getElementById('pct').textContent = stats.played > 0
      ? Math.round((stats.correct / stats.played) * 100) + '%'
      : '0%';
    document.getElementById('pb').textContent = stats.pb !== null ? stats.pb.toFixed(1) + 's' : '—';
    renderStreakTier(stats.streak);
  }

  // ─── Live timer ───────────────────────────────────────
  function startLiveTimer() {
    questionStartTime = performance.now();
    var el = document.getElementById('live-timer-value');
    timerInterval = setInterval(function () {
      var elapsed = (performance.now() - questionStartTime) / 1000;
      el.textContent = elapsed.toFixed(1) + 's';
    }, 100);
  }

  function stopLiveTimer() {
    if (timerInterval) clearInterval(timerInterval);
    answerTimeSeconds = Math.round(((performance.now() - questionStartTime) / 1000) * 10) / 10;
    document.getElementById('live-timer-value').textContent = answerTimeSeconds.toFixed(1) + 's';
    return answerTimeSeconds;
  }

  // ─── Countdown to midnight ────────────────────────────
  function startCountdown(elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    function update() {
      var now = new Date();
      var tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      var diff = tomorrow - now;
      var h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      var m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      var s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }
    update();
    setInterval(update, 1000);
  }

  // ─── Promo & Reward ──────────────────────────────────
  function getNextEvent() {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    for (var i = 0; i < PROMO_EVENTS.length; i++) {
      var eventDate = new Date(PROMO_EVENTS[i].date);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate > now) return PROMO_EVENTS[i];
    }
    return PROMO_EVENTS[0]; // fallback to first
  }

  function getDaysUntil(dateStr) {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((target - now) / 86400000));
  }

  function showPromoCard(promoCardId, promoDaysId) {
    var event = getNextEvent();
    var days = getDaysUntil(event.date);
    var card = document.getElementById(promoCardId);
    var daysEl = document.getElementById(promoDaysId);
    if (card && days > 0) {
      // Update card content dynamically
      var nameEl = card.querySelector('.promo-event-name');
      var detailsEl = card.querySelector('.promo-details');
      var btnEl = card.querySelector('.promo-btn');
      if (nameEl) nameEl.innerHTML = event.name + ' <span class="promo-highlight">' + event.highlight + '</span>';
      if (detailsEl) detailsEl.textContent = event.details;
      if (btnEl) btnEl.href = event.url;
      if (daysEl) daysEl.textContent = days;
      card.classList.add('show');
    }
  }

  function showRewardCard(rewardCardId) {
    var stats = getStats();
    if (stats.streak >= STREAK_REWARD_THRESHOLD || stats.longestStreak >= STREAK_REWARD_THRESHOLD) {
      var card = document.getElementById(rewardCardId);
      if (card) card.classList.add('show');
    }
  }

  window.copyCode = function () {
    navigator.clipboard.writeText(STREAK_REWARD_CODE).then(function () {
      var codes = document.querySelectorAll('.reward-code');
      codes.forEach(function (el) {
        el.textContent = 'Copied!';
        setTimeout(function () { el.textContent = STREAK_REWARD_CODE; }, 2000);
      });
    });
  };

  // ─── Tab switching ────────────────────────────────────
  var currentLbTab = 'time';

  window.switchTab = function (tab) {
    var playArea = document.getElementById('play-area');
    var lbArea = document.getElementById('leaderboard-area');
    var tabPlay = document.getElementById('tab-play');
    var tabLb = document.getElementById('tab-leaderboard');

    if (tab === 'play') {
      playArea.style.display = 'block';
      lbArea.classList.remove('show');
      tabPlay.classList.add('active');
      tabLb.classList.remove('active');
    } else {
      playArea.style.display = 'none';
      lbArea.classList.add('show');
      tabPlay.classList.remove('active');
      tabLb.classList.add('active');
      loadLeaderboard();
    }
  };

  window.switchLbTab = function (tab) {
    currentLbTab = tab;
    document.getElementById('lb-tab-time').classList.toggle('active', tab === 'time');
    document.getElementById('lb-tab-streaks').classList.toggle('active', tab === 'streaks');
    document.getElementById('lb-pane-time').classList.toggle('show', tab === 'time');
    document.getElementById('lb-pane-streaks').classList.toggle('show', tab === 'streaks');
    loadLeaderboard();
  };

  // ─── Firebase: Submit score ───────────────────────────
  function submitToFirebase(correct, timeSec) {
    var name = getPlayerName();
    if (!name) return;

    var playerId = getPlayerId();
    var weekKey = getWeekKey();
    var todayKey = getTodayKey();
    var stats = getStats();
    var effectiveTime = correct ? timeSec : timeSec + PENALTY_SECONDS;

    // Write today's result
    var dayRef = db.ref('starting-block/weekly/' + weekKey + '/players/' + playerId + '/days/' + todayKey);
    dayRef.set({
      correct: correct,
      time: timeSec,
      effectiveTime: effectiveTime,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Update player summary for the week
    var playerWeekRef = db.ref('starting-block/weekly/' + weekKey + '/players/' + playerId);
    playerWeekRef.child('info').set({
      name: name,
      streak: stats.streak
    });

    // Recalculate weekly total from all days
    playerWeekRef.child('days').once('value', function (snap) {
      var days = snap.val() || {};
      var totalTime = 0;
      var daysPlayed = 0;
      Object.keys(days).forEach(function (key) {
        totalTime += days[key].effectiveTime || 0;
        daysPlayed++;
      });
      playerWeekRef.child('info').update({
        totalTime: Math.round(totalTime * 10) / 10,
        daysPlayed: daysPlayed,
        streak: stats.streak
      });
    });

    // Write global streak data (for all-time streaks leaderboard)
    var globalRef = db.ref('starting-block/players/' + playerId);
    globalRef.set({
      name: name,
      streak: stats.streak,
      longestStreak: stats.longestStreak || stats.streak,
      lastPlayed: todayKey,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }

  // ─── Firebase: Load leaderboard ───────────────────────
  function loadLeaderboard() {
    if (currentLbTab === 'time') {
      loadTimeLeaderboard();
    } else {
      loadStreaksLeaderboard();
    }
  }

  function loadTimeLeaderboard() {
    var weekKey = getWeekKey();
    var playerId = getPlayerId();

    document.getElementById('lb-week-label').textContent = getWeekLabel();

    var ref = db.ref('starting-block/weekly/' + weekKey + '/players');
    ref.once('value', function (snap) {
      var players = snap.val() || {};
      var rows = [];

      Object.keys(players).forEach(function (pid) {
        var p = players[pid];
        if (!p.info || !p.info.name) return;
        rows.push({
          id: pid,
          name: p.info.name,
          totalTime: p.info.totalTime || 0,
          daysPlayed: p.info.daysPlayed || 0,
          streak: p.info.streak || 0
        });
      });

      // Sort: more days played first, then lowest total time
      rows.sort(function (a, b) {
        if (b.daysPlayed !== a.daysPlayed) return b.daysPlayed - a.daysPlayed;
        return a.totalTime - b.totalTime;
      });

      var container = document.getElementById('lb-rows-time');
      if (rows.length === 0) {
        container.innerHTML = '<div class="lb-empty">No scores yet this week.<br>Play today to be first on the board.</div>';
        return;
      }

      var html = '';
      rows.forEach(function (row, i) {
        var isYou = row.id === playerId;
        var tier = getStreakTier(row.streak);
        var tierEmoji = '';
        if (tier && (tier.css === 'tier-5' || tier.css === 'tier-4')) {
          tierEmoji = ' <span class="lb-tier-badge">&#9733;</span>';
        }
        var timeDisplay = row.totalTime > 0 ? row.totalTime.toFixed(1) + 's' : '—';

        html += '<div class="lb-row' + (isYou ? ' you' : '') + '">';
        html += '<span class="lb-rank">' + (i + 1) + '</span>';
        html += '<span class="lb-name">' + escapeHtml(row.name) + tierEmoji + '</span>';
        html += '<span class="lb-time">' + timeDisplay + '</span>';
        html += '<span class="lb-streak">' + row.daysPlayed + '</span>';
        html += '</div>';
      });
      container.innerHTML = html;
    });
  }

  function loadStreaksLeaderboard() {
    var playerId = getPlayerId();

    var ref = db.ref('starting-block/players');
    ref.orderByChild('streak').limitToLast(50).once('value', function (snap) {
      var players = snap.val() || {};
      var rows = [];

      Object.keys(players).forEach(function (pid) {
        var p = players[pid];
        if (!p.name || !p.streak) return;
        rows.push({
          id: pid,
          name: p.name,
          streak: p.streak || 0,
          longestStreak: p.longestStreak || 0
        });
      });

      // Sort by current streak descending
      rows.sort(function (a, b) { return b.streak - a.streak; });

      var container = document.getElementById('lb-rows-streaks');
      if (rows.length === 0) {
        container.innerHTML = '<div class="lb-empty">No streaks yet.<br>Play daily to build yours.</div>';
        return;
      }

      var html = '';
      rows.forEach(function (row, i) {
        var isYou = row.id === playerId;
        var tier = getStreakTier(row.streak);
        var tierLabel = tier ? ' <span class="lb-tier-badge">' + tier.name + '</span>' : '';

        html += '<div class="lb-row' + (isYou ? ' you' : '') + '">';
        html += '<span class="lb-rank">' + (i + 1) + '</span>';
        html += '<span class="lb-name">' + escapeHtml(row.name) + tierLabel + '</span>';
        html += '<span class="lb-time"></span>';
        html += '<span class="lb-streak">' + row.streak + 'd</span>';
        html += '</div>';
      });
      container.innerHTML = html;
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Share ────────────────────────────────────────────
  window.shareResult = function () {
    var todayResult = getTodayResult();
    if (!todayResult) return;

    var stats = getStats();
    var dayNum = getDayNumber();
    var emoji = todayResult.correct ? '🟩' : '🟥';
    var word = todayResult.correct ? 'Nailed it' : 'Missed it';
    var timeStr = todayResult.time ? ' in ' + todayResult.time.toFixed(1) + 's' : '';

    var tier = getStreakTier(stats.streak);
    var tierStr = tier ? ' — ' + tier.name : '';

    var pbStr = (todayResult.correct && stats.pb !== null && todayResult.time <= stats.pb) ? '\n⚡ New PB!' : '';
    var text = 'Runnerdle #' + dayNum + ' ' + emoji + '\n' + word + timeStr + '\n🔥 ' + stats.streak + ' day streak' + tierStr + pbStr + '\n\nstartingblock.netlify.app';

    if (navigator.share) {
      navigator.share({ text: text }).catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(function () {
      var btns = document.querySelectorAll('.share-btn');
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
    var timeSec = stopLiveTimer();
    var buttons = document.querySelectorAll('.option-btn');
    var isCorrect = chosenIndex === correctIndex;
    var effectiveTime = isCorrect ? timeSec : timeSec + PENALTY_SECONDS;

    // Disable all buttons
    buttons.forEach(function (btn, i) {
      btn.classList.add('answered');
      if (i === correctIndex) btn.classList.add('correct');
      if (i === chosenIndex && !isCorrect) btn.classList.add('incorrect');
    });

    // Update stats
    var stats = getStats();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayKey = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');

    stats.played++;
    if (isCorrect) {
      stats.correct++;
      if (stats.lastPlayed === yesterdayKey || stats.played === 1) {
        stats.streak++;
      } else if (stats.lastPlayed !== getTodayKey()) {
        stats.streak = 1;
      }
      // Update PB (fastest correct answer ever)
      if (stats.pb === null || timeSec < stats.pb) {
        stats.pb = timeSec;
      }
    } else {
      stats.streak = 0;
    }
    // Update longest streak
    if (stats.streak > (stats.longestStreak || 0)) {
      stats.longestStreak = stats.streak;
    }
    stats.lastPlayed = getTodayKey();
    stats.lastCorrect = isCorrect;
    saveStats(stats);
    saveTodayResult(isCorrect, chosenIndex, timeSec);
    renderStats();

    // Submit to Firebase
    submitToFirebase(isCorrect, timeSec);

    // Show fact
    if (question.fact) {
      document.getElementById('fun-fact-text').textContent = question.fact;
      document.getElementById('fun-fact').classList.add('show');
    }

    // Show result
    document.getElementById('result-emoji').textContent = isCorrect ? '🟩' : '🟥';
    document.getElementById('result-text').innerHTML = isCorrect
      ? '<span class="neon">Nailed it.</span>'
      : '<span class="miss">Not today.</span>';
    var isPB = isCorrect && stats.pb !== null && timeSec <= stats.pb;
    document.getElementById('result-time').textContent = isCorrect
      ? timeSec.toFixed(1) + 's' + (isPB ? ' ⚡ New PB!' : '')
      : timeSec.toFixed(1) + 's + ' + PENALTY_SECONDS + 's penalty = ' + effectiveTime.toFixed(1) + 's';
    document.getElementById('result-section').classList.add('show');

    // Show reward and/or promo
    showRewardCard('reward-card');
    showPromoCard('promo-card', 'promo-days');

    startCountdown('countdown');
  }

  // ─── Show already-played state ────────────────────────
  function showAlreadyPlayed(todayResult) {
    var question = QUESTIONS[getDayIndex()];
    var dayNum = getDayNumber();

    document.getElementById('game-area').style.display = 'none';
    document.getElementById('already-played').classList.add('show');

    document.getElementById('ap-q-number').textContent = '#' + dayNum;
    document.getElementById('ap-q-text').textContent = question.question;

    var answerEl = document.getElementById('ap-answer');
    var answerText = question.options[question.answer];
    var chosenText = question.options[todayResult.chosenIndex];

    if (todayResult.correct) {
      answerEl.innerHTML = '<div class="option-btn correct answered" style="opacity:1">' + escapeHtml(answerText) + '</div>';
    } else {
      answerEl.innerHTML = '<div class="option-btn incorrect answered" style="opacity:1">' + escapeHtml(chosenText) + '</div><div class="option-btn correct answered" style="opacity:1; margin-top:10px">' + escapeHtml(answerText) + '</div>';
    }

    document.getElementById('ap-fun-fact-text').textContent = question.fact;
    document.getElementById('ap-result-emoji').textContent = todayResult.correct ? '🟩' : '🟥';
    document.getElementById('ap-result-text').innerHTML = todayResult.correct
      ? '<span class="neon">Nailed it.</span>'
      : '<span class="miss">Not today.</span>';

    if (todayResult.time) {
      var effectiveTime = todayResult.correct ? todayResult.time : todayResult.time + PENALTY_SECONDS;
      document.getElementById('ap-result-time').textContent = todayResult.correct
        ? todayResult.time.toFixed(1) + 's'
        : todayResult.time.toFixed(1) + 's + ' + PENALTY_SECONDS + 's penalty = ' + effectiveTime.toFixed(1) + 's';
    }

    // Show reward and/or promo on revisit
    showRewardCard('ap-reward-card');
    showPromoCard('ap-promo-card', 'ap-promo-days');

    startCountdown('ap-countdown');
  }

  // ─── Name modal ───────────────────────────────────────
  function showNameModal(callback) {
    var modal = document.getElementById('name-modal');
    var input = document.getElementById('name-input');
    var submitBtn = document.getElementById('name-submit');
    var skipBtn = document.getElementById('name-skip');

    modal.classList.add('show');
    setTimeout(function () { input.focus(); }, 100);

    input.addEventListener('input', function () {
      submitBtn.disabled = input.value.trim().length === 0;
    });

    submitBtn.addEventListener('click', function () {
      var name = input.value.trim();
      if (name) {
        setPlayerName(name);
        modal.classList.remove('show');
        callback();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && input.value.trim()) {
        setPlayerName(input.value.trim());
        modal.classList.remove('show');
        callback();
      }
    });

    skipBtn.addEventListener('click', function () {
      modal.classList.remove('show');
      callback();
    });
  }

  // ─── Init ─────────────────────────────────────────────
  function startGame() {
    renderStats();

    // Check if already played today
    var todayResult = getTodayResult();
    if (todayResult) {
      showAlreadyPlayed(todayResult);
      return;
    }

    // Load today's question
    var idx = getDayIndex();
    var question = QUESTIONS[idx];
    var dayNum = getDayNumber();

    document.getElementById('category').textContent = question.category;
    document.getElementById('q-number').textContent = '#' + dayNum;
    document.getElementById('q-text').textContent = question.question;

    var optionsEl = document.getElementById('options');
    question.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        if (btn.classList.contains('answered')) return;
        handleAnswer(i, question.answer, question);
      });
      optionsEl.appendChild(btn);
    });

    // Start the timer
    startLiveTimer();
  }

  function init() {
    // Restore from Firebase if localStorage was cleared (e.g. WhatsApp in-app browser)
    restoreFromFirebase(function () {
      if (!getPlayerName()) {
        showNameModal(startGame);
      } else {
        startGame();
      }
    });
  }

  // Go
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
