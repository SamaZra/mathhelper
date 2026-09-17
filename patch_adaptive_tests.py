#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto-patch all adaptive tests.

What it does:
  1. Inserts enlarged CSS before </style>.
  2. Replaces old protection script with <script src="adaptive-protection.js"></script>.
  3. Makes .bak backup for each changed file.
  4. Idempotent: safe to run multiple times.

Usage:
    python patch_adaptive_tests.py
"""

import os
import re
import shutil
import sys

# ------------------------------------------------------------------
# Files to process
# ------------------------------------------------------------------
ADAPTIVE_FILES = [
    "test-derivative-adaptive.html",
    "test-exponential-adaptive.html",
    "test-formulas-adaptive.html",
    "test-integral-adaptive.html",
    "test-lines-planes-adaptive.html",
    "test-logarithms-adaptive.html",
    "test-polyhedrons-adaptive.html",
    "test-powers-adaptive.html",
    "test-solids-adaptive.html",
    "test-trigonometry-adaptive.html",
    "test-vectors-adaptive.html",
]

# ------------------------------------------------------------------
# CSS block (ASCII-only marker)
# ------------------------------------------------------------------
CSS_BLOCK = """
/* ================================================================
   AUTO-PATCH-CSS-MARKER
   Enlarged UI for mobile devices.
   ================================================================ */
body { font-size: 18px !important; padding: 10px !important; }
.container { padding: 18px !important; padding-top: 56px !important; max-width: 100% !important; }
.header h1 { font-size: 1.7rem !important; line-height: 1.3 !important; }
.header .sub { font-size: 1rem !important; }
.theme-toggle { width: 44px !important; height: 44px !important; font-size: 22px !important; top: 12px !important; right: 12px !important; }
.favorite-btn { width: 56px !important; height: 56px !important; font-size: 30px !important; bottom: 24px !important; left: 24px !important; }
.settings { padding: 16px !important; gap: 10px !important; }
.settings label { font-size: 1rem !important; }
.settings select { font-size: 1rem !important; padding: 10px 14px !important; min-width: 90px !important; }
.settings .start-btn { font-size: 1.1rem !important; padding: 12px 28px !important; }
.settings .reset-btn { font-size: 1rem !important; padding: 10px 20px !important; }
.mode-btn { font-size: 0.95rem !important; padding: 8px 16px !important; }
.mode-btn .hint { font-size: 0.65rem !important; }
.stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
.stats-card { padding: 10px 6px !important; }
.stats-card .label { font-size: 0.65rem !important; }
.stats-card .value { font-size: 1.3rem !important; }
.progress-info { font-size: 0.9rem !important; }
.progress-bar { height: 8px !important; }
.timer-container { padding: 8px 14px !important; gap: 10px !important; }
.timer-text { font-size: 1.1rem !important; min-width: 55px !important; }
.timer-bar-wrap { height: 8px !important; }
.q-meta { gap: 8px !important; }
.q-topic { font-size: 0.9rem !important; padding: 4px 12px !important; }
.q-difficulty { font-size: 0.8rem !important; padding: 4px 12px !important; }
.q-number { font-size: 0.9rem !important; }
.q-text { font-size: 1.15rem !important; line-height: 1.6 !important; margin: 14px 0 !important; }
.options { gap: 10px !important; }
.options button { font-size: 1.05rem !important; padding: 16px 18px !important; line-height: 1.5 !important; border-radius: 14px !important; }
.result-box { font-size: 1.05rem !important; padding: 14px 18px !important; }
.controls { gap: 10px !important; margin-top: 18px !important; }
.controls button { font-size: 1.05rem !important; padding: 14px 20px !important; min-width: 90px !important; }
.result-final { padding: 22px !important; }
.result-final .grade-text { font-size: 1.4rem !important; }
.result-final .big-score { font-size: 2.8rem !important; }
.result-final .result-details { font-size: 1rem !important; }
.result-final .result-mode { font-size: 0.95rem !important; }
.result-actions { gap: 10px !important; }
.result-actions button { font-size: 1rem !important; padding: 10px 22px !important; }
.recommend-box .title { font-size: 1rem !important; }
.recommend-box .list { font-size: 0.95rem !important; }
.topic-stats-title { font-size: 1rem !important; }
.topic-row { font-size: 0.95rem !important; padding: 6px 0 !important; }
.history-title { font-size: 1rem !important; }
.history-item { font-size: 0.9rem !important; padding: 6px 0 !important; }
.history-actions button { font-size: 0.85rem !important; padding: 6px 14px !important; }
.share-modal .modal-content { padding: 26px !important; max-width: 95% !important; }
.share-modal .modal-title { font-size: 1.3rem !important; }
.share-modal input { font-size: 1.05rem !important; padding: 12px 16px !important; }
.share-modal .modal-btn { font-size: 1.1rem !important; padding: 14px !important; }
.share-modal .modal-note { font-size: 0.85rem !important; }
.back-link { font-size: 1.05rem !important; padding: 14px !important; }
@media (max-width: 550px) {
    body { font-size: 17px !important; }
    .container { padding: 14px !important; padding-top: 52px !important; }
    .header h1 { font-size: 1.4rem !important; }
    .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .q-text { font-size: 1.05rem !important; }
    .options button { font-size: 1rem !important; padding: 14px 16px !important; }
    .result-final .big-score { font-size: 2.2rem !important; }
}
"""

CSS_MARKER = "AUTO-PATCH-CSS-MARKER"
PROTECTION_LINK = '<script src="adaptive-protection.js"></script>'

OLD_PROTECTION_RE = re.compile(
    r"<script>\s*(?=[^<]*document\.addEventListener\('contextmenu').*?</script>",
    re.DOTALL
)


def patch_file(path):
    if not os.path.isfile(path):
        return "not_found"

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    changes = []

    # 1. CSS
    if CSS_MARKER not in content:
        idx = content.find("</style>")
        if idx == -1:
            return "error: no </style>"
        content = content[:idx] + CSS_BLOCK + "\n" + content[idx:]
        changes.append("CSS")

    # 2. Protection
    if PROTECTION_LINK not in content:
        m = OLD_PROTECTION_RE.search(content)
        if m:
            content = content[:m.start()] + PROTECTION_LINK + content[m.end():]
            changes.append("protection")
        else:
            idx = content.rfind("</body>")
            if idx == -1:
                return "error: no </body>"
            content = content[:idx] + "\n" + PROTECTION_LINK + "\n" + content[idx:]
            changes.append("protection(inserted)")

    if content != original:
        backup = path + ".bak"
        if not os.path.exists(backup):
            shutil.copy2(path, backup)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return "patched:" + ",".join(changes)
    return "already"


def main():
    base = os.path.dirname(os.path.abspath(__file__))
    print("=" * 60)
    print("Patch adaptive tests")
    print("Folder:", base)
    print("=" * 60)

    patched = already = missing = 0
    errors = []

    for name in ADAPTIVE_FILES:
        path = os.path.join(base, name)
        result = patch_file(path)
        if result == "not_found":
            print("  [MISSING] " + name)
            missing += 1
        elif result == "already":
            print("  [OK]      " + name + " (already patched)")
            already += 1
        elif result.startswith("error"):
            print("  [ERROR]   " + name + " -- " + result)
            errors.append(name)
        else:
            print("  [PATCH]   " + name + " -> " + result)
            patched += 1

    print()
    print("=" * 60)
    print("Patched: " + str(patched) +
          " | Already: " + str(already) +
          " | Missing: " + str(missing) +
          " | Errors: " + str(len(errors)))
    print("=" * 60)

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()