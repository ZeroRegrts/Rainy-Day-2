/* ─────────────────────────────────────────────
   1. WORD BANK
   Phrases used for the "danmaku" background animation.
───────────────────────────────────────────── */
const wordBank = [
  "學習", "我在學中文", "今天要學什麼？", "這個有點難", "我不太懂",
  "可以再說一次嗎？", "你可以慢一點說嗎？", "我需要多一點時間",
  "這個意思是什麼？", "我查一下字典", "這樣用對嗎？", "我還在練習",
  "多練習就會進步", "我每天都學一點", "我想讓我的中文更自然",
  "這句話聽起來怪怪的嗎？", "可以幫我改一下這句話嗎？",
  "我想提高我的聽力能力", "說中文的時候我有點緊張",
  "我正在慢慢建立信心", "我學到了很多新的表達方式",
  "這個方法對我很有幫助", "我喜歡用聊天來學習語言",
  "有時候我會忘記怎麼說", "不過我會繼續努力下去",
  "你好", "您好", "早安", "晚安", "最近好嗎？",
  "很高興見到你", "很高興認識你", "謝謝", "非常感謝你",
  "真的很謝謝你的幫忙", "不客氣", "沒關係", "對不起",
  "不好意思打擾一下", "請", "請問", "可以請你幫我一下嗎？",
  "麻煩你了", "可以嗎？", "好的，沒問題", "請稍等一下",
  "歡迎光臨", "請進", "請坐", "請慢用", "慢走",
  "路上小心", "保重", "祝你好運", "祝你有美好的一天",
  "希望你一切順利", "辛苦了", "加油", "有空再聯絡", "保持聯絡",
];

/* ─────────────────────────────────────────────
   2. STATE & CONFIG
───────────────────────────────────────────── */
const app = document.getElementById('app');
let animationsEnabled = true;
const activeYPositions = [];
let savedPhrases = [];
let wasHidden = false;
let snapshot = [];

/* ─────────────────────────────────────────────
   3. DANMAKU ANIMATION
   Spawns floating phrases that travel across the background.
───────────────────────────────────────────── */
function spawnPhrase(startProgress = 0, existingY = null, existingText = null) {
  if (!animationsEnabled) return;

  const el = document.createElement('div');
  el.className = 'float-phrase';
  el.textContent = existingText !== null
    ? existingText
    : wordBank[Math.floor(Math.random() * wordBank.length)];

  el.style.visibility = 'hidden';
  el.style.position = 'absolute';
  app.appendChild(el);
  const phraseWidth = el.offsetWidth;
  app.removeChild(el);
  el.style.visibility = '';

  const minYGap = 8;
  const minXGap = 80;
  let yPct;

  if (existingY !== null) {
    yPct = existingY;
  } else {
    let attempts = 0;
    let found = false;
    do {
      yPct = 4 + Math.random() * 90;
      const yOk = !activeYPositions.some(y => Math.abs(y - yPct) < minYGap);
      const xOk = !savedPhrases.some(p => {
        const sameRow = Math.abs(p.yPct - yPct) < minYGap * 2;
        if (!sameRow) return false;
        const vw = window.innerWidth || 1200;
        const totalDist = vw + 600;
        const pX = vw - (p.progress * totalDist);
        const newX = vw;
        return Math.abs(pX - newX) < phraseWidth + minXGap;
      });
      found = yOk && xOk;
      attempts++;
    } while (!found && attempts < 30);
  }
  activeYPositions.push(yPct);

  const speed     = 55 + Math.random() * 55;
  const vw        = window.innerWidth || document.documentElement.clientWidth || 1200;
  const totalDist = vw + 600;
  const duration  = (totalDist / speed) * 1000;
  const fadeIn    = 1000;
  const fadeOut   = 1500;
  const maxAlpha  = 0.18;

  el.style.top       = yPct + '%';
  el.style.opacity   = '0';
  el.style.right     = '0';

  const startX = vw - (startProgress * totalDist);
  el.style.transform = 'translateX(' + startX + 'px)';
  app.appendChild(el);

  let elapsed0 = startProgress * duration;
  let t0 = null;

  const phraseRecord = { yPct, progress: startProgress, text: el.textContent };
  savedPhrases.push(phraseRecord);

  function tick(ts) {
    if (!t0) t0 = ts;
    const elapsed  = elapsed0 + (ts - t0);
    const progress = Math.min(elapsed / duration, 1);
    phraseRecord.progress = progress;
    const x        = vw - (progress * totalDist);

    let opacity;
    if (elapsed < fadeIn) {
      opacity = (elapsed / fadeIn) * maxAlpha;
    } else if (elapsed > duration - fadeOut) {
      opacity = Math.max(0, ((duration - elapsed) / fadeOut) * maxAlpha);
    } else {
      opacity = maxAlpha;
    }

    el.style.transform = 'translateX(' + x + 'px)';
    el.style.opacity   = opacity;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.remove();
      const idx = activeYPositions.indexOf(yPct);
      if (idx !== -1) activeYPositions.splice(idx, 1);
      const si = savedPhrases.indexOf(phraseRecord);
      if (si !== -1) savedPhrases.splice(si, 1);
    }
  }
  requestAnimationFrame(tick);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    wasHidden = true;
    snapshot = savedPhrases.map(p => ({ yPct: p.yPct, progress: p.progress, text: p.text }));
    document.querySelectorAll('.float-phrase').forEach(el => el.remove());
    activeYPositions.length = 0;
    savedPhrases = [];
  } else if (wasHidden) {
    wasHidden = false;
    snapshot.forEach(p => spawnPhrase(p.progress, p.yPct, p.text));
    snapshot = [];
  }
});

