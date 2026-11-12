import os
import re

FOLDER = r"app\src\main\assets"

# ===== БЛОК ЗАЩИТЫ =====
NEW_PROTECTION = """    // ===== ЖЁСТКАЯ ЗАЩИТА ОТ СПИСЫВАНИЯ =====
    var testStarted = false;
    var testFinished = false;

    function finishTestDueToViolation() {
        if (testFinished) return;
        testFinished = true;
        testStarted = false;

        if (typeof timerInterval !== 'undefined' && timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        var container = document.getElementById('testContainer');
        if (container) {
            container.innerHTML =
                '<div class="questions-hidden" style="border-color:#ef4444;background:rgba(239,68,68,0.1);">' +
                    '<span class="lock">🚫</span>' +
                    '<h3 style="color:#ef4444;">Тест завершён</h3>' +
                    '<p style="color:#ef4444;">Тест автоматически завершён из-за нарушения правил: выход из приложения или переключение окна во время прохождения.</p>' +
                    '<p style="color:#8ba5b8;font-size:0.85rem;margin-top:8px;">Результат сохранён по уже отвеченным вопросам.</p>' +
                '</div>';
        }

        if (isStarted && !isFinished) {
            isFinished = true;
            checkAnswers(true);
        } else {
            isFinished = true;
        }

        alert('⚠️ Тест завершён! Выход из приложения во время теста запрещён.');
    }

    document.addEventListener('visibilitychange', function() {
        if (document.hidden && testStarted && !testFinished) {
            finishTestDueToViolation();
        }
    });
"""

WARNING_INSERT = """html += '  <div style="margin-top:16px;padding:12px;border-radius:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.4);text-align:left;max-width:500px;margin-left:auto;margin-right:auto;">';
        html += '    <p style="color:#ef4444;font-weight:bold;margin-bottom:6px;">⚠️ Внимание! Правила прохождения:</p>';
        html += '    <p style="color:#ef4444;font-size:0.85rem;line-height:1.5;margin:0;">';
        html += '      Во время теста <b>запрещено</b>:<br>';
        html += '      • сворачивать приложение<br>';
        html += '      • переключаться на другие окна и вкладки<br>';
        html += '      • открывать браузер или другие приложения<br><br>';
        html += '      <b>Любое из этих действий приведёт к автоматическому завершению теста.</b><br>';
        html += '      Результат будет сохранён по уже отвеченным вопросам.';
        html += '    </p>';
        html += '  </div>';
"""

# ===== РЕГУЛЯРКИ =====
OLD_VISIBILITY = re.compile(
    r"document\.addEventListener\(\s*['\"]visibilitychange['\"]\s*,\s*function\s*\(\s*\)\s*\{.*?\}\s*\)\s*;",
    re.DOTALL
)

START_TEST = re.compile(
    r"(function\s+startTest\s*\(\s*\)\s*\{\s*if\s*\(isStarted\s*\)\s*return\s*;\s*isStarted\s*=\s*true\s*;)",
    re.DOTALL
)

CHECK_ANSWERS = re.compile(
    r"(function\s+checkAnswers\s*\(\s*timeUp\s*\)\s*\{\s*if\s*\(isFinished\s*&&\s*!timeUp\s*\)\s*return\s*;\s*if\s*\(!isStarted\s*&&\s*!timeUp\s*\)\s*return\s*;)",
    re.DOTALL
)

WARNING_LINE = re.compile(
    r"(html\s*\+=\s*['\"][^'\"]*Начать тест[^'\"]*таймер[^'\"]*['\"]\s*;)",
    re.DOTALL
)

WARNING_LINE2 = re.compile(
    r"(html\s*\+=\s*['\"][^'\"]*Начать тест[^'\"]*['\"]\s*;)",
    re.DOTALL
)


def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    changes = []

    # 1. ЗАЩИТА — вставляем только если её ещё нет
    if "finishTestDueToViolation" not in content:
        if OLD_VISIBILITY.search(content):
            content = OLD_VISIBILITY.sub(NEW_PROTECTION, content, count=1)
            changes.append("visibilitychange OK")
        else:
            changes.append("visibilitychange NE NAIDEN")
    else:
        changes.append("visibilitychange UZHE EST")

    # 2. startTest — вставляем только если флага ещё нет
    if "testStarted = true" not in content:
        if START_TEST.search(content):
            content = START_TEST.sub(
                r"\1\n    testStarted = true;\n    testFinished = false;",
                content, count=1
            )
            changes.append("startTest OK")
        else:
            changes.append("startTest NE NAIDEN")
    else:
        changes.append("startTest UZHE EST")

    # 3. checkAnswers — вставляем только если флага ещё нет
    if "testFinished = true" not in content:
        if CHECK_ANSWERS.search(content):
            content = CHECK_ANSWERS.sub(
                r"\1\n    testFinished = true;\n    testStarted = false;",
                content, count=1
            )
            changes.append("checkAnswers OK")
        else:
            changes.append("checkAnswers NE NAIDEN")
    else:
        changes.append("checkAnswers UZHE EST")

    # 4. warning — вставляем только если его ещё нет
    if "Правила прохождения" not in content:
        if WARNING_LINE.search(content):
            content = WARNING_LINE.sub(r"\1\n        " + WARNING_INSERT, content, count=1)
            changes.append("warning OK")
        elif WARNING_LINE2.search(content):
            content = WARNING_LINE2.sub(r"\1\n        " + WARNING_INSERT, content, count=1)
            changes.append("warning OK (v2)")
        else:
            changes.append("warning NE NAIDEN")
    else:
        changes.append("warning UZHE EST")

    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True, changes
    return False, changes


def main():
    if not os.path.isdir(FOLDER):
        print("PAPKA NE NAIDENA: " + FOLDER)
        return

    processed = 0
    for filename in sorted(os.listdir(FOLDER)):
        if not filename.endswith(".html"):
            continue
        if not filename.startswith("test-"):
            continue
        if "adaptive" in filename:
            continue

        path = os.path.join(FOLDER, filename)
        print("\n" + filename)
        try:
            ok, changes = process_file(path)
            for c in changes:
                print("   " + c)
            if ok:
                processed += 1
                print("   FAJL IZMENEN")
        except Exception as e:
            print("   Oshibka: " + str(e))

    print("\nGotovo. Obrabotano: " + str(processed))


if __name__ == "__main__":
    main()