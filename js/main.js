// main.js - 校門口入口流程控制
document.addEventListener('DOMContentLoaded', function() {
    const userNameInput = document.getElementById('userName');
    const enterBtn = document.getElementById('enterBtn');

    // 檢查是否已有儲存的使用者名稱
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userNameInput.value = savedName;
    }

    enterBtn.addEventListener('click', function() {
        const userName = userNameInput.value.trim();
        if (userName) {
            localStorage.setItem('userName', userName);
            // 導向校園地圖
            window.location.href = 'map.html';
        } else {
            alert('請輸入您的名字');
        }
    });

    // Enter 鍵快速進入
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enterBtn.click();
        }
    });
});