/* ─────────────────────────────────────────────
   learn.js — 雨天 Learn Page v4 (Updated Accuracy/Progress)
───────────────────────────────────────────── */

/* ══════════════════════════════════════════════
   1. BOPOMOFO KEYBOARD DATA
   Verified: Microsoft Bopomofo Standard layout
══════════════════════════════════════════════ */
const BOPOMOFO_MAP = {
  '1':'ㄅ','2':'ㄉ','3':'ˇ','4':'ˋ','5':'ㄓ','6':'ˊ','7':'˙',
  '8':'ㄚ','9':'ㄞ','0':'ㄢ','-':'ㄦ',
  'q':'ㄆ','w':'ㄊ','e':'ㄍ','r':'ㄐ','t':'ㄔ','y':'ㄗ',
  'u':'ㄧ','i':'ㄛ','o':'ㄟ','p':'ㄣ',
  'a':'ㄇ','s':'ㄋ','d':'ㄎ','f':'ㄑ','g':'ㄕ','h':'ㄘ',
  'j':'ㄨ','k':'ㄜ','l':'ㄠ',';':'ㄤ',
  'z':'ㄈ','x':'ㄌ','c':'ㄏ','v':'ㄒ','b':'ㄖ',
  'n':'ㄙ','m':'ㄩ',',':'ㄝ','.':'ㄡ','/':'ㄥ',
  ' ':'1st',
};

const ZHUYIN_TO_KEY = {};
Object.entries(BOPOMOFO_MAP).forEach(([k,v]) => { ZHUYIN_TO_KEY[v] = k; });

const KB_ROWS = [
  [
    {key:'1',zh:'ㄅ'},{key:'2',zh:'ㄉ'},{key:'3',zh:'ˇ',tone:true},{key:'4',zh:'ˋ',tone:true},
    {key:'5',zh:'ㄓ'},{key:'6',zh:'ˊ',tone:true},{key:'7',zh:'˙',tone:true},
    {key:'8',zh:'ㄚ'},{key:'9',zh:'ㄞ'},{key:'0',zh:'ㄢ'},{key:'-',zh:'ㄦ'},
  ],
  [
    {key:'Q',zh:'ㄆ'},{key:'W',zh:'ㄊ'},{key:'E',zh:'ㄍ'},{key:'R',zh:'ㄐ'},
    {key:'T',zh:'ㄔ'},{key:'Y',zh:'ㄗ'},{key:'U',zh:'ㄧ'},{key:'I',zh:'ㄛ'},
    {key:'O',zh:'ㄟ'},{key:'P',zh:'ㄣ'},
  ],
  [
    {key:'A',zh:'ㄇ'},{key:'S',zh:'ㄋ'},{key:'D',zh:'ㄎ'},{key:'F',zh:'ㄑ'},
    {key:'G',zh:'ㄕ'},{key:'H',zh:'ㄘ'},{key:'J',zh:'ㄨ'},{key:'K',zh:'ㄜ'},
    {key:'L',zh:'ㄠ'},{key:';',zh:'ㄤ'},
  ],
  [
    {key:'Z',zh:'ㄈ'},{key:'X',zh:'ㄌ'},{key:'C',zh:'ㄏ'},{key:'V',zh:'ㄒ'},
    {key:'B',zh:'ㄖ'},{key:'N',zh:'ㄙ'},{key:'M',zh:'ㄩ'},
    {key:',',zh:'ㄝ'},{key:'.',zh:'ㄡ'},{key:'/',zh:'ㄥ'},
  ],
  [{key:'SPACE',zh:'1st tone',tone:true,space:true}],
];

const PINYIN = {
  'ㄅ':'b','ㄆ':'p','ㄇ':'m','ㄈ':'f',
  'ㄉ':'d','ㄊ':'t','ㄋ':'n','ㄌ':'l',
  'ㄍ':'g','ㄎ':'k','ㄏ':'h',
  'ㄐ':'j','ㄑ':'q','ㄒ':'x',
  'ㄓ':'zh','ㄔ':'ch','ㄕ':'sh','ㄖ':'r',
  'ㄗ':'z','ㄘ':'c','ㄙ':'s',
  'ㄚ':'a','ㄛ':'o','ㄜ':'e','ㄝ':'ê',
  'ㄞ':'ai','ㄟ':'ei','ㄠ':'ao','ㄡ':'ou',
  'ㄢ':'an','ㄣ':'en','ㄤ':'ang','ㄥ':'eng','ㄦ':'er',
  'ㄧ':'i','ㄨ':'u','ㄩ':'ü',
};

const SYMBOL_HINT = {
  ...PINYIN,
  'ˊ':'2nd','ˇ':'3rd','ˋ':'4th','˙':'neutral','1st':'1st (space)',
};

