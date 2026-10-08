
FROM python:3.11-slim

WORKDIR /app

# 1. نسخ ملف المكتبات وتثبيتها (Docker هيقراها من الكاش اللي أخد ساعة ومش هيعيد تحميلها)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. 🌟 تثبيت أداة FFmpeg هنا عشان يلقط الكاش اللي فوق وينزل الأدوات دي في ثواني
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# 3. نسخ باقي ملفات ومجلدات المشروع (بما فيها مجلد app الجديد)
COPY . .

# 4. فتح المنفذ الخاص بسيرفر الـ Python
EXPOSE 8001

# 5. أمر التشغيل النهائي الصحيح بناءً على الهيكلية الجديدة
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
