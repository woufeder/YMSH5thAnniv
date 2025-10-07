



let dialogue = [];
let current = 0;
let studentData = [];
let studentInfo = null;
let typingInterval = null;


// DOM
const bg = document.querySelector('#bg');
const nameBox = document.querySelector('#name');
const dialogueHeader = document.querySelector('.dialogue-header');
const textBox = document.querySelector('#text');
const nextBtn = document.querySelector('#nextBtn');
const inputArea = document.querySelector('#name-input-area');
const scene = document.querySelector('#scene-container');



async function init() {

  // 預設劇情
  await loadDialogue('data/precede.json');

  // 綁事件
  nextBtn.addEventListener('click', nextLine);

}

async function loadDialogue(path) {
  const res = await fetch(path);
  const data = await res.json();
  dialogue = data.warning || []; // 使用 data.warning
  current = 0;
  showLine();
}

function showLine() {
  const line = dialogue[current];
  if (!line) return;

  clearInterval(typingInterval);

  // 背景
  if (line.bg && line.bg !== bg.src) bg.src = line.bg;

  // 對話與名字
  if (line.name) {
    nameBox.textContent = line.name;
    nameBox.style.display = 'inline'; // 顯示名字
  } else {
    nameBox.textContent = '';
    dialogueHeader.style.display = 'none'; // 沒有名字就隱藏
  }

  // 文字
  textBox.textContent = ''; // 清空文字

  const text = line.text || '';
  let i = 0;
  const speed = 60; // 每個字的間隔（毫秒）

  typingInterval = setInterval(() => {
    textBox.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(typingInterval);
  }, speed);
}

function nextLine() {
  current++;
  if (current < dialogue.length) {
    showLine();
  } else {
    fadeTo('gate.html');
  }
}


init();