/* ══════════════════════════════════════════════
   2. SECTIONS
══════════════════════════════════════════════ */
const SECTIONS = {
  initials: {
    symbols: ['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ'],
    type: 'single',
  },
  medials: {
    symbols: ['ㄧ','ㄨ','ㄩ'],
    type: 'single',
  },
  finals: {
    symbols: ['ㄚ','ㄛ','ㄜ','ㄝ','ㄞ','ㄟ','ㄠ','ㄡ','ㄢ','ㄣ','ㄤ','ㄥ','ㄦ'],
    type: 'single',
  },
  tones: {
    symbols: ['ˊ','ˇ','ˋ','˙','1st'],
    type: 'single',
  },
  combos: {
    type: 'combo',
    syllables: [
      /* standalone initials */
      ['ㄓ','ˊ'],['ㄓ','ˇ'],['ㄓ','ˋ'],
      ['ㄔ','ˊ'],['ㄔ','ˇ'],['ㄔ','ˋ'],
      ['ㄕ','ˊ'],['ㄕ','ˇ'],['ㄕ','ˋ'],
      ['ㄖ','ˊ'],['ㄖ','ˋ'],
      ['ㄗ','ˊ'],['ㄗ','ˇ'],['ㄗ','ˋ'],
      ['ㄘ','ˊ'],['ㄘ','ˇ'],
      ['ㄙ','ˋ'],
      /* initial + final + tone */
      ['ㄅ','ㄚ','SPACE'],['ㄅ','ㄛ','SPACE'],['ㄅ','ㄞ','SPACE'],
      ['ㄅ','ㄢ','SPACE'],['ㄅ','ㄣ','SPACE'],
      ['ㄆ','ㄚ','SPACE'],['ㄆ','ㄛ','SPACE'],
      ['ㄇ','ㄚ','ˊ'],['ㄇ','ㄚ','ˇ'],['ㄇ','ㄚ','ˋ'],
      ['ㄇ','ㄛ','SPACE'],['ㄇ','ㄞ','ˊ'],
      ['ㄈ','ㄚ','ˊ'],['ㄈ','ㄟ','SPACE'],['ㄈ','ㄟ','ˊ'],
      ['ㄉ','ㄜ','SPACE'],['ㄉ','ㄠ','ˋ'],['ㄉ','ㄞ','ˋ'],['ㄉ','ㄢ','SPACE'],
      ['ㄊ','ㄚ','SPACE'],['ㄊ','ㄚ','ˊ'],['ㄊ','ㄞ','ˊ'],
      ['ㄋ','ㄚ','SPACE'],['ㄋ','ㄞ','ˋ'],['ㄋ','ㄢ','ˊ'],
      ['ㄌ','ㄜ','SPACE'],['ㄌ','ㄞ','ˊ'],['ㄌ','ㄠ','ˇ'],
      ['ㄍ','ㄠ','SPACE'],['ㄍ','ㄢ','SPACE'],
      ['ㄎ','ㄜ','SPACE'],['ㄎ','ㄜ','ˇ'],
      ['ㄏ','ㄠ','ˇ'],['ㄏ','ㄜ','SPACE'],['ㄏ','ㄞ','ˇ'],
      ['ㄓ','ㄜ','SPACE'],['ㄓ','ㄠ','ˋ'],
      ['ㄔ','ㄜ','SPACE'],['ㄔ','ㄞ','ˊ'],
      ['ㄕ','ㄢ','SPACE'],['ㄕ','ㄣ','SPACE'],
      ['ㄗ','ㄞ','ˋ'],['ㄗ','ㄢ','SPACE'],
      ['ㄘ','ㄞ','ˊ'],['ㄙ','ㄢ','SPACE'],
      /* initial + ㄧ + tone */
      ['ㄅ','ㄧ','SPACE'],['ㄅ','ㄧ','ˊ'],['ㄅ','ㄧ','ˇ'],['ㄅ','ㄧ','ˋ'],
      ['ㄆ','ㄧ','SPACE'],['ㄆ','ㄧ','ˊ'],['ㄆ','ㄧ','ˇ'],
      ['ㄇ','ㄧ','ˊ'],['ㄇ','ㄧ','ˋ'],
      ['ㄉ','ㄧ','SPACE'],['ㄉ','ㄧ','ˊ'],['ㄉ','ㄧ','ˇ'],['ㄉ','ㄧ','ˋ'],
      ['ㄊ','ㄧ','ˊ'],['ㄊ','ㄧ','ˇ'],
      ['ㄋ','ㄧ','ˇ'],['ㄋ','ㄧ','ˋ'],
      ['ㄌ','ㄧ','SPACE'],['ㄌ','ㄧ','ˊ'],['ㄌ','ㄧ','ˇ'],['ㄌ','ㄧ','ˋ'],
      ['ㄐ','ㄧ','SPACE'],['ㄐ','ㄧ','ˊ'],['ㄐ','ㄧ','ˇ'],['ㄐ','ㄧ','ˋ'],
      ['ㄑ','ㄧ','SPACE'],['ㄑ','ㄧ','ˊ'],['ㄑ','ㄧ','ˇ'],['ㄑ','ㄧ','ˋ'],
      ['ㄒ','ㄧ','SPACE'],['ㄒ','ㄧ','ˊ'],['ㄒ','ㄧ','ˇ'],['ㄒ','ㄧ','ˋ'],
      /* initial + ㄨ + tone */
      ['ㄉ','ㄨ','SPACE'],['ㄉ','ㄨ','ˊ'],['ㄉ','ㄨ','ˇ'],['ㄉ','ㄨ','ˋ'],
      ['ㄊ','ㄨ','SPACE'],['ㄊ','ㄨ','ˊ'],
      ['ㄋ','ㄨ','ˇ'],['ㄋ','ㄨ','ˋ'],
      ['ㄌ','ㄨ','ˊ'],['ㄌ','ㄨ','ˋ'],
      ['ㄍ','ㄨ','SPACE'],['ㄍ','ㄨ','ˊ'],['ㄍ','ㄨ','ˇ'],
      ['ㄎ','ㄨ','SPACE'],['ㄎ','ㄨ','ˇ'],
      ['ㄏ','ㄨ','SPACE'],['ㄏ','ㄨ','ˊ'],['ㄏ','ㄨ','ˇ'],
      ['ㄓ','ㄨ','SPACE'],['ㄓ','ㄨ','ˊ'],['ㄓ','ㄨ','ˇ'],
      ['ㄔ','ㄨ','SPACE'],['ㄔ','ㄨ','ˊ'],['ㄔ','ㄨ','ˋ'],
      ['ㄕ','ㄨ','SPACE'],['ㄕ','ㄨ','ˊ'],['ㄕ','ㄨ','ˇ'],['ㄕ','ㄨ','ˋ'],
      ['ㄖ','ㄨ','ˊ'],['ㄖ','ㄨ','ˋ'],
      ['ㄗ','ㄨ','SPACE'],['ㄗ','ㄨ','ˊ'],['ㄗ','ㄨ','ˇ'],
      ['ㄘ','ㄨ','SPACE'],['ㄘ','ㄨ','ˊ'],
      ['ㄙ','ㄨ','SPACE'],['ㄙ','ㄨ','ˊ'],
      /* initial + ㄩ + tone */
      ['ㄋ','ㄩ','ˇ'],['ㄋ','ㄩ','ˋ'],
      ['ㄌ','ㄩ','ˊ'],['ㄌ','ㄩ','ˋ'],
      ['ㄐ','ㄩ','SPACE'],['ㄐ','ㄩ','ˊ'],['ㄐ','ㄩ','ˇ'],['ㄐ','ㄩ','ˋ'],
      ['ㄑ','ㄩ','SPACE'],['ㄑ','ㄩ','ˊ'],['ㄑ','ㄩ','ˇ'],['ㄑ','ㄩ','ˋ'],
      ['ㄒ','ㄩ','SPACE'],['ㄒ','ㄩ','ˊ'],['ㄒ','ㄩ','ˇ'],['ㄒ','ㄩ','ˋ'],
      /* 4-key: initial + ㄧ + final + tone */
      ['ㄊ','ㄧ','ㄢ','SPACE'],['ㄊ','ㄧ','ㄢ','ˊ'],
      ['ㄉ','ㄧ','ㄢ','SPACE'],['ㄉ','ㄧ','ㄢ','ˋ'],
      ['ㄋ','ㄧ','ㄢ','ˊ'],['ㄌ','ㄧ','ㄢ','ˋ'],
      ['ㄐ','ㄧ','ㄢ','SPACE'],['ㄐ','ㄧ','ㄢ','ˋ'],
      ['ㄑ','ㄧ','ㄢ','SPACE'],['ㄑ','ㄧ','ㄢ','ˊ'],
      ['ㄒ','ㄧ','ㄢ','SPACE'],['ㄒ','ㄧ','ㄢ','ˋ'],
      ['ㄐ','ㄧ','ㄥ','SPACE'],['ㄐ','ㄧ','ㄥ','ˊ'],
      ['ㄑ','ㄧ','ㄥ','SPACE'],['ㄑ','ㄧ','ㄥ','ˊ'],
      ['ㄒ','ㄧ','ㄥ','SPACE'],['ㄒ','ㄧ','ㄥ','ˋ'],
      ['ㄐ','ㄧ','ㄠ','SPACE'],['ㄐ','ㄧ','ㄠ','ˋ'],
      ['ㄑ','ㄧ','ㄠ','ˇ'],['ㄒ','ㄧ','ㄠ','ˇ'],
      ['ㄌ','ㄧ','ㄠ','ˇ'],['ㄉ','ㄧ','ㄠ','ˋ'],
      ['ㄑ','ㄧ','ㄤ','ˊ'],['ㄐ','ㄧ','ㄤ','SPACE'],
      ['ㄒ','ㄧ','ㄤ','SPACE'],['ㄒ','ㄧ','ㄤ','ˋ'],
      /* 4-key: initial + ㄨ + final + tone */
      ['ㄍ','ㄨ','ㄥ','SPACE'],['ㄓ','ㄨ','ㄥ','SPACE'],
      ['ㄊ','ㄨ','ㄥ','SPACE'],['ㄉ','ㄨ','ㄥ','SPACE'],
      ['ㄏ','ㄨ','ㄥ','ˊ'],['ㄌ','ㄨ','ㄥ','ˊ'],
      ['ㄓ','ㄨ','ㄤ','SPACE'],['ㄓ','ㄨ','ㄤ','ˋ'],
      ['ㄔ','ㄨ','ㄤ','SPACE'],['ㄕ','ㄨ','ㄤ','SPACE'],
      ['ㄍ','ㄨ','ㄤ','SPACE'],['ㄍ','ㄨ','ㄤ','ˇ'],
      ['ㄓ','ㄨ','ㄢ','SPACE'],['ㄔ','ㄨ','ㄢ','ˊ'],
      ['ㄍ','ㄨ','ㄢ','SPACE'],['ㄏ','ㄨ','ㄢ','ˊ'],
      /* 4-key: initial + ㄩ + final + tone */
      ['ㄑ','ㄩ','ㄢ','SPACE'],['ㄑ','ㄩ','ㄢ','ˊ'],
      ['ㄒ','ㄩ','ㄢ','SPACE'],['ㄐ','ㄩ','ㄢ','ˊ'],
      ['ㄐ','ㄩ','ㄥ','SPACE'],['ㄑ','ㄩ','ㄥ','ˊ'],['ㄒ','ㄩ','ㄥ','ˊ'],
    ],
  },
};

/* ══════════════════════════════════════════════
   3. MASTERY STATE
══════════════════════════════════════════════ */
const mastery = {};
const weights = {};
const ALL_SINGLE = [
  ...SECTIONS.initials.symbols,
  ...SECTIONS.medials.symbols,
  ...SECTIONS.finals.symbols,
  ...SECTIONS.tones.symbols,
];
ALL_SINGLE.forEach(s => { mastery[s] = 0; weights[s] = 1; });
SECTIONS.combos.syllables.forEach(s => {
  const k = s.join('');
  mastery[k] = 0; weights[k] = 1;
});

