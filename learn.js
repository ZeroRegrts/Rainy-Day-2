/* ─────────────────────────────────────────────
   learn.js  —  雨天 Learn Page
───────────────────────────────────────────── */

/* ══════════════════════════════════════════════
   1. ZHUYIN ↔ QWERTY DATA
   Standard Zhuyin input method (Traditional keyboard layout)
══════════════════════════════════════════════ */
const INITIALS = [
  { zh: 'ㄅ', key: 'b' }, { zh: 'ㄆ', key: 'p' }, { zh: 'ㄇ', key: 'm' }, { zh: 'ㄈ', key: 'f' },
  { zh: 'ㄉ', key: 'd' }, { zh: 'ㄊ', key: 't' }, { zh: 'ㄋ', key: 'n' }, { zh: 'ㄌ', key: 'l' },
  { zh: 'ㄍ', key: 'g' }, { zh: 'ㄎ', key: 'k' }, { zh: 'ㄏ', key: 'h' },
  { zh: 'ㄐ', key: 'j' }, { zh: 'ㄑ', key: 'q' }, { zh: 'ㄒ', key: 'x' },
  { zh: 'ㄓ', key: 'zh' }, { zh: 'ㄔ', key: 'ch' }, { zh: 'ㄕ', key: 'sh' }, { zh: 'ㄖ', key: 'r' },
  { zh: 'ㄗ', key: 'z' }, { zh: 'ㄘ', key: 'c' }, { zh: 'ㄙ', key: 's' },
];

const MEDIALS = [
  { zh: 'ㄧ', key: 'i' }, { zh: 'ㄨ', key: 'u' }, { zh: 'ㄩ', key: 'iu' },
];

const FINALS = [
  { zh: 'ㄚ', key: 'a' }, { zh: 'ㄛ', key: 'o' }, { zh: 'ㄜ', key: 'e' },
  { zh: 'ㄝ', key: 'ê' }, { zh: 'ㄞ', key: 'ai' }, { zh: 'ㄟ', key: 'ei' },
  { zh: 'ㄠ', key: 'ao' }, { zh: 'ㄡ', key: 'ou' },
  { zh: 'ㄢ', key: 'an' }, { zh: 'ㄣ', key: 'en' }, { zh: 'ㄤ', key: 'ang' }, { zh: 'ㄥ', key: 'eng' },
  { zh: 'ㄦ', key: 'er' },
];

const TONES = [
  { zh: '˙', key: '5', label: 'Neutral' },
  { zh: 'ˊ', key: '2', label: '2nd' },
  { zh: 'ˇ', key: '3', label: '3rd' },
  { zh: 'ˋ', key: '4', label: '4th' },
  { zh: '（1st）', key: '(none)', label: '1st = no key' },
];

