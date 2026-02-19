/* ═══════════════════════════════════════════
   Mahmoud Bakir – Study Planner Pro
   app.js – All Features & Logic
═══════════════════════════════════════════ */

'use strict';

// ─── DATA ─────────────────────────────────
const WEEKEND_SCHEDULE = [
  { time: '10:00 – 12:00', emoji: '🗄️', activity: 'Databases – تركيز عالي (SQL, Queries, Design)', category: 'study' },
  { time: '12:00 – 12:30', emoji: '🥗', activity: 'غداء / استراحة قصيرة', category: 'rest' },
  { time: '12:30 – 02:00', emoji: '🧩', activity: 'Problem Solving – مراجعة الحلول السابقة', category: 'study' },
  { time: '02:00 – 03:00', emoji: '😴', activity: 'استراحة + نشاط خفيف / غفوة قصيرة', category: 'rest' },
  { time: '03:00 – 05:00', emoji: '🏫', activity: 'مراجعة الجامعة – قراءة ملاحظات وتحضير', category: 'study' },
  { time: '05:00 – 06:00', emoji: '💻', activity: 'Problem Solving / Coding خفيف', category: 'study' },
  { time: '06:00 – 06:30', emoji: '🚿', activity: 'وقت الاستحمام (ثابت)', category: 'fixed' },
  { time: '06:30 – 08:00', emoji: '🗣️', activity: 'English Speaking – تحدث عن مادتك أو يومك', category: 'english' },
  { time: '08:00 – 09:00', emoji: '🍽️', activity: 'وقت العشاء (ثابت)', category: 'fixed' },
  { time: '09:00 – 10:00', emoji: '✍️', activity: 'English Writing & Vocab (صفحة + 3 جمل)', category: 'english' },
  { time: '10:00 – 10:30', emoji: '🔄', activity: 'مراجعة خفيفة (تحدث وكتابة)', category: 'english' },
  { time: '10:30 – 12:00', emoji: '📖', activity: 'English Light Output / Reading', category: 'english' },
];

const WEEKDAY_SCHEDULE = [
  { time: '05:10 – 06:00', emoji: '🧠', activity: 'دراسة أساسية – المادة الأصعب (Databases)', category: 'study' },
  { time: '06:00 – 06:30', emoji: '🚿', activity: 'وقت الاستحمام (ثابت)', category: 'fixed' },
  { time: '06:30 – 08:00', emoji: '📚', activity: 'دراسة ثالثة / تلخيص ومتابعة مواد الجامعة', category: 'study' },
  { time: '08:00 – 09:00', emoji: '🍽️', activity: 'وقت العشاء (ثابت)', category: 'fixed' },
  { time: '09:00 – 10:00', emoji: '💻', activity: 'دراسة إضافية / Problem Solving خفيف', category: 'study' },
  { time: '10:00 – 10:30', emoji: '🧘', activity: 'استراحة قبل الإنجليزي (تنفس وحركة)', category: 'rest' },
  { time: '10:30 – 11:10', emoji: '🇬🇧', activity: 'English Speaking & Writing', category: 'english' },
  { time: '11:10 – 11:50', emoji: '📑', activity: 'Vocab & المراجعة الخفيفة', category: 'english' },
  { time: '11:50 – 12:30', emoji: '🛌', activity: 'تهدئة قبل النوم (قراءة بسيطة)', category: 'rest' },
];

const QUOTES = [
  'العلم نور يضيء طريق النجاح، والمثابرة هي وقوده الدائم.',
  'كل دقيقة تستثمرها في التعلم اليوم هي عوائد لا تُحصى في الغد.',
  'لا تقارن تقدمك بتقدم الآخرين، فأنت تخوض معركتك الخاصة.',
  'النجاح ليس نهاية الطريق، بل هو بداية المسافة الأجمل.',
  'الانضباط اليومي يبني الأحلام العظيمة درجةً درجة.',
  'أصعب خطوة هي الأولى، لكن الأروع هي تلك التي تتبعها.',
  'مهما كان يومك صعباً، أنت أقوى مما تظن.',
  'The expert in anything was once a beginner.',
  'Every line of code you write is a step toward mastery.',
  'Consistency beats perfection every single day.',
];

