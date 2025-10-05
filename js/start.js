



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
const scene = document.querySelector('#scene-container');



async function init() {

  // 預設劇情
  await loadDialogue('data/precede.json');

  // 綁事件
  nextBtn.addEventListener('click', nextLine);

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

  // 對話與名字
  nameBox.textContent = line.name || '';
  textBox.textContent = ''; // 先清空文字

  const text = line.text || '';
  let i = 0;
  const speed = 50; // 每個字的間隔（毫秒）

  const interval = setInterval(() => {
    textBox.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
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