/* Standard Zhuyin keyboard layout (key → zhuyin) */
const KB_ROWS = [
  [
    { qwerty: '1', zh: '',    tone: true,  label: '˙ (5)' },
    { qwerty: '2', zh: '',    tone: true,  label: 'ˊ (2)' },
    { qwerty: '3', zh: '',    tone: true,  label: 'ˇ (3)' },
    { qwerty: '4', zh: '',    tone: true,  label: 'ˋ (4)' },
    { qwerty: '5', zh: 'ㄍ',  tone: false },
    { qwerty: '6', zh: 'ㄐ',  tone: false },
    { qwerty: '7', zh: 'ㄓ',  tone: false },
    { qwerty: '8', zh: 'ㄗ',  tone: false },
    { qwerty: '9', zh: 'ㄘ',  tone: false },
    { qwerty: '0', zh: 'ㄙ',  tone: false },
    { qwerty: '-', zh: '',    tone: false },
    { qwerty: '=', zh: '',    tone: false },
  ],
  [
    { qwerty: 'Q', zh: 'ㄆ',  tone: false },
    { qwerty: 'W', zh: 'ㄊ',  tone: false },
    { qwerty: 'E', zh: 'ㄋ',  tone: false },
    { qwerty: 'R', zh: 'ㄖ',  tone: false },
    { qwerty: 'T', zh: 'ㄐ',  tone: false },
    { qwerty: 'Y', zh: 'ㄑ',  tone: false },
    { qwerty: 'U', zh: 'ㄧ',  tone: false },
    { qwerty: 'I', zh: 'ㄛ',  tone: false },
    { qwerty: 'O', zh: 'ㄞ',  tone: false },
    { qwerty: 'P', zh: 'ㄢ',  tone: false },
    { qwerty: '[', zh: 'ㄣ',  tone: false },
    { qwerty: ']', zh: 'ㄤ',  tone: false },
  ],
  [
    { qwerty: 'A', zh: 'ㄇ',  tone: false },
    { qwerty: 'S', zh: 'ㄋ',  tone: false },
    { qwerty: 'D', zh: 'ㄉ',  tone: false },
    { qwerty: 'F', zh: 'ㄈ',  tone: false },
    { qwerty: 'G', zh: 'ㄍ',  tone: false },
    { qwerty: 'H', zh: 'ㄏ',  tone: false },
    { qwerty: 'J', zh: 'ㄨ',  tone: false },
    { qwerty: 'K', zh: 'ㄜ',  tone: false },
    { qwerty: 'L', zh: 'ㄟ',  tone: false },
    { qwerty: ';', zh: 'ㄢ',  tone: false },
    { qwerty: "'", zh: 'ㄥ',  tone: false },
  ],
  [
    { qwerty: 'Z', zh: 'ㄈ',  tone: false },
    { qwerty: 'X', zh: 'ㄌ',  tone: false },
    { qwerty: 'C', zh: 'ㄔ',  tone: false },
    { qwerty: 'V', zh: 'ㄩ',  tone: false },
    { qwerty: 'B', zh: 'ㄅ',  tone: false },
    { qwerty: 'N', zh: 'ㄣ',  tone: false },
    { qwerty: 'M', zh: 'ㄇ',  tone: false },
    { qwerty: ',', zh: 'ㄝ',  tone: false },
    { qwerty: '.', zh: 'ㄡ',  tone: false },
    { qwerty: '/', zh: 'ㄦ',  tone: false },
  ],
];

