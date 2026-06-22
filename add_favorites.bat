@echo off
setlocal enabledelayedexpansion

echo Добавление кнопки "Избранное" во все HTML-файлы...
echo.

for /r "C:\Users\vkvmkv\AndroidStudioProjects\Mathhelper\app\src\main\assets" %%f in (*.html) do (
    echo Обработка: %%~nf
    set "FILE=%%f"
    set "HAS_BTN=false"
    findstr /c:"favoriteBtn" "%%f" >nul && set HAS_BTN=true
    if "!HAS_BTN!"=="false" (
        echo Добавляем кнопку в %%~nf
        :: Создаём временный файл
        (
            for /f "tokens=*" %%a in ('type "%%f"') do (
                echo %%a
                if "%%a"=="<body>" (
                    echo     ^<button id="favoriteBtn" style="position: fixed; top: 20px; left: 20px; background: none; border: none; font-size: 28px; cursor: pointer; z-index: 1000; color: #f1c40f;"^>☆^</button^>
                )
            )
        ) > "%%f.tmp"
        move /y "%%f.tmp" "%%f" >nul
    ) else (
        echo Пропускаем %%~nf (уже есть кнопка)
    )
)

echo.
echo Готово! Кнопки добавлены во все HTML-файлы.
pause