function renderSectionMastery() {
  /* single-symbol sections */
  ['initials','medials','finals','tones'].forEach(key => {
    const el = document.getElementById('mastery-' + key);
    if (!el) return;
    el.innerHTML = '';
    SECTIONS[key].symbols.forEach(s => {
      const dot = document.createElement('span');
      dot.className = 'mastery-dot level-' + (mastery[s] || 0);
      dot.title = s + ' · ' + (SYMBOL_HINT[s] || '');
      el.appendChild(dot);
    });
  });

  /* combos — progress bar */
  const comboSyms = SECTIONS.combos.syllables.map(s => s.join(''));
  const avg = comboSyms.reduce((a,s) => a + (mastery[s]||0), 0) / (comboSyms.length || 1);
  const pct = Math.round((avg / 3) * 100);
  const fill = document.getElementById('combo-mastery-fill');
  if (fill) fill.style.width = pct + '%';
}

/* ══════════════════════════════════════════════
   4. TAB SWITCHING
══════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'drill') showSectionList();
  });
});

/* ══════════════════════════════════════════════
   5. NAVIGATION
══════════════════════════════════════════════ */
function showSectionList() {
  document.getElementById('section-list').style.display = 'flex';
  document.getElementById('session-setup').classList.add('hidden');
  document.getElementById('drill-screen').classList.add('hidden');
  renderSectionMastery();
}

let pendingSection = null;
let chosenLength = 20;

function showSessionSetup(sectionKey) {
  pendingSection = sectionKey;
  document.getElementById('section-list').style.display = 'none';
  document.getElementById('session-setup').classList.remove('hidden');

  const lang = sessionStorage.getItem('lang') || 'zh';
  const t = TRANSLATIONS[lang];
  document.getElementById('setup-section-name').textContent = t[sectionKey + 'Name'] || sectionKey;
  document.getElementById('setup-desc').textContent = t[sectionKey + 'Desc'] || '';

  /* reset length selection */
  document.querySelectorAll('.length-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.len) === chosenLength);
  });
}

function showDrillScreen(sectionKey) {
  document.getElementById('session-setup').classList.add('hidden');
  document.getElementById('drill-screen').classList.remove('hidden');
  startDrill(sectionKey, chosenLength === 0);
}

document.querySelectorAll('.section-row').forEach(row => {
  row.addEventListener('click', () => showSessionSetup(row.dataset.section));
});

document.querySelectorAll('.length-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chosenLength = parseInt(btn.dataset.len);
  });
});

document.getElementById('btn-start-drill').addEventListener('click', () => {
  if (pendingSection) showDrillScreen(pendingSection);
});

document.getElementById('btn-setup-cancel').addEventListener('click', showSectionList);
document.getElementById('btn-back').addEventListener('click', showSectionList);

/* ══════════════════════════════════════════════
   6. DRILL ENGINE
══════════════════════════════════════════════ */
let currentSection = null;
let currentSymbol  = null;
let currentCombo   = null;
let comboStep      = 0;
let drillStreak    = 0;
let drillCorrect   = 0;
let drillTotal     = 0; // Tracks items completed (for the progress bar)
let drillAttempts  = 0; // Tracks items presented (for accuracy)
let itemHasMistake = false; // Ensures one-time penalty per item
let drillLocked    = false;
let drillInfinite  = false;
let drillLimit     = 20;
let drillShowPinyin   = true;
let drillShowKey      = true;
let drillShowKeyboard = false;

function startDrill(sectionKey, infinite) {
  currentSection = sectionKey;
  drillStreak = 0; drillCorrect = 0; drillTotal = 0; drillAttempts = 0; drillLocked = false;
  drillInfinite = infinite || chosenLength === 0;
  drillLimit = chosenLength;

  document.getElementById('drill-score-screen').classList.add('hint-hidden');

  const lang = sessionStorage.getItem('lang') || 'zh';
  const t = TRANSLATIONS[lang];
  document.getElementById('drill-section-title').textContent = t[sectionKey+'Name'] || sectionKey;
  document.getElementById('drill-streak').textContent = '0';
  document.getElementById('drill-accuracy').textContent = '—';

  /* show correct progress indicator */
  const isCombo = SECTIONS[sectionKey].type === 'combo';
  document.getElementById('drill-mastery-row').classList.toggle('hidden', isCombo);
  document.getElementById('drill-progress-bar-wrap').classList.toggle('hidden', !isCombo);

  renderMasteryDots();
  updateSessionCount();
  nextItem();
}

function renderMasteryDots() {
  const row = document.getElementById('drill-mastery-row');
  row.innerHTML = '';
  if (currentSection === 'combos') return;
  const pool = SECTIONS[currentSection]?.symbols || [];
  pool.forEach(s => {
    const dot = document.createElement('span');
    dot.className = 'mastery-dot level-' + (mastery[s] || 0);
    dot.title = s;
    row.appendChild(dot);
  });
}

function updateSessionCount() {
  const el = document.getElementById('drill-session-count');
  el.textContent = drillInfinite ? '∞' : drillTotal + ' / ' + drillLimit;

  /* update combo progress bar */
  if (currentSection === 'combos' && !drillInfinite) {
    const pct = drillLimit > 0 ? Math.round((drillTotal / drillLimit) * 100) : 0;
    document.getElementById('drill-progress-fill').style.width = pct + '%';
  }
}

function checkSessionEnd() {
  return !drillInfinite && drillLimit > 0 && drillTotal >= drillLimit;
}

function showDrillScore() {
  const pct = drillAttempts > 0 ? Math.round((drillCorrect / drillAttempts) * 100) : 0;
  document.getElementById('drill-score-number').textContent = drillCorrect + ' / ' + drillTotal;
  document.getElementById('drill-score-pct').textContent = pct + '% correct';
  document.getElementById('drill-score-screen').classList.remove('hint-hidden');
  renderSectionMastery();
}

function nextItem() {
  drillLocked = false;
  drillAttempts++; // A new item is presented
  itemHasMistake = false; // Reset mistake tracker for the new item
  document.getElementById('drill-feedback').textContent = '';
  if (SECTIONS[currentSection].type === 'combo') nextCombo();
  else nextSingle();
}

/* ─── SINGLE SYMBOL ─── */
function nextSingle() {
  const pool = SECTIONS[currentSection].symbols;
  const w = pool.map(s => weights[s] || 1);
  const total = w.reduce((a,b) => a+b, 0);
  let r = Math.random() * total, sym = pool[pool.length-1];
  for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) { sym = pool[i]; break; } }
  currentSymbol = sym;

  const symEl = document.getElementById('drill-symbol');
  symEl.textContent = sym === '1st' ? '（一聲）' : sym;
  symEl.className = '';
  symEl.style.display = 'block';

  document.getElementById('drill-category-tag').textContent = '';
  const hint = SYMBOL_HINT[sym] || '';
  document.getElementById('drill-pinyin-hint').textContent = hint;
  document.getElementById('drill-pinyin-hint').classList.toggle('hint-hidden', !drillShowPinyin || !hint);

  const comboEl = document.getElementById('drill-combo-display');
  if (comboEl) comboEl.innerHTML = '';

  renderSingleKey(sym, null, null);
  if (drillShowKeyboard) renderKeyboard(null, null);
  renderMasteryDots();
}

function renderSingleKey(sym, wrongKey) {
  const el = document.getElementById('drill-expected-key');
  el.innerHTML = '';
  if (!drillShowKey && !wrongKey) return;
  const expectedKey = ZHUYIN_TO_KEY[sym];
  const displayKey = sym === '1st' ? 'SPACE' : expectedKey?.toUpperCase();
  if (wrongKey) {
    const wb = document.createElement('span');
    wb.className = 'key-badge wrong-key';
    wb.textContent = wrongKey === ' ' ? 'SPACE' : wrongKey.toUpperCase();
    el.appendChild(wb);
    const arr = document.createElement('span');
    arr.style.cssText = 'color:#ddd;font-size:14px;';
    arr.textContent = '→';
    el.appendChild(arr);
    const cb = document.createElement('span');
    cb.className = 'key-badge correct-key';
    cb.textContent = displayKey;
    el.appendChild(cb);
  } else if (drillShowKey && displayKey) {
    const b = document.createElement('span');
    b.className = 'key-badge';
    b.textContent = displayKey;
    el.appendChild(b);
  }
}