/* accurate standard zhuyin keyboard — rows with correct layout */
const KB_LAYOUT = [
  [
    { qwerty:'1', zh:'',   tone:true,  toneLabel:'˙' },
    { qwerty:'2', zh:'',   tone:true,  toneLabel:'ˊ' },
    { qwerty:'3', zh:'',   tone:true,  toneLabel:'ˇ' },
    { qwerty:'4', zh:'',   tone:true,  toneLabel:'ˋ' },
    { qwerty:'5', zh:'ㄍ', tone:false },
    { qwerty:'6', zh:'ㄐ', tone:false },
    { qwerty:'7', zh:'ㄓ', tone:false },
    { qwerty:'8', zh:'ㄗ', tone:false },
    { qwerty:'9', zh:'ㄘ', tone:false },
    { qwerty:'0', zh:'ㄙ', tone:false },
    { qwerty:'-', zh:'',  tone:false },
    { qwerty:'=', zh:'',  tone:false },
  ],
  [
    { qwerty:'Q', zh:'ㄆ', tone:false },
    { qwerty:'W', zh:'ㄊ', tone:false },
    { qwerty:'E', zh:'ㄋ', tone:false },
    { qwerty:'R', zh:'ㄖ', tone:false },
    { qwerty:'T', zh:'ㄐ', tone:false },
    { qwerty:'Y', zh:'ㄑ', tone:false },
    { qwerty:'U', zh:'ㄧ', tone:false },
    { qwerty:'I', zh:'ㄛ', tone:false },
    { qwerty:'O', zh:'ㄞ', tone:false },
    { qwerty:'P', zh:'ㄢ', tone:false },
    { qwerty:'[', zh:'ㄣ', tone:false },
    { qwerty:']', zh:'ㄤ', tone:false },
  ],
  [
    { qwerty:'A', zh:'ㄇ', tone:false },
    { qwerty:'S', zh:'ㄋ', tone:false },
    { qwerty:'D', zh:'ㄉ', tone:false },
    { qwerty:'F', zh:'ㄈ', tone:false },
    { qwerty:'G', zh:'ㄍ', tone:false },
    { qwerty:'H', zh:'ㄏ', tone:false },
    { qwerty:'J', zh:'ㄨ', tone:false },
    { qwerty:'K', zh:'ㄜ', tone:false },
    { qwerty:'L', zh:'ㄟ', tone:false },
    { qwerty:';', zh:'ㄢ', tone:false },
    { qwerty:"'", zh:'ㄥ', tone:false },
  ],
  [
    { qwerty:'Z', zh:'ㄈ', tone:false },
    { qwerty:'X', zh:'ㄌ', tone:false },
    { qwerty:'C', zh:'ㄔ', tone:false },
    { qwerty:'V', zh:'ㄩ', tone:false },
    { qwerty:'B', zh:'ㄅ', tone:false },
    { qwerty:'N', zh:'ㄣ', tone:false },
    { qwerty:'M', zh:'ㄇ', tone:false },
    { qwerty:',', zh:'ㄝ', tone:false },
    { qwerty:'.', zh:'ㄡ', tone:false },
    { qwerty:'/', zh:'ㄦ', tone:false },
  ],
  [
    { qwerty:'SPACE', zh:'', tone:false, space:true },
  ],
];

