// js/favorites.js
// Общие функции для работы с избранным

// Ключ для localStorage
const FAVORITES_KEY = 'math_favorites';

// Получить список избранного
function getFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch(e) {
            return [];
        }
    }
    return [];
}

// Добавить страницу в избранное
function addToFavorites(url) {
    let favorites = getFavorites();
    if (!favorites.includes(url)) {
        favorites.push(url);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
    return false;
}

// Удалить страницу из избранного
function removeFromFavorites(url) {
    let favorites = getFavorites();
    const index = favorites.indexOf(url);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
    return false;
}

// Проверить, находится ли страница в избранном
function isFavorite(url) {
    return getFavorites().includes(url);
}

// Переключить избранное (добавить/удалить)
function toggleFavorite(url) {
    if (isFavorite(url)) {
        removeFromFavorites(url);
        return false;
    } else {
        addToFavorites(url);
        return true;
    }
}

// Обновить внешний вид кнопки избранного на текущей странице
function updateFavoriteButton() {
    const currentUrl = window.location.pathname.split('/').pop();
    const isFav = isFavorite(currentUrl);
    const favBtn = document.getElementById('favoriteBtn');
    if (favBtn) {
        favBtn.textContent = isFav ? '★' : '☆';
        favBtn.title = isFav ? 'Удалить из избранного' : 'Добавить в избранное';
        favBtn.style.color = isFav ? '#facc15' : 'var(--text-secondary)';
    }
}

// Инициализация кнопки избранного на странице
function initFavoriteButton() {
    // Создаём кнопку, если её нет
    if (!document.getElementById('favoriteBtn')) {
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            const favBtn = document.createElement('button');
            favBtn.id = 'favoriteBtn';
            favBtn.className = 'favorite-toggle';
            favBtn.style.position = 'absolute';
            favBtn.style.top = '12px';
            favBtn.style.left = '60px';
            favBtn.style.width = '36px';
            favBtn.style.height = '36px';
            favBtn.style.borderRadius = '50%';
            favBtn.style.background = 'var(--card-bg)';
            favBtn.style.border = '1px solid var(--border)';
            favBtn.style.cursor = 'pointer';
            favBtn.style.fontSize = '20px';
            favBtn.style.display = 'flex';
            favBtn.style.alignItems = 'center';
            favBtn.style.justifyContent = 'center';
            favBtn.style.zIndex = '100';
            favBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
            favBtn.style.transition = 'all 0.2s';
            favBtn.onclick = () => {
                const currentUrl = window.location.pathname.split('/').pop();
                toggleFavorite(currentUrl);
                updateFavoriteButton();
            };
            themeBtn.parentElement.style.position = 'relative';
            themeBtn.parentElement.appendChild(favBtn);
        }
    }
    updateFavoriteButton();
}

// Запускаем инициализацию после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavoriteButton);
} else {
    initFavoriteButton();
}