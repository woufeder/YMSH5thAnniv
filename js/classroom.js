// classroom.js - 翻牌遊戲邏輯
document.addEventListener('DOMContentLoaded', function() {
    const cardGrid = document.getElementById('cardGrid');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const resetBtn = document.getElementById('resetGame');
    const backBtn = document.getElementById('backToMap');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let score = 0;
    let startTime = null;
    let timerInterval = null;

    // 卡片數據（可以是學校相關圖片或符號）
    const cardData = [
        '🏫', '📚', '✏️', '🎓', '🔬', '🌸', '⚽', '🎨',
        '🏫', '📚', '✏️', '🎓', '🔬', '🌸', '⚽', '🎨'
    ];

    function initGame() {
        cards = [...cardData].sort(() => Math.random() - 0.5);
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        score = 0;
        startTime = Date.now();
        
        updateUI();
        createCards();
        startTimer();
    }

    function createCards() {
        cardGrid.innerHTML = '';
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            `;
            card.addEventListener('click', flipCard);
            cardGrid.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length >= 2) return;
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            updateUI();
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const symbol1 = cards[card1.dataset.index];
        const symbol2 = cards[card2.dataset.index];

        setTimeout(() => {
            if (symbol1 === symbol2) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                score += 10;
                
                if (matchedPairs === cards.length / 2) {
                    gameComplete();
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            flippedCards = [];
            updateUI();
        }, 1000);
    }

    function gameComplete() {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`恭喜完成！分數: ${score}, 步數: ${moves}`);
            
            // 標記為已完成
            let completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];
            if (!completedGames.includes('classroom')) {
                completedGames.push('classroom');
                localStorage.setItem('completedGames', JSON.stringify(completedGames));
            }
        }, 500);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function updateUI() {
        scoreElement.textContent = `分數: ${score}`;
        movesElement.textContent = `步數: ${moves}`;
    }

    resetBtn.addEventListener('click', initGame);
    backBtn.addEventListener('click', () => window.location.href = '../map.html');

    // 初始化遊戲
    initGame();
});