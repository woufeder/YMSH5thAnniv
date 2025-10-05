let dialogue = [];
let current = 0;
let studentData = [];
let studentInfo = null;

// DOM
const bg = document.querySelector('#bg');
const nameBox = document.querySelector('#name');
const textBox = document.querySelector('#text');
const nextBtn = document.querySelector('#nextBtn');
const inputArea = document.querySelector('#name-input-area');
const playerInput = document.querySelector('#playerName');
const submitName = document.querySelector('#submitName');

async function init() {
  // 讀學生資料
  const s = await fetch('data/student.json');
  studentData = await s.json();

  // 預設劇情
  await loadDialogue('data/start_default.json');

  // 綁事件
  nextBtn.addEventListener('click', nextLine);
  submitName.addEventListener('click', handleNameSubmit);
}

async function loadDialogue(path) {
  const res = await fetch(path);
  dialogue = await res.json();
  current = 0;
  showLine();
}

function showLine() {
  const line = dialogue[current];
  if (!line) return;

  // 背景
  if (line.bg && line.bg !== bg.src) bg.src = line.bg;

  // 對話
  nameBox.textContent = line.name || '';
  textBox.textContent = replaceVars(line.text || '');

  // 控制輸入框顯示/隱藏（只用 class 切換）

}

function replaceVars(str) {
  if (!studentInfo) return str;
  return str
    .replaceAll('{{name}}', studentInfo.name)
    .replaceAll('{{year}}', studentInfo.year)
    .replaceAll('{{class}}', studentInfo.class);
}

async function handleNameSubmit() {
  const input = playerInput.value.trim();
  if (!input) return alert('請輸入名字');

  studentInfo = studentData.find(s => s.name === input);

  // 按下確定 → 把輸入框隱藏回去
  inputArea.classList.add('hidden');
  nextBtn.classList.remove('hidden');

  if (studentInfo) {
    // 有學生 → 換劇本
    await loadDialogue('data/start_student.json');
  } else {
    // 沒學生 → 往下一句
    current++;
    showLine();
  }
}

function nextLine() {
  current++;
  if (current < dialogue.length) {
    showLine();
  } else {
    window.location.href = 'map.html';
  }
}

init();
