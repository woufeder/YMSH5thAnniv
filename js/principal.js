// principal.js - 紀念卡生成功能 (Canvas)
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('memoryCard');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateCard');
    const downloadBtn = document.getElementById('downloadCard');
    const backBtn = document.getElementById('backToMap');

    const userName = localStorage.getItem('userName') || '紀念者';
    const completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];

    function generateCard() {
        // 清空畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景漸層
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(1, '#bbdefb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 邊框
        ctx.strokeStyle = '#1565c0';
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // 標題
        ctx.fillStyle = '#0d47a1';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YMSH 5週年紀念卡', canvas.width / 2, 60);

        // 使用者名稱
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#1565c0';
        ctx.fillText(userName, canvas.width / 2, 120);

        // 完成狀態
        ctx.font = '18px Arial';
        ctx.fillStyle = '#424242';
        const totalGames = ['classroom', 'garden', 'lab'];
        const completedCount = completedGames.filter(game => totalGames.includes(game)).length;
        ctx.fillText(`完成進度: ${completedCount}/${totalGames.length}`, canvas.width / 2, 160);

        // 成就徽章
        drawAchievements();

        // 日期
        const today = new Date();
        const dateString = today.toLocaleDateString('zh-TW');
        ctx.font = '16px Arial';
        ctx.fillStyle = '#757575';
        ctx.fillText(`生成日期: ${dateString}`, canvas.width / 2, 550);

        // QR 碼佔位符（實際實作可加入真實 QR 碼）
        drawQRPlaceholder();
    }

    function drawAchievements() {
        const achievements = [
            { id: 'classroom', name: '記憶大師', emoji: '🧠', completed: completedGames.includes('classroom') },
            { id: 'garden', name: '綠手指', emoji: '🌱', completed: completedGames.includes('garden') },
            { id: 'lab', name: '小愛迪生', emoji: '⚡', completed: completedGames.includes('lab') },
            { id: 'explorer', name: '探索者', emoji: '🗺️', completed: completedGames.includes('extras') }
        ];

        const startY = 200;
        const spacing = 80;

        achievements.forEach((achievement, index) => {
            const x = canvas.width / 2;
            const y = startY + (index * spacing);

            // 徽章圓圈
            ctx.beginPath();
            ctx.arc(x - 100, y, 25, 0, 2 * Math.PI);
            ctx.fillStyle = achievement.completed ? '#4caf50' : '#e0e0e0';
            ctx.fill();
            ctx.strokeStyle = achievement.completed ? '#2e7d32' : '#bdbdbd';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 徽章表情符號
            ctx.font = '20px Arial';
            ctx.fillStyle = achievement.completed ? '#ffffff' : '#9e9e9e';
            ctx.textAlign = 'center';
            ctx.fillText(achievement.emoji, x - 100, y + 7);

            // 成就名稱
            ctx.font = '18px Arial';
            ctx.fillStyle = achievement.completed ? '#2e7d32' : '#9e9e9e';
            ctx.textAlign = 'left';
            ctx.fillText(achievement.name, x - 60, y + 5);

            // 完成狀態
            ctx.font = '14px Arial';
            ctx.fillStyle = achievement.completed ? '#4caf50' : '#f44336';
            ctx.fillText(achievement.completed ? '✓ 已完成' : '✗ 未完成', x + 50, y + 5);
        });
    }

    function drawQRPlaceholder() {
        const qrSize = 80;
        const qrX = canvas.width - qrSize - 30;
        const qrY = canvas.height - qrSize - 30;

        // QR 碼邊框
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);

        // QR 碼佔位符文字
        ctx.font = '12px Arial';
        ctx.fillStyle = '#757575';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', qrX + qrSize / 2, qrY + qrSize / 2);
    }

    function downloadCard() {
        // 創建下載連結
        const link = document.createElement('a');
        link.download = `YMSH_5週年紀念卡_${userName}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    // 事件監聽器
    generateBtn.addEventListener('click', generateCard);
    downloadBtn.addEventListener('click', downloadCard);
    backBtn.addEventListener('click', () => window.location.href = 'map.html');

    // 頁面載入時自動生成
    generateCard();
});