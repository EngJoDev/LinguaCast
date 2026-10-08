import os
import glob
import re

langs = [
    ("ar", "🇸🇦 العربية"), ("en", "🇺🇸 الإنجليزية"), ("es", "🇪🇸 الإسبانية"), ("fr", "🇫🇷 الفرنسية"),
    ("de", "🇩🇪 الألمانية"), ("zh", "🇨🇳 الصينية"), ("ru", "🇷🇺 الروسية"), ("tr", "🇹🇷 التركية"),
    ("hi", "🇮🇳 الهندية"), ("it", "🇮🇹 الإيطالية"), ("pt", "🇵🇹 البرتغالية"), ("ja", "🇯🇵 اليابانية"),
    ("ko", "🇰🇷 الكورية"), ("nl", "🇳🇱 الهولندية"), ("pl", "🇵🇱 البولندية"), ("ro", "🇷🇴 الرومانية"),
    ("uk", "🇺🇦 الأوكرانية"), ("sv", "🇸🇪 السويدية"), ("da", "🇩🇰 الدنماركية"), ("fi", "🇫🇮 الفنلندية"),
    ("no", "🇳🇴 النرويجية"), ("cs", "🇨🇿 التشيكية"), ("hu", "🇭🇺 الهنغارية"), ("el", "🇬🇷 اليونانية"),
    ("id", "🇮🇩 الإندونيسية"), ("ms", "🇲🇾 الماليزية"), ("th", "🇹🇭 التايلاندية"), ("vi", "🇻🇳 الفيتنامية"),
    ("he", "🇮🇱 العبرية"), ("fa", "🇮🇷 الفارسية"), ("ur", "🇵🇰 الأوردية"), ("bn", "🇧🇩 البنغالية")
]

options_html = "".join([f'<option value="{k}">{v}</option>' for k, v in langs])

for path in glob.glob('app/**/*.*', recursive=True):
    if path.endswith(('.html', '.js', '.py', '.json')):
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # لو الملف HTML
        if path.endswith('.html'):
            new_content = re.sub(r'(<select[^>]*>)(.*?)(</select>)', r'\1' + options_html + r'\3', content, flags=re.DOTALL)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated HTML: {path}")

EOF