(function loop() {
  setTimeout(() => {
    if (!document.hidden) spawnPhrase();
    loop();
  }, 1200 + Math.random() * 2200);
})();

/* ─────────────────────────────────────────────
   4. TITLE & SUBTITLE
───────────────────────────────────────────── */

// 4a. Title — zhuyin typing animation
const zhuyinSteps = ['ㄩ', 'ㄩˇ', 'ㄩˇ ㄊ', 'ㄩˇ ㄊㄧ', 'ㄩˇ ㄊㄧㄢ', '雨天'];
const titleEl = document.getElementById('title-text');
let step = 0;

function typeTitle() {
  if (step < zhuyinSteps.length) {
    titleEl.textContent = zhuyinSteps[step];
    step++;
    const isLast = step === zhuyinSteps.length;
    setTimeout(typeTitle, isLast ? 500 : 150 + Math.random() * 150);
  }
}
setTimeout(typeTitle, 500);

// 4b. Subtitle — rotating funny subtitles (RESTORED)
const subtitles = [
  'ㄏㄏㄏ',
  '哈囉世界',
  '贏麻了',
  '遙遙領先',
  '喝茶了嗎？🍵',
  '此網站只有正能量',
  'Today\'s date: 1946/09/08',
  '尋釁滋事',
  '源自於老祖宗的智慧',
  '來源於永樂大典',
  '嗯...這個嘛...',
];

document.getElementById('subtitle').textContent =
  subtitles[Math.floor(Math.random() * subtitles.length)];

/* ─────────────────────────────────────────────
   5. SETTINGS & PERSISTENCE
───────────────────────────────────────────── */
const settingsBtn      = document.getElementById('btn-settings');
const settingsMenu     = document.getElementById('settings-menu');
const toggleAnimations = document.getElementById('toggle-animations');
const toggleDark       = document.getElementById('toggle-dark');
const timerPills       = document.querySelectorAll('.timer-pill');

function applySettings() {
  const dark = sessionStorage.getItem('theme') === 'dark';
  const anims = sessionStorage.getItem('animations') !== 'false'; 
  const duration = sessionStorage.getItem('timerDuration') || '60';

  if (dark) {
    document.body.classList.add('dark');
    toggleDark.checked = true;
  }

  animationsEnabled = anims;
  toggleAnimations.checked = anims;
  const cursor = document.getElementById('cursor');
  if (cursor) {
    if (!anims) {
      cursor.style.animation = 'none';
      cursor.style.opacity = '1';
    } else {
      cursor.style.animation = 'blink 0.9s step-end infinite';
    }
  }

  timerPills.forEach(p => {
    p.classList.toggle('active', p.dataset.seconds === duration);
  });
}
applySettings();

settingsBtn.addEventListener('click', () => settingsMenu.classList.toggle('open'));

document.addEventListener('click', (e) => {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsMenu.classList.remove('open');
  }
});

toggleAnimations.addEventListener('change', () => {
  animationsEnabled = toggleAnimations.checked;
  sessionStorage.setItem('animations', animationsEnabled);
  const cursor = document.getElementById('cursor');
  if (!animationsEnabled) {
    document.querySelectorAll('.float-phrase').forEach(el => el.remove());
    activeYPositions.length = 0;
    savedPhrases = [];
    if (cursor) { cursor.style.animation = 'none'; cursor.style.opacity = '1'; }
  } else {
    if (cursor) { cursor.style.animation = 'blink 0.9s step-end infinite'; }
  }
});

toggleDark.addEventListener('change', () => {
  const isDark = toggleDark.checked;
  document.body.classList.toggle('dark', isDark);
  sessionStorage.setItem('theme', isDark ? 'dark' : 'light');
});

timerPills.forEach(pill => {
  pill.addEventListener('click', () => {
    timerPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    sessionStorage.setItem('timerDuration', pill.dataset.seconds);
  });
});

/* ─────────────────────────────────────────────
   6. NAVIGATION
───────────────────────────────────────────── */
document.getElementById('btn-write').addEventListener('click', () => {
  window.location.href = 'write.html';
});

/* ─────────────────────────────────────────────
   7. LANGUAGE TOGGLE
───────────────────────────────────────────── */
const langToggle = document.getElementById('lang-toggle');
const homeTranslations = {
  en: { learn: "Learn", write: "Write", animations: "Animations", dark: "Dark Mode" },
  zh: { learn: "學習", write: "書寫", animations: "動畫", dark: "深色模式" }
};

function updateHomeLanguage() {
  const lang = sessionStorage.getItem('lang') || 'zh';
  const t = homeTranslations[lang];

  document.getElementById('btn-learn').textContent = t.learn;
  document.getElementById('btn-write').textContent = t.write;

  const settingsSpans = document.querySelectorAll('.settings-item > span');
  if (settingsSpans.length >= 2) {
    settingsSpans[0].textContent = t.animations;
    settingsSpans[1].textContent = t.dark;
  }

  const enSpan = document.getElementById('toggle-en');
  const zhSpan = document.getElementById('toggle-zh');
  if (lang === 'en') {
    enSpan.classList.add('active');
    zhSpan.classList.remove('active');
  } else {
    zhSpan.classList.add('active');
    enSpan.classList.remove('active');
  }
}

langToggle.addEventListener('click', (e) => {
  if (e.target.classList.contains('divider')) return;
  const clicked = e.target;
  let newLang;
  if (clicked.id === 'toggle-en') newLang = 'en';
  else if (clicked.id === 'toggle-zh') newLang = 'zh';
  else newLang = (sessionStorage.getItem('lang') || 'zh') === 'zh' ? 'en' : 'zh';
  
  sessionStorage.setItem('lang', newLang);
  updateHomeLanguage();
});

updateHomeLanguage();