/* ==== Избранное для математического справочника ==== */
(function () {
    'use strict';

    var FAV_KEY = 'math_favorites'; // Ключ для математики

    function getFavorites() {
        try {
            var raw = localStorage.getItem(FAV_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function saveFavorites(arr) {
        try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch (e) {}
    }
    function isFavorite(url) { return getFavorites().indexOf(url) !== -1; }
    function addFavorite(url) {
        var fav = getFavorites();
        if (fav.indexOf(url) === -1) { fav.push(url); saveFavorites(fav); }
    }
    function removeFavorite(url) {
        saveFavorites(getFavorites().filter(function (u) { return u !== url; }));
    }
    function toggleFavorite(url) {
        if (isFavorite(url)) removeFavorite(url); else addFavorite(url);
        updateAllStars();
        return isFavorite(url);
    }

    function getPageInfo(url) {
        var data = window.MATH_DATA || [];
        var decoded = decodeURIComponent(url);
        var found = data.find(function (p) { return p.url === url || p.url === decoded; });
        if (found) return found;
        
        // Если страницы нет в базе, пытаемся сделать из имени файла красивый заголовок
        var name = decoded.replace('.html', '').replace(/-/g, ' ');
        // Делаем первую букву заглавной
        name = name.charAt(0).toUpperCase() + name.slice(1);
        
        return { title: name, category: 'Страница', desc: '' };
    }

    function renderFavoritesPage() {
        var list = document.getElementById('favoritesList');
        var count = document.getElementById('favCount');
        if (!list || !count) return;

        var fav = getFavorites();
        count.textContent = fav.length;

        var searchInput = document.getElementById('favSearchInput');
        var query = (searchInput && searchInput.value || '').trim().toLowerCase();
        var clearBtn = document.getElementById('favSearchClear');
        if (clearBtn) clearBtn.classList.toggle('show', query.length > 0);

        if (fav.length === 0) {
            list.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-icon">⭐</div>' +
                    '<p>У вас пока нет избранных страниц</p>' +
                    '<p class="hint">Нажмите на звёздочку ☆ в левом нижнем углу любой страницы справочника</p>' +
                '</div>';
            return;
        }

        var items = fav.map(function (url) {
            var info = getPageInfo(url);
            return {
                url: url,
                title: info.title || url,
                category: info.category || 'Страница',
                desc: info.desc || ''
            };
        });

        if (query) {
            items = items.filter(function (it) {
                return it.title.toLowerCase().indexOf(query) !== -1 ||
                       it.category.toLowerCase().indexOf(query) !== -1 ||
                       it.desc.toLowerCase().indexOf(query) !== -1;
            });
        }

        if (items.length === 0) {
            list.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-icon">🔍</div>' +
                    '<p>По запросу «' + query.replace(/</g, '&lt;') + '» ничего не найдено</p>' +
                '</div>';
            return;
        }

        // Группировка по категории
        var groups = {};
        items.forEach(function (it) {
            var root = (it.category || '').split('→')[0].trim() || 'Другие';
            if (!groups[root]) groups[root] = [];
            groups[root].push(it);
        });

        var sortedKeys = Object.keys(groups).sort(function (a, b) {
            return a.localeCompare(b, 'ru');
        });

        var html = '';
        sortedKeys.forEach(function (key) {
            var groupItems = groups[key];
            groupItems.sort(function (a, b) {
                return a.title.localeCompare(b.title, 'ru');
            });

            html += '<div class="fav-group">';
            html += '<div class="fav-group-title">' +
                        '<span class="dot"></span>' +
                        '<span>' + escapeHtml(key) + '</span>' +
                        '<span class="badge">' + groupItems.length + '</span>' +
                    '</div>';

            groupItems.forEach(function (it) {
                var safe = it.url.replace(/'/g, "\\'");
                html +=
                    '<div class="favorite-item ripple-host" onclick="window.location.href=\'' + it.url + '\'">' +
                        '<div class="favorite-content">' +
                            '<div class="favorite-title">' + escapeHtml(it.title) + '</div>' +
                            '<div class="favorite-desc">' + escapeHtml(it.desc || '') + '</div>' +
                        '</div>' +
                        '<button class="remove-fav" title="Удалить" onclick="event.stopPropagation(); window.__favRemove(\'' + safe + '\')">✖</button>' +
                    '</div>';
            });
            html += '</div>';
        });
        list.innerHTML = html;
        if (window.__bindRipple) window.__bindRipple();
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function currentPageUrl() {
        var path = location.pathname.split('/').pop() || 'index.html';
        return decodeURIComponent(path);
    }

    // Звезда в левом нижнем углу
    function createStarButton() {
        if (document.getElementById('favToggleBtn')) return;
        if (currentPageUrl() === 'favorites.html') return;

        var btn = document.createElement('button');
        btn.id = 'favToggleBtn';
        btn.type = 'button';
        btn.title = 'В избранное';
        btn.style.cssText = 'position:fixed;left:16px;bottom:20px;width:48px;height:48px;border-radius:0;border:none;background:transparent;box-shadow:none;cursor:pointer;font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:950;padding:0;transition:transform 0.18s, color 0.2s, text-shadow 0.2s;color:var(--text-secondary, #8ba5b8);-webkit-tap-highlight-color:transparent;';

        btn.addEventListener('click', function () {
            toggleFavorite(currentPageUrl());
            btn.style.transform = 'scale(1.2)';
            setTimeout(function () { btn.style.transform = 'scale(1)'; }, 160);
        });
        document.body.appendChild(btn);
        updateAllStars();
    }

    function updateAllStars() {
        var btn = document.getElementById('favToggleBtn');
        if (btn) {
            var on = isFavorite(currentPageUrl());
            if (on) {
                btn.textContent = '★';
                btn.style.color = '#facc15'; // Желтая
                btn.style.textShadow = '0 0 8px rgba(250,204,21,0.7)';
            } else {
                btn.textContent = '☆';
                btn.style.color = 'var(--text-secondary, #8ba5b8)';
                btn.style.textShadow = 'none';
            }
        }
    }

    function watchTheme() {
        new MutationObserver(function () {
            if (document.getElementById('favToggleBtn')) updateAllStars();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    window.__favRemove = function (url) { removeFavorite(url); renderFavoritesPage(); };
    window.clearAllFavorites = function () {
        if (confirm('Удалить все страницы из избранного?')) {
            saveFavorites([]);
            renderFavoritesPage();
        }
    };

    function bindRipple() {
        document.querySelectorAll('.favorite-item, .back-link, .bottom-nav a, .bottom-nav button').forEach(function(el){
            if (el.dataset.rippleBound) return;
            el.dataset.rippleBound = '1';
            el.classList.add('ripple-host');
            el.addEventListener('pointerdown', function(e){
                var rect = el.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var r = document.createElement('span');
                r.className = 'ripple';
                r.style.width = r.style.height = size + 'px';
                r.style.left = (e.clientX - rect.left - size/2) + 'px';
                r.style.top  = (e.clientY - rect.top  - size/2) + 'px';
                el.appendChild(r);
                setTimeout(function(){ r.remove(); }, 650);
            });
        });
    }
    window.__bindRipple = bindRipple;

    function init() {
        var input = document.getElementById('favSearchInput');
        var clearBtn = document.getElementById('favSearchClear');
        if (input) {
            var t = null;
            input.addEventListener('input', function () {
                clearTimeout(t);
                t = setTimeout(renderFavoritesPage, 180);
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (input) input.value = '';
                renderFavoritesPage();
                if (input) input.focus();
            });
        }
        renderFavoritesPage();
        createStarButton();
        watchTheme();
        bindRipple();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