const CAT_LABELS = {
  ar: { study: 'دراسة', english: 'إنجليزي', rest: 'راحة', fixed: 'ثابت', personal: 'شخصي' },
  en: { study: 'Study', english: 'English', rest: 'Rest', fixed: 'Fixed', personal: 'Personal' },
};

// ─── STATE ─────────────────────────────────
let state = {
  lang: 'ar',
  theme: 'dark',
  weekendChecked: [],
  weekdayChecked: [],
  customTasks: [],
  streak: 0,
  lastDate: '',
  quoteIndex: 0,
  heatmapData: [],
};

// ─── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  initNavigation();
  initTheme();
  startClock();
  buildHeatmap();
  buildWeekChart();
  updateStats();
});

// ─── PERSISTENCE ───────────────────────────
function loadState() {
  try {
    const saved = localStorage.getItem('mb_planner_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);

      // Reset checked items if new day
      const today = todayStr();
      if (state.lastDate !== today) {
        state.weekendChecked = [];
        state.weekdayChecked = [];
        state.lastDate = today;
        updateStreak();
        saveState();
      }
    } else {
      state.lastDate = todayStr();
      // Seed heatmap
      state.heatmapData = generateHeatmapSeed();
      saveState();
    }
  } catch (e) { console.warn('Could not load state', e); }
}

function saveState() {
  try { localStorage.setItem('mb_planner_v2', JSON.stringify(state)); }
  catch (e) { console.warn('Could not save state', e); }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateHeatmapSeed() {
  const data = [];
  for (let i = 0; i < 14 * 7; i++) {
    data.push(Math.floor(Math.random() * 5));
  }
  return data;
}

// ─── RENDER ────────────────────────────────
function renderAll() {
  renderScheduleTable('weekend-tbody', WEEKEND_SCHEDULE, 'weekend');
  renderScheduleTable('weekday-tbody', WEEKDAY_SCHEDULE, 'weekday');
  renderCustomTasks();
  renderTodayMiniSchedule();
  updateGreeting();
  updateQuote();
  updateStats();
  updateLangUI();
}

function renderScheduleTable(tbodyId, schedule, type) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const checked = state[`${type}Checked`] || [];

  tbody.innerHTML = schedule.map((item, i) => {
    const isDone = checked.includes(i);
    return `
    <tr class="${isDone ? 'done-row' : ''}">
      <td class="td-time">${item.time}</td>
      <td>
        <div class="act-wrap">
          <span class="act-emoji">${item.emoji}</span>
          <span class="act-text">${item.activity}</span>
        </div>
      </td>
      <td><span class="cat-badge cat-${item.category}">${catLabel(item.category)}</span></td>
      <td>
        <label class="custom-check">
          <input type="checkbox" ${isDone ? 'checked' : ''}
            onchange="toggleTask('${type}', ${i}, this.checked)">
          <span class="cbox"></span>
        </label>
      </td>
    </tr>`;
  }).join('');
}