/* ══════════════════════════════════════════════
   2. WORD BANK
   Format: { chars, zhuyin, pinyin, meaning }
══════════════════════════════════════════════ */
const WORD_BANK = [
  { chars:'你好',   zhuyin:'ㄋㄧˇ ㄏㄠˇ',      pinyin:'nǐ hǎo',      meaning:'Hello' },
  { chars:'謝謝',   zhuyin:'ㄒㄧㄝˋ ㄒㄧㄝ',   pinyin:'xiè xie',     meaning:'Thank you' },
  { chars:'早安',   zhuyin:'ㄗㄠˇ ㄢ',          pinyin:'zǎo ān',      meaning:'Good morning' },
  { chars:'晚安',   zhuyin:'ㄨㄢˇ ㄢ',          pinyin:'wǎn ān',      meaning:'Good night' },
  { chars:'對不起', zhuyin:'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ', pinyin:'duì bu qǐ', meaning:'Sorry' },
  { chars:'沒關係', zhuyin:'ㄇㄟˊ ㄍㄨㄢ ㄒㄧ', pinyin:'méi guān xi', meaning:"It's okay" },
  { chars:'再見',   zhuyin:'ㄗㄞˋ ㄐㄧㄢˋ',    pinyin:'zài jiàn',    meaning:'Goodbye' },
  { chars:'請問',   zhuyin:'ㄑㄧㄥˇ ㄨㄣˋ',    pinyin:'qǐng wèn',   meaning:'Excuse me / May I ask' },
  { chars:'我愛你', zhuyin:'ㄨㄛˇ ㄞˋ ㄋㄧˇ',  pinyin:'wǒ ài nǐ',   meaning:'I love you' },
  { chars:'中文',   zhuyin:'ㄓㄨㄥ ㄨㄣˊ',     pinyin:'zhōng wén',   meaning:'Chinese language' },
  { chars:'學習',   zhuyin:'ㄒㄩㄝˊ ㄒㄧˊ',   pinyin:'xué xí',      meaning:'To study / learn' },
  { chars:'朋友',   zhuyin:'ㄆㄥˊ ㄧㄡˇ',     pinyin:'péng yǒu',    meaning:'Friend' },
  { chars:'家人',   zhuyin:'ㄐㄧㄚ ㄖㄣˊ',    pinyin:'jiā rén',     meaning:'Family' },
  { chars:'老師',   zhuyin:'ㄌㄠˇ ㄕ',         pinyin:'lǎo shī',     meaning:'Teacher' },
  { chars:'學生',   zhuyin:'ㄒㄩㄝˊ ㄕㄥ',    pinyin:'xué shēng',   meaning:'Student' },
  { chars:'好吃',   zhuyin:'ㄏㄠˇ ㄔ',         pinyin:'hǎo chī',     meaning:'Delicious' },
  { chars:'漂亮',   zhuyin:'ㄆㄧㄠˋ ㄌㄧㄤˋ', pinyin:'piào liàng',  meaning:'Beautiful' },
  { chars:'加油',   zhuyin:'ㄐㄧㄚ ㄧㄡˊ',    pinyin:'jiā yóu',     meaning:'Keep it up!' },
  { chars:'沒問題', zhuyin:'ㄇㄟˊ ㄨㄣˋ ㄊㄧˊ', pinyin:'méi wèn tí', meaning:'No problem' },
  { chars:'台灣',   zhuyin:'ㄊㄞˊ ㄨㄢ',      pinyin:'Tái wān',     meaning:'Taiwan' },
  { chars:'台北',   zhuyin:'ㄊㄞˊ ㄅㄟˇ',     pinyin:'Tái běi',     meaning:'Taipei' },
  { chars:'吃飯',   zhuyin:'ㄔ ㄈㄢˋ',        pinyin:'chī fàn',     meaning:'To eat (a meal)' },
  { chars:'喝水',   zhuyin:'ㄏㄜ ㄕㄨㄟˇ',   pinyin:'hē shuǐ',     meaning:'To drink water' },
  { chars:'睡覺',   zhuyin:'ㄕㄨㄟˋ ㄐㄧㄠˋ', pinyin:'shuì jiào',  meaning:'To sleep' },
  { chars:'工作',   zhuyin:'ㄍㄨㄥ ㄗㄨㄛˋ',  pinyin:'gōng zuò',   meaning:'Work / job' },
  { chars:'電話',   zhuyin:'ㄉㄧㄢˋ ㄏㄨㄚˋ', pinyin:'diàn huà',   meaning:'Phone call / telephone' },
  { chars:'手機',   zhuyin:'ㄕㄡˇ ㄐㄧ',      pinyin:'shǒu jī',    meaning:'Mobile phone' },
  { chars:'天氣',   zhuyin:'ㄊㄧㄢ ㄑㄧˋ',   pinyin:'tiān qì',    meaning:'Weather' },
  { chars:'音樂',   zhuyin:'ㄧㄣ ㄩㄝˋ',      pinyin:'yīn yuè',    meaning:'Music' },
  { chars:'電影',   zhuyin:'ㄉㄧㄢˋ ㄧㄥˇ',  pinyin:'diàn yǐng',  meaning:'Movie / film' },
  { chars:'書',     zhuyin:'ㄕㄨ',             pinyin:'shū',        meaning:'Book' },
  { chars:'貓',     zhuyin:'ㄇㄠ',             pinyin:'māo',        meaning:'Cat' },
  { chars:'狗',     zhuyin:'ㄍㄡˇ',            pinyin:'gǒu',        meaning:'Dog' },
  { chars:'水',     zhuyin:'ㄕㄨㄟˇ',          pinyin:'shuǐ',       meaning:'Water' },
  { chars:'火',     zhuyin:'ㄏㄨㄛˇ',          pinyin:'huǒ',        meaning:'Fire' },
  { chars:'山',     zhuyin:'ㄕㄢ',             pinyin:'shān',       meaning:'Mountain' },
  { chars:'海',     zhuyin:'ㄏㄞˇ',            pinyin:'hǎi',        meaning:'Sea / ocean' },
  { chars:'雨天',   zhuyin:'ㄩˇ ㄊㄧㄢ',      pinyin:'yǔ tiān',    meaning:'Rainy day' },
];

