// ===== Кнопка "Избранное" =====
// Работает и в браузере, и в Android WebView.
// Избранное хранится в localStorage под ключом 'math_favorites'.

(function () {
    'use strict';

    // ===== 1. Стиль кнопки =====
    var style = document.createElement('style');
    style.textContent = `
        .favorite-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 32px;
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
        .favorite-btn:hover {
            transform: scale(1.15);
        }
        .favorite-btn.active {
            color: #facc15;
        }
    `;
    document.head.appendChild(style);

    // ===== 2. Логика избранного =====
    var FAV_KEY = 'math_favorites';

    function getFavorites() {
        try {
            var s = localStorage.getItem(FAV_KEY);
            return s ? JSON.parse(s) : [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(f) {
        try {
            localStorage.setItem(FAV_KEY, JSON.stringify(f));
        } catch (e) {}
    }

    function currentPage() {
        var parts = window.location.pathname.split('/');
        return parts[parts.length - 1] || 'index.html';
    }

    function isFavorite() {
        return getFavorites().indexOf(currentPage()) !== -1;
    }

    function toggleFavorite() {
        var page = currentPage();
        var f = getFavorites();
        var idx = f.indexOf(page);
        if (idx !== -1) {
            f.splice(idx, 1);
        } else {
            f.push(page);
        }
        saveFavorites(f);
        updateButton();
    }

    function updateButton() {
        var btn = document.getElementById('favoriteBtn');
        if (!btn) return;
        if (isFavorite()) {
            btn.textContent = '★';
            btn.classList.add('active');
        } else {
            btn.textContent = '☆';
            btn.classList.remove('active');
        }
    }

    // ===== 3. Вставка кнопки =====
    function insertButton() {
        if (document.getElementById('favoriteBtn')) return; // уже есть
        var btn = document.createElement('button');
        btn.className = 'favorite-btn';
        btn.id = 'favoriteBtn';
        btn.textContent = '☆';
        btn.setAttribute('aria-label', 'Добавить в избранное');
        btn.addEventListener('click', toggleFavorite);
        document.body.appendChild(btn);
        updateButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }

    // Экспортируем функции наружу (на случай, если где-то в HTML есть старые вызовы)
    window.toggleFavorite = toggleFavorite;
    window.updateFavoriteBtn = updateButton;
})();