function renderCustomTasks() {
  const list = document.getElementById('custom-tasks-list');
  const empty = document.getElementById('empty-state');
  if (!list) return;

  // Remove existing task items
  list.querySelectorAll('.custom-task-item').forEach(el => el.remove());

  if (state.customTasks.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  state.customTasks.forEach((task, i) => {
    const div = document.createElement('div');
    div.className = `custom-task-item ${task.done ? 'done' : ''}`;
    div.innerHTML = `
      <label class="custom-check">
        <input type="checkbox" ${task.done ? 'checked' : ''}
          onchange="toggleCustomTask(${i}, this.checked)">
        <span class="cbox"></span>
      </label>
      <span class="ct-time">${task.time || '—'}</span>
      <span class="cat-badge cat-${task.category}">${catLabel(task.category)}</span>
      <span class="ct-title">${task.title}</span>
      <button class="ct-delete" onclick="deleteCustomTask(${i})"><i class="fas fa-times"></i></button>
    `;
    list.appendChild(div);
  });
}

function renderTodayMiniSchedule() {
  const el = document.getElementById('today-mini-schedule');
  const label = document.getElementById('today-schedule-label');
  const badge = document.getElementById('today-mode-badge');
  if (!el) return;

  const isWeekend = isWeekendDay();
  const schedule = isWeekend ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
  const type = isWeekend ? 'weekend' : 'weekday';
  const checked = state[`${type}Checked`] || [];

  if (label) label.textContent = state.lang === 'ar'
    ? (isWeekend ? 'جدول العطلة' : 'جدول الأسبوع')
    : (isWeekend ? 'Weekend' : 'Weekday');

  if (badge) badge.textContent = isWeekend
    ? (state.lang === 'ar' ? 'عطلة' : 'Weekend')
    : (state.lang === 'ar' ? 'أسبوع' : 'Weekday');

  const CAT_COLORS = { study: '#60a5fa', english: '#a78bfa', rest: '#34d399', fixed: '#fb923c', personal: '#fb7185' };

  el.innerHTML = schedule.slice(0, 7).map((item, i) => {
    const done = checked.includes(i);
    return `
    <div class="ms-row ${done ? 'done' : ''}">
      <div class="ms-dot" style="background:${CAT_COLORS[item.category] || '#64748b'}"></div>
      <span class="ms-time">${item.time}</span>
      <span class="ms-activity">${item.emoji} ${item.activity.split('–')[0].trim()}</span>
    </div>`;
  }).join('');
}

// ─── TASK TOGGLING ─────────────────────────
function toggleTask(type, index, checked) {
  const key = `${type}Checked`;
  if (checked) {
    if (!state[key].includes(index)) state[key].push(index);
  } else {
    state[key] = state[key].filter(i => i !== index);
  }

  // Update heatmap with today's activity
  updateTodayHeatmap();
  saveState();
  updateStats();
  rerenderRow(type, index);

  // Check for completion celebration
  const total = type === 'weekend' ? WEEKEND_SCHEDULE.length : WEEKDAY_SCHEDULE.length;
  if (state[key].length === total) {
    setTimeout(() => { showConfetti(); showToast('🎉 أتممت جميع مهام اليوم!'); }, 300);
  }
}

function rerenderRow(type, index) {
  const tbodyId = `${type}-tbody`;
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const schedule = type === 'weekend' ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
  const checked = state[`${type}Checked`] || [];
  const rows = tbody.querySelectorAll('tr');
  if (rows[index]) {
    const isDone = checked.includes(index);
    rows[index].className = isDone ? 'done-row' : '';
  }
  renderTodayMiniSchedule();
}

window.toggleTask = toggleTask;

// ─── CUSTOM TASKS ──────────────────────────
window.addCustomTask = function() {
  const title = document.getElementById('taskTitle')?.value.trim();
  const time  = document.getElementById('taskTime')?.value.trim();
  const cat   = document.getElementById('taskCategory')?.value;

  if (!title) { showToast('⚠️ أدخل اسم المهمة'); return; }

  state.customTasks.push({ title, time, category: cat, done: false });
  saveState();
  renderCustomTasks();
  updateStats();

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskTime').value = '';
  showToast('✅ تمت إضافة المهمة');
};

window.toggleCustomTask = function(index, checked) {
  if (state.customTasks[index]) {
    state.customTasks[index].done = checked;
    saveState();
    updateStats();
    renderCustomTasks();
  }
};

window.deleteCustomTask = function(index) {
  state.customTasks.splice(index, 1);
  saveState();
  renderCustomTasks();
  updateStats();
  showToast('🗑️ تم حذف المهمة');
};

// ─── STATS ─────────────────────────────────
function updateStats() {
  const wChecked = state.weekendChecked.length;
  const dChecked = state.weekdayChecked.length;
  const cChecked = state.customTasks.filter(t => t.done).length;
  const total = wChecked + dChecked + cChecked;

  const isWeekend = isWeekendDay();
  const schedTotal = isWeekend ? WEEKEND_SCHEDULE.length : WEEKDAY_SCHEDULE.length;
  const schedChecked = isWeekend ? wChecked : dChecked;
  const pct = schedTotal > 0 ? Math.round((schedChecked / schedTotal) * 100) : 0;

  // KPI
  setText('kpi-completed', total);
  setText('kpi-productivity', `${pct}%`);
  setText('kpi-hours', `${Math.round(total * 0.8)}س`);
  setText('kpi-streak', state.streak);
  setText('circle-percent', `${pct}%`);

  // Progress circle
  const circle = document.getElementById('progress-circle');
  if (circle) {
    const offset = 314 - (314 * pct / 100);
    circle.style.strokeDashoffset = offset;
  }

  // Mini bars (approximate)
  const studyDone = [...state.weekendChecked, ...state.weekdayChecked]
    .filter(i => {
      const item = isWeekend ? WEEKEND_SCHEDULE[i] : WEEKDAY_SCHEDULE[i];
      return item && item.category === 'study';
    }).length;
  const engDone = [...state.weekendChecked, ...state.weekdayChecked]
    .filter(i => {
      const item = isWeekend ? WEEKEND_SCHEDULE[i] : WEEKDAY_SCHEDULE[i];
      return item && item.category === 'english';
    }).length;
  const restDone = [...state.weekendChecked, ...state.weekdayChecked]
    .filter(i => {
      const item = isWeekend ? WEEKEND_SCHEDULE[i] : WEEKDAY_SCHEDULE[i];
      return item && item.category === 'rest';
    }).length;

  setBar('bar-study',   Math.min(100, studyDone * 20));
  setBar('bar-english', Math.min(100, engDone * 25));
  setBar('bar-rest',    Math.min(100, restDone * 33));

  // Schedule progress bars
  const wTotal = WEEKEND_SCHEDULE.length;
  const dTotal = WEEKDAY_SCHEDULE.length;
  setProgressBar('weekend-spb', (wChecked / wTotal) * 100);
  setProgressBar('weekday-spb', (dChecked / dTotal) * 100);
  setText('weekend-spb-label', `${wChecked} / ${wTotal}`);
  setText('weekday-spb-label', `${dChecked} / ${dTotal}`);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setBar(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${pct}%`;
}
function setProgressBar(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${Math.min(100, pct)}%`;
}

// ─── STREAK ────────────────────────────────
function updateStreak() {
  const today = todayStr();
  const last = state.lastDate;

  if (!last) { state.streak = 1; return; }

  const diff = (new Date(today) - new Date(last)) / 86400000;
  if (diff === 1) { state.streak = (state.streak || 0) + 1; }
  else if (diff > 1) { state.streak = 1; }
  // same day: no change
}

// ─── HEATMAP ───────────────────────────────
function buildHeatmap() {
  const el = document.getElementById('heatmap');
  if (!el) return;

  const data = state.heatmapData || generateHeatmapSeed();
  el.innerHTML = '';

  // 14 weeks × 7 days
  for (let w = 0; w < 14; w++) {
    const weekDiv = document.createElement('div');
    weekDiv.className = 'hm-week';
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const level = data[idx] || 0;
      const day = document.createElement('div');
      day.className = `hm-day${level > 0 ? ` l${level}` : ''}`;
      day.title = `Week ${w + 1}, Day ${d + 1}: ${level > 0 ? ['Low','Medium','Good','Excellent'][level - 1] : 'No activity'}`;
      weekDiv.appendChild(day);
    }
    el.appendChild(weekDiv);
  }
}

function updateTodayHeatmap() {
  if (!state.heatmapData) state.heatmapData = generateHeatmapSeed();
  const total = state.weekendChecked.length + state.weekdayChecked.length;
  const level = Math.min(4, Math.floor(total / 3));
  // Update last cell
  const last = state.heatmapData.length - 1;
  state.heatmapData[last] = level;
  buildHeatmap();
}

// ─── WEEK CHART ────────────────────────────
function buildWeekChart() {
  const el = document.getElementById('week-chart');
  if (!el) return;
  const heights = [65, 80, 45, 90, 70, 30, 85];
  el.innerHTML = heights.map(h =>
    `<div class="wbc-bar" style="height:${h}%;"></div>`
  ).join('');
}

// ─── CLOCK ─────────────────────────────────
function startClock() {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    setText('liveClock', `${h}:${m}:${s}`);

    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = state.lang === 'ar' ? 'ar-SA' : 'en-US';
    setText('liveDate', now.toLocaleDateString(locale, opts));
  }
  tick();
  setInterval(tick, 1000);
}

