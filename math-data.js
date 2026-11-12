// Полная база данных математического справочника для поиска и избранного
window.MATH_DATA = [
    // Стереометрия
    { url: "01-basic.html", title: "Основные понятия стереометрии", category: "Стереометрия", desc: "Аксиомы, следствия", keywords: ["аксиомы", "стереометрия"] },
    { url: "02-lines.html", title: "Параллельные, пересекающиеся, скрещивающиеся", category: "Стереометрия", desc: "Классификация прямых", keywords: ["прямые", "параллельные"] },
    { url: "03-positions.html", title: "Расположение прямых и плоскостей", category: "Стереометрия", desc: "Все случаи расположения", keywords: ["прямые", "плоскости"] },
    { url: "04-parallel-line-plane.html", title: "Параллельность прямых, прямой и плоскости", category: "Стереометрия", desc: "Признаки параллельности", keywords: ["параллельность"] },
    { url: "05-parallel-planes.html", title: "Параллельность плоскостей", category: "Стереометрия", desc: "Признак и свойства", keywords: ["плоскости"] },
    { url: "06-perpendicular-line-plane.html", title: "Перпендикулярность прямой и плоскости", category: "Стереометрия", desc: "Определение и свойства", keywords: ["перпендикулярность"] },
    { url: "07-perpendicular-lines.html", title: "Перпендикулярные прямые в пространстве", category: "Стереометрия", desc: "Лемма и теоремы", keywords: ["прямые"] },
    { url: "08-sign-perpendicular.html", title: "Признак перпендикулярности", category: "Стереометрия", desc: "Теорема и следствия", keywords: ["перпендикулярность"] },
    { url: "09-three-perpendiculars.html", title: "Теорема о трёх перпендикулярах", category: "Стереометрия", desc: "Прямая и обратная теоремы", keywords: ["перпендикуляры"] },
    { url: "10-dihedral-angle.html", title: "Двугранный угол", category: "Стереометрия", desc: "Линейный угол", keywords: ["угол"] },
    { url: "11-perpendicular-planes.html", title: "Перпендикулярность плоскостей", category: "Стереометрия", desc: "Признак и свойства", keywords: ["плоскости"] },

    // Векторы
    { url: "vectors.html", title: "Векторы в пространстве", category: "Векторы", desc: "Полный справочник", keywords: ["векторы", "координаты"] },
    { url: "block1.html", title: "Вектор и действия над векторами", category: "Векторы", desc: "Сложение, вычитание, умножение", keywords: ["векторы", "сложение"] },
    { url: "block2.html", title: "Декартовы координаты в пространстве", category: "Векторы", desc: "Система координат", keywords: ["координаты"] },
    { url: "block3.html", title: "Простейшие задачи в координатах", category: "Векторы", desc: "Середина, расстояние", keywords: ["задачи", "координаты"] },
    { url: "block4.html", title: "Скалярное произведение векторов", category: "Векторы", desc: "Угол между векторами", keywords: ["скалярное произведение"] },

    // Тела вращения
    { url: "cone.html", title: "Конус", category: "Тела вращения", desc: "Объём и площадь", keywords: ["конус", "объём"] },
    { url: "cylinder.html", title: "Цилиндр", category: "Тела вращения", desc: "Объём и площадь", keywords: ["цилиндр", "объём"] },
    { url: "truncated-cone.html", title: "Усечённый конус", category: "Тела вращения", desc: "Объём и площадь", keywords: ["конус"] },
    { url: "sphere.html", title: "Сфера и шар", category: "Тела вращения", desc: "Объём и площадь", keywords: ["сфера", "шар"] },

    // Многогранники
    { url: "cuboid.html", title: "Прямоугольный параллелепипед", category: "Многогранники", desc: "Объём, диагональ", keywords: ["параллелепипед"] },
    { url: "prism.html", title: "Пятиугольная призма", category: "Многогранники", desc: "Объём, площадь", keywords: ["призма"] },
    { url: "pyramid.html", title: "Правильная четырёхугольная пирамида", category: "Многогранники", desc: "Объём, апофема", keywords: ["пирамида"] },
    { url: "truncated-pyramid.html", title: "Усечённая пирамида", category: "Многогранники", desc: "Объём", keywords: ["пирамида"] },
    { url: "platonic.html", title: "Правильные многогранники", category: "Многогранники", desc: "Платоновы тела", keywords: ["многогранники"] },

    // Алгебра
    { url: "formulas.html", title: "Формулы сокращённого умножения", category: "Алгебра", desc: "ФСУ, дискриминант", keywords: ["формулы", "ФСУ"] },
    { url: "powers.html", title: "Степени и корни", category: "Алгебра", desc: "Свойства", keywords: ["степени", "корни"] },
    { url: "powers-menu.html", title: "Степени, корни и степенная функция", category: "Алгебра", desc: "Навигация", keywords: ["степени"] },
    { url: "степенная-функция.html", title: "Степенная функция y = xᵖ", category: "Алгебра", desc: "Свойства, графики", keywords: ["функция", "график"] },
    { url: "logarithms.html", title: "Логарифмы", category: "Алгебра", desc: "Определение, свойства", keywords: ["логарифмы"] },
    { url: "logarithms-menu.html", title: "Логарифмы и логарифмическая функция", category: "Алгебра", desc: "Навигация", keywords: ["логарифмы"] },
    { url: "логарифмическая-функция.html", title: "Логарифмическая функция y = logₐ x", category: "Алгебра", desc: "Свойства, графики", keywords: ["логарифмы"] },
    { url: "exponential-menu.html", title: "Показательная функция", category: "Алгебра", desc: "Навигация", keywords: ["функция"] },
    { url: "показательная-функция.html", title: "Показательная функция y = aˣ", category: "Алгебра", desc: "Свойства, графики", keywords: ["функция"] },
    { url: "показательные-уравнения.html", title: "Показательные уравнения", category: "Алгебра", desc: "Методы решения", keywords: ["уравнения"] },
    { url: "показательные-неравенства.html", title: "Показательные неравенства", category: "Алгебра", desc: "Решение", keywords: ["неравенства"] },
    { url: "логарифмические-уравнения.html", title: "Логарифмические уравнения", category: "Алгебра", desc: "Методы", keywords: ["уравнения"] },
    { url: "логарифмические-неравенства.html", title: "Логарифмические неравенства", category: "Алгебра", desc: "Решение", keywords: ["неравенства"] },
    { url: "иррациональные-уравнения.html", title: "Иррациональные уравнения", category: "Алгебра", desc: "Методы", keywords: ["уравнения"] },
    { url: "иррациональные-неравенства.html", title: "Иррациональные неравенства", category: "Алгебра", desc: "Решение", keywords: ["неравенства"] },
    
    // Методы решений
    { url: "methods-equations-inequalities.html", title: "Методы решений", category: "Алгебра", desc: "Все основные методы", keywords: ["методы"] },
    { url: "standard-methods.html", title: "Стандартные методы решения", category: "Алгебра", desc: "Метод интервалов, замена", keywords: ["методы"] },
    { url: "nonstandard-methods.html", title: "Нестандартные методы решения", category: "Алгебра", desc: "Графики, монотонность", keywords: ["методы"] },
    { url: "rational-equations.html", title: "Рациональные уравнения", category: "Алгебра", desc: "Общий знаменатель, замена", keywords: ["уравнения"] },
    { url: "rational-inequalities.html", title: "Рациональные неравенства", category: "Алгебра", desc: "Метод интервалов", keywords: ["неравенства"] },
    { url: "equations-with-module.html", title: "Уравнения с модулем", category: "Алгебра", desc: "Раскрытие, метод интервалов", keywords: ["модуль"] },
    { url: "inequalities-with-module.html", title: "Неравенства с модулем", category: "Алгебра", desc: "Раскрытие", keywords: ["модуль"] },
    { url: "equations-with-parameter.html", title: "Уравнения с параметром", category: "Алгебра", desc: "Линейные, квадратные", keywords: ["параметр"] },
    { url: "inequalities-with-parameter.html", title: "Неравенства с параметром", category: "Алгебра", desc: "Линейные, квадратные", keywords: ["параметр"] },
    { url: "graphical-solutions.html", title: "Графическое решение уравнений", category: "Алгебра", desc: "Построение, точки пересечения", keywords: ["график"] },

    // Производная и Анализ
    { url: "asymptotes.html", title: "Асимптоты", category: "Анализ", desc: "Вертикальные, горизонтальные", keywords: ["асимптоты"] },
    { url: "convexity.html", title: "Выпуклость и точки перегиба", category: "Анализ", desc: "Вторая производная", keywords: ["выпуклость"] },
    { url: "derivative-higher.html", title: "Производные высших порядков", category: "Анализ", desc: "2-я, 3-я, n-я производные", keywords: ["производная"] },
    { url: "derivative.html", title: "Производная", category: "Анализ", desc: "Таблица, правила, экстремумы", keywords: ["производная"] },
    { url: "производная-таблица-правила.html", title: "Таблица и правила дифференцирования", category: "Анализ", desc: "Таблица производных", keywords: ["производная"] },
    { url: "производная-сложная-функция.html", title: "Производная сложной функции", category: "Анализ", desc: "Формула и примеры", keywords: ["производная"] },
    { url: "экстремумы-функции.html", title: "Экстремумы функции", category: "Анализ", desc: "Максимум и минимум", keywords: ["экстремумы"] },
    { url: "исследование-функции.html", title: "Исследование функции", category: "Анализ", desc: "Алгоритм и пример", keywords: ["исследование"] },
    { url: "наибольшее-наименьшее-значение.html", title: "Наибольшее и наименьшее значение", category: "Анализ", desc: "На отрезке", keywords: ["значение"] },
    { url: "integral.html", title: "Интеграл", category: "Анализ", desc: "Определённый и неопределённый", keywords: ["интеграл"] },
    { url: "indefinite.html", title: "Неопределённый интеграл", category: "Анализ", desc: "Таблица интегралов", keywords: ["интеграл"] },
    { url: "definite.html", title: "Определённый интеграл", category: "Анализ", desc: "Формула Ньютона-Лейбница", keywords: ["интеграл"] },
    { url: "area.html", title: "Площадь криволинейной трапеции", category: "Анализ", desc: "Геометрический смысл", keywords: ["площадь"] },
    { url: "primitive.html", title: "Первообразная", category: "Анализ", desc: "Таблица первообразных", keywords: ["первообразная"] },
    { url: "integral-volume.html", title: "Объём через интеграл", category: "Анализ", desc: "Тела вращения", keywords: ["объём", "интеграл"] },

    // Тригонометрия
    { url: "trigonometry.html", title: "Тригонометрия", category: "Тригонометрия", desc: "Все разделы", keywords: ["тригонометрия"] },
    { url: "Тождества.html", title: "Основные тригонометрические тождества", category: "Тригонометрия", desc: "sin²α+cos²α=1", keywords: ["тождества"] },
    { url: "Сумма и разность углов.html", title: "Сумма и разность углов", category: "Тригонометрия", desc: "Формулы", keywords: ["углы"] },
    { url: "Двойной угол.html", title: "Двойной аргумент", category: "Тригонометрия", desc: "sin2α, cos2α", keywords: ["угол"] },
    { url: "Половинный аргумент.html", title: "Половинный аргумент", category: "Тригонометрия", desc: "sin²(α/2), cos²(α/2)", keywords: ["угол"] },
    { url: "Ссумма и разность функций.html", title: "Сумма и разность функций", category: "Тригонометрия", desc: "Преобразование в произведение", keywords: ["функции"] },
    { url: "Произведение функций.html", title: "Произведение функций", category: "Тригонометрия", desc: "Преобразование в сумму", keywords: ["функции"] },
    { url: "Знаки тригонометрических функций.html", title: "Знаки по четвертям", category: "Тригонометрия", desc: "Знаки sin, cos, tg", keywords: ["знаки"] },
    { url: "Формулы приведения.html", title: "Формулы приведения", category: "Тригонометрия", desc: "sin, cos, tg, ctg", keywords: ["формулы"] },
    { url: "Четность функции.html", title: "Чётность и нечётность", category: "Тригонометрия", desc: "sin(-x), cos(-x)", keywords: ["четность"] },
    { url: "Значения тригонометрических функций.html", title: "Таблица значений", category: "Тригонометрия", desc: "0°–360°", keywords: ["таблица"] },
    { url: "простейшие тригонометрические уравнения.html", title: "Простейшие уравнения", category: "Тригонометрия", desc: "sin x = a, cos x = a", keywords: ["уравнения"] },
    { url: "тригонометрические-уравнения-сводящиеся-к-алгебраическим.html", title: "Уравнения, сводящиеся к алгебраическим", category: "Тригонометрия", desc: "Замена переменной", keywords: ["уравнения"] },
    { url: "тригонометрические-неравенства.html", title: "Тригонометрические неравенства", category: "Тригонометрия", desc: "Единичная окружность", keywords: ["неравенства"] },
    { url: "radian.html", title: "Радианная мера угла", category: "Тригонометрия", desc: "Что такое радиан", keywords: ["радиан"] },
    { url: "trig_circle.htm", title: "Тригонометрическая окружность", category: "Тригонометрия", desc: "Интерактивный круг", keywords: ["окружность"] },

    // Геометрия
    { url: "geometry.html", title: "Геометрия", category: "Геометрия", desc: "Навигация", keywords: ["геометрия"] },
    { url: "stereo.html", title: "Прямые и плоскости в пространстве", category: "Геометрия", desc: "Стереометрия", keywords: ["прямые", "плоскости"] },
    { url: "Многоугольники.html", title: "Многоугольники", category: "Геометрия", desc: "Площади", keywords: ["многоугольники"] },
    { url: "polyhedrons.html", title: "Многогранники", category: "Геометрия", desc: "Призма, пирамида", keywords: ["многогранники"] },
    { url: "solids.html", title: "Тела вращения", category: "Геометрия", desc: "Цилиндр, конус, шар", keywords: ["тела вращения"] },

    // Комбинаторика и статистика
    { url: "combinatorics.html", title: "Комбинаторика и статистика (меню)", category: "Комбинаторика", desc: "Меню раздела", keywords: ["комбинаторика"] },
    { url: "combinatorics-basics.html", title: "Основные понятия комбинаторики", category: "Комбинаторика", desc: "Перестановки, сочетания", keywords: ["комбинаторика"] },
    { url: "probability-events.html", title: "Событие, вероятность события", category: "Вероятность", desc: "Основы", keywords: ["вероятность"] },
    { url: "probability-professional.html", title: "Вероятность в проф. задачах", category: "Вероятность", desc: "Практика", keywords: ["вероятность"] },
    { url: "random-variables.html", title: "Дискретная случайная величина", category: "Статистика", desc: "Математическое ожидание", keywords: ["величина"] },
    { url: "math-statistics.html", title: "Задачи математической статистики", category: "Статистика", desc: "Выборка, медиана", keywords: ["статистика"] },
    { url: "diagrams-tables.html", title: "Составление таблиц и диаграмм", category: "Статистика", desc: "Графики данных", keywords: ["таблицы"] },

    // Инструменты
    { url: "calculator.html", title: "Калькулятор", category: "Инструменты", desc: "Обычный, инженерный", keywords: ["калькулятор"] },
    { url: "quadratic.html", title: "Калькулятор квадратных уравнений", category: "Инструменты", desc: "Решение", keywords: ["калькулятор"] },
    { url: "radical.html", title: "Калькулятор радикалов", category: "Инструменты", desc: "Корни любой степени", keywords: ["калькулятор"] },
    { url: "конвертер.html", title: "Конвертер величин", category: "Инструменты", desc: "Конвертация", keywords: ["конвертер"] },
    { url: "plotter.html", title: "Построитель графиков", category: "Инструменты", desc: "Графики функций", keywords: ["графики"] },
    { url: "bradis.html", title: "Таблица Брадиса", category: "Инструменты", desc: "Калькулятор sin, cos, tg, ctg", keywords: ["брадис"] },
    { url: "favorites.html", title: "Избранное", category: "Инструменты", desc: "Сохранённые страницы", keywords: ["избранное"] },
    { url: "about.html", title: "О приложении", category: "Общее", desc: "Информация", keywords: ["о приложении"] },

    // Профессиональные задачи
    { url: "показательная-функция-tasks.html", title: "Профзадачи: Показательная функция", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "показательная функция", "степени"] },
    { url: "степенная-функция-tasks.html", title: "Профзадачи: Степенная функция", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "степенная функция", "корни"] },
    { url: "тригонометрия-tasks.html", title: "Профзадачи: Тригонометрия", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "тригонометрия", "синус", "косинус"] },
    { url: "stereo-tasks.html", title: "Профзадачи: Прямые и плоскости", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "стереометрия", "прямые", "плоскости"] },
    { url: "логарифмы-tasks.html", title: "Профзадачи: Логарифмы", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "логарифмы", "децибелы"] },
    { url: "mnogogranniki-tasks.html", title: "Профзадачи: Многогранники", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "многогранники", "призма", "пирамида"] },
        { url: "tela-vrascheniya-tasks.html", title: "Профзадачи: Тела вращения", category: "Профессиональные задачи", desc: "7 специальностей, реальные ситуации", keywords: ["профзадачи", "тела вращения", "цилиндр", "конус", "шар"] },

];
