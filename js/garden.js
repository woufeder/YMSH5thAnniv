// garden.js - 種樹互動遊戲
document.addEventListener('DOMContentLoaded', function() {
    const treeContainer = document.getElementById('treeContainer');
    const waterBtn = document.getElementById('waterBtn');
    const sunlightBtn = document.getElementById('sunlightBtn');
    const fertilizeBtn = document.getElementById('fertilizeBtn');
    const growthFill = document.getElementById('growthFill');
    const growthText = document.getElementById('growthText');
    const backBtn = document.getElementById('backToMap');

    let treeGrowth = parseInt(localStorage.getItem('treeGrowth')) || 0;
    let lastWatered = localStorage.getItem('lastWatered') || 0;
    let lastSunlight = localStorage.getItem('lastSunlight') || 0;
    let lastFertilized = localStorage.getItem('lastFertilized') || 0;

    const growthStages = [
        '🌱', // 種子
        '🌿', // 幼苗
        '🌳', // 小樹
        '🌲', // 大樹
        '🎄'  // 完全成長
    ];

    function initGarden() {
        updateTreeDisplay();
        updateGrowthBar();
        checkButtonStates();
    }

    function updateTreeDisplay() {
        const stageIndex = Math.min(Math.floor(treeGrowth / 20), growthStages.length - 1);
        treeContainer.innerHTML = `
            <div class="tree-stage" style="font-size: ${2 + stageIndex}em;">
                ${growthStages[stageIndex]}
            </div>
        `;
    }

    function updateGrowthBar() {
        const percentage = Math.min(treeGrowth, 100);
        growthFill.style.width = percentage + '%';
        growthText.textContent = `生長進度: ${percentage}%`;
        
        if (percentage >= 100) {
            growthText.textContent += ' - 樹木已完全成長！';
            markGameComplete();
        }
    }

    function checkButtonStates() {
        const now = Date.now();
        const cooldown = 5000; // 5秒冷卻時間

        // 檢查按鈕是否需要冷卻
        if (now - lastWatered < cooldown) {
            waterBtn.disabled = true;
            setTimeout(() => {
                waterBtn.disabled = false;
            }, cooldown - (now - lastWatered));
        }

        if (now - lastSunlight < cooldown) {
            sunlightBtn.disabled = true;
            setTimeout(() => {
                sunlightBtn.disabled = false;
            }, cooldown - (now - lastSunlight));
        }

        if (now - lastFertilized < cooldown) {
            fertilizeBtn.disabled = true;
            setTimeout(() => {
                fertilizeBtn.disabled = false;
            }, cooldown - (now - lastFertilized));
        }
    }

    function growTree(amount, action) {
        treeGrowth = Math.min(treeGrowth + amount, 100);
        localStorage.setItem('treeGrowth', treeGrowth);
        
        updateTreeDisplay();
        updateGrowthBar();
        
        // 顯示動畫效果
        showGrowthEffect(action);
    }

    function showGrowthEffect(action) {
        const effect = document.createElement('div');
        effect.className = 'growth-effect';
        effect.textContent = getActionEffect(action);
        treeContainer.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }

    function getActionEffect(action) {
        const effects = {
            water: '💧 澆水中...',
            sunlight: '☀️ 陽光照射...',
            fertilize: '🌰 施肥中...'
        };
        return effects[action] || '';
    }

    function markGameComplete() {
        let completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];
        if (!completedGames.includes('garden')) {
            completedGames.push('garden');
            localStorage.setItem('completedGames', JSON.stringify(completedGames));
        }
    }

    // 事件監聽器
    waterBtn.addEventListener('click', function() {
        if (!this.disabled) {
            growTree(15, 'water');
            lastWatered = Date.now();
            localStorage.setItem('lastWatered', lastWatered);
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 5000);
        }
    });

    sunlightBtn.addEventListener('click', function() {
        if (!this.disabled) {
            growTree(10, 'sunlight');
            lastSunlight = Date.now();
            localStorage.setItem('lastSunlight', lastSunlight);
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 5000);
        }
    });

    fertilizeBtn.addEventListener('click', function() {
        if (!this.disabled) {
            growTree(20, 'fertilize');
            lastFertilized = Date.now();
            localStorage.setItem('lastFertilized', lastFertilized);
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 5000);
        }
    });

    backBtn.addEventListener('click', () => window.location.href = '../map.html');

    // 初始化
    initGarden();
});