/* ─── COMBO ─── */
const TONE_DIACRITICS = {
  'a':['ā','á','ǎ','à','a'],'e':['ē','é','ě','è','e'],
  'i':['ī','í','ǐ','ì','i'],'o':['ō','ó','ǒ','ò','o'],
  'u':['ū','ú','ǔ','ù','u'],'ü':['ǖ','ǘ','ǚ','ǜ','ü'],
};
function toneNum(sym) {
  if (sym==='ˊ') return 1; if (sym==='ˇ') return 2;
  if (sym==='ˋ') return 3; if (sym==='˙') return 4; return 0;
}
function comboToPinyin(combo) {
  const TONE_SET = new Set(['ˊ','ˇ','ˋ','˙','SPACE']);
  let tone = 0;
  const parts = [];
  combo.forEach(sym => {
    if (sym === 'SPACE') tone = 0;
    else if (TONE_SET.has(sym)) tone = toneNum(sym);
    else parts.push(PINYIN[sym] || '');
  });
  let raw = parts.join('');
  for (const vowel of ['a','e','ou','ü','o','i','u']) {
    const idx = raw.indexOf(vowel[0]);
    if (idx !== -1 && TONE_DIACRITICS[vowel[0]]) {
      raw = raw.slice(0,idx) + TONE_DIACRITICS[vowel[0]][tone] + raw.slice(idx+1);
      break;
    }
  }
  return raw;
}

function nextCombo() {
  const syllables = SECTIONS.combos.syllables;
  const w = syllables.map(s => weights[s.join('')]||1);
  const total = w.reduce((a,b)=>a+b,0);
  let r = Math.random()*total, idx = syllables.length-1;
  for (let i=0; i<syllables.length; i++) { r-=w[i]; if (r<=0){idx=i;break;} }
  currentCombo = syllables[idx];
  comboStep = 0;

  const symEl = document.getElementById('drill-symbol');
  symEl.style.display = 'none';

  const pinyinEl = document.getElementById('drill-pinyin-hint');
  pinyinEl.textContent = comboToPinyin(currentCombo);
  pinyinEl.classList.toggle('hint-hidden', !drillShowPinyin);

  renderComboDisplay();
  renderComboKeys();
  if (drillShowKeyboard) renderKeyboard(null, null);
  renderMasteryDots();
  document.getElementById('drill-category-tag').textContent = currentCombo.filter(p=>p!=='SPACE').join('');
}

function renderComboDisplay() {
  let el = document.getElementById('drill-combo-display');
  if (!el) {
    el = document.createElement('div');
    el.id = 'drill-combo-display';
    document.getElementById('drill-card').insertBefore(el, document.getElementById('drill-expected-key'));
  }
  el.innerHTML = '';
  currentCombo.forEach((part, i) => {
    const span = document.createElement('span');
    span.className = 'combo-part ' + (i<comboStep?'done':i===comboStep?'active':'pending');
    span.textContent = part==='SPACE' ? '⎵' : part;
    el.appendChild(span);
    if (i < currentCombo.length-1) {
      const sep = document.createElement('span');
      sep.style.cssText = 'color:#ddd;font-size:1.2rem;';
      sep.textContent = '+';
      el.appendChild(sep);
    }
  });
}

function renderComboKeys() {
  const el = document.getElementById('drill-expected-key');
  el.innerHTML = '';
  if (!drillShowKey) return;
  currentCombo.forEach((part, i) => {
    const key = part==='SPACE' ? 'SPACE' : ZHUYIN_TO_KEY[part]?.toUpperCase()||part;
    const b = document.createElement('span');
    if (i<comboStep) b.className='key-badge done-key';
    else if (i===comboStep) b.className='key-badge';
    else b.className='key-badge pending-key';
    b.textContent = key;
    el.appendChild(b);
  });
}

/* ─── KEY HANDLER ─── */
function handleDrillKey(e) {
  if (!document.getElementById('tab-drill').classList.contains('active')) return;
  if (document.getElementById('drill-screen').classList.contains('hidden')) return;
  if (!document.getElementById('drill-score-screen').classList.contains('hint-hidden')) return;
  if (drillLocked) return;
  if (e.ctrlKey||e.metaKey||e.altKey) return;

  const pressed = e.key.toLowerCase();
  const validKeys = new Set([...Object.keys(BOPOMOFO_MAP),' ']);
  if (!validKeys.has(pressed)) return;
  e.preventDefault();

  if (SECTIONS[currentSection].type==='combo') handleComboKey(pressed);
  else handleSingleKey(pressed);
}

function handleSingleKey(pressed) {
  const expectedKey = ZHUYIN_TO_KEY[currentSymbol];
  const isSpace = currentSymbol==='1st';
  const correct = isSpace ? pressed===' ' : pressed===expectedKey;
  const symEl = document.getElementById('drill-symbol');

  if (correct) {
    if (!itemHasMistake) { drillCorrect++; drillStreak++; } // Only reward if flawless
    drillTotal++; // Only progress forward when correctly finished
    mastery[currentSymbol] = Math.min(3,(mastery[currentSymbol]||0)+1);
    weights[currentSymbol] = Math.max(0.3,(weights[currentSymbol]||1)*0.65);
    symEl.classList.add('flash-correct');
    updateDrillStats();
    setTimeout(() => { if (checkSessionEnd()) showDrillScore(); else nextItem(); }, 350);
  } else {
    drillStreak = 0;
    itemHasMistake = true; // Mark penalty once
    mastery[currentSymbol] = Math.max(0,(mastery[currentSymbol]||0)-1);
    weights[currentSymbol] = (weights[currentSymbol]||1)*2.0;
    drillLocked = true;
    symEl.classList.add('flash-wrong');
    renderSingleKey(currentSymbol, pressed);
    if (drillShowKeyboard) renderKeyboard(expectedKey, pressed);
    const expDisplay = isSpace?'SPACE':expectedKey?.toUpperCase();
    document.getElementById('drill-feedback').textContent = 'Expected: '+expDisplay;
    updateDrillStats();
    setTimeout(() => {
      symEl.classList.remove('flash-wrong');
      drillLocked = false;
      renderSingleKey(currentSymbol, null);
      if (drillShowKeyboard) renderKeyboard(null,null);
      document.getElementById('drill-feedback').textContent='';
    }, 900);
  }
}

function handleComboKey(pressed) {
  const part = currentCombo[comboStep];
  const expectedKey = part==='SPACE' ? ' ' : ZHUYIN_TO_KEY[part];
  const correct = pressed===expectedKey;

  if (correct) {
    comboStep++;
    renderComboDisplay();
    renderComboKeys();
    if (drillShowKeyboard) renderKeyboard(null,null);
    if (comboStep>=currentCombo.length) {
      if (!itemHasMistake) { drillCorrect++; drillStreak++; } // Only reward if flawless
      drillTotal++; // Only progress forward when correctly finished
      const k=currentCombo.join('');
      mastery[k]=Math.min(3,(mastery[k]||0)+1);
      weights[k]=Math.max(0.3,(weights[k]||1)*0.65);
      updateDrillStats();
      renderMasteryDots();
      setTimeout(() => { if (checkSessionEnd()) showDrillScore(); else nextItem(); }, 400);
    } else {
      if (drillShowKeyboard) {
        const nextPart=currentCombo[comboStep];
        renderKeyboard(nextPart==='SPACE'?'space':ZHUYIN_TO_KEY[nextPart], null);
      }
    }
  } else {
    drillStreak=0;
    itemHasMistake = true; // Mark penalty once
    const k=currentCombo.join('');
    mastery[k]=Math.max(0,(mastery[k]||0)-1);
    weights[k]=(weights[k]||1)*1.8;
    drillLocked=true;
    const expDisplay=part==='SPACE'?'SPACE':expectedKey?.toUpperCase();
    document.getElementById('drill-feedback').textContent='Expected: '+expDisplay;
    if (drillShowKeyboard) renderKeyboard(expectedKey,pressed);
    updateDrillStats();
    setTimeout(() => {
      drillLocked=false;
      document.getElementById('drill-feedback').textContent='';
      if (drillShowKeyboard) renderKeyboard(null,null);
    }, 900);
  }
}

function updateDrillStats() {
  document.getElementById('drill-streak').textContent = drillStreak;
  // Calculate accuracy based on items presented vs flawless attempts
  const acc = drillAttempts>0 ? Math.round((drillCorrect/drillAttempts)*100)+'%' : '—';
  document.getElementById('drill-accuracy').textContent = acc;
  updateSessionCount(); // Uses drillTotal (completed items) for the progress bar
}

