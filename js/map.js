// map.js - 地圖互動與進度管理
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName') || '訪客';
    const progressText = document.getElementById('progress-text');
    
    // 初始化進度
    let completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];
    updateProgress();

    // 建立地點標記
    createLocationMarkers();

    function createLocationMarkers() {
        const markers = document.querySelector('.location-markers');
        const locations = [
            { id: 'classroom', name: '教室', x: 20, y: 30, url: 'games/classroom.html' },
            { id: 'garden', name: '花園', x: 60, y: 50, url: 'games/garden.html' },
            { id: 'lab', name: '實驗室', x: 80, y: 20, url: 'games/lab.html' },
            { id: 'principal', name: '校長室', x: 50, y: 80, url: 'principal.html' },
            { id: 'hall', name: '穿堂', x: 40, y: 60, url: 'hall.html' },
            { id: 'extras', name: '彩蛋區', x: 10, y: 70, url: 'games/extras.html' }
        ];

        locations.forEach(location => {
            const marker = document.createElement('div');
            marker.className = 'location-marker';
            marker.style.left = location.x + '%';
            marker.style.top = location.y + '%';
            marker.textContent = location.name;
            
            // 檢查是否已完成
            if (completedGames.includes(location.id)) {
                marker.classList.add('completed');
            }

            marker.addEventListener('click', () => {
                window.location.href = location.url;
            });

            markers.appendChild(marker);
        });
    }

    function updateProgress() {
        const total = 3; // 主要遊戲數量
        const completed = completedGames.filter(game => 
            ['classroom', 'garden', 'lab'].includes(game)
        ).length;
        
        progressText.textContent = `進度: ${completed}/${total}`;
        
        // 如果全部完成，顯示特殊訊息
        if (completed === total) {
            progressText.textContent += ' - 恭喜完成所有挑戰！';
        }
    }
});