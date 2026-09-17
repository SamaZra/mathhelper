# add_favorite.ps1 - БЕЗОПАСНЫЙ скрипт (только добавляет, ничего не удаляет)
$folder = "."
$excludeFiles = @("index.html", "search.html", "favorites.html", "about.html")

$favButtonHtml = '<button class="favorite-btn" id="favoriteBtn" onclick="toggleFavorite()">☆</button>'

$favStyles = @"
    .favorite-btn {
        position: absolute;
        top: 52px;
        left: 60px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--card-bg);
        border: 1px solid var(--border);
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        color: var(--text-secondary);
        transition: all 0.2s;
    }
    .favorite-btn:hover { transform: scale(1.1); }
    .favorite-btn.active { color: #facc15; }
"@

$favScript = @"
<script>
const FAV_KEY = 'math_favorites';
function getFavorites() { const s = localStorage.getItem(FAV_KEY); return s ? JSON.parse(s) : []; }
function saveFavorites(f) { localStorage.setItem(FAV_KEY, JSON.stringify(f)); }
function isFavorite() { const u = window.location.pathname.split('/').pop(); return getFavorites().includes(u); }
function toggleFavorite() {
    const u = window.location.pathname.split('/').pop();
    let f = getFavorites();
    const btn = document.getElementById('favoriteBtn');
    if (f.includes(u)) { f = f.filter(x => x !== u); btn.textContent = '☆'; btn.classList.remove('active'); }
    else { f.push(u); btn.textContent = '★'; btn.classList.add('active'); }
    saveFavorites(f);
}
function updateFavoriteBtn() {
    const btn = document.getElementById('favoriteBtn');
    if (btn) {
        if (isFavorite()) { btn.textContent = '★'; btn.classList.add('active'); }
        else { btn.textContent = '☆'; btn.classList.remove('active'); }
    }
}
updateFavoriteBtn();
</script>
"@

Get-ChildItem -Path $folder -Filter "*.html" | ForEach-Object {
    $file = $_.Name
    if ($excludeFiles -contains $file) {
        Write-Host "Пропущен: $file" -ForegroundColor Yellow
        return
    }
    
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $changed = $false

    # Добавляем стили, если их нет
    if ($content -notmatch "favorite-btn") {
        $content = $content -replace "(</style>)", "$favStyles`n    `$1"
        $changed = $true
        Write-Host "Добавлены стили в: $file" -ForegroundColor Green
    }
    
    # Добавляем кнопку, если её нет
    if ($content -match "theme-toggle" -and $content -notmatch "favoriteBtn") {
        $content = $content -replace '(<button class="theme-toggle")', "$favButtonHtml`n    `$1"
        $changed = $true
        Write-Host "Добавлена кнопка в: $file" -ForegroundColor Green
    }
    
    # Добавляем скрипт, если его нет
    if ($content -notmatch "FAV_KEY") {
        $content = $content -replace "(</body>)", "$favScript`n`$1"
        $changed = $true
        Write-Host "Добавлен скрипт в: $file" -ForegroundColor Green
    }
    
    if ($changed) {
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
    } else {
        Write-Host "Без изменений: $file" -ForegroundColor Gray
    }
}

Write-Host "`nГотово!" -ForegroundColor Cyan