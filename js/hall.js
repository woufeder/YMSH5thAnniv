// hall.js - Google Sheet 留言板串接
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const submitBtn = document.getElementById('submitMessage');
    const messagesList = document.getElementById('messagesList');
    const backBtn = document.getElementById('backToMap');

    const userName = localStorage.getItem('userName') || '匿名使用者';

    // Google Apps Script Web App URL (需要實際部署後取得)
    const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

    let messages = [];

    function loadMessages() {
        // 模擬從 Google Sheet 載入留言
        // 實際實作時需要替換為真實的 Google Apps Script API 呼叫
        const mockMessages = [
            { name: '小明', message: '恭喜 YMSH 5週年！', timestamp: '2024-10-01 10:30' },
            { name: '小華', message: '感謝這個學校帶給我們的美好回憶', timestamp: '2024-10-01 11:15' },
            { name: '小美', message: '祝願學校越來越好！', timestamp: '2024-10-01 14:20' }
        ];

        // 從 localStorage 獲取本地留言
        const localMessages = JSON.parse(localStorage.getItem('localMessages')) || [];
        messages = [...mockMessages, ...localMessages];

        displayMessages();
    }

    function displayMessages() {
        messagesList.innerHTML = '';
        
        messages.reverse().forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-item';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-author">${msg.name}</span>
                    <span class="message-time">${msg.timestamp}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            `;
            messagesList.appendChild(messageDiv);
        });

        messages.reverse(); // 恢復原序
    }

    function submitMessage() {
        const messageText = messageInput.value.trim();
        if (!messageText) {
            alert('請輸入留言內容');
            return;
        }

        const newMessage = {
            name: userName,
            message: messageText,
            timestamp: new Date().toLocaleString('zh-TW')
        };

        // 實際實作時，這裡應該發送到 Google Apps Script
        // 目前先儲存到 localStorage
        const localMessages = JSON.parse(localStorage.getItem('localMessages')) || [];
        localMessages.push(newMessage);
        localStorage.setItem('localMessages', JSON.stringify(localMessages));

        // 模擬 Google Sheet API 呼叫
        // sendToGoogleSheet(newMessage);

        messages.push(newMessage);
        displayMessages();
        messageInput.value = '';

        // 顯示成功訊息
        showSuccessMessage();
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '留言已送出！';
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Google Apps Script 串接函式 (需要實際部署)
    function sendToGoogleSheet(messageData) {
        fetch(SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('留言已送出到 Google Sheet:', data);
        })
        .catch(error => {
            console.error('送出留言時發生錯誤:', error);
        });
    }

    // 事件監聽器
    submitBtn.addEventListener('click', submitMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitMessage();
        }
    });

    backBtn.addEventListener('click', () => window.location.href = 'map.html');

    // 初始化載入留言
    loadMessages();

    // 每30秒重新載入留言 (實際部署時啟用)
    // setInterval(loadMessages, 30000);
});