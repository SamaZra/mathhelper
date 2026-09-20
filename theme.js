// ===== Кнопка смены темы =====
// Работает и в браузере, и в Android WebView.
// Тема хранится в localStorage под ключом 'mathTheme'.
// После переключения вызываются функции перерисовки, если они есть на странице.

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

    // ===== 3. Перерисовка всех возможных визуализаций =====
    function refreshAllVisuals() {
        // 3D-модели (Three.js) — если файл определяет эти функции
        try { if (typeof window.__themeRefreshAll === 'function') window.__themeRefreshAll(); } catch (e) {}

        // 2D canvas-графики — разные файлы называют по-разному
        try { if (typeof window.drawAllGraphs === 'function') window.drawAllGraphs(); } catch (e) {}
        try { if (typeof window.drawAllPlots === 'function') window.drawAllPlots(); } catch (e) {}
        try { if (typeof window.drawAllIntervalPlots === 'function') window.drawAllIntervalPlots(); } catch (e) {}
        try { if (typeof window.drawViz === 'function') window.drawViz(); } catch (e) {}
        try { if (typeof window.drawAllIntervalPlots === 'function') window.drawAllIntervalPlots(); } catch (e) {}
        try { if (typeof window.drawChart === 'function') window.drawChart(); } catch (e) {}
        try { if (typeof window.drawAll === 'function') window.drawAll(); } catch (e) {}
        try { if (typeof window.redraw === 'function') window.redraw(); } catch (e) {}

        // MathJax — перерисовать формулы (цвета из CSS)
        try {
            if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
        } catch (e) {}
    }

    // ===== 4. Переключение темы =====
    function toggleTheme() {
        var html = document.documentElement;
        var isLight = html.classList.contains('light-mode');
        var newTheme = isLight ? 'dark' : 'light';

        applyTheme(newTheme);

        try {
            localStorage.setItem('mathTheme', newTheme);
        } catch (e) {}

        // Перерисовываем всё, что может зависеть от темы
        refreshAllVisuals();

        // Небольшая задержка — на случай, если CSS ещё применяется,
        // и функция перерисовки должна увидеть уже новый фон
        setTimeout(refreshAllVisuals, 60);
    }

    // ===== 5. Вставка кнопки =====
    function insertButton() {
        // Если кнопка уже есть — не дублируем, но обновим её состояние
        if (document.getElementById('themeBtn')) {
            applyTheme(getSavedTheme());
            return;
        }

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
    window.applyTheme = applyTheme;

    // Публичный API для страниц: они могут попросить перерисовать
    // (например, при программной смене темы)
    window.__themeRefreshAll = window.__themeRefreshAll || function () {};
})();