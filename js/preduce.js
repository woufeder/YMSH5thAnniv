let dialogue = [];
let current = 0;
let typingInterval = null;

// DOM
const bg = document.querySelector('#bg');
const nameBox = document.querySelector('#name');
const dialogueHeader = document.querySelector('.dialogue-header');
const textBox = document.querySelector('#text');
const nextBtn = document.querySelector('#nextBtn');
const inputArea = document.querySelector('#name-input-area');
const scene = document.querySelector('#scene-container');

// 初始化
async function init() {
  // 從 localStorage 讀取資料
  const name = localStorage.getItem('playerName');
  const role = localStorage.getItem('playerRole') || 'default';
  const className = localStorage.getItem('playerClass');

  // 載入同一個 JSON
  await loadDialogue('data/precede.json', role, { name, className, role });

  nextBtn.addEventListener('click', nextLine);
}

// 載入對話劇本
async function loadDialogue(path, role, player = {}) {
  try {
    const res = await fetch(path);
    const data = await res.json();

    // 根據身份選擇對話組
    switch (role) {
      case 'student':
        dialogue = data.student || data.default || [];
        break;
      case 'teacher':
        dialogue = data.teacher || data.default || [];
        break;
      default:
        dialogue = data.default || [];
    }

    current = 0;
    window.playerInfo = player;
    showLine();
  } catch (err) {
    console.error('❌ 劇情載入失敗:', err);
  }
}

// 顯示對話
function showLine() {
  const line = dialogue[current];
  if (!line) return;

  clearInterval(typingInterval);

  // 清除舊效果
  scene?.classList.remove('shake', 'shakeStrong', 'flash');

  // 背景
  if (line.bg && line.bg !== bg.src) bg.src = line.bg;

  // 名字
  if (line.name) {
    nameBox.textContent = line.name;
    dialogueHeader.style.display = 'block';
  } else {
    nameBox.textContent = '';
    dialogueHeader.style.display = 'none';
  }

  // 🔹 在這裡加效果
  if (line.effect) triggerEffect(line.effect);

  // 打字機效果
  textBox.textContent = '';
  const text = replaceVars(line.text || '');
  let i = 0;
  const speed = 50;

  typingInterval = setInterval(() => {
    textBox.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(typingInterval);
  }, speed);
}

// 變數代換（支援 {{name}}、{{class}}、{{role}}）
function replaceVars(str) {
  const info = window.playerInfo || {};
  return str
    .replaceAll('{{name}}', info.name || '')
    .replaceAll('{{class}}', info.className || '')
    .replaceAll('{{role}}', info.role || '');
}

// 下一句
function nextLine() {
  current++;
  if (current < dialogue.length) {
    showLine();
  } else {
    fadeTo('gate.html');
  }
}

init();
