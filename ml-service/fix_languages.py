import re
import glob

langs_data = [
    ("ar", "🇸🇦 العربية"), ("en", "🇺🇸 الإنجليزية"), ("es", "🇪🇸 الإسبانية"), ("fr", "🇫🇷 الفرنسية"),
    ("de", "🇩🇪 الألمانية"), ("zh", "🇨🇳 الصينية"), ("ru", "🇷🇺 الروسية"), ("tr", "🇹🇷 التركية"),
    ("hi", "🇮🇳 الهندية"), ("it", "🇮🇹 الإيطالية"), ("pt", "🇵🇹 البرتغالية"), ("ja", "🇯🇵 اليابانية"),
    ("ko", "🇰🇷 الكورية"), ("nl", "🇳🇱 الهولندية"), ("pl", "🇵🇱 البولندية"), ("ro", "🇷🇴 الرومانية"),
    ("uk", "🇺🇦 الأوكرانية"), ("sv", "🇸🇪 السويدية"), ("da", "🇩🇰 الدنماركية"), ("fi", "🇫🇮 الفنلندية"),
    ("no", "🇳🇴 النرويجية"), ("cs", "🇨🇿 التشيكية"), ("hu", "🇭🇺 الهنغارية"), ("el", "🇬🇷 اليونانية"),
    ("id", "🇮🇩 الإندونيسية"), ("ms", "🇲🇾 الماليزية"), ("th", "🇹🇭 التايلاندية"), ("vi", "🇻🇳 الفيتنامية"),
    ("he", "🇮🇱 العبرية"), ("fa", "🇮🇷 الفارسية"), ("ur", "🇵🇰 الأوردية"), ("bn", "🇧🇩 البنغالية"),
    ("sw", "🇰🇪 السواحلية"), ("af", "🇿🇦 الأفريكانية"), ("sq", "🇦🇱 الألبانية"), ("am", "🇪🇹 الأمهرية"),
    ("hy", "🇦🇲 الأرمنية"), ("az", "🇦🇿 الأذربيجانية"), ("eu", "🇪🇸 الباسكية"), ("be", "🇧🇾 البيلاروسية"),
    ("bs", "🇧🇦 البوسنية"), ("bg", "🇧🇬 البلغارية"), ("ca", "🇪🇸 الكتالونية"), ("hr", "🇭🇷 الكرواتية"),
    ("et", "🇪🇪 الإستونية"), ("tl", "🇵🇭 الفلبينية"), ("ka", "🇬🇪 الجورجية"), ("is", "🇮🇸 الأيسلندية"),
    ("ga", "🇮🇪 الأيرلندية"), ("lv", "🇱🇻 اللاتفية"), ("lt", "🇱🇹 اللتوانية"), ("mk", "🇲🇰 المكدونية"),
    ("ml", "🇮🇳 الماليالامية"), ("mt", "🇲🇹 المالتية"), ("mr", "🇮🇳 الماراهتية"), ("mn", "🇲🇳 المنغولية"),
    ("ne", "🇳🇵 النيبالية"), ("sr", "🇷🇸 الصربية"), ("sk", "🇸🇰 السلوفاكية"), ("sl", "🇸🇮 السلوفينية"),
    ("so", "🇸🇴 الصومالية"), ("cy", "🇬🇧 الويلزية")
]

options_html = "".join([f'<option value="{k}">{v}</option>' for k, v in langs_data])

langs_json = "{" + ", ".join([f'"{k}": "{v}"' for k, v in langs_data]) + "}"

force_js = f"""
<script>
(function() {{
    const langs = {langs_json};
    function injectLangs() {{
        const selects = document.querySelectorAll('select');
        selects.forEach(sel => {{
            sel.innerHTML = Object.entries(langs).map(([k, v]) => `<option value="${{k}}">${{v}}</option>`).join('');
        }});
    }}
    document.addEventListener('DOMContentLoaded', injectLangs);
    window.addEventListener('load', injectLangs);
    setInterval(injectLangs, 500);
}})();
</script>
"""

for path in glob.glob('app/**/*.html', recursive=True):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    new_content = re.sub(r'(<select[^>]*>)(.*?)(</select>)', r'\1' + options_html + r'\3', content, flags=re.DOTALL)
    
    if "injectLangs" not in new_content:
        if "</body>" in new_content:
            new_content = new_content.replace("</body>", force_js + "\n</body>")
        else:
            new_content += force_js

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ Updated HTML File: {path}")
