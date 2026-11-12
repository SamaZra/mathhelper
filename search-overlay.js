/* ==== Модальный поиск по всему математическому справочнику ==== */
(function () {
    'use strict';

    // ---------- Стили ----------
    var css = `
    .so-backdrop {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: none; align-items: flex-start; justify-content: center;
        padding: 60px 16px 16px;
        opacity: 0; transition: opacity 0.25s ease;
    }
    .so-backdrop.show { display: flex; opacity: 1; }
    .so-card {
        width: 100%; max-width: 640px; max-height: 80vh;
        background: var(--menu-card-bg, #1e3545);
        border: 1px solid var(--border, rgba(26,188,156,0.15));
        border-radius: 24px;
        box-shadow: 0 24px 60px -12px rgba(0,0,0,0.55);
        display: flex; flex-direction: column; overflow: hidden;
        transform: translateY(-12px) scale(0.98);
        transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .so-backdrop.show .so-card { transform: translateY(0) scale(1); }
    .so-head {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 16px; border-bottom: 1px solid var(--border, rgba(26,188,156,0.15));
    }
    .so-input {
        flex: 1; background: transparent; border: none; outline: none;
        font-size: 1rem; color: var(--text, #fff); padding: 8px 0;
    }
    .so-input::placeholder { color: var(--text-secondary, #8ba5b8); }
    .so-close {
        background: none; border: none; cursor: pointer;
        font-size: 20px; color: var(--text-secondary, #8ba5b8);
        padding: 6px 10px; border-radius: 12px; transition: all 0.2s;
    }
    .so-close:hover { color: var(--accent, #1abc9c); background: rgba(26,188,156,0.12); }
    .so-results { overflow-y: auto; padding: 8px; scrollbar-width: none; -ms-overflow-style: none; }
    .so-results::-webkit-scrollbar { width: 0; height: 0; }
    .so-item {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 14px; border-radius: 14px;
        text-decoration: none; color: var(--text, #fff);
        transition: background 0.2s, transform 0.2s;
    }
    .so-item:hover { background: var(--menu-item-hover, rgba(255,255,255,0.06)); transform: translateX(3px); }
    .so-title { font-size: 0.95rem; font-weight: 700; }
    .so-cat {
        display: inline-block; margin-top: 4px; padding: 2px 10px;
        border-radius: 999px; font-size: 0.65rem; font-weight: 700;
        color: #fff; background: var(--accent, #1abc9c);
    }
    .so-desc { font-size: 0.72rem; color: var(--text-secondary, #8ba5b8); margin-top: 2px; }
    .so-empty { padding: 28px; text-align: center; color: var(--text-secondary, #8ba5b8); }
    .so-mark { background: transparent; color: inherit; border: 1.5px solid var(--accent, #1abc9c); border-radius: 6px; padding: 0 4px; }
    
    /* ==== СВЕТЛАЯ ТЕМА ==== */
    :root.light-mode .so-card {
        background: var(--menu-card-bg, #ffffff);
        border-color: #d0d8e0;
    }
    :root.light-mode .so-input {
        color: #1a2a3f;
    }
    :root.light-mode .so-input::placeholder {
        color: #5a7a94;
    }
    :root.light-mode .so-close {
        color: #5a7a94;
    }
    :root.light-mode .so-item {
        color: #1a2a3f;
    }
    :root.light-mode .so-item:hover {
        background: #f0f4fa;
    }
    `;
    var style = document.createElement('style');
    style.id = 'search-overlay-style';
    style.textContent = css;
    document.head.appendChild(style);

    // ---------- Разметка ----------
    var backdrop = document.createElement('div');
    backdrop.className = 'so-backdrop';
    backdrop.innerHTML = `
        <div class="so-card" role="dialog" aria-modal="true" aria-label="Поиск по справочнику">
            <div class="so-head">
                <span style="font-size:20px;color:var(--text-secondary,#8ba5b8);">⌕</span>
                <input type="text" class="so-input" id="soInput" placeholder="Поиск по всему справочнику..." autocomplete="off">
                <button class="so-close" id="soClose" aria-label="Закрыть">✖</button>
            </div>
            <div class="so-results" id="soResults"></div>
        </div>`;
    document.body.appendChild(backdrop);

    var input = backdrop.querySelector('#soInput');
    var results = backdrop.querySelector('#soResults');
    var closeBtn = backdrop.querySelector('#soClose');
    var debounceTimer = null;

    function highlight(text, q) {
        if (!q) return text;
        var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return text.replace(re, '<mark class="so-mark">$1</mark>');
    }

    function search(q) {
        // Используем MATH_DATA для математики
        var data = window.MATH_DATA || [];
        q = q.toLowerCase().trim();
        if (!q) {
            results.innerHTML = '<div class="so-empty">Начните вводить запрос…</div>';
            return;
        }
        var found = data.filter(function (p) {
            return (p.title && p.title.toLowerCase().indexOf(q) !== -1) ||
                   (p.category && p.category.toLowerCase().indexOf(q) !== -1) ||
                   (p.desc && p.desc.toLowerCase().indexOf(q) !== -1) ||
                   (p.keywords && p.keywords.some(function (k) { return k.toLowerCase().indexOf(q) !== -1; }));
        });
        if (found.length === 0) {
            results.innerHTML = '<div class="so-empty">😕 Ничего не найдено</div>';
            return;
        }
        results.innerHTML = found.map(function (p) {
            return '<a href="' + p.url + '" class="so-item">' +
                '<div style="flex:1;">' +
                    '<div class="so-title">' + highlight(p.title, q) + '</div>' +
                    '<span class="so-cat">' + p.category + '</span>' +
                    '<div class="so-desc">' + (p.desc || '') + '</div>' +
                '</div>' +
                '<div style="color:var(--text-secondary,#8ba5b8);font-size:18px;">›</div>' +
                '</a>';
        }).join('');
    }

    function openOverlay() {
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(function () { input.focus(); }, 50);
    }
    function closeOverlay() {
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () { search(input.value); }, 150);
    });
    closeBtn.addEventListener('click', closeOverlay);
    backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeOverlay();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && backdrop.classList.contains('show')) closeOverlay();
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault(); openOverlay();
        }
    });

    window.openSearchOverlay = openOverlay;
})();
