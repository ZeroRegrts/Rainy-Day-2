/* ─────────────────────────────────────────────
   learn.js — 雨天 Learn Page (v2)
───────────────────────────────────────────── */

/* ══════════════════════════════════════════════
   1. VERIFIED MICROSOFT BOPOMOFO LAYOUT
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
  'ˊ':'2nd tone','ˇ':'3rd tone','ˋ':'4th tone','˙':'neutral tone','1st':'1st tone (space)',
};

/* ══════════════════════════════════════════════
   2. SYMBOL GROUPS
══════════════════════════════════════════════ */
const GROUPS = {
  initials: {
    label: 'Initials · 聲母',
    labelZh: '聲母',
    symbols: ['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ'],
  },
  medials: {
    label: 'Medials · 介母',
    labelZh: '介母',
    symbols: ['ㄧ','ㄨ','ㄩ'],
  },
  finals: {
    label: 'Finals · 韻母',
    labelZh: '韻母',
    symbols: ['ㄚ','ㄛ','ㄜ','ㄝ','ㄞ','ㄟ','ㄠ','ㄡ','ㄢ','ㄣ','ㄤ','ㄥ','ㄦ'],
  },
  tones: {
    label: 'Tones · 聲調',
    labelZh: '聲調',
    symbols: ['ˊ','ˇ','ˋ','˙','1st'],
  },
};

const ALL_SYMBOLS = [
  ...GROUPS.initials.symbols,
  ...GROUPS.medials.symbols,
  ...GROUPS.finals.symbols,
  ...GROUPS.tones.symbols,
];

function getGroupOf(symbol) {
  for (const [key, group] of Object.entries(GROUPS)) {
    if (group.symbols.includes(symbol)) return key;
  }
  return 'all';
}

function getGroupLabel(symbol) {
  for (const group of Object.values(GROUPS)) {
    if (group.symbols.includes(symbol)) return group.label;
  }
  return '';
}

/* ══════════════════════════════════════════════
   3. WORD BANKS (HSK with key sequences)
══════════════════════════════════════════════ */

/* Build key sequence string from zhuyin annotation.
   Each zhuyin part (e.g. "ㄋㄧˇ") → array of keys.
   Tones: ˊ=6, ˇ=3, ˋ=4, ˙=7, (none)=SPACE */
function zhuyinToKeys(zhuyinStr) {
  const toneMap = {'ˊ':'6','ˇ':'3','ˋ':'4','˙':'7'};
  const tones = new Set(['ˊ','ˇ','ˋ','˙']);

  const parts = zhuyinStr.split(' ');
  const result = [];

  parts.forEach(part => {
    const keys = [];
    let tone = 'SPACE';
    for (const ch of part) {
      if (tones.has(ch)) {
        tone = toneMap[ch];
      } else {
        const k = ZHUYIN_TO_KEY[ch];
        if (k) keys.push(k === ' ' ? 'SPACE' : k.toUpperCase());
      }
    }
    keys.push(tone);
    result.push(keys);
  });
  return result;
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
    {chars:'可以',   zhuyin:'ㄎㄜˇ ㄧˇ',            meaning:'Can / may'},
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
    {chars:'裝備',   zhuyin:'ㄓㄨㄤ ㄅㄟˋ',         meaning:'Equipment / gear'},
  ],
};

/* ══════════════════════════════════════════════
   4. TAB SWITCHING
══════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ══════════════════════════════════════════════
   5. SYMBOL DRILL
══════════════════════════════════════════════ */
let drillFilter = 'all';
let drillShowPinyin = true;
let drillShowKey = true;
let drillShowKeyboard = false;
let drillStreak = 0;
let drillCorrect = 0;
let drillTotal = 0;
let drillLocked = false;
let currentSymbol = null;

/* mastery: 0 = unseen, 1 = seen, 2 = getting it, 3 = mastered */
const mastery = {};
ALL_SYMBOLS.forEach(s => { mastery[s] = 0; });

/* spaced repetition weights — wrong answers increase weight */
const weights = {};
ALL_SYMBOLS.forEach(s => { weights[s] = 1; });

function getPool() {
  if (drillFilter === 'all') return ALL_SYMBOLS;
  return GROUPS[drillFilter]?.symbols || ALL_SYMBOLS;
}