/* ══════════════════════════════════════════════
   3. STATE
══════════════════════════════════════════════ */
let currentWordIndex = -1;
let notationMode = 'zhuyin'; // 'zhuyin' | 'pinyin'
let usedIndices = [];

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
   5. WORD EXPLORER
══════════════════════════════════════════════ */
function pickNextWord() {
  if (usedIndices.length >= WORD_BANK.length) usedIndices = [];
  let idx;
  do { idx = Math.floor(Math.random() * WORD_BANK.length); }
  while (usedIndices.includes(idx));
  usedIndices.push(idx);
  currentWordIndex = idx;
  renderWord();
}

function renderWord() {
  const w = WORD_BANK[currentWordIndex];
  const charEl     = document.getElementById('word-chars');
  const notationEl = document.getElementById('word-notation');
  const meaningEl  = document.getElementById('word-meaning');
  const counterEl  = document.getElementById('word-counter');

  /* fade out */
  charEl.style.opacity = '0';
  notationEl.style.opacity = '0';

  setTimeout(() => {
    charEl.textContent     = w.chars;
    notationEl.textContent = notationMode === 'zhuyin' ? w.zhuyin : w.pinyin;
    meaningEl.textContent  = w.meaning;
    counterEl.textContent  = (usedIndices.length) + ' / ' + WORD_BANK.length;
    charEl.style.opacity = '1';
    notationEl.style.opacity = '1';
  }, 140);
}

document.getElementById('btn-next-word').addEventListener('click', pickNextWord);

document.querySelectorAll('.notation-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.notation-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    notationMode = btn.dataset.mode;
    if (currentWordIndex >= 0) renderWord();
  });
});

/* initialise with first word */
pickNextWord();

/* ══════════════════════════════════════════════
   6. REFERENCE TABLE
══════════════════════════════════════════════ */
function buildCell(item, isTone = false) {
  const cell = document.createElement('div');
  cell.className = 'zy-cell' + (isTone ? ' tone-cell' : '');

  const sym = document.createElement('div');
  sym.className = 'zy-sym';
  sym.textContent = isTone ? item.zh : item.zh;

  const key = document.createElement('div');
  key.className = 'zy-key';
  key.textContent = (item.key || item.label || '').toUpperCase();

  cell.appendChild(sym);
  cell.appendChild(key);
  return cell;
}

function buildGrid(containerId, data, isTone = false) {
  const grid = document.getElementById(containerId);
  data.forEach(item => grid.appendChild(buildCell(item, isTone)));
}

buildGrid('grid-initials', INITIALS);
buildGrid('grid-medials',  MEDIALS);
buildGrid('grid-finals',   FINALS);
buildGrid('grid-tones',    TONES, true);

/* ══════════════════════════════════════════════
   7. KEYBOARD VISUAL
══════════════════════════════════════════════ */
function buildKeyboard() {
  const kb = document.getElementById('keyboard');
  kb.innerHTML = '';

  KB_LAYOUT.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';

    row.forEach(k => {
      const keyEl = document.createElement('div');

      if (k.space) {
        keyEl.className = 'kb-key space-key';
        const qEl = document.createElement('div');
        qEl.className = 'kk-qwerty';
        qEl.textContent = 'SPACE';
        keyEl.appendChild(qEl);
      } else {
        keyEl.className = 'kb-key' + (k.tone ? ' tone-key' : '');

        const zhEl = document.createElement('div');
        zhEl.className = 'kk-zh';
        zhEl.textContent = k.tone ? (k.toneLabel || '') : (k.zh || '');

        const qEl = document.createElement('div');
        qEl.className = 'kk-qwerty';
        qEl.textContent = k.qwerty;

        keyEl.appendChild(zhEl);
        keyEl.appendChild(qEl);
      }

      rowEl.appendChild(keyEl);
    });

    kb.appendChild(rowEl);
  });
}

