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
  // 使用全域 studentData，不 fetch
  if (!window.studentData || !Array.isArray(window.studentData)) {
    console.error('❌ studentData 未載入，請確認 data/student.js 已正確引用。');
    return;
  }

  // 載入全域資料
  studentData = window.studentData;

  // 預設劇情
  await loadDialogue('data/start_default.json');

  // 綁定事件
  nextBtn.addEventListener('click', nextLine);
  submitName.addEventListener('click', handleNameSubmit);
}

async function loadDialogue(path) {
  try {
    const res = await fetch(path);
    dialogue = await res.json();
    current = 0;
    showLine();
  } catch (err) {
    console.error(`❌ 劇情檔載入失敗：${path}`, err);
  }
}

function showLine() {
  const line = dialogue[current];
  if (!line) return;

  // 更新背景
  if (line.bg && line.bg !== bg.src) {
    bg.src = line.bg;
  }

  // 顯示對話
  nameBox.textContent = line.name || '';
  textBox.textContent = replaceVars(line.text || '');

  // 控制輸入框顯示（例如特定劇情需要）
  // if (line.showInput) {
  //   inputArea.classList.remove('hidden');
  //   nextBtn.classList.add('hidden');
  // } else {
  //   inputArea.classList.add('hidden');
  //   nextBtn.classList.remove('hidden');
  // }
}

function replaceVars(str) {
  if (!studentInfo) return str;
  return str
    .replaceAll('{{name}}', studentInfo.name)
    .replaceAll('{{class}}', studentInfo.class);
}

async function handleNameSubmit() {
  const input = playerInput.value.trim();
  if (!input) {
    alert('請輸入名字');
    return;
  }

  // 比對學生名單（使用 normalize 去除潛在編碼差異）
  studentInfo = studentData.find(
    s => s.name.trim().normalize() === input.normalize()
  );

  // 隱藏輸入框、顯示下一步
  inputArea.classList.add('hidden');
  nextBtn.classList.remove('hidden');

  if (studentInfo) {
    // 有學生 → 換劇本
    await loadDialogue('data/start_student.json');
  } else {
    // 沒學生 → 繼續預設劇情
    current++;
    showLine();
  }
}

function nextLine() {
  current++;
  if (current < dialogue.length) {
    showLine();
  } else {
    // 劇情結束跳轉
    fadeTo('map.html');
  }
}

// 初始化
init();
