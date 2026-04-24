/* ─────────────────────────────────────────────
   1. READ URL PARAMS
───────────────────────────────────────────── */
const params   = new URLSearchParams(window.location.search);
const wpm      = params.get('wpm') || '0';
const accuracy = params.get('accuracy') || '0';
const chars    = params.get('chars') || '0';
const history  = JSON.parse(params.get('history') || '[]');

/* ─────────────────────────────────────────────
   2. POPULATE NUMBERS
───────────────────────────────────────────── */
document.getElementById('s-wpm').textContent      = wpm;
document.getElementById('s-accuracy').textContent = accuracy + '%';
document.getElementById('s-chars').textContent    = chars;
const peakBurst = history.length > 0
  ? Math.max(...history.map(d => typeof d === 'object' ? d.burst : d))
  : 0;
document.getElementById('s-burst').textContent = peakBurst;

/* ─────────────────────────────────────────────
   3. DRAW WPM GRAPH
───────────────────────────────────────────── */
const canvas = document.getElementById('wpm-graph');
const ctx    = canvas.getContext('2d');

function drawGraph() {
  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w   = rect.width;
  const h   = rect.height;
  const pad = { top: 24, right: 24, bottom: 28, left: 40 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  /* normalise history — handle both old format (numbers) and new (objects) */
  const avgData   = history.map(d => typeof d === 'object' ? d.avg   : d);
  const burstData = history.map(d => typeof d === 'object' ? d.burst : d);

  /* background */
  ctx.fillStyle = '#f0ede8';
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 12);
  ctx.fill();

  if (history.length < 1) {
    ctx.fillStyle = '#ccc';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough data — type for at least 5 seconds', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...avgData, ...burstData, 1);

  /* grid lines + y labels */
  ctx.strokeStyle = '#e0ddd8';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + plotH * (i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();

    ctx.fillStyle = '#bbb';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * (1 - i / 4)), pad.left - 6, y + 4);
  }

  const stepX = history.length > 1 ? plotW / (history.length - 1) : plotW;

  function drawLine(data, color, alpha) {
    if (data.length < 1) return;

    /* fill */
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + plotH * (1 - val / maxVal);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.left + (data.length - 1) * stepX, pad.top + plotH);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.closePath();
    ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.fill();

    /* line */
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    data.forEach((val, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + plotH * (1 - val / maxVal);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    /* dots */
    data.forEach((val, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + plotH * (1 - val / maxVal);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }

  /* draw burst first (behind), then avg on top */
  drawLine(burstData, 'rgb(192, 57, 43)', 0.05);
  drawLine(avgData,   'rgb(192, 57, 43)', 0.12);

  /* make burst line dashed and lighter */
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(192, 57, 43, 0.4)';
  ctx.lineWidth = 1.5;
  burstData.forEach((val, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + plotH * (1 - val / maxVal);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  /* x labels */
  history.forEach((_, i) => {
    const x = pad.left + i * stepX;
    ctx.fillStyle = '#bbb';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((i + 1) * 5 + 's', x, h - 6);
  });

  /* legend */
  const lx = pad.left + plotW - 10;
  const ly = pad.top + 12;

  ctx.fillStyle = 'rgb(192, 57, 43)';
  ctx.fillRect(lx - 60, ly - 6, 16, 3);
  ctx.fillStyle = '#888';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('avg', lx - 40, ly - 2);

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(192, 57, 43, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lx - 60, ly + 10);
  ctx.lineTo(lx - 44, ly + 10);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#888';
  ctx.fillText('burst', lx - 40, ly + 14);
}

window.addEventListener('load', () => setTimeout(drawGraph, 50));
window.addEventListener('resize', drawGraph);

/* ─────────────────────────────────────────────
   4. BUTTONS
───────────────────────────────────────────── */
document.getElementById('btn-again').addEventListener('click', () => {
  window.location.href = 'write.html';
});

document.getElementById('btn-back-home').addEventListener('click', () => {
  window.location.href = 'index.html';
});
/* ─────────────────────────────────────────────
   5. LANGUAGE TOGGLE
───────────────────────────────────────────── */
const statsTranslations = {
  en: {
    title: "Statistics", wpm: "WPM", burst: "Peak Burst",
    accuracy: "Accuracy", chars: "Characters", graph: "WPM over time",
    again: "Try Again", home: "Home"
  },
  'zh-TW': {
    title: "統計", wpm: "WPM", burst: "最高瞬間速度",
    accuracy: "準確率", chars: "字數", graph: "WPM 趨勢圖",
    again: "再試一次", home: "回首頁"
  },
  'zh-CN': {
    title: "统计", wpm: "WPM", burst: "最高瞬时速度",
    accuracy: "准确率", chars: "字数", graph: "WPM 趋势图",
    again: "再试一次", home: "回首页"
  }
};

function getLang() {
  const l = sessionStorage.getItem('lang');
  if (!l || l === 'zh') { sessionStorage.setItem('lang', 'zh-TW'); return 'zh-TW'; }
  return l;
}

function updateStatsLanguage() {
  const lang = getLang();
  const t = statsTranslations[lang] || statsTranslations['zh-TW'];

  document.getElementById('stats-title').textContent = t.title;
  document.getElementById('graph-label').textContent = t.graph;
  document.getElementById('btn-again').textContent = t.again;
  document.getElementById('btn-back-home').textContent = t.home;

  const labels = document.querySelectorAll('.stat-block-label');
  labels[0].textContent = t.wpm;
  labels[1].textContent = t.burst;
  labels[2].textContent = t.accuracy;
  labels[3].textContent = t.chars;

  // UPDATED: Update active state on toggle spans
  document.getElementById('toggle-en').classList.toggle('active', lang === 'en');
  document.getElementById('toggle-jian').classList.toggle('active', lang === 'zh-CN');
  document.getElementById('toggle-fan').classList.toggle('active', lang === 'zh-TW');
}

// UPDATED: Improved click listener to match main.js
document.getElementById('lang-toggle').addEventListener('click', (e) => {
  if (e.target.classList.contains('divider')) return;
  const clicked = e.target;
  let newLang;
  if (clicked.id === 'toggle-en') {
    newLang = 'en';
  } else if (clicked.id === 'toggle-jian') { newLang = 'zh-CN';
  } else if (clicked.id === 'toggle-fan') {
    newLang = 'zh-TW';
  } else {
    { const cur = getLang(); newLang = cur === 'en' ? 'zh-TW' : cur === 'zh-TW' ? 'zh-CN' : 'en'; }
  }
  sessionStorage.setItem('lang', newLang);
  updateStatsLanguage();
});

updateStatsLanguage();