// ─── GREETING ──────────────────────────────
function updateGreeting() {
  const h = new Date().getHours();
  const greetings = {
    ar: h < 12 ? 'صباح النور، محمود 👋' : h < 17 ? 'مساء الخير، محمود 👋' : 'مساء النور، محمود 🌙',
    en: h < 12 ? 'Good morning, Mahmoud 👋' : h < 17 ? 'Good afternoon, Mahmoud 👋' : 'Good evening, Mahmoud 🌙',
  };
  const el = document.getElementById('greeting');
  if (el) el.textContent = greetings[state.lang];
}

// ─── QUOTES ────────────────────────────────
function updateQuote() {
  const el = document.getElementById('quote-text');
  if (el) el.textContent = QUOTES[state.quoteIndex % QUOTES.length];

  const sub = document.getElementById('daily-quote');
  if (sub) sub.textContent = QUOTES[(state.quoteIndex + 1) % QUOTES.length];
}

window.newQuote = function() {
  state.quoteIndex = (state.quoteIndex + 1) % QUOTES.length;
  updateQuote();
};

// ─── NAVIGATION ────────────────────────────
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const tab = item.dataset.tab;
      switchTab(tab);

      // close sidebar on mobile
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar')?.classList.remove('open');
      }
    });
  });

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
}