function pickSymbol() {
  const pool = getPool();
  const w = pool.map(s => weights[s]);
  const total = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= w[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function renderMasteryDots() {
  const pool = getPool();
  const row = document.getElementById('drill-mastery-row');
  row.innerHTML = '';
  pool.forEach(s => {
    const dot = document.createElement('div');
    dot.className = 'mastery-dot level-' + mastery[s];
    dot.title = s + (PINYIN[s] ? ' · ' + PINYIN[s] : '');
    row.appendChild(dot);
  });
}

function renderExpectedKey(symbol, wrongKey) {
  const el = document.getElementById('drill-expected-key');
  el.innerHTML = '';

  if (!drillShowKey && !wrongKey) return;

  const expectedKey = ZHUYIN_TO_KEY[symbol];
  const displayKey = symbol === '1st' ? 'SPACE' : expectedKey?.toUpperCase();

  if (wrongKey) {
    const wrongBadge = document.createElement('span');
    wrongBadge.className = 'key-badge wrong-key';
    wrongBadge.textContent = wrongKey === ' ' ? 'SPACE' : wrongKey.toUpperCase();
    el.appendChild(wrongBadge);

    const arrow = document.createElement('span');
    arrow.textContent = '→';
    arrow.style.cssText = 'color:#ddd;font-size:14px;';
    el.appendChild(arrow);

    const correctBadge = document.createElement('span');
    correctBadge.className = 'key-badge correct-key';
    correctBadge.textContent = displayKey;
    el.appendChild(correctBadge);
  } else if (drillShowKey && displayKey) {
    const badge = document.createElement('span');
    badge.className = 'key-badge';
    badge.textContent = displayKey;
    el.appendChild(badge);
  }
}

function renderDrillSymbol() {
  currentSymbol = pickSymbol();
  drillLocked = false;

  const symEl = document.getElementById('drill-symbol');
  symEl.textContent = currentSymbol === '1st' ? '（1声）' : currentSymbol;
  symEl.className = '';

  document.getElementById('drill-category-tag').textContent = getGroupLabel(currentSymbol);
  document.getElementById('drill-pinyin-hint').textContent = PINYIN[currentSymbol] || '';
  document.getElementById('drill-pinyin-hint').classList.toggle('hint-hidden', !drillShowPinyin);
  document.getElementById('drill-feedback').textContent = '';

  renderExpectedKey(currentSymbol, null);
  if (drillShowKeyboard) renderKeyboard(null, null);
  renderMasteryDots();
}

function renderKeyboard(highlightKey, wrongKey) {
  const kb = document.getElementById('drill-kb');
  kb.innerHTML = '';
  KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(k => {
      const keyEl = document.createElement('div');
      const kLower = k.key.toLowerCase();
      let cls = 'kb-key';
      if (k.tone) cls += ' tone-key';
      if (k.space) cls += ' space-key';
      if (highlightKey && kLower === highlightKey.toLowerCase()) cls += ' kb-active';
      if (wrongKey && kLower === wrongKey.toLowerCase()) cls += ' kb-wrong';
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

function handleDrillKey(e) {
  if (!document.getElementById('tab-drill').classList.contains('active')) return;
  if (drillLocked) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const pressed = e.key.toLowerCase();
  const validKeys = new Set([...Object.keys(BOPOMOFO_MAP), ' ']);
  if (!validKeys.has(pressed)) return;

  e.preventDefault();

  const expectedKey = ZHUYIN_TO_KEY[currentSymbol];
  const isSpace = currentSymbol === '1st';
  const pressedCorrect = isSpace ? pressed === ' ' : pressed === expectedKey;

  drillTotal++;
  const symEl = document.getElementById('drill-symbol');

  if (pressedCorrect) {
    drillCorrect++;
    drillStreak++;
    /* increase mastery, max 3 */
    mastery[currentSymbol] = Math.min(3, mastery[currentSymbol] + 1);
    /* reduce weight */
    weights[currentSymbol] = Math.max(0.3, weights[currentSymbol] * 0.65);

    symEl.classList.add('flash-correct');
    document.getElementById('drill-feedback').textContent = '';
    renderExpectedKey(currentSymbol, null);
    if (drillShowKeyboard) renderKeyboard(expectedKey, null);

    updateDrillStats();
    setTimeout(renderDrillSymbol, 350);
  } else {
    drillStreak = 0;
    /* reduce mastery, min 0 */
    mastery[currentSymbol] = Math.max(0, mastery[currentSymbol] - 1);
    /* increase weight */
    weights[currentSymbol] = weights[currentSymbol] * 2.0;
    drillLocked = true;

    symEl.classList.add('flash-wrong');
    renderExpectedKey(currentSymbol, pressed);
    if (drillShowKeyboard) renderKeyboard(expectedKey, pressed);

    const feedEl = document.getElementById('drill-feedback');
    const expDisplay = isSpace ? 'SPACE' : expectedKey?.toUpperCase();
    feedEl.textContent = 'Expected: ' + expDisplay;

    updateDrillStats();

    setTimeout(() => {
      symEl.classList.remove('flash-wrong');
      drillLocked = false;
      renderExpectedKey(currentSymbol, null);
      if (drillShowKeyboard) renderKeyboard(null, null);
    }, 900);
  }
}

function updateDrillStats() {
  document.getElementById('drill-streak').textContent = drillStreak;
  const acc = drillTotal > 0 ? Math.round((drillCorrect / drillTotal) * 100) + '%' : '—';
  document.getElementById('drill-accuracy').textContent = acc;
}

document.addEventListener('keydown', handleDrillKey);

/* group nav links */
document.querySelectorAll('.group-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.group-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    drillFilter = link.dataset.filter;
    renderDrillSymbol();
  });
});

/* toggles */
document.getElementById('btn-show-pinyin').addEventListener('click', () => {
  drillShowPinyin = !drillShowPinyin;
  document.getElementById('btn-show-pinyin').classList.toggle('active', drillShowPinyin);
  document.getElementById('drill-pinyin-hint').classList.toggle('hint-hidden', !drillShowPinyin);
});

document.getElementById('btn-show-key').addEventListener('click', () => {
  drillShowKey = !drillShowKey;
  document.getElementById('btn-show-key').classList.toggle('active', drillShowKey);
  renderExpectedKey(currentSymbol, null);
});

document.getElementById('btn-show-keyboard').addEventListener('click', () => {
  drillShowKeyboard = !drillShowKeyboard;
  document.getElementById('btn-show-keyboard').classList.toggle('active', drillShowKeyboard);
  const hintEl = document.getElementById('drill-keyboard-hint');
  hintEl.classList.toggle('hint-hidden', !drillShowKeyboard);
  if (drillShowKeyboard) renderKeyboard(null, null);
});

/* ══════════════════════════════════════════════
   6. WORD PRACTICE
══════════════════════════════════════════════ */
let wordHSK = 1;
let wordList = [];
let wordIndex = 0;
let wordCorrect = 0;
let wordShowZhuyin = true;
let wordShowKeys = true;
let wordLocked = false;

function initWordSession() {
  wordList = [...WORD_BANKS[wordHSK]].sort(() => Math.random() - 0.5);
  wordIndex = 0;
  wordCorrect = 0;
  wordLocked = false;
  document.getElementById('word-score-screen').classList.add('hint-hidden');
  renderWord();
  updateWordProgress();
}

function renderWord() {
  const word = wordList[wordIndex];
  if (!word) return;

  const chars = [...word.chars];
  const zhuyinParts = word.zhuyin.split(' ');
  const row = document.getElementById('word-chars-row');
  row.innerHTML = '';

  chars.forEach((ch, i) => {
    const block = document.createElement('div');
    block.className = 'word-char-block';

    const zy = document.createElement('div');
    zy.className = 'word-char-zhuyin' + (wordShowZhuyin ? '' : ' hint-hidden');
    zy.textContent = zhuyinParts[i] || '';

    const hanzi = document.createElement('div');
    hanzi.className = 'word-char-hanzi';
    hanzi.textContent = ch;

    block.appendChild(zy);
    block.appendChild(hanzi);
    row.appendChild(block);
  });

  /* key sequence */
  const keySeqEl = document.getElementById('word-key-sequence');
  keySeqEl.innerHTML = '';
  keySeqEl.classList.toggle('hint-hidden', !wordShowKeys);

  const keyGroups = zhuyinToKeys(word.zhuyin);
  keyGroups.forEach((keys, gi) => {
    if (gi > 0) {
      const sep = document.createElement('span');
      sep.className = 'word-key-sep';
      sep.textContent = '·';
      keySeqEl.appendChild(sep);
    }
    keys.forEach(k => {
      const badge = document.createElement('span');
      badge.className = 'key-badge';
      badge.textContent = k;
      keySeqEl.appendChild(badge);
    });
  });

  document.getElementById('word-meaning-label').textContent = word.meaning;
  document.getElementById('word-feedback').textContent = '';
  document.getElementById('word-feedback').className = '';

  const input = document.getElementById('word-input');
  input.value = '';
  input.className = '';
  input.disabled = false;
  wordLocked = false;
  setTimeout(() => input.focus(), 50);
}

function updateWordProgress() {
  const total = wordList.length;
  const pct = total > 0 ? (wordIndex / total) * 100 : 0;
  document.getElementById('word-progress-fill').style.width = pct + '%';
  document.getElementById('word-progress-label').textContent = wordIndex + ' / ' + total;
}

function checkWord() {
  if (wordLocked) return;
  const word = wordList[wordIndex];
  if (!word) return;

  const input = document.getElementById('word-input');
  const typed = input.value.trim();

  if (typed === word.chars) {
    wordCorrect++;
    wordLocked = true;
    input.classList.add('inp-correct');
    const fb = document.getElementById('word-feedback');
    fb.textContent = '✓';
    fb.className = 'fb-correct';

    setTimeout(() => {
      wordIndex++;
      updateWordProgress();
      if (wordIndex >= wordList.length) showWordScore();
      else renderWord();
    }, 500);
  } else if (typed.length >= word.chars.length) {
    input.classList.add('inp-wrong');
    const fb = document.getElementById('word-feedback');
    fb.textContent = word.zhuyin;
    fb.className = 'fb-wrong';
    setTimeout(() => {
      input.classList.remove('inp-wrong');
      input.value = '';
    }, 900);
  }
}

function showWordScore() {
  const total = wordList.length;
  const pct = Math.round((wordCorrect / total) * 100);
  document.getElementById('score-number').textContent = wordCorrect + ' / ' + total;
  document.getElementById('score-pct').textContent = pct + '% correct';
  document.getElementById('word-score-screen').classList.remove('hint-hidden');
  document.getElementById('btn-next-level').style.display = wordHSK < 3 ? '' : 'none';
}

document.getElementById('word-input').addEventListener('input', checkWord);
document.getElementById('word-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkWord();
});

document.getElementById('btn-show-zhuyin').addEventListener('click', () => {
  wordShowZhuyin = !wordShowZhuyin;
  document.getElementById('btn-show-zhuyin').classList.toggle('active', wordShowZhuyin);
  document.querySelectorAll('.word-char-zhuyin').forEach(el => {
    el.classList.toggle('hint-hidden', !wordShowZhuyin);
  });
});

document.getElementById('btn-show-keys').addEventListener('click', () => {
  wordShowKeys = !wordShowKeys;
  document.getElementById('btn-show-keys').classList.toggle('active', wordShowKeys);
  document.getElementById('word-key-sequence').classList.toggle('hint-hidden', !wordShowKeys);
});

document.querySelectorAll('.hsk-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.hsk-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    wordHSK = parseInt(pill.dataset.hsk);
    initWordSession();
  });
});

