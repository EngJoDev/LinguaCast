code
Markdown
# 🎬 LinguaCast AI — Next-Gen 4K AI Video Dubbing & Translation Engine

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/EngJoDev/LinguaCast?style=for-the-badge&color=FFD700&logo=github)](https://github.com/EngJoDev/LinguaCast/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/EngJoDev/LinguaCast?style=for-the-badge&color=00F0FF&logo=github)](https://github.com/EngJoDev/LinguaCast/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg?style=for-the-badge&logo=python)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-Hardware_Accel-007808.svg?style=for-the-badge&logo=ffmpeg)](https://ffmpeg.org)

<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="LinguaCast AI Banner" width="100%" />
</p>

### ⚡ **Instant Studio-Grade Voice Dubbing, Neural Translation & Ultra-Precision Subtitling at 4K Resolution.**

[🌟 المميزات الرئيسية](#-المميزات-الرئيسية-key-features) •
[📐 الهيكل التقني](#-الهيكل-التقني-architecture) •
[⚙️ خط المعالجة الذكي](#️-دورة-عمل-معالجة-الذكاء-الاصطناعي-ai-pipeline) •
[🚀 التشغيل السريع](#-دليل-التشغيل-والتثبيت-quick-start) •
[🎨 واجهة المستخدم](#-واجهة-المستخدم-السينمائية-cinematic-ui) •
[🗺️ خارطة الطريق](#️-خارطة-الطريق-roadmap)

---

</div>

## 🌐 نظرة عامة (Overview)

**LinguaCast AI** هي منصة ويب سينمائية متكاملة من الطراز العالمي (Enterprise-Grade AI Media Suite) صُممت لإعادة تعريف صناعة الدبلجة والترجمة الرقمية للفيديو بدقة 4K. تجمع المنصة بين قوة نماذج المعالجة الصوتية العصبية فائقة الدقة (Whisper ASR & Microsoft Neural TTS)، ومحركات التعافي اللغوي الذكي (Sentence Healing)، وتوليد الترجمات السينمائية المتزامنة بدقة أجزاء الثانية، مع واجهة مستخدم مظلمة تحاكي معايير الجوائز العالمية (Awwwards-winning Dark Glassmorphism).

---

## 🌟 المميزات الرئيسية (Key Features)
╔════════════════════════════════════════════════════════════════════════════════╗
║ LINGUACAST AI CAPABILITIES ║
╠════════════════════════════════╦═══════════════════════════════════════════════╣
║ 🎙️ Whisper ASR Anti-Hallucination║ 🌍 150+ Global Languages & Dialects ║
║ 🩹 Smart Sentence Healing ║ 🔊 Neural Edge-TTS Voice Synthesis ║
║ ⏱️ Zero-Drift Timestamp Sync ║ 🎚️ 5-Band Studio Audio EQ Mixer ║
║ 🎛️ Dual-Sync Compare Player ║ 🖥️ 4K Ultra-HD Lossless Render Output ║
║ ✨ Nebula Canvas Particle FX ║ ⚡ Real-Time Cyberpunk Toast Engine ║
╚════════════════════════════════╩═══════════════════════════════════════════════╝
code
Code
- **دبلجة وترجمة فورية لأكثر من 150 لغة ولهجة:** تغطية شاملة لكافة اللهجات العربية (المصرية، السعودية، الشامية، الخليجية، المغاربية) بالإضافة لجميع اللغات الحية عالمياً.
- **تلاشي الهلوسة وانعدام التكرار:** استدعاء نموذج Whisper المضبوط بدقة هندسية تمنع تكرار المقاطع والكلمات المبتورة.
- **مزامنة زمنية سينمائية صفرية الخطأ (Zero-Drift Sync):** الحفاظ التام والمللي-ثانية على المدة الزمنية الأصلية للفيديو دون أي ترحيل صوتي عبر فلاتر FFmpeg المتقدمة.
- **مشغل سينمائي ثلاثي الأوضاع:**
  - **Neon Slider:** سلايدر مقارنة فوري بين الصوت/الفيديو الأصلي والمدبلج.
  - **Side-by-Side:** رؤية المقارنة جنباً إلى جنب لاختبار دقة الشفاه والتزامن.
  - **Cinema Theater:** تجربة عرض سينمائية كاملة بشاشة مكبرة.
- **ميكسر استوديو صوتي مدمج (5-Band Master EQ):** تحكم كامل في الترددات (Bass, Low-Mid, Mid, High-Mid, Treble) لإخراج صوت دبلجة معزول ونقي.
- **تصدير فوري مباشر (Direct Blob Streaming):** تنزيل مباشر للفيديوهات المعالجة بدقة تصل إلى 4K دون ضغط مفرط أو تشويه في الألوان.

---

## 📐 الهيكل التقني (Architecture)

```mermaid
graph TD
    User([المستخدم / المتصفح]) -->|رفع الفيديو + تحديد اللغة والصوت| Frontend[React 18 + Vite UI]
    Frontend -->|REST API Request / FormData| Backend[Flask API Server]
    
    subgraph AI Media Processing Engine
        Backend -->|1. استخراج وتضخيم الصوت| FFmpegExtract[FFmpeg Audio Extractor]
        FFmpegExtract -->|PCM S16LE 16kHz Mono| Whisper[Whisper ASR Model]
        Whisper -->|Raw Timed Segments| Healer[Sentence Healing Algorithm]
        Healer -->|Sanitized Sentences| TransEngine[Batch Neural Translator]
        TransEngine -->|Translated Script| EdgeTTS[Microsoft Neural Edge-TTS]
        EdgeTTS -->|High-Fidelity Audio Tracks| AudioStitch[Audio Segment Concatenation]
        AudioStitch -->|Dressed Audio Track| FFmpegMux[FFmpeg Muxer with apad filter]
    end
    
    FFmpegMux -->|الفيديو النهائي المدبلج 4K + ملف الترجمة VTT/SRT| Backend
    Backend -->|Streaming JSON + Blob Video| Frontend
    Frontend -->|عرض في المشغل المتزامن + تنزيل مباشر| User
📂 هيكلية مجلدات المشروع (Directory Tree)
code
Text
LinguaCast/
├── backend-api/
│   ├── server.py              # محرك السيرفر والـ AI Pipeline الرئيسي
│   ├── requirements.txt       # حزم ومكتبات البايثون المطلوبة
│   ├── uploads/               # مجلد مؤقت للفيديوهات المرفوعة (تلقائي)
│   └── outputs/               # مجلد المخرجات المعالجة والرندر النهائي
│
├── frontend/
│   ├── public/                # الأيقونات والملفات الثابتة
│   ├── src/
│   │   ├── App.jsx            # واجهة المستخدم السينمائية والمشغل الذكي
│   │   ├── main.jsx           # مدخل تطبيق React
│   │   ├── index.css          # تخصيصات Tailwind والتأثيرات الزجاجية
│   │   └── components/        # المكونات الفرعية والميكسر الصوتي
│   ├── package.json           # حزم واجهة React
│   ├── tailwind.config.js     # ضبط التصميم والنيون والـ Glassmorphism
│   └── vite.config.js         # ضبط بيئة البناء والتطوير السريع
│
├── docs/                      # التوثيق والصور التوضيحية
│   └── assets/                # لقطات الشاشة والشعارات
├── .gitignore                 # استبعاد الوسائط الثقيلة ومجلدات الكاش
└── README.md                  # التوثيق الشامل للمشروع
⚙️ دورة عمل معالجة الذكاء الاصطناعي (AI Pipeline)
تعتمد المنصة على خط إنتاج هندسي صارم من 6 مراحل لضمان أعلى جودة بث ممكنة:
code
Code
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│  1. استخراج    │      │ 2. التفريغ     │      │ 3. الترميم     │
│  الصوت وتضخيمه │ ───> │  الصوتي        │ ───> │  اللغوي الذكي  │
│  FFmpeg PCM    │      │  Whisper ASR   │      │ Sentence Heal  │
└────────────────┘      └────────────────┘      └────────────────┘
        │                                                │
        ▼                                                ▼
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│  6. الدمج      │      │ 5. التوليد     │      │ 4. الترجمة     │
│  السينمائي     │ <─── │  الصوتي العصبي │ <─── │  العصبية       │
│  FFmpeg [1:a]  │      │  Edge-TTS      │      │  Batch Engine  │
└────────────────┘      └────────────────┘      └────────────────┘
1️⃣ استخراج الصوت وتضخيمه (Acoustic Isolation)
يتم عزل مسار الصوت وتحويله إلى صيغة استوديو خام متوافقة مع متطلبات نماذج الذكاء الاصطناعي بدقة تضخيم مزدوجة:
code
Bash
ffmpeg -y -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 -af "volume=2.0" audio.wav
2️⃣ التفريغ الصوتي فائق الدقة (Whisper ASR)
استخدام نموذج Whisper المدعوم ببارامترات هندسية تمنع الهلوسة الصوتية وحلقات التكرار المفرغة:
beam_size = 1: لسرعة معالجة قصوى وخفض زمن الاستجابة.
temperature = 0: لضمان أدق مسار احتمالي وحذف التخمينات العشوائية.
condition_on_previous_text = False: لعزل المقاطع ومنع تكرار العبارات السابقة في حال وجود فترات صمت.
3️⃣ خوارزمية ترميم الجمل المكسورة (Sentence Healing Engine)
تعالج المشكلة الشائعة لنماذج ASR التي تقطع الجمل بسبب سكتات النفس والوقفات الطبيعية للمتحدث. تقوم الخوارزمية بدمج العبارات المبتورة وإزالة علامات الترقيم الوهمية لإعادة بناء سياق نحوي سليم قبل الترجمة.
4️⃣ الترجمة العصبية المجمعة (Batch Neural Translation)
إرسال النصوص بنظام الدفعات الموحدة (Batch Payload) لتقليل زمن الشبكة ومنع قيود الـ Rate Limit.
ترويسات متصفح كاملة (Custom Realistic User-Agents).
قاموس التنقية البلاغية: قاموس استبدال مدمج لتنقية الترجمة العربية وتصحيح المصطلحات الصوتية والتقنية لتظهر بأسلوب فصيح وجذاب.
5️⃣ التوليد الصوتي العصبي (Neural TTS Synthesis)
توليد النبرة الصوتية باستخدام خوادم Microsoft Edge Neural بأصوات طبيعية تماثل المذيعين البشريين:
اللهجة المصرية: ar-EG-ShakirNeural / ar-EG-SalmaNeural
اللهجة السعودية: ar-SA-HamedNeural / ar-SA-ZariyahNeural
بالإضافة لأكثر من 150 صوتاً دولياً مع دعم تعديل طبقة الصوت والسرعة تلقائياً لتناسب زمن اللقطة.
6️⃣ الدمج والمزامنة الصفرية (Zero-Drift Muxing)
لمنع أي تقصير في مدة الفيديو أو اختلاف بين الصوت والصورة بنهاية الفيديو، يُستخدم الفلتر الصوتي المتقدم [1:a]apad:
code
Bash
ffmpeg -y -i input.mp4 -i dubbed.wav -c:v copy \
  -filter_complex "[1:a]apad=whole_dur=VIDEO_EXACT_DURATION[a]" \
  -map 0:v:0 -map "[a]" -shortest output_4k_dubbed.mp4
يضمن هذا الإجراء مطابقة طول الفيديو الأصلي (مثال: 29.670s) بالمللي ثانية التامة دون اقتطاع أو تكرار أسود.
🎨 واجهة المستخدم السينمائية (Cinematic UI)
<div align="center">
<img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80" alt="Cinematic Glassmorphism UI" width="95%" style="border-radius: 12px; box-shadow: 0 0 35px rgba(0, 240, 255, 0.25);" />
</div>
Cyberpunk & Glassmorphism Design: خلفية ديناميكية مبنية بـ HTML5 Canvas لمحاكاة سديم كوني متفاعل (Cosmic Nebula Particles).
Netflix Golden Subtitles: شريط ترجمة سينمائي باللون الذهبي المميز، يتزامن بالمللي ثانية وفقاً لتوقيت Number(s.start) مع مؤثرات Glow خافتة تمنع إجهاد العين.
Dual Neon Comparison Slider: محرك تفاعلي يتيح لك سحب الخط الفاصل أفقياً للمقارنة المباشرة بين الصوت/الفيديو الأصلي والمدبلج لحظياً.
Cyberpunk Toast Notification: نظام إشعارات عائم بتأثير زجاجي ثلاثي الأبعاد يُعلمك باكتمال مراحل المعالجة ونجاح التصدير.
Studio Master 5-Band EQ: ميكسر صوتي متقدم يتيح التحكم بالترددات:
Sub-Bass (60Hz)
Bass (250Hz)
Midrange (1kHz)
Upper Mid (4kHz)
Presence / Air (12kHz)
🚀 دليل التشغيل والتثبيت (Quick Start)
📋 المتطلبات الأساسية (Prerequisites)
تأكد من تثبيت الأدوات التالية على نظامك:
Node.js (الإصدار v18.0.0 أو أحدث) & npm
Python (الإصدار 3.10 أو أحدث)
FFmpeg مثبت ومضاف لمسار النظام (System PATH).
code
Bash
# للتأكد من تثبيت FFmpeg:
ffmpeg -version
1️⃣ تشغيل السيرفر الخلفي (Backend API)
code
Bash
# 1. الدخول إلى مجلد السيرفر
cd backend-api

# 2. إنشاء بيئة عمل افتراضية (Virtual Environment)
python3 -m venv venv

# تفعيل البيئة (Linux / macOS):
source venv/bin/activate
# تفعيل البيئة (Windows PowerShell):
# .\venv\Scripts\Activate.ps1

# 3. تثبيت الحزم المطلوبة
pip install -r requirements.txt

# 4. تشغيل السيرفر
python3 server.py
⚡ يعمل السيرفر افتراضياً على: http://localhost:5000
2️⃣ تشغيل واجهة المستخدم (Frontend Web App)
افتح نافذة Terminal جديدة:
code
Bash
# 1. الدخول إلى مجلد الواجهة
cd frontend

# 2. تثبيت الحزم والمكتبات
npm install

# 3. بدء خادم التطوير السريع (Vite Dev Server)
npm run dev
🚀 تفتح الواجهة التفاعلية على: http://localhost:5173
🔌 نقاط النهاية للـ API (RESTful Endpoints)
Method	Endpoint	Description	Payload / Parameters
GET	/api/health	فحص جاهزية السيرفر والعتاد	لا يوجد
GET	/api/languages	جلب قائمة الـ 150 لغة ولهجة مع معرفات الأصوات	لا يوجد
POST	/api/dub	رفع الفيديو والبدء في دورة المعالجة والدبلجة	multipart/form-data (video, target_lang, voice_id)
GET	/api/status/<task_id>	متابعة حالة المعالجة الحالية لحظياً	task_id في المسار
GET	/api/download/<filename>	تنزيل الفيديو النهائي المعالج بدقة 4K	filename في المسار
🛠️ استكشاف الأخطاء وحلها (Troubleshooting)
🗺️ خارطة الطريق (Roadmap)

محرك تفريغ Whisper ASR مع تقنيات مكافحة الهلوسة.

نظام دمج زمني Zero-Drift عبر FFmpeg apad filter.

واجهة Neon Slider ثنائية ومقارنة جنباً لجنب.

ميكسر استوديو صوتي 5-Band Master EQ.

Voice Cloning: استنساخ بصمة صوت المتحدث الحقيقي بدقة عصبية عبر XTTS-v2.

AI Lip-Sync Integration: مطابقة حركة الشفاه آلياً مع الكلمات المدبلجة.

SaaS Billing & Subscriptions: ربط بوابات الدفع العالمية والمحلية (Stripe & Paymob).

Cloud Distributed Workers: فصل المعالجة الثقيلة عبر Celery وRedis لتشغيل مئات العمليات المتزامنة.
👨‍💻 المطور وصاحب المشروع (Lead Architect)
تم بناء وتطوير المشروع بواسطة المهندس:
Eng. Youssef (EngJoDev)
GitHub: @EngJoDev
المستودع الرسمي: LinguaCast
📜 الترخيص (License)
هذا المشروع مرخص بموجب رخصة MIT License — راجع ملف LICENSE للمزيد من التفاصيل.
<div align="center">
<sub>صُنع بكل إتقان واحترافية بواسطة فريق هندسة LinguaCast AI 🚀</sub>
</div>
```
35.8s
info
Google AI models may make mistakes, so double-check outputs.
Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.
Start typing a prompt

lightbulb
This agent can execute code, take real actions, and use large number of tokens. You can stop the agent at any time.
Learn more
