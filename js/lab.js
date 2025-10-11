// lab.js - 電路解謎遊戲
document.addEventListener('DOMContentLoaded', function() {
    const circuitBoard = document.querySelector('.circuit-grid');
    const testBtn = document.getElementById('testCircuit');
    const resetBtn = document.getElementById('resetCircuit');
    const hintBtn = document.getElementById('hintBtn');
    const statusLight = document.getElementById('statusLight');
    const statusText = document.getElementById('statusText');
    const backBtn = document.getElementById('backToMap');

    let circuitGrid = [];
    let solution = [];
    let hintCount = 0;
    const maxHints = 3;

    // 電路元件類型
    const components = {
        empty: '⬜',
        wire: '━',
        corner: '┗',
        battery: '🔋',
        bulb: '💡',
        switch: '🔘'
    };

    // 可由玩家放置/循環切換的元件清單
    const placeableComponents = ['empty', 'wire', 'corner'];

    function initCircuit() {
        // 創建一個簡單的電路謎題
        circuitGrid = [
            ['battery', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'bulb']
        ];

        // 正確解答
        solution = [
            ['battery', 'wire', 'wire', 'corner'],
            ['empty', 'empty', 'empty', 'wire'],
            ['empty', 'empty', 'empty', 'wire'],
            ['corner', 'wire', 'wire', 'bulb']
        ];

        createCircuitBoard();
        updateStatus('未連接', 'red');
    }

    function createCircuitBoard() {
        circuitBoard.innerHTML = '';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'circuit-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const component = circuitGrid[row][col];
                cell.textContent = components[component];
                
                // 允許可放置元件的格子點擊切換（empty/wire/corner）
                if (placeableComponents.includes(component)) {
                    cell.classList.add('clickable');
                    cell.addEventListener('click', () => placeComponent(row, col));
                }
                
                circuitBoard.appendChild(cell);
            }
        }
    }

    function placeComponent(row, col) {
        // 循環切換電路元件
        const currentIndex = placeableComponents.indexOf(circuitGrid[row][col]);
        const nextIndex = (currentIndex + 1) % placeableComponents.length;
        
        circuitGrid[row][col] = placeableComponents[nextIndex];
        createCircuitBoard();
    }

    function testCircuit() {
        let isCorrect = true;
        
        // 檢查電路是否與解答匹配
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (circuitGrid[row][col] !== solution[row][col]) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }

        if (isCorrect) {
            updateStatus('電路接通！', 'green');
            setTimeout(() => {
                alert('恭喜！電路解謎完成！');
                markGameComplete();
            }, 1000);
        } else {
            updateStatus('電路未接通', 'orange');
            // 檢查部分正確
            const correctCount = checkPartialCorrect();
            if (correctCount > 0) {
                setTimeout(() => {
                    updateStatus(`${correctCount} 個元件位置正確`, 'yellow');
                }, 1000);
            }
        }
    }

    function checkPartialCorrect() {
        let correct = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (circuitGrid[row][col] === solution[row][col]) {
                    correct++;
                }
            }
        }
        return correct;
    }

    function resetCircuit() {
        circuitGrid = [
            ['battery', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'bulb']
        ];
        createCircuitBoard();
        updateStatus('未連接', 'red');
    }

    function showHint() {
        if (hintCount >= maxHints) {
            alert('提示次數已用完！');
            return;
        }

        hintCount++;
        
        // 提供不同的提示
        const hints = [
            '提示 1: 電流需要從電池流向燈泡',
            '提示 2: 使用直線和轉角連接電路路徑',
            '提示 3: 記住電流必須形成完整的迴路'
        ];

        alert(hints[hintCount - 1]);
        
        if (hintCount >= maxHints) {
            hintBtn.disabled = true;
            hintBtn.textContent = '提示已用完';
        } else {
            hintBtn.textContent = `提示 (${maxHints - hintCount} 次剩餘)`;
        }
    }

    function updateStatus(text, color) {
        statusText.textContent = `電路狀態: ${text}`;
        statusLight.style.backgroundColor = color;
    }

    function markGameComplete() {
        let completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];
        if (!completedGames.includes('lab')) {
            completedGames.push('lab');
            localStorage.setItem('completedGames', JSON.stringify(completedGames));
        }
    }

    // 事件監聽器
    testBtn.addEventListener('click', testCircuit);
    resetBtn.addEventListener('click', resetCircuit);
    hintBtn.addEventListener('click', showHint);
    backBtn.addEventListener('click', () => window.location.href = '../map.html');

    // 初始化
    initCircuit();
});