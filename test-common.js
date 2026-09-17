/* ============================================================
   test-common.js — общая защита от списывания для всех тестов
   ============================================================ */

(function () {
    'use strict';

    // ===== КЛЮЧ ДЛЯ ХРАНЕНИЯ =====
    var STORAGE_KEY = 'math_test_state_' + window.location.pathname.split('/').pop();

    // ===== ФЛАГИ =====
    window.testStarted = false;
    window.testFinished = false;

    // ===== СОХРАНЕНИЕ СОСТОЯНИЯ =====
    window.saveTestState = function () {
        if (!window.testStarted || window.testFinished) return;
        try {
            var answers = {};
            var correctCount = 0;
            var totalAnswered = 0;
            var qs = window.currentQuestions || [];
            for (var i = 0; i < qs.length; i++) {
                var sel = document.querySelector('input[name="q' + i + '"]:checked');
                if (sel) {
                    var val = parseInt(sel.value, 10);
                    answers[i] = val;
                    totalAnswered++;
                    if (val === qs[i].ans) correctCount++;
                }
            }
            var saved = {
                started: true,
                finished: false,
                answers: answers,
                correctCount: correctCount,
                totalAnswered: totalAnswered,
                questionCount: qs.length,
                timeLeft: window.timeLeft || 0,
                totalTime: window.totalTime || 0,
                currentMode: window.currentMode || 'mixed'
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) { /* ignore */ }
    };

    window.loadTestState = function () {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) { return null; }
    };

    window.clearTestState = function () {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    };

    // ===== ЗАВЕРШЕНИЕ ТЕСТА ИЗ-ЗА НАРУШЕНИЯ =====
    window.finishTestDueToViolation = function () {
        if (window.testFinished) return;
        window.testFinished = true;
        window.testStarted = false;

        // Останавливаем таймер
        if (typeof window.timerInterval !== 'undefined' && window.timerInterval) {
            clearInterval(window.timerInterval);
            window.timerInterval = null;
        }

        // Сохраняем перед завершением, чтобы отобразить результат
        var saved = window.loadTestState();

        // Показываем сообщение
        var container = document.getElementById('testContainer');
        if (container) {
            var resultHtml = '';
            if (saved && saved.questionCount) {
                resultHtml =
                    '<p style="color:#8ba5b8;font-size:0.85rem;margin-top:12px;">Результат по уже отвеченным вопросам:</p>' +
                    '<p style="color:#ffffff;font-size:1.4rem;font-weight:bold;margin-top:6px;">' +
                        saved.correctCount + ' / ' + saved.questionCount +
                    '</p>' +
                    '<p style="color:#8ba5b8;font-size:0.8rem;margin-top:4px;">(отвечено: ' + saved.totalAnswered + ')</p>';
            }
            container.innerHTML =
                '<div class="questions-hidden" style="border-color:#ef4444;background:rgba(239,68,68,0.1);">' +
                    '<span class="lock">🚫</span>' +
                    '<h3 style="color:#ef4444;">Тест завершён</h3>' +
                    '<p style="color:#ef4444;">Тест автоматически завершён из-за нарушения правил: выход из приложения или переключение окна во время прохождения.</p>' +
                    resultHtml +
                '</div>';
        }

        // Скрываем таймер
        var ft = document.getElementById('fixedTimer');
        if (ft) ft.classList.remove('show');

        // Очищаем состояние
        window.clearTestState();

        // Небольшая задержка перед alert, чтобы DOM успел обновиться
        setTimeout(function () {
            alert('⚠️ Тест завершён! Выход из приложения во время теста запрещён.');
        }, 50);
    };

    // ===== ПРОВЕРКА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
    // Если состояние есть и тест не завершён — значит, студент ушёл. Завершаем.
    window.checkViolationOnLoad = function () {
        var saved = window.loadTestState();
        if (saved && saved.started && !saved.finished) {
            // Студент ушёл со страницы — показываем результат
            window.testFinished = true;
            window.testStarted = false;

            var container = document.getElementById('testContainer');
            if (container) {
                container.innerHTML =
                    '<div class="questions-hidden" style="border-color:#ef4444;background:rgba(239,68,68,0.1);">' +
                        '<span class="lock">🚫</span>' +
                        '<h3 style="color:#ef4444;">Тест завершён</h3>' +
                        '<p style="color:#ef4444;">Тест автоматически завершён из-за нарушения правил: выход из приложения или переключение окна во время прохождения.</p>' +
                        '<p style="color:#8ba5b8;font-size:0.85rem;margin-top:12px;">Результат по уже отвеченным вопросам:</p>' +
                        '<p style="color:#ffffff;font-size:1.4rem;font-weight:bold;margin-top:6px;">' +
                            saved.correctCount + ' / ' + saved.questionCount +
                        '</p>' +
                        '<p style="color:#8ba5b8;font-size:0.8rem;margin-top:4px;">(отвечено: ' + saved.totalAnswered + ')</p>' +
                    '</div>';
            }

            var ft = document.getElementById('fixedTimer');
            if (ft) ft.classList.remove('show');

            window.clearTestState();

            setTimeout(function () {
                alert('⚠️ Тест завершён! Выход из приложения во время теста запрещён.');
            }, 50);

            return true; // нарушение было
        }
        return false; // всё нормально, можно генерировать тест
    };

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    document.addEventListener('visibilitychange', function () {
        if (document.hidden && window.testStarted && !window.testFinished) {
            window.finishTestDueToViolation();
        }
    });

    window.addEventListener('blur', function () {
        if (window.testStarted && !window.testFinished) {
            window.finishTestDueToViolation();
        }
    });

    document.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement && window.testStarted && !window.testFinished) {
            window.finishTestDueToViolation();
        }
    });

})();