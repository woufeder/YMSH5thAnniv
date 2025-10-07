/**
 * 通用對話系統
 * 用法：
 *   const game = new DialogueCore({
 *     container: '#game',                // 包覆整個對話畫面容器
 *     data: 'data/start_default.json',    // 預設劇情
 *     students: 'data/student.json',      // (選) 學生名單
 *     onFinish: () => fadeTo('map.html')  // 劇情結束 callback
 *   });
 *   game.init();
 */

class DialogueCore {
  constructor(options) {
    this.container = document.querySelector(options.container || '#game');
    this.dataPath = options.data;
    this.studentsPath = options.students || null;
    this.onFinish = options.onFinish || function () {};

    // 狀態
    this.dialogue = [];
    this.current = 0;
    this.studentList = [];
    this.studentInfo = null;
    this.typingTimer = null;
    this.textSpeed = 35; // 每字間隔
  }

  async init() {
    // 學生資料可選
    if (this.studentsPath) {
      try {
        const res = await fetch(this.studentsPath);
        this.studentList = await res.json();
      } catch (err) {
        console.warn('⚠️ 沒有載入學生名單', err);
      }
    }

    // 載入對話檔
    await this.loadDialogue(this.dataPath);
    this.buildLayout();
    this.showLine();
  }

  async loadDialogue(path) {
    try {
      const res = await fetch(path);
      this.dialogue = await res.json();
      this.current = 0;
    } catch (err) {
      console.error(`❌ 劇情檔載入失敗：${path}`, err);
    }
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
      .replaceAll('{{name}}', this.studentInfo.name || '')
      .replaceAll('{{class}}', this.studentInfo.class || '')
      .replaceAll('{{year}}', this.studentInfo.year || '');
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

    // 背景、角色
    this.bg.src = line.bg ? line.bg : '';
    this.charImg.src = line.char ? line.char : '';

    // 名字與文字
    this.nameBox.textContent = line.name || '';
    const parsed = this.replaceVars(line.text || '');
    this.typeText(parsed);

    // 是否顯示輸入框
    if (line.action === 'askName') {
      this.inputArea.classList.remove('hidden');
      this.nextBtn.classList.add('hidden');
    } else {
      this.inputArea.classList.add('hidden');
      this.nextBtn.classList.remove('hidden');
    }
  }

  async handleNameSubmit() {
    const input = this.playerInput.value.trim();
    if (!input) return;

    this.inputArea.style.transition = 'opacity 0.5s';
    this.inputArea.style.opacity = 0;

    setTimeout(() => {
      this.inputArea.classList.add('hidden');
      this.nextBtn.classList.remove('hidden');
    }, 500);

    this.studentInfo = this.studentList.find(
      s => s.name.trim().normalize() === input.normalize()
    );

    if (this.studentInfo && this.studentInfo.dialogue) {
      // 如果學生資料包含對應劇情
      await this.loadDialogue(this.studentInfo.dialogue);
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

// 自動偵測啟動（容器有 #game 時）
window.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#game')) {
    const game = new DialogueCore({
      container: '#game',
      data: 'data/start_default.json',
      students: 'data/student.json',
      onFinish: () => fadeTo('map.html')
    });
    game.init();
  }
});
