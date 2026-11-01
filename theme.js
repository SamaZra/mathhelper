// ===== Кнопка смены темы =====
(function () {
    'use strict';
    var style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed; top: 12px; right: 12px; width: 44px; height: 44px;
            border-radius: 50%; background: transparent; border: none; cursor: pointer;
            font-size: 26px; display: flex; align-items: center; justify-content: center;
            z-index: 1000; color: var(--text-secondary, #8ba5b8); transition: all 0.2s;
            padding: 0; outline: none; -webkit-tap-highlight-color: transparent; user-select: none;
        }
        .theme-toggle:hover { transform: scale(1.15); background: transparent; }
    `;
    document.head.appendChild(style);

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
        try { return localStorage.getItem('mathTheme') || 'dark'; } catch (e) { return 'dark'; }
    }

    function refreshAllVisuals() {
        try { if (typeof window.__themeRefreshAll === 'function') window.__themeRefreshAll(); } catch (e) {}
        try { if (typeof window.drawAllGraphs === 'function') window.drawAllGraphs(); } catch (e) {}
        try { if (typeof window.drawAllPlots === 'function') window.drawAllPlots(); } catch (e) {}
        try { if (typeof window.drawAllIntervalPlots === 'function') window.drawAllIntervalPlots(); } catch (e) {}
        try { if (typeof window.drawViz === 'function') window.drawViz(); } catch (e) {}
        try { if (typeof window.drawAllIntervalPlots === 'function') window.drawAllIntervalPlots(); } catch (e) {}
        try { if (typeof window.drawChart === 'function') window.drawChart(); } catch (e) {}
        try { if (typeof window.drawAll === 'function') window.drawAll(); } catch (e) {}
        try { if (typeof window.redraw === 'function') window.redraw(); } catch (e) {}
        try { if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise(); } catch (e) {}
    }

    function toggleTheme() {
        var html = document.documentElement;
        var isLight = html.classList.contains('light-mode');
        var newTheme = isLight ? 'dark' : 'light';
        applyTheme(newTheme);
        try { localStorage.setItem('mathTheme', newTheme); } catch (e) {}
        refreshAllVisuals();
        setTimeout(refreshAllVisuals, 60);
    }

    function insertButton() {
        if (document.getElementById('themeBtn')) { applyTheme(getSavedTheme()); return; }
        var btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.id = 'themeBtn';
        btn.setAttribute('aria-label', 'Сменить тему');
        btn.addEventListener('click', toggleTheme);
        document.body.appendChild(btn);
        applyTheme(getSavedTheme());
    }

    applyTheme(getSavedTheme());
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }
    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;
    window.__themeRefreshAll = window.__themeRefreshAll || function () {};
})();

// ===== ГЛОБАЛЬНЫЕ СТИЛИ ДЛЯ ВСЕХ ЭМОДЗИ (ПОВОРОТ И СИНЯЯ ПОДСВЕТКА ПОД ФИЗИКУ) =====
(function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = `
        .submenu-icon, .menu-icon, .group-icon, .section-icon, .toc-icon, .theme-icon {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex; align-items: center; justify-content: center;
            transform-origin: center;
        }
        a:hover .submenu-icon, a:hover .menu-icon, .submenu-item:hover .submenu-icon,
        .menu-item:hover .menu-icon, .group-header:hover .group-icon, .section-title:hover .section-icon,
        .toc-item:hover .toc-icon {
            transform: scale(1.15) rotate(-8deg);
            color: var(--accent) !important;
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        }
        a:hover span[class*="icon"], a:hover div[class*="icon"] {
            color: var(--accent) !important;
        }
    `;
    if (style.styleSheet) { style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); }
    document.head.appendChild(style);
    document.addEventListener('DOMContentLoaded', function() {
        var interactiveElements = document.querySelectorAll('.group-header, .menu-item, .submenu-item, .section-title, a');
        interactiveElements.forEach(function(el) {
            el.style.webkitTapHighlightColor = 'transparent';
            if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        });
    });
})();

// ===== ПЛАВНЫЙ ПЕРЕХОД ТЕМ =====
(function() {
    var style = document.createElement('style');
    style.textContent = `
        body, .card, .menu-card, .content-card, .container, .header, .search-bar, 
        .group-header, .submenu-item, .menu-item, .question, .opts label, .result-block {
            transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
    `;
    document.head.appendChild(style);
})();

// ===== ПОЛОСА ПРОГРЕССА ЧТЕНИЯ =====
(function() {
    if (window.location.pathname.includes('test')) return;
    var bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    bar.style.cssText = `position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #0d9488, #3b82f6); z-index: 9999; transition: width 0.1s ease-out; box-shadow: 0 0 10px rgba(59,130,246,0.5);`;
    document.body.appendChild(bar);
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            bar.style.width = (scrollTop / docHeight) * 100 + '%';
        }
    });
})();

// ===== СТИЛИ ДЛЯ ПОЛОСЫ ТАЙМЕРА В ТЕСТАХ =====
(function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        .fixed-timer .bar-fill, .timer-bar-fill, .time-bar-fill {
            background: #3b82f6 !important;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.6) !important;
            border-radius: 10px;
            transition: width 0.3s ease !important;
        }
        .fixed-timer .bar-fill.danger, .timer-bar-fill.danger, .time-bar-fill.danger {
            background: #ef4444 !important;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.6) !important;
        }
    `;
    document.head.appendChild(style);
})();

