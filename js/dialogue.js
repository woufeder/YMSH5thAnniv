/**
 * Visual Novel Dialogue System
 * 使用方式：
 *   const game = new DialogueSystem({
 *     container: '#game',
 *     data: 'data/dialogue_default.json',
 *     students: 'data/student.json',
 *     onFinish: () => window.location.href = 'map.html'
 *   });
 *   game.init();
 */

class DialogueSystem {
  constructor(options) {
    this.container = document.querySelector(options.container || '#game');
    this.dataPath = options.data;
    this.studentsPath = options.students;
    this.onFinish = options.onFinish || function(){};

    this.dialogue = [];
    this.current = 0;
    this.studentList = [];
    this.studentInfo = null;
    this.typingTimer = null;
    this.textSpeed = 25; // ms per character
  }

  async init() {
    await this.loadStudents();
    await this.loadDialogue(this.dataPath);
    this.buildLayout();
    this.showLine();
  }

  async loadStudents() {
    try {
      const res = await fetch(this.studentsPath);
      this.studentList = await res.json();
    } catch (err) {
      console.warn('No student data found', err);
    }
  }

  async loadDialogue(path) {
    const res = await fetch(path);
    this.dialogue = await res.json();
    this.current = 0;
  }

  buildLayout() {
    this.container.innerHTML = `
      <div class="background-layer"><img id="bg" /></div>
      <div class="character-layer"><img id="char" /></div>
      <div class="dialogue-box">
        <div class="dialogue-header"><span id="name"></span></div>
        <div id="text" class="dialogue-text"></div>

        <div id="inputArea" class="input-area hidden">
          <input id="playerName" type="text" placeholder="請輸入你的名字" />
          <button id="submitName">確定</button>
        </div>

        <div class="control-area">
          <button id="nextBtn" class="next-btn">▶</button>
        </div>
      </div>
    `;

    this.bg = this.container.querySelector('#bg');
    this.charImg = this.container.querySelector('#char');
    this.nameBox = this.container.querySelector('#name');
    this.textBox = this.container.querySelector('#text');
    this.nextBtn = this.container.querySelector('#nextBtn');
    this.inputArea = this.container.querySelector('#inputArea');
    this.playerInput = this.container.querySelector('#playerName');
    this.submitName = this.container.querySelector('#submitName');

    this.nextBtn.addEventListener('click', () => this.nextLine());
    this.submitName.addEventListener('click', () => this.handleNameSubmit());
  }

  replaceVars(str) {
    if (!this.studentInfo) return str;
    return str
      .replace('{{name}}', this.studentInfo.name)
      .replace('{{year}}', this.studentInfo.year)
      .replace('{{class}}', this.studentInfo.class);
  }

  typeText(text) {
    this.textBox.textContent = '';
    let i = 0;
    clearInterval(this.typingTimer);
    this.typingTimer = setInterval(() => {
      this.textBox.textContent = text.slice(0, i++);
      if (i > text.length) clearInterval(this.typingTimer);
    }, this.textSpeed);
  }

  showLine() {
    const line = this.dialogue[this.current];
    if (!line) return this.onFinish();

    this.bg.src = 'assets/images/' + (line.bg || 'blank.jpg');
    this.charImg.src = line.char ? 'assets/images/' + line.char : '';
    this.nameBox.textContent = line.name || '';

    const parsed = this.replaceVars(line.text || '');
    this.typeText(parsed);

    if (line.action === 'askName') {
      this.inputArea.classList.remove('hidden');
      this.inputArea.style.opacity = 1;
      this.nextBtn.classList.add('hidden');
    } else {
      this.inputArea.classList.add('hidden');
      this.nextBtn.classList.remove('hidden');
    }
  }

  async handleNameSubmit() {
    const input = this.playerInput.value.trim();
    if (!input) return;
    localStorage.setItem('name', input);

    this.inputArea.style.transition = 'opacity 0.5s';
    this.inputArea.style.opacity = 0;

    setTimeout(() => {
      this.inputArea.classList.add('hidden');
      this.nextBtn.classList.remove('hidden');
    }, 500);

    this.studentInfo = this.studentList.find(s => s.name === input);

    if (this.studentInfo) {
      await this.loadDialogue('data/dialogue_student.json');
    }
    this.current = 0;
    this.showLine();
  }

  nextLine() {
    clearInterval(this.typingTimer);
    const line = this.dialogue[this.current];
    // 如果正在逐字播放，快速跳完
    if (this.textBox.textContent.length < (line?.text?.length || 0)) {
      this.textBox.textContent = this.replaceVars(line.text);
      return;
    }

    this.current++;
    if (this.current < this.dialogue.length) {
      this.showLine();
    } else {
      this.onFinish();
    }
  }
}

// 自動偵測啟動
window.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#game')) {
    const vn = new DialogueSystem({
      container: '#game',
      data: 'data/dialogue_default.json',
      students: 'data/student.json',
      onFinish: () => window.location.href = 'map.html'
    });
    vn.init();
  }
});
