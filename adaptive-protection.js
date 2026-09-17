/* ================================================================
 * adaptive-protection.js
 * Универсальная защита для адаптивных тестов.
 * Автоматически определяет старт/финиш теста по кнопкам.
 * ================================================================ */
(function () {
    'use strict';

    var violationTriggered = false;
    var blurTimeout = null;
    var hiddenStart = null;
    var testActiveInternal = false;   // внутренний флаг активности теста

    // =================================================================
    // 1. БАЗОВАЯ ЗАЩИТА (правая кнопка, копирование, клавиши, zoom)
    // =================================================================

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        alert('⚠️ Копирование и сохранение контента запрещено!');
        return false;
    });

    document.addEventListener('copy', function (e) {
        e.preventDefault();
        alert('⚠️ Копирование контента запрещено!');
        return false;
    });
    document.addEventListener('cut', function (e) {
        e.preventDefault();
        alert('⚠️ Вырезание контента запрещено!');
        return false;
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            alert('⚠️ Инструменты разработчика отключены!');
            return false;
        }
        if (e.ctrlKey && e.shiftKey && (
                e.key === 'I' || e.key === 'i' ||
                e.key === 'J' || e.key === 'j' ||
                e.key === 'C' || e.key === 'c'
            )) {
            e.preventDefault();
            alert('⚠️ Инструменты разработчика отключены!');
            return false;
        }
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            alert('⚠️ Просмотр исходного кода запрещён!');
            return false;
        }
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            alert('⚠️ Сохранение страницы запрещено!');
            return false;
        }
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            alert('⚠️ Создание скриншотов запрещено!');
            return false;
        }
        if (e.ctrlKey && (
                e.key === 'c' || e.key === 'C' ||
                e.key === 'x' || e.key === 'X' ||
                e.key === 'a' || e.key === 'A' ||
                e.key === 'p' || e.key === 'P'
            )) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length > 1) {
            e.preventDefault();
            alert('⚠️ Масштабирование отключено!');
            return false;
        }
    }, { passive: false });
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
        alert('⚠️ Масштабирование отключено!');
        return false;
    });

    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    // =================================================================
    // 2. АВТООПРЕДЕЛЕНИЕ СТАРТА/ФИНИША ТЕСТА ПО КЛИКАМ
    // =================================================================

    // Клик на "Начать тест" → активируем защиту
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('#startBtn');
        if (btn) {
            testActiveInternal = true;
            violationTriggered = false;   // сбрасываем счётчик нарушений
            if (blurTimeout) { clearTimeout(blurTimeout); blurTimeout = null; }
            hiddenStart = null;
            console.log('🛡️ Защита активирована: тест начат');
        }
    }, true);

    // Клик на "Прервать" / "Завершить" → снимаем защиту
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('#abortBtn, #finishBtn');
        if (btn) {
            testActiveInternal = false;
            console.log('🛡️ Защита снята: тест завершён вручную');
        }
    }, true);

    // =================================================================
    // 3. ПРОВЕРКА АКТИВНОСТИ ТЕСТА
    // =================================================================

    function isTestActive() {
        // 1) Явные флаги, если тест их выставляет
        if (typeof window.testStarted !== 'undefined' && window.testStarted === true) {
            return window.testFinished !== true;
        }
        // 2) Через state (адаптивные тесты)
        if (typeof window.state !== 'undefined' && window.state) {
            if (typeof window.state.isRunning !== 'undefined') {
                return window.state.isRunning === true && window.state.isFinished !== true;
            }
        }
        // 3) Внутренний флаг (ставится кликом на startBtn)
        if (testActiveInternal) {
            // Проверим, что результат ещё не показан
            var resultFinal = document.getElementById('resultFinal');
            if (resultFinal && resultFinal.classList.contains('show')) {
                testActiveInternal = false;
                return false;
            }
            var startBtn = document.getElementById('startBtn');
            if (startBtn && startBtn.disabled === false) {
                // Кнопка снова активна — тест либо не начат, либо завершён
                testActiveInternal = false;
                return false;
            }
            return true;
        }
        return false;
    }

    // =================================================================
    // 4. ПРИНУДИТЕЛЬНОЕ ЗАВЕРШЕНИЕ ТЕСТА
    // =================================================================

    function forceFinishTest(reason) {
        if (violationTriggered) return;
        violationTriggered = true;
        testActiveInternal = false;

        // Пробуем вызвать finishTest() самого теста
        if (typeof window.finishTest === 'function') {
            try {
                if (typeof window.timerInterval !== 'undefined' && window.timerInterval) {
                    clearInterval(window.timerInterval);
                    window.timerInterval = null;
                }
                if (typeof window.isFinished !== 'undefined') {
                    window.isFinished = true;
                }
                if (typeof window.state !== 'undefined' && window.state) {
                    window.state.isFinished = true;
                    window.state.isRunning = false;
                }
                window.finishTest();
                return;
            } catch (err) {
                console.warn('finishTest() threw, fallback:', err);
            }
        }

        // Fallback — рисуем результат вручную
        try {
            if (typeof window.timerInterval !== 'undefined' && window.timerInterval) {
                clearInterval(window.timerInterval);
                window.timerInterval = null;
            }
            if (typeof window.isFinished !== 'undefined') {
                window.isFinished = true;
            }
            if (typeof window.state !== 'undefined' && window.state) {
                window.state.isFinished = true;
                window.state.isRunning = false;
            }

            ['questionArea', 'controlsPanel', 'progressContainer', 'statsGrid', 'timerContainer'].forEach(function (id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });

            var resultFinal = document.getElementById('resultFinal');
            if (resultFinal) {
                var gradeText = document.getElementById('gradeText');
                var bigScore = document.getElementById('bigScore');
                var details = document.getElementById('resultDetails');
                var examRes = document.getElementById('examResult');

                if (gradeText) {
                    gradeText.textContent = '⏸️ Тест прерван';
                    gradeText.className = 'grade-text good';
                }
                if (bigScore) {
                    var pct = '—';
                    if (typeof window.state !== 'undefined' && window.state) {
                        var total = (window.state.correct || 0) + (window.state.wrong || 0);
                        if (total > 0) pct = Math.round((window.state.correct / total) * 100) + '%';
                    }
                    bigScore.textContent = pct;
                    bigScore.className = 'big-score good';
                }
                if (details) {
                    var dText = 'Нарушение правил: ' + reason;
                    if (typeof window.state !== 'undefined' && window.state) {
                        var t = (window.state.correct || 0) + (window.state.wrong || 0);
                        if (t > 0) {
                            dText = 'Отвечено: ' + t + ' · правильно: ' +
                                window.state.correct + ' · ошибок: ' + window.state.wrong;
                        }
                    }
                    details.textContent = dText;
                }
                if (examRes) examRes.textContent = '⏸️ Тест завершён из-за нарушения правил';
                resultFinal.className = 'result-final show';
                try { resultFinal.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
            }

            var settingsPanel = document.getElementById('settingsPanel');
            if (settingsPanel) settingsPanel.style.display = 'flex';
            var startBtn = document.getElementById('startBtn');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.animation = 'pulse-glow 2s ease-in-out infinite';
                startBtn.style.boxShadow = '0 0 14px rgba(26,188,156,0.2)';
            }
            var abortBtn = document.getElementById('abortBtn');
            if (abortBtn) abortBtn.style.display = 'none';
        } catch (err) {
            console.error('Fallback forceFinish error:', err);
        }
    }

    // =================================================================
    // 5. ОТСЛЕЖИВАНИЕ НАРУШЕНИЙ
    // =================================================================

    document.addEventListener('visibilitychange', function () {
        if (document.hidden && isTestActive() && !violationTriggered) {
            forceFinishTest('переключение вкладки / сворачивание');
        }
    });

    window.addEventListener('blur', function () {
        if (!isTestActive() || violationTriggered) return;
        if (blurTimeout) clearTimeout(blurTimeout);
        blurTimeout = setTimeout(function () {
            if (!document.hidden && isTestActive() && !violationTriggered) {
                forceFinishTest('потеря фокуса окна');
            }
        }, 500);
    });

    window.addEventListener('pagehide', function () {
        if (isTestActive() && !violationTriggered) {
            forceFinishTest('сворачивание приложения');
        }
    });

    function watchHidden() {
        if (document.hidden) {
            if (hiddenStart === null) hiddenStart = Date.now();
            if (Date.now() - hiddenStart > 1000 && isTestActive() && !violationTriggered) {
                forceFinishTest('длительное скрытие вкладки');
            }
        } else {
            hiddenStart = null;
        }
        requestAnimationFrame(watchHidden);
    }
    requestAnimationFrame(watchHidden);

    window.__examProtectionInstalled = true;
    console.log('🛡️ adaptive-protection.js установлен');
})();