function renderKeyboard(highlightKey, wrongKey) {
  const kb = document.getElementById('drill-kb');
  kb.innerHTML = '';
  KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(k => {
      const kl = k.key.toLowerCase();
      let cls = 'kb-key';
      if (k.tone) cls+=' tone-key';
      if (k.space) cls+=' space-key';
      if (highlightKey && kl===highlightKey.toLowerCase()) cls+=' kb-active';
      if (wrongKey && kl===wrongKey.toLowerCase()) cls+=' kb-wrong';
      const keyEl = document.createElement('div');
      keyEl.className = cls;
      const zhEl = document.createElement('div');
      zhEl.className = 'kk-zh';
      zhEl.textContent = k.space?'1st':k.zh;
      const qEl = document.createElement('div');
      qEl.className = 'kk-qwerty';
      qEl.textContent = k.space?'SPACE':k.key;
      keyEl.appendChild(zhEl);
      keyEl.appendChild(qEl);
      rowEl.appendChild(keyEl);
    });
    kb.appendChild(rowEl);
  });
}

document.addEventListener('keydown', handleDrillKey);

/* toggles */
document.getElementById('btn-show-pinyin').addEventListener('click', () => {
  drillShowPinyin = !drillShowPinyin;
  document.getElementById('btn-show-pinyin').classList.toggle('active', drillShowPinyin);
  const el = document.getElementById('drill-pinyin-hint');
  el.classList.toggle('hint-hidden', !drillShowPinyin || !el.textContent.trim());
});
document.getElementById('btn-show-key').addEventListener('click', () => {
  drillShowKey = !drillShowKey;
  document.getElementById('btn-show-key').classList.toggle('active', drillShowKey);
  if (currentSection && SECTIONS[currentSection].type!=='combo') renderSingleKey(currentSymbol,null);
  else renderComboKeys();
});
document.getElementById('btn-show-keyboard').addEventListener('click', () => {
  drillShowKeyboard = !drillShowKeyboard;
  document.getElementById('btn-show-keyboard').classList.toggle('active', drillShowKeyboard);
  document.getElementById('drill-keyboard-hint').classList.toggle('hint-hidden', !drillShowKeyboard);
  if (drillShowKeyboard) renderKeyboard(null,null);
});

/* score buttons */
document.getElementById('btn-drill-retry').addEventListener('click', () => startDrill(currentSection, false));
document.getElementById('btn-drill-infinite').addEventListener('click', () => startDrill(currentSection, true));
document.getElementById('btn-drill-back').addEventListener('click', showSectionList);

/* ══════════════════════════════════════════════
   7. WORD PRACTICE
══════════════════════════════════════════════ */
const TONES_MAP = {'ˊ':'6','ˇ':'3','ˋ':'4','˙':'7'};
const TONE_SET  = new Set(['ˊ','ˇ','ˋ','˙']);

function zhuyinToKeys(zhuyinStr) {
  return zhuyinStr.split(' ').map(part => {
    const keys=[];
    let tone='SPC';
    for (const ch of part) {
      if (TONE_SET.has(ch)) tone=TONES_MAP[ch];
      else { const k=ZHUYIN_TO_KEY[ch]; if(k) keys.push(k===' '?'SPC':k.toUpperCase()); }
    }
    keys.push(tone);
    return keys;
  });
}

