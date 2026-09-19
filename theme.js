// ===== Кнопка смены темы =====
// Работает и в браузере, и в Android WebView.
// Тема хранится в localStorage под ключом 'mathTheme'.
// Если на странице определён window.__themeRefreshAll — вызывается после переключения
// (нужно для 3D-моделей и графиков, которые не подхватывают CSS автоматически).

(function () {
    'use strict';

    // ===== 1. Стиль кнопки =====
    var style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed;
            top: 12px;
            right: 12px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: var(--text-secondary, #8ba5b8);
            transition: all 0.2s;
            padding: 0;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        }
        .theme-toggle:hover {
            transform: scale(1.15);
            background: transparent;
        }
    `;
    document.head.appendChild(style);

    // ===== 2. Применение темы =====
    function applyTheme(theme) {
        var html = document.documentElement;
        var btn = document.getElementById('themeBtn');

        if (theme === 'light') {
            html.classList.add('light-mode');
            if (btn) btn.textContent = '☀️';
        } else {
            html.classList.remove('light-mode');
            if (btn) btn.textContent = '🌙';
        }
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem('mathTheme') || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function toggleTheme() {
        var html = document.documentElement;
        var isLight = html.classList.contains('light-mode');
        var newTheme = isLight ? 'dark' : 'light';

        applyTheme(newTheme);

        try {
            localStorage.setItem('mathTheme', newTheme);
        } catch (e) {}

        // Перерисовка 3D-моделей и графиков, если функция есть на странице
        if (typeof window.__themeRefreshAll === 'function') {
            try { window.__themeRefreshAll(); } catch (e) {}
        }
    }

    // ===== 3. Вставка кнопки =====
    function insertButton() {
        if (document.getElementById('themeBtn')) return;

        var btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.id = 'themeBtn';
        btn.setAttribute('aria-label', 'Сменить тему');
        btn.addEventListener('click', toggleTheme);
        document.body.appendChild(btn);

        applyTheme(getSavedTheme());
    }

    // Применяем тему СРАЗУ (чтобы не было "мигания")
    applyTheme(getSavedTheme());

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }

    // Экспортируем функции
    window.toggleTheme = toggleTheme;
})();