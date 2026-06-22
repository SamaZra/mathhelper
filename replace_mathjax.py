import os
import re

# Папка, где лежат ваши HTML-файлы (текущая папка)
folder_path = os.path.dirname(os.path.abspath(__file__))

# Какие замены сделать
replacements = [
    # Старые ссылки на MathJax (CDN) -> локальная
    (r'https://cdn\.jsdelivr\.net/npm/mathjax@[0-9\.]+/es5/tex-chtml\.js', 'file:///android_asset/es5/tex-chtml.js'),
    (r'https://cdn\.jsdelivr\.net/npm/mathjax@[0-9\.]+/es5/tex-svg\.js', 'file:///android_asset/es5/tex-chtml.js'),
    (r'https://cdn\.jsdelivr\.net/npm/mathjax@[0-9\.]+/es5/tex-chtml\.js\?config=TeX-AMS_HTML', 'file:///android_asset/es5/tex-chtml.js'),
    (r'https://cdnjs\.cloudflare\.com/ajax/libs/mathjax/[0-9\.]+/es5/tex-chtml\.js', 'file:///android_asset/es5/tex-chtml.js'),
    (r'https://cdnjs\.cloudflare\.com/ajax/libs/mathjax/[0-9\.]+/MathJax\.js', 'file:///android_asset/es5/tex-chtml.js'),
]

# Проходим по всем файлам в папке
for filename in os.listdir(folder_path):
    if filename.endswith('.html') or filename.endswith('.htm'):
        file_path = os.path.join(folder_path, filename)

        # Читаем файл
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        original_content = content

        # Делаем все замены
        for old, new in replacements:
            content = re.sub(old, new, content)

        # Если файл изменился — сохраняем
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Исправлен: {filename}")
        else:
            print(f"⏭️ Без изменений: {filename}")

print("\n🎉 Готово! Все ссылки на MathJax заменены на локальные.")