const WORD_BANKS = {
  1: [
    {chars:'你好',   zhuyin:'ㄋㄧˇ ㄏㄠˇ',          meaning:'Hello'},
    {chars:'謝謝',   zhuyin:'ㄒㄧㄝˋ ㄒㄧㄝ',        meaning:'Thank you'},
    {chars:'早安',   zhuyin:'ㄗㄠˇ ㄢ',              meaning:'Good morning'},
    {chars:'晚安',   zhuyin:'ㄨㄢˇ ㄢ',              meaning:'Good night'},
    {chars:'再見',   zhuyin:'ㄗㄞˋ ㄐㄧㄢˋ',        meaning:'Goodbye'},
    {chars:'對不起', zhuyin:'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ',   meaning:'Sorry'},
    {chars:'沒關係', zhuyin:'ㄇㄟˊ ㄍㄨㄢ ㄒㄧ',     meaning:"It's okay"},
    {chars:'請問',   zhuyin:'ㄑㄧㄥˇ ㄨㄣˋ',        meaning:'Excuse me'},
    {chars:'中文',   zhuyin:'ㄓㄨㄥ ㄨㄣˊ',         meaning:'Chinese language'},
    {chars:'台灣',   zhuyin:'ㄊㄞˊ ㄨㄢ',           meaning:'Taiwan'},
    {chars:'台北',   zhuyin:'ㄊㄞˊ ㄅㄟˇ',          meaning:'Taipei'},
    {chars:'學習',   zhuyin:'ㄒㄩㄝˊ ㄒㄧˊ',        meaning:'To study'},
    {chars:'朋友',   zhuyin:'ㄆㄥˊ ㄧㄡˇ',          meaning:'Friend'},
    {chars:'老師',   zhuyin:'ㄌㄠˇ ㄕ',             meaning:'Teacher'},
    {chars:'學生',   zhuyin:'ㄒㄩㄝˊ ㄕㄥ',         meaning:'Student'},
    {chars:'吃飯',   zhuyin:'ㄔ ㄈㄢˋ',             meaning:'To eat a meal'},
    {chars:'喝水',   zhuyin:'ㄏㄜ ㄕㄨㄟˇ',         meaning:'Drink water'},
    {chars:'睡覺',   zhuyin:'ㄕㄨㄟˋ ㄐㄧㄠˋ',      meaning:'To sleep'},
    {chars:'加油',   zhuyin:'ㄐㄧㄚ ㄧㄡˊ',         meaning:'Keep it up'},
    {chars:'沒問題', zhuyin:'ㄇㄟˊ ㄨㄣˋ ㄊㄧˊ',    meaning:'No problem'},
  ],
  2: [
    {chars:'工作',   zhuyin:'ㄍㄨㄥ ㄗㄨㄛˋ',       meaning:'Work / job'},
    {chars:'電話',   zhuyin:'ㄉㄧㄢˋ ㄏㄨㄚˋ',      meaning:'Phone call'},
    {chars:'手機',   zhuyin:'ㄕㄡˇ ㄐㄧ',           meaning:'Mobile phone'},
    {chars:'天氣',   zhuyin:'ㄊㄧㄢ ㄑㄧˋ',         meaning:'Weather'},
    {chars:'音樂',   zhuyin:'ㄧㄣ ㄩㄝˋ',           meaning:'Music'},
    {chars:'電影',   zhuyin:'ㄉㄧㄢˋ ㄧㄥˇ',        meaning:'Movie'},
    {chars:'好吃',   zhuyin:'ㄏㄠˇ ㄔ',             meaning:'Delicious'},
    {chars:'漂亮',   zhuyin:'ㄆㄧㄠˋ ㄌㄧㄤˋ',      meaning:'Beautiful'},
    {chars:'高興',   zhuyin:'ㄍㄠ ㄒㄧㄥˋ',         meaning:'Happy'},
    {chars:'知道',   zhuyin:'ㄓ ㄉㄠˋ',             meaning:'To know'},
    {chars:'喜歡',   zhuyin:'ㄒㄧˇ ㄏㄨㄢ',         meaning:'To like'},
    {chars:'可以',   zhuyin:'ㄎㄜˇ ㄧˇ',            meaning:'轉可以'},
    {chars:'覺得',   zhuyin:'ㄐㄩㄝˊ ㄉㄜ',         meaning:'To feel / think'},
    {chars:'時間',   zhuyin:'ㄕˊ ㄐㄧㄢ',           meaning:'Time'},
    {chars:'東西',   zhuyin:'ㄉㄨㄥ ㄒㄧ',          meaning:'Things / stuff'},
    {chars:'問題',   zhuyin:'ㄨㄣˋ ㄊㄧˊ',          meaning:'Problem / question'},
    {chars:'開始',   zhuyin:'ㄎㄞ ㄕˇ',             meaning:'To begin'},
    {chars:'結束',   zhuyin:'ㄐㄧㄝˊ ㄕㄨˋ',        meaning:'To end'},
    {chars:'練習',   zhuyin:'ㄌㄧㄢˋ ㄒㄧˊ',        meaning:'To practice'},
    {chars:'快樂',   zhuyin:'ㄎㄨㄞˋ ㄌㄜˋ',        meaning:'Happy / joyful'},
  ],
  3: [
    {chars:'文化',   zhuyin:'ㄨㄣˊ ㄏㄨㄚˋ',        meaning:'Culture'},
    {chars:'歷史',   zhuyin:'ㄌㄧˋ ㄕˇ',            meaning:'History'},
    {chars:'經濟',   zhuyin:'ㄐㄧㄥ ㄐㄧˋ',         meaning:'Economy'},
    {chars:'環境',   zhuyin:'ㄏㄨㄢˊ ㄐㄧㄥˋ',      meaning:'Environment'},
    {chars:'發展',   zhuyin:'ㄈㄚ ㄓㄢˇ',           meaning:'Development'},
    {chars:'影響',   zhuyin:'ㄧㄥˇ ㄒㄧㄤˇ',        meaning:'Influence'},
    {chars:'重要',   zhuyin:'ㄓㄨㄥˋ ㄧㄠˋ',        meaning:'Important'},
    {chars:'社會',   zhuyin:'ㄕㄜˋ ㄏㄨㄟˋ',        meaning:'Society'},
    {chars:'科技',   zhuyin:'ㄎㄜ ㄐㄧˋ',           meaning:'Technology'},
    {chars:'傳統',   zhuyin:'ㄔㄨㄢˊ ㄊㄨㄥˇ',      meaning:'Tradition'},
    {chars:'現代',   zhuyin:'ㄒㄧㄢˋ ㄉㄞˋ',        meaning:'Modern'},
    {chars:'自然',   zhuyin:'ㄗˋ ㄖㄢˊ',            meaning:'Nature'},
    {chars:'藝術',   zhuyin:'ㄧˋ ㄕㄨˋ',            meaning:'Art'},
    {chars:'教育',   zhuyin:'ㄐㄧㄠˋ ㄩˋ',          meaning:'Education'},
    {chars:'健康',   zhuyin:'ㄐㄧㄢˋ ㄎㄤ',         meaning:'Health'},
    {chars:'幸福',   zhuyin:'ㄒㄧㄥˋ ㄈㄨˊ',        meaning:'Happiness'},
    {chars:'機會',   zhuyin:'ㄐㄧ ㄏㄨㄟˋ',         meaning:'Opportunity'},
    {chars:'努力',   zhuyin:'ㄋㄨˇ ㄌㄧˋ',          meaning:'Hard work'},
    {chars:'成功',   zhuyin:'ㄔㄥˊ ㄍㄨㄥ',         meaning:'Success'},
    {chars:'裝備',   zhuyin:'ㄓㄨㄤ ㄅㄟˋ',         meaning:'Equipment'},
  ],
  4: [
    {chars:'態度',   zhuyin:'ㄊㄞˋ ㄉㄨˋ',          meaning:'Attitude'},
    {chars:'記憶',   zhuyin:'ㄐㄧˋ ㄧˋ',            meaning:'Memory'},
    {chars:'印象',   zhuyin:'ㄧㄣˋ ㄒㄧㄤˋ',        meaning:'Impression'},
    {chars:'複雜',   zhuyin:'ㄈㄨˋ ㄗㄚˊ',          meaning:'Complicated'},
    {chars:'活動',   zhuyin:'ㄏㄨㄛˊ ㄉㄨㄥˋ',      meaning:'Activity / event'},
    {chars:'改變',   zhuyin:'ㄍㄞˇ ㄅㄧㄢˋ',        meaning:'To change'},
    {chars:'優秀',   zhuyin:'ㄧㄡ ㄒㄧㄡˋ',         meaning:'Outstanding'},
    {chars:'認真',   zhuyin:'ㄖㄣˋ ㄓㄣ',           meaning:'Earnest / serious'},
    {chars:'方便',   zhuyin:'ㄈㄤ ㄅㄧㄢˋ',         meaning:'Convenient'},
    {chars:'國際',   zhuyin:'ㄍㄨㄛˊ ㄐㄧˋ',        meaning:'International'},
    {chars:'感情',   zhuyin:'ㄍㄢˇ ㄑㄧㄥˊ',        meaning:'Feelings / emotion'},
    {chars:'表達',   zhuyin:'ㄅㄧㄠˇ ㄉㄚˊ',        meaning:'To express'},
    {chars:'建議',   zhuyin:'ㄐㄧㄢˋ ㄧˋ',          meaning:'Suggestion'},
    {chars:'目標',   zhuyin:'ㄇㄨˋ ㄅㄧㄠ',         meaning:'Goal / target'},
    {chars:'責任',   zhuyin:'ㄗㄜˊ ㄖㄣˋ',          meaning:'Responsibility'},
    {chars:'創造',   zhuyin:'ㄔㄨㄤˋ ㄗㄠˋ',        meaning:'To create'},
    {chars:'競爭',   zhuyin:'ㄐㄧㄥˋ ㄓㄥ',         meaning:'Competition'},
    {chars:'積極',   zhuyin:'ㄐㄧ ㄐㄧˊ',           meaning:'Positive / proactive'},
    {chars:'理解',   zhuyin:'ㄌㄧˇ ㄐㄧㄝˇ',        meaning:'To understand'},
    {chars:'保護',   zhuyin:'ㄅㄠˇ ㄏㄨˋ',          meaning:'To protect'},
  ],
  5: [
    {chars:'意識',   zhuyin:'ㄧˋ ㄕˊ',              meaning:'Consciousness / awareness'},
    {chars:'概念',   zhuyin:'ㄍㄞˋ ㄋㄧㄢˋ',        meaning:'Concept'},
    {chars:'推測',   zhuyin:'ㄊㄨㄟ ㄘㄜˋ',         meaning:'To speculate / infer'},
    {chars:'矛盾',   zhuyin:'ㄇㄠˊ ㄉㄨㄣˋ',        meaning:'Contradiction'},
    {chars:'抽象',   zhuyin:'ㄔㄡ ㄒㄧㄤˋ',         meaning:'Abstract'},
    {chars:'趨勢',   zhuyin:'ㄑㄩ ㄕˋ',             meaning:'Trend'},
    {chars:'統計',   zhuyin:'ㄊㄨㄥˇ ㄐㄧˋ',        meaning:'Statistics'},
    {chars:'論點',   zhuyin:'ㄌㄨㄣˋ ㄉㄧㄢˇ',      meaning:'Argument / point'},
    {chars:'策略',   zhuyin:'ㄘㄜˋ ㄌㄩㄝˋ',        meaning:'Strategy'},
    {chars:'依據',   zhuyin:'ㄧ ㄐㄩˋ',             meaning:'Basis / grounds'},
    {chars:'貢獻',   zhuyin:'ㄍㄨㄥˋ ㄒㄧㄢˋ',      meaning:'Contribution'},
    {chars:'批評',   zhuyin:'ㄆㄧ ㄆㄧㄥˊ',         meaning:'Criticism'},
    {chars:'假設',   zhuyin:'ㄐㄧㄚˇ ㄕㄜˋ',        meaning:'Hypothesis / assumption'},
    {chars:'程序',   zhuyin:'ㄔㄥˊ ㄒㄩˋ',          meaning:'Procedure / program'},
    {chars:'廣泛',   zhuyin:'ㄍㄨㄤˇ ㄈㄢˋ',        meaning:'Extensive / widespread'},
    {chars:'謹慎',   zhuyin:'ㄐㄧㄣˇ ㄕㄣˋ',        meaning:'Cautious / careful'},
    {chars:'克服',   zhuyin:'ㄎㄜˋ ㄈㄨˊ',          meaning:'To overcome'},
    {chars:'延伸',   zhuyin:'ㄧㄢˊ ㄕㄣ',           meaning:'To extend'},
    {chars:'融合',   zhuyin:'ㄖㄨㄥˊ ㄏㄜˊ',        meaning:'To integrate / blend'},
    {chars:'歧視',   zhuyin:'ㄑㄧˊ ㄕˋ',            meaning:'Discrimination'},
  ],
  6: [
    {chars:'哲學',   zhuyin:'ㄓㄜˊ ㄒㄩㄝˊ',        meaning:'Philosophy'},
    {chars:'辯證',   zhuyin:'ㄅㄧㄢˋ ㄓㄥˋ',        meaning:'Dialectical'},
    {chars:'詮釋',   zhuyin:'ㄑㄩㄢˊ ㄕˋ',          meaning:'Interpretation'},
    {chars:'意涵',   zhuyin:'ㄧˋ ㄏㄢˊ',            meaning:'Connotation / implication'},
    {chars:'脈絡',   zhuyin:'ㄇㄞˋ ㄌㄨㄛˋ',        meaning:'Context'},
    {chars:'範疇',   zhuyin:'ㄈㄢˋ ㄔㄡˊ',          meaning:'Category / domain'},
    {chars:'悖論',   zhuyin:'ㄅㄟˋ ㄌㄨㄣˋ',        meaning:'Paradox'},
    {chars:'隱喻',   zhuyin:'ㄧㄣˇ ㄩˋ',            meaning:'Metaphor'},
    {chars:'推論',   zhuyin:'ㄊㄨㄟ ㄌㄨㄣˋ',        meaning:'Inference / reasoning'},
    {chars:'縝密',   zhuyin:'ㄓㄣˇ ㄇㄧˋ',          meaning:'Meticulous / rigorous'},
    {chars:'闡述',   zhuyin:'ㄔㄢˇ ㄕㄨˋ',          meaning:'To elaborate / expound'},
    {chars:'折衷',   zhuyin:'ㄓㄜˊ ㄓㄨㄥ',         meaning:'Compromise'},
    {chars:'昇華',   zhuyin:'ㄕㄥ ㄏㄨㄚ',           meaning:'To sublimate / elevate'},
    {chars:'剖析',   zhuyin:'ㄆㄡˇ ㄒㄧ',           meaning:'To analyse / dissect'},
    {chars:'窺探',   zhuyin:'ㄎㄨㄟ ㄊㄢˋ',         meaning:'To peek into / probe'},
    {chars:'蘊含',   zhuyin:'ㄩㄣˋ ㄏㄢˊ',          meaning:'To embody / contain'},
    {chars:'滲透',   zhuyin:'ㄕㄣˋ ㄊㄡˋ',          meaning:'To permeate / infiltrate'},
    {chars:'萌芽',   zhuyin:'ㄇㄥˊ ㄧㄚˊ',          meaning:'To sprout / emerge'},
    {chars:'鑄造',   zhuyin:'ㄓㄨˋ ㄗㄠˋ',          meaning:'To forge / cast'},
    {chars:'凝聚',   zhuyin:'ㄋㄧㄥˊ ㄐㄩˋ',        meaning:'To converge / coalesce'},
  ],
};