buildKeyboard();

/* ══════════════════════════════════════════════
   8. LANGUAGE TOGGLE  (mirrors main.js pattern)
══════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    tabWord: 'Word', tabTable: 'Reference', tabKeyboard: 'Keyboard',
    tableTitle: 'Zhuyin / QWERTY Reference',
    tableSub: 'Every Zhuyin symbol and its keyboard key',
    labelInitials: 'Initials', labelMedials: 'Medials',
    labelFinals: 'Finals', labelTones: 'Tones',
    kbTitle: 'Zhuyin Keyboard Layout',
    kbSub: 'Standard Zhuyin input — as seen on a Taiwanese keyboard',
    legendZh: 'Zhuyin', legendQwerty: 'QWERTY', legendTone: 'Tone key',
    nextLabel: 'Next Word',
    wordHint: 'Each syllable shown above has a Zhuyin symbol — find it on the keyboard tab',
  },
  zh: {
    tabWord: '單字', tabTable: '對照表', tabKeyboard: '鍵盤',
    tableTitle: '注音 / QWERTY 對照表',
    tableSub: '每個注音符號與對應按鍵',
    labelInitials: '聲母', labelMedials: '介母',
    labelFinals: '韻母', labelTones: '聲調',
    kbTitle: '注音鍵盤配置',
    kbSub: '台灣標準注音輸入鍵盤',
    legendZh: '注音', legendQwerty: '按鍵', legendTone: '聲調鍵',
    nextLabel: '下一個',
    wordHint: '上方每個音節都有注音符號，可在鍵盤頁查詢對應按鍵',
  },
};

function updateLanguage() {
  const lang = sessionStorage.getItem('lang') || 'zh';
  const t = TRANSLATIONS[lang];

  /* tabs */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabKeys = ['Word','Table','Keyboard'];
  tabBtns[0].querySelector('.tab-zh').textContent = lang === 'zh' ? '單字' : 'Word';
  tabBtns[0].querySelector('.tab-en').textContent = lang === 'zh' ? 'Word' : '單字';
  tabBtns[1].querySelector('.tab-zh').textContent = lang === 'zh' ? '對照表' : 'Reference';
  tabBtns[1].querySelector('.tab-en').textContent = lang === 'zh' ? 'Reference' : '對照表';
  tabBtns[2].querySelector('.tab-zh').textContent = lang === 'zh' ? '鍵盤' : 'Keyboard';
  tabBtns[2].querySelector('.tab-en').textContent = lang === 'zh' ? 'Keyboard' : '鍵盤';

  /* table */
  document.getElementById('table-title').textContent    = t.tableTitle;
  document.getElementById('table-subtitle').textContent = t.tableSub;
  document.getElementById('label-initials').textContent = t.labelInitials + ' 聲母';
  document.getElementById('label-medials').textContent  = t.labelMedials + ' 介母';
  document.getElementById('label-finals').textContent   = t.labelFinals  + ' 韻母';
  document.getElementById('label-tones').textContent    = t.labelTones   + ' 聲調';

  /* keyboard */
  document.getElementById('kb-title').textContent    = t.kbTitle;
  document.getElementById('kb-subtitle').textContent = t.kbSub;
  document.getElementById('legend-zh').textContent   = t.legendZh;
  document.getElementById('legend-qwerty').textContent = t.legendQwerty;
  document.getElementById('legend-tone').textContent = t.legendTone;

  /* word explorer */
  document.getElementById('next-label').textContent   = t.nextLabel;
  document.getElementById('word-hint-label').textContent = t.wordHint;

  /* lang toggle active state */
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

updateLanguage();

/* ══════════════════════════════════════════════
   9. WIRE UP "LEARN" BUTTON FROM INDEX
      (index.html → btn-learn → learn.html)
══════════════════════════════════════════════ */
// (navigation is handled by index.html's main.js — nothing extra needed here)