document.getElementById('btn-try-again').addEventListener('click', initWordSession);
document.getElementById('btn-next-level').addEventListener('click', () => {
  if (wordHSK < 3) {
    wordHSK++;
    document.querySelectorAll('.hsk-pill').forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.hsk) === wordHSK);
    });
    initWordSession();
  }
});

/* ══════════════════════════════════════════════
   7. LANGUAGE TOGGLE
══════════════════════════════════════════════ */
function updateLanguage() {
  const lang = sessionStorage.getItem('lang') || 'zh';
  const enSpan = document.getElementById('toggle-en');
  const zhSpan = document.getElementById('toggle-zh');
  if (lang === 'en') { enSpan.classList.add('active'); zhSpan.classList.remove('active'); }
  else               { zhSpan.classList.add('active'); enSpan.classList.remove('active'); }
}

document.getElementById('lang-toggle').addEventListener('click', e => {
  if (e.target.classList.contains('divider')) return;
  let newLang;
  if (e.target.id === 'toggle-en') newLang = 'en';
  else if (e.target.id === 'toggle-zh') newLang = 'zh';
  else newLang = (sessionStorage.getItem('lang') || 'zh') === 'zh' ? 'en' : 'zh';
  sessionStorage.setItem('lang', newLang);
  updateLanguage();
});

/* ══════════════════════════════════════════════
   8. INIT
══════════════════════════════════════════════ */
renderDrillSymbol();
initWordSession();
updateLanguage();