let wordHSK=1, wordList=[], wordIndex=0, wordCorrect=0;
let wordShowZhuyin=true, wordShowKeys=true, wordLocked=false;
let wordShowMeaning=true, wordShowKeyboard=false;
let wordHasMistake=false; // New tracker for Word Practice

function initWordSession() {
  wordList = [...WORD_BANKS[wordHSK]].sort(()=>Math.random()-0.5);
  wordIndex=0; wordCorrect=0; wordLocked=false; wordHasMistake=false;
  document.getElementById('word-score-screen').classList.add('hint-hidden');
  renderWord();
  updateWordProgress();
}

function renderWord() {
  const word = wordList[wordIndex];
  if (!word) return;
  wordHasMistake = false; // Reset tracker on new word
  const chars=[...word.chars], zhuyinParts=word.zhuyin.split(' ');
  const row=document.getElementById('word-chars-row');
  row.innerHTML='';
  chars.forEach((ch,i)=>{
    const block=document.createElement('div');
    block.className='word-char-block';
    const zy=document.createElement('div');
    zy.className='word-char-zhuyin'+(wordShowZhuyin?'':' hint-hidden');
    zy.textContent=zhuyinParts[i]||'';
    const hanzi=document.createElement('div');
    hanzi.className='word-char-hanzi';
    hanzi.textContent=ch;
    block.appendChild(zy); block.appendChild(hanzi);
    row.appendChild(block);
  });

  const keySeqEl=document.getElementById('word-key-sequence');
  keySeqEl.innerHTML='';
  keySeqEl.classList.toggle('hint-hidden',!wordShowKeys);
  zhuyinToKeys(word.zhuyin).forEach((keys,gi)=>{
    if (gi>0){const sep=document.createElement('span');sep.className='word-key-sep';sep.textContent='·';keySeqEl.appendChild(sep);}
    keys.forEach(k=>{
      const b=document.createElement('span');
      b.className='key-badge';
      b.style.cssText='font-size:13px;min-width:32px;height:32px;';
      b.textContent=k; keySeqEl.appendChild(b);
    });
  });

  document.getElementById('word-meaning-label').textContent=word.meaning;
  document.getElementById('word-meaning-label').style.opacity = wordShowMeaning ? '1' : '0';
  document.getElementById('word-feedback').textContent='';
  document.getElementById('word-feedback').className='';

  const input=document.getElementById('word-input');
  input.blur(); input.value=''; input.className=''; input.disabled=false;
  wordLocked=false;
  setTimeout(()=>input.focus(),80);
}

function updateWordProgress() {
  const total=wordList.length;
  document.getElementById('word-progress-fill').style.width=(wordIndex/total*100)+'%';
  document.getElementById('word-progress-label').textContent=wordIndex+' / '+total;
}

function checkWord() {
  if (wordLocked) return;
  const word=wordList[wordIndex]; if (!word) return;
  const typed=document.getElementById('word-input').value.trim();
  if (typed===word.chars) {
    if (!wordHasMistake) wordCorrect++; // Only grant correct stat if flawless
    wordLocked=true;
    document.getElementById('word-input').classList.add('inp-correct');
    const fb=document.getElementById('word-feedback');
    fb.textContent='✓'; fb.className='fb-correct';
    setTimeout(()=>{ wordIndex++; updateWordProgress(); if(wordIndex>=wordList.length) showWordScore(); else renderWord(); },500);
  } else if (typed.length>=word.chars.length) {
    wordHasMistake = true; // Mark mistake so they don't get a point
    document.getElementById('word-input').classList.add('inp-wrong');
    const fb=document.getElementById('word-feedback');
    fb.textContent=word.zhuyin; fb.className='fb-wrong';
    setTimeout(()=>{ document.getElementById('word-input').classList.remove('inp-wrong'); document.getElementById('word-input').value=''; },900);
  }
}

function showWordScore() {
  const total=wordList.length, pct=Math.round((wordCorrect/total)*100);
  document.getElementById('score-number').textContent=wordCorrect+' / '+total;
  document.getElementById('score-pct').textContent=pct+'% correct';
  document.getElementById('word-score-screen').classList.remove('hint-hidden');
  document.getElementById('btn-next-level').style.display=wordHSK<6?'':'none';
}

document.getElementById('word-input').addEventListener('input',checkWord);
document.getElementById('word-input').addEventListener('keydown',e=>{if(e.key==='Enter')checkWord();});
document.getElementById('btn-show-zhuyin').addEventListener('click',()=>{
  wordShowZhuyin=!wordShowZhuyin;
  document.getElementById('btn-show-zhuyin').classList.toggle('active',wordShowZhuyin);
  document.querySelectorAll('.word-char-zhuyin').forEach(el=>el.classList.toggle('hint-hidden',!wordShowZhuyin));
});
document.getElementById('btn-show-keys').addEventListener('click',()=>{
  wordShowKeys=!wordShowKeys;
  document.getElementById('btn-show-keys').classList.toggle('active',wordShowKeys);
  document.getElementById('word-key-sequence').classList.toggle('hint-hidden',!wordShowKeys);
});
document.getElementById('btn-show-meaning').addEventListener('click',()=>{
  wordShowMeaning=!wordShowMeaning;
  document.getElementById('btn-show-meaning').classList.toggle('active',wordShowMeaning);
  document.getElementById('word-meaning-label').style.opacity = wordShowMeaning ? '1' : '0';
});
document.getElementById('btn-show-word-keyboard').addEventListener('click',()=>{
  wordShowKeyboard=!wordShowKeyboard;
  document.getElementById('btn-show-word-keyboard').classList.toggle('active',wordShowKeyboard);
  document.getElementById('word-keyboard-hint').classList.toggle('hint-hidden',!wordShowKeyboard);
  if (wordShowKeyboard) renderWordKeyboard();
});

function renderWordKeyboard() {
  const kb = document.getElementById('word-kb');
  kb.innerHTML = '';
  KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(k => {
      const keyEl = document.createElement('div');
      let cls = 'kb-key';
      if (k.tone) cls += ' tone-key';
      if (k.space) cls += ' space-key';
      keyEl.className = cls;
      const zhEl = document.createElement('div');
      zhEl.className = 'kk-zh';
      zhEl.textContent = k.space ? '1st' : k.zh;
      const qEl = document.createElement('div');
      qEl.className = 'kk-qwerty';
      qEl.textContent = k.space ? 'SPACE' : k.key;
      keyEl.appendChild(zhEl);
      keyEl.appendChild(qEl);
      rowEl.appendChild(keyEl);
    });
    kb.appendChild(rowEl);
  });
}
document.querySelectorAll('.hsk-pill').forEach(pill=>{
  pill.addEventListener('click',()=>{
    document.querySelectorAll('.hsk-pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active'); wordHSK=parseInt(pill.dataset.hsk); initWordSession();
  });
});
document.getElementById('btn-try-again').addEventListener('click',initWordSession);
document.getElementById('btn-next-level').addEventListener('click',()=>{
  if(wordHSK<6){wordHSK++;document.querySelectorAll('.hsk-pill').forEach(p=>p.classList.toggle('active',parseInt(p.dataset.hsk)===wordHSK));initWordSession();}
});