function switchTab(tab) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const navItem = document.querySelector(`[data-tab="${tab}"]`);
  const content = document.getElementById(`tab-${tab}`);
  if (navItem) navItem.classList.add('active');
  if (content) content.classList.add('active');
}

// ─── THEME ─────────────────────────────────
function initTheme() {
  if (state.theme === 'light') document.body.classList.add('light');
  updateThemeBtn();
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('light', state.theme === 'light');
  updateThemeBtn();
  saveState();
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = state.theme === 'dark'
    ? '<i class="fas fa-sun"></i><span>الوضع النهاري</span>'
    : '<i class="fas fa-moon"></i><span>الوضع الليلي</span>';
}

// ─── LANGUAGE ──────────────────────────────
document.getElementById('langBtn')?.addEventListener('click', toggleLang);

function toggleLang() {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = state.lang === 'ar' ? 'EN' : 'AR';

  updateLangUI();
  renderAll();
  saveState();
}

function updateLangUI() {
  // Update all elements with data-ar/data-en
  document.querySelectorAll('[data-ar]').forEach(el => {
    el.textContent = state.lang === 'ar'
      ? el.dataset.ar
      : (el.dataset.en || el.dataset.ar);
  });

  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = state.lang === 'ar' ? 'EN' : 'AR';
}

function catLabel(cat) {
  return (CAT_LABELS[state.lang] || CAT_LABELS.ar)[cat] || cat;
}

// ─── RESET ─────────────────────────────────
window.resetDay = function() {
  const msg = state.lang === 'ar'
    ? 'هل تريد مسح جميع مهام اليوم؟'
    : 'Reset all tasks for today?';
  if (!confirm(msg)) return;

  state.weekendChecked = [];
  state.weekdayChecked = [];
  state.customTasks = state.customTasks.map(t => ({ ...t, done: false }));
  saveState();
  renderAll();
  showToast(state.lang === 'ar' ? '🔄 تمت إعادة التعيين' : '🔄 Reset complete');
};

// ─── TOAST ─────────────────────────────────
let toastTimeout;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 3000);
}

// ─── CONFETTI ──────────────────────────────
function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 8 + 4,
    d: Math.random() * 0.5 + 0.3,
    color: ['#60a5fa','#a78bfa','#34d399','#fb923c','#fb7185'][Math.floor(Math.random() * 5)],
    tilt: Math.random() * 360,
    tiltSpeed: Math.random() * 4 - 2,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.d * 5;
      p.x += Math.sin(frame / 30) * 2;
      p.tilt += p.tiltSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─── HELPERS ───────────────────────────────
function isWeekendDay() {
  const day = new Date().getDay(); // 0=Sun, 6=Sat
  return day === 5 || day === 6; // Friday/Saturday (Arabic weekend)
}
