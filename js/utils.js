// utils.js - 通用工具函式
// 取得 localStorage 資料的安全方法
function getStorageData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
}

// 設定 localStorage 資料的安全方法
function setStorageData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        return false;
    }
}

// 動畫工具 - 淡入效果
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            element.style.opacity = progress;
            requestAnimationFrame(animate);
        } else {
            element.style.opacity = 1;
        }
    }
    
    requestAnimationFrame(animate);
}

// 動畫工具 - 淡出效果
function fadeOut(element, duration = 300) {
    const start = performance.now();
    const startOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            element.style.opacity = startOpacity * (1 - progress);
            requestAnimationFrame(animate);
        } else {
            element.style.opacity = 0;
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// 滑動效果
function slideIn(element, direction = 'left', duration = 300) {
    const directions = {
        left: { from: '-100%', to: '0%', property: 'translateX' },
        right: { from: '100%', to: '0%', property: 'translateX' },
        up: { from: '-100%', to: '0%', property: 'translateY' },
        down: { from: '100%', to: '0%', property: 'translateY' }
    };
    
    const config = directions[direction];
    element.style.transform = `${config.property}(${config.from})`;
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const currentPos = parseFloat(config.from) * (1 - progress);
            element.style.transform = `${config.property}(${currentPos}%)`;
            requestAnimationFrame(animate);
        } else {
            element.style.transform = `${config.property}(${config.to})`;
        }
    }
    
    requestAnimationFrame(animate);
}

// 彈跳效果
function bounce(element, scale = 1.1, duration = 200) {
    const originalTransform = element.style.transform || 'scale(1)';
    
    element.style.transform = `scale(${scale})`;
    element.style.transition = `transform ${duration}ms ease-out`;
    
    setTimeout(() => {
        element.style.transform = originalTransform;
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }, duration);
}

// 震動效果
function shake(element, intensity = 10, duration = 300) {
    const originalPosition = element.style.position || 'static';
    const originalLeft = element.style.left || '0px';
    
    element.style.position = 'relative';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const offset = Math.sin(progress * Math.PI * 10) * intensity * (1 - progress);
            element.style.left = parseFloat(originalLeft) + offset + 'px';
            requestAnimationFrame(animate);
        } else {
            element.style.position = originalPosition;
            element.style.left = originalLeft;
        }
    }
    
    requestAnimationFrame(animate);
}

// 隨機數生成器
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// 隨機整數生成器
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 陣列隨機排序
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 延遲執行
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 防抖動函式
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 節流函式
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 格式化時間
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 檢查是否為行動裝置
function isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 播放音效 (如果音檔存在)
function playSound(soundName) {
    try {
        const audio = new Audio(`assets/audio/${soundName}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
        console.log('Sound not available:', soundName);
    }
}

// 顯示載入中動畫
function showLoading(container) {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = '載入中...';
    container.appendChild(loader);
    return loader;
}

// 隱藏載入中動畫
function hideLoading(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}


// 淡入淡出
function fadeTo(url, elementId = 'scene-container') {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.style.transition = 'opacity 0.6s ease';
  el.style.opacity = 0;

  el.addEventListener('transitionend', () => {
    window.location.href = url;
  }, { once: true });
}