/* ══════════════════════════════════════════════
   8. TRANSLATIONS
══════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    drillTab:'Symbol Drill', wordsTab:'Word Practice',
    /* section list */
    initialsName:'Initials', initialsZh:'聲母', initialsDesc:'The starting consonant sounds',
    medialsName:'Medials', medialsZh:'介母', medialsDesc:'The bridge vowels ㄧ ㄨ ㄩ',
    finalsName:'Finals', finalsZh:'韻母', finalsDesc:'The ending vowel sounds',
    tonesName:'Tones', tonesZh:'聲調', tonesDesc:'Tone marks — Space for 1st tone',
    combosName:'Combinations', combosZh:'組合', combosDesc:'Multi-key syllables: initial + medial + final + tone',
    /* mastery legend */
    masteryLabel:'Mastery', legendUnseen:'Unseen', legendLearning:'Learning',
    legendFamiliar:'Familiar', legendMastered:'Mastered',
    /* session setup */
    setupLengthLabel:'Choose session length',
    setupStart:'Start', setupCancel:'Cancel',
    /* drill screen */
    back:'← Back', streak:'Streak', accuracy:'Accuracy', progress:'Progress',
    pinyinBtn:'Pinyin', showKeyBtn:'Show key', kbMapBtn:'Keyboard map',
    drillInstruction:'Press the key on your QWERTY keyboard',
    /* drill score */
    drillScoreTitle:'Session Complete',
    drillRetry:'Try Again', drillInfinite:'Infinite Mode', drillBack:'Back',
    /* word practice */
    hsk1:'HSK 1', hsk2:'HSK 2', hsk3:'HSK 3', hsk4:'HSK 4', hsk5:'HSK 5', hsk6:'HSK 6',
    zhuyinBtn:'Zhuyin', keySeqBtn:'Key sequence', meaningBtn:'Translation', wordKbBtn:'Keyboard map',
    wordPlaceholder:'Type the word...',
    wordHint:'Enable your zhuyin input method',
    scoreTitle:'Session Complete',
    tryAgain:'Try Again', nextLevel:'Next Level',
  },
  zh: {
    drillTab:'符號練習', wordsTab:'單字練習',
    /* section list */
    initialsName:'聲母', initialsZh:'Initials', initialsDesc:'聲母是音節最開頭的子音',
    medialsName:'介母', medialsZh:'Medials', medialsDesc:'介母是橋接母音 ㄧ ㄨ ㄩ',
    finalsName:'韻母', finalsZh:'Finals', finalsDesc:'韻母是音節結尾的母音',
    tonesName:'聲調', tonesZh:'Tones', tonesDesc:'聲調符號 — 空白鍵為一聲',
    combosName:'組合練習', combosZh:'Combos', combosDesc:'多鍵音節：聲母 + 介母 + 韻母 + 聲調',
    /* mastery legend */
    masteryLabel:'熟練度', legendUnseen:'未見', legendLearning:'學習中',
    legendFamiliar:'熟悉', legendMastered:'已掌握',
    /* session setup */
    setupLengthLabel:'選擇練習題數',
    setupStart:'開始', setupCancel:'取消',
    /* drill screen */
    back:'← 返回', streak:'連續答對', accuracy:'準確率', progress:'進度',
    pinyinBtn:'拼音', showKeyBtn:'顯示按鍵', kbMapBtn:'鍵盤圖',
    drillInstruction:'按下對應的 QWERTY 鍵',
    /* drill score */
    drillScoreTitle:'練習完成',
    drillRetry:'再試一次', drillInfinite:'無限模式', drillBack:'返回',
    /* word practice */
    hsk1:'HSK 1', hsk2:'HSK 2', hsk3:'HSK 3', hsk4:'HSK 4', hsk5:'HSK 5', hsk6:'HSK 6',
    zhuyinBtn:'注音', keySeqBtn:'按鍵序列', meaningBtn:'翻譯', wordKbBtn:'鍵盤圖',
    wordPlaceholder:'輸入這個詞...',
    wordHint:'請開啟注音輸入法',
    scoreTitle:'練習完成',
    tryAgain:'再試一次', nextLevel:'下一級',
  },
};

function updateLanguage() {
  const lang = sessionStorage.getItem('lang') || 'zh';
  const t = TRANSLATIONS[lang];

  /* tabs */
  document.querySelector('[data-tab="drill"] .tab-zh').textContent = t.drillTab;
  document.querySelector('[data-tab="words"] .tab-zh').textContent = t.wordsTab;

  /* section rows */
  const keys = ['initials','medials','finals','tones','combos'];
  keys.forEach(k => {
    const nameEl = document.getElementById('sname-'+k);
    if (nameEl) nameEl.innerHTML = t[k+'Name']+' <span class="section-row-zh">'+t[k+'Zh']+'</span>';
    const descEl = document.getElementById('sdesc-'+k);
    if (descEl) descEl.textContent = t[k+'Desc'];
  });

  /* mastery legend */
  document.getElementById('mastery-legend-label').textContent = t.masteryLabel;
  document.getElementById('legend-unseen').textContent = t.legendUnseen;
  document.getElementById('legend-learning').textContent = t.legendLearning;
  document.getElementById('legend-familiar').textContent = t.legendFamiliar;
  document.getElementById('legend-mastered').textContent = t.legendMastered;

  /* session setup */
  document.getElementById('setup-length-label').textContent = t.setupLengthLabel;
  document.getElementById('btn-start-drill').textContent = t.setupStart;
  document.getElementById('btn-setup-cancel').textContent = t.setupCancel;

  /* drill screen */
  document.getElementById('btn-back').textContent = t.back;
  document.getElementById('lbl-streak').textContent = t.streak;
  document.getElementById('lbl-accuracy').textContent = t.accuracy;
  document.getElementById('lbl-progress').textContent = t.progress;
  document.getElementById('btn-show-pinyin').textContent = t.pinyinBtn;
  document.getElementById('btn-show-key').textContent = t.showKeyBtn;
  document.getElementById('btn-show-keyboard').textContent = t.kbMapBtn;
  document.getElementById('drill-instruction').textContent = t.drillInstruction;
  document.getElementById('drill-score-title').textContent = t.drillScoreTitle;
  document.getElementById('btn-drill-retry').textContent = t.drillRetry;
  document.getElementById('btn-drill-infinite').textContent = t.drillInfinite;
  document.getElementById('btn-drill-back').textContent = t.drillBack;

  /* word practice */
  document.getElementById('btn-show-zhuyin').textContent = t.zhuyinBtn;
  document.getElementById('btn-show-keys').textContent = t.keySeqBtn;
  document.getElementById('btn-show-meaning').textContent = t.meaningBtn;
  document.getElementById('btn-show-word-keyboard').textContent = t.wordKbBtn;
  document.getElementById('word-input').placeholder = t.wordPlaceholder;
  document.getElementById('word-hint-label').textContent = t.wordHint;
  document.getElementById('score-title').textContent = t.scoreTitle;
  document.getElementById('btn-try-again').textContent = t.tryAgain;
  document.getElementById('btn-next-level').textContent = t.nextLevel;

  /* lang toggle */
  const enSpan=document.getElementById('toggle-en');
  const zhSpan=document.getElementById('toggle-zh');
  if (lang==='en'){enSpan.classList.add('active');zhSpan.classList.remove('active');}
  else{zhSpan.classList.add('active');enSpan.classList.remove('active');}

  /* re-render setup if visible */
  if (pendingSection && !document.getElementById('session-setup').classList.contains('hidden')) {
    document.getElementById('setup-section-name').textContent = t[pendingSection+'Name']||pendingSection;
    document.getElementById('setup-desc').textContent = t[pendingSection+'Desc']||'';
  }
}

document.getElementById('lang-toggle').addEventListener('click', e => {
  if (e.target.classList.contains('divider')) return;
  let newLang;
  if (e.target.id==='toggle-en') newLang='en';
  else if (e.target.id==='toggle-zh') newLang='zh';
  else newLang=(sessionStorage.getItem('lang')||'zh')==='zh'?'en':'zh';
  sessionStorage.setItem('lang',newLang);
  updateLanguage();
});

/* ══════════════════════════════════════════════
   9. INIT
══════════════════════════════════════════════ */
showSectionList();
initWordSession();
updateLanguage();