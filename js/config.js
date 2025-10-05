// config.js - 遊戲設定常數
const GAME_CONFIG = {
    // 遊戲版本
    VERSION: '1.0.0',
    
    // 徽章系統
    BADGES: {
        MEMORY_MASTER: {
            id: 'classroom',
            name: '記憶大師',
            emoji: '🧠',
            description: '完成翻牌記憶遊戲'
        },
        GREEN_THUMB: {
            id: 'garden',
            name: '綠手指',
            emoji: '🌱',
            description: '成功種植紀念樹'
        },
        EDISON: {
            id: 'lab',
            name: '小愛迪生',
            emoji: '⚡',
            description: '解決電路謎題'
        },
        EXPLORER: {
            id: 'extras',
            name: '探索者',
            emoji: '🗺️',
            description: '發現隱藏彩蛋'
        },
        MESSAGE_WRITER: {
            id: 'hall',
            name: '留言家',
            emoji: '✍️',
            description: '在留言板留下祝福'
        }
    },

    // 主題色彩
    COLORS: {
        PRIMARY: '#1565c0',
        SECONDARY: '#42a5f5',
        SUCCESS: '#4caf50',
        WARNING: '#ff9800',
        ERROR: '#f44336',
        INFO: '#2196f3',
        LIGHT: '#f5f5f5',
        DARK: '#424242',
        
        // 學校主題色
        SCHOOL_BLUE: '#0d47a1',
        SCHOOL_LIGHT_BLUE: '#e3f2fd',
        SCHOOL_GOLD: '#ffc107',
        SCHOOL_GREEN: '#2e7d32'
    },

    // 遊戲設定
    GAMES: {
        CLASSROOM: {
            CARDS_COUNT: 16,
            MAX_TIME: 300, // 5分鐘
            PERFECT_SCORE: 100,
            TIME_BONUS: 2
        },
        GARDEN: {
            MAX_GROWTH: 100,
            WATER_GROWTH: 15,
            SUNLIGHT_GROWTH: 10,
            FERTILIZE_GROWTH: 20,
            COOLDOWN_TIME: 5000 // 5秒
        },
        LAB: {
            GRID_SIZE: 4,
            MAX_HINTS: 3,
            COMPONENTS: ['empty', 'wire', 'corner', 'battery', 'bulb', 'switch']
        }
    },

    // 動畫設定
    ANIMATIONS: {
        FADE_DURATION: 300,
        SLIDE_DURATION: 400,
        BOUNCE_SCALE: 1.1,
        BOUNCE_DURATION: 200,
        SHAKE_INTENSITY: 10,
        SHAKE_DURATION: 300
    },

    // 音效設定
    AUDIO: {
        ENABLED: true,
        VOLUME: 0.5,
        SOUNDS: {
            CLICK: 'click',
            SUCCESS: 'complete',
            WIND: 'wind',
            BGM: 'bgm'
        }
    },

    // 儲存設定
    STORAGE_KEYS: {
        USER_NAME: 'userName',
        COMPLETED_GAMES: 'completedGames',
        TREE_GROWTH: 'treeGrowth',
        LAST_WATERED: 'lastWatered',
        LAST_SUNLIGHT: 'lastSunlight',
        LAST_FERTILIZED: 'lastFertilized',
        LOCAL_MESSAGES: 'localMessages',
        GAME_SETTINGS: 'gameSettings'
    },

    // 地圖位置設定
    MAP_LOCATIONS: [
        {
            id: 'classroom',
            name: '教室',
            x: 20,
            y: 30,
            url: 'games/classroom.html',
            required: true
        },
        {
            id: 'garden',
            name: '花園',
            x: 60,
            y: 50,
            url: 'games/garden.html',
            required: true
        },
        {
            id: 'lab',
            name: '實驗室',
            x: 80,
            y: 20,
            url: 'games/lab.html',
            required: true
        },
        {
            id: 'principal',
            name: '校長室',
            x: 50,
            y: 80,
            url: 'principal.html',
            required: false
        },
        {
            id: 'hall',
            name: '穿堂',
            x: 40,
            y: 60,
            url: 'hall.html',
            required: false
        },
        {
            id: 'extras',
            name: '彩蛋區',
            x: 10,
            y: 70,
            url: 'games/extras.html',
            required: false,
            hidden: true
        }
    ],

    // 成就解鎖條件
    ACHIEVEMENTS: {
        COMPLETIONIST: {
            name: '完美主義者',
            description: '完成所有必修關卡',
            condition: 'complete_all_required'
        },
        SPEEDSTER: {
            name: '閃電俠',
            description: '在60秒內完成翻牌遊戲',
            condition: 'classroom_time_under_60'
        },
        GARDENER: {
            name: '園藝師',
            description: '在5分鐘內種出完整的樹',
            condition: 'garden_fast_growth'
        },
        GENIUS: {
            name: '天才',
            description: '不使用提示完成電路謎題',
            condition: 'lab_no_hints'
        }
    },

    // API 設定
    API: {
        GOOGLE_SHEET_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
        TIMEOUT: 10000, // 10秒
        RETRY_COUNT: 3
    },

    // 響應式設計斷點
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1200
    },

    // 開發模式設定
    DEBUG: {
        ENABLED: false, // 生產環境請設為 false
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_GRID: false,
        SKIP_INTRO: false
    }
};

// 工具函式 - 取得設定值
function getConfig(path) {
    const keys = path.split('.');
    let value = GAME_CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// 工具函式 - 檢查除錯模式
function isDebugMode() {
    return getConfig('DEBUG.ENABLED') === true;
}

// 工具函式 - 除錯日誌
function debugLog(message, level = 'info') {
    if (!isDebugMode()) return;
    
    const logLevel = getConfig('DEBUG.LOG_LEVEL') || 'info';
    const levels = ['debug', 'info', 'warn', 'error'];
    
    if (levels.indexOf(level) >= levels.indexOf(logLevel)) {
        console[level](`[YMSH-5th] ${message}`);
    }
}

// 匯出設定 (如果使用模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}