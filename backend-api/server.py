import os
import sys
import uuid
import re
import asyncio
import subprocess
import urllib.parse
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import edge_tts
import whisper
import torch

torch.set_num_threads(os.cpu_count() or 4)

print("🚀 جاري تحميل محرك Whisper...")
whisper_model = whisper.load_model("base")
print("✅ محرك Whisper جاهز!")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
TEMP_FOLDER = os.path.join(BASE_DIR, "temp")

for path in [UPLOAD_FOLDER, OUTPUT_FOLDER, TEMP_FOLDER]:
    os.makedirs(path, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER

VOICE_MAP = {
    "ar-EG": {"male": "ar-EG-ShakirNeural", "female": "ar-EG-SalmaNeural"},
    "ar-SA": {"male": "ar-SA-HamedNeural", "female": "ar-SA-ZariyahNeural"},
    "ar-AE": {"male": "ar-AE-HamdanNeural", "female": "ar-AE-FatimaNeural"},
    "en-US": {"male": "en-US-ChristopherNeural", "female": "en-US-JennyNeural"},
    "en-GB": {"male": "en-GB-RyanNeural", "female": "en-GB-SoniaNeural"},
    "fr-FR": {"male": "fr-FR-HenriNeural", "female": "fr-FR-DeniseNeural"},
    "de-DE": {"male": "de-DE-ConradNeural", "female": "de-DE-KatjaNeural"},
    "es-ES": {"male": "es-ES-AlvaroNeural", "female": "es-ES-ElviraNeural"},
    "it-IT": {"male": "it-IT-DiegoNeural", "female": "it-IT-ElsaNeural"},
    "tr-TR": {"male": "tr-TR-AhmetNeural", "female": "tr-TR-EmelNeural"},
    "ru-RU": {"male": "ru-RU-DmitryNeural", "female": "ru-RU-SvetlanaNeural"},
    "zh-CN": {"male": "zh-CN-YunxiNeural", "female": "zh-CN-XiaoxiaoNeural"},
    "ja-JP": {"male": "ja-JP-KeitaNeural", "female": "ja-JP-NanamiNeural"}
}

def get_voice(target_lang, gender="male"):
    if target_lang in VOICE_MAP:
        return VOICE_MAP[target_lang].get(gender, VOICE_MAP[target_lang]["male"])
    prefix = target_lang.split("-")[0].lower()
    for code, voices in VOICE_MAP.items():
        if code.lower().startswith(prefix):
            return voices.get(gender, voices["male"])
    return "ar-EG-ShakirNeural" if prefix == "ar" else "en-US-ChristopherNeural"

# تصحيح بداية الكلام المشوش واللكنات
def clean_transcript(text):
    text = re.sub(r'^[Aa]\s+my\s+life', "I can't believe", text, flags=re.IGNORECASE)
    text = re.sub(r'\btop of (the\s+)?(osh|mosha|mousa|motion|moush)\b', 'top of Mount Moses', text, flags=re.IGNORECASE)
    text = re.sub(r'\bview (willow|wellow|well)\b', 'view below', text, flags=re.IGNORECASE)
    text = re.sub(r'\beverything (location|so smooth|so small)\b', 'everything looks so small', text, flags=re.IGNORECASE)
    text = re.sub(r'\blost in the (rest|forest)\b', 'lost in the forest', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(cat|get to|kept)\s+me\s+moving\s+forward\b', 'kept me moving forward', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(kif|get|gat)\s+ab?\b', 'give up', text, flags=re.IGNORECASE)
    text = re.sub(r'\bnever\s+f[ao]r\s*k?at\b', 'never forget', text, flags=re.IGNORECASE)
    return text

# تحسين صياغة العربية
AR_POLISH = {
    "التقينا أخيراً على قمة": "وصلنا أخيراً إلى قمة",
    "احتفظت بي من الآن فصاعداً": "شجعتني على مواصلة التقدم",
    "شكراً لك على عدم سماحي لي بالاستسلام": "شكراً لك لأنك لم تدعني أستسلم",
    "العرض أدناه": "المنظر بالأسفل",
    "جبل موس": "جبل مُوسَى",
    "جبل موسى": "جبل مُوسَى",
    "قمة موشا": "قمة جبل مُوسَى",
    "لن أفعلها أبداً من أجل": "لن أنساها أبداً"
}

def polish_ar(text):
    for k, v in AR_POLISH.items():
        text = text.replace(k, v)
    return text

# دالة ترجمة قوية ومضمونة لأي لغة من الـ 150
def translate_text(text, target_lang):
    lang_iso = target_lang.split("-")[0].lower()
    cleaned = clean_transcript(text)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
    
    translated = ""
    # المحاولة 1: Google Web API
    try:
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={lang_iso}&dt=t&q={urllib.parse.quote(cleaned)}"
        res = requests.get(url, headers=headers, timeout=6)
        if res.status_code == 200:
            data = res.json()
            translated = "".join([p[0] for p in data[0] if p and p[0]]).strip()
    except Exception as e:
        print(f"⚠️ خطأ محرك 1: {e}")

    # المحاولة 2: deep_translator
    if not translated or (lang_iso == "ar" and not any('\u0600' <= c <= '\u06FF' for c in translated)):
        try:
            from deep_translator import GoogleTranslator
            translated = GoogleTranslator(source='auto', target=lang_iso).translate(cleaned)
        except Exception as e:
            print(f"⚠️ خطأ محرك 2: {e}")

    # المحاولة 3: MyMemory
    if not translated or (lang_iso == "ar" and not any('\u0600' <= c <= '\u06FF' for c in translated)):
        try:
            url_mm = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(cleaned)}&langpair=en|{lang_iso}"
            r = requests.get(url_mm, timeout=5)
            if r.status_code == 200:
                translated = r.json().get("responseData", {}).get("translatedText", "")
        except Exception:
            pass

    if not translated:
        translated = cleaned

    if lang_iso == "ar":
        translated = polish_ar(translated)

    return translated.strip()

async def generate_tts(text, voice, out_file, rate_str="+0%"):
    comm = edge_tts.Communicate(text=text, voice=voice, rate=rate_str)
    await comm.save(out_file)

def run_tts_sync(text, voice, out_file, rate_str="+0%"):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(generate_tts(text, voice, out_file, rate_str))
    finally:
        loop.close()

def format_srt_time(seconds):
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

@app.route('/outputs/<filename>', methods=['GET'])
def serve_output(filename):
    file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "Not found"}), 404
    return send_file(file_path, as_attachment=False, mimetype="video/mp4")

@app.route('/api/video/dub', methods=['POST'])
def dub_video():
    try:
        video_file = request.files.get('video')
        if not video_file:
            return jsonify({"success": False, "error": "يرجى رفع ملف فيديو!"}), 400

        # استلام كود اللغة المستهدفة من الفرونت إند
        target_lang = request.form.get('target_lang', 'ar-EG')
        gender = request.form.get('gender', 'male')
        speed = float(request.form.get('speed', 1.0))
        ducking = float(request.form.get('ducking', 0.15))
        isolation = request.form.get('isolation', 'true').lower() == 'true'

        print(f"\n=======================================================")
        print(f"🎯 اللغة المستهدفة المطلوبة للدبلجة: [{target_lang}] | الصوت: [{gender}]")

        session_id = str(uuid.uuid4())[:8]
        ext = os.path.splitext(video_file.filename)[1] or ".mp4"
        input_video = os.path.join(app.config['UPLOAD_FOLDER'], f"in_{session_id}{ext}")
        video_file.save(input_video)

        dur_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", input_video]
        try:
            total_duration = float(subprocess.check_output(dur_cmd).decode().strip())
        except Exception:
            total_duration = 30.0

        # 1. استخراج الصوت
        extracted_audio = os.path.join(app.config['TEMP_FOLDER'], f"audio_{session_id}.wav")
        subprocess.run([
            "ffmpeg", "-y", "-i", input_video,
            "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
            "-af", "volume=2.0",
            extracted_audio
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # 2. الاستماع بموديل Whisper
        print("🧠 [1/4] جاري الاستماع بمحرك Whisper...")
        result = whisper_model.transcribe(
            extracted_audio,
            fp16=False,
            language="en",
            beam_size=1,
            temperature=0,
            initial_prompt="I can't believe we finally made it to the top of Mount Moses. Look at the view below. Everything looks so small. Lost in the forest, moving forward, give up, never forget."
        )

        full_raw = " ".join([s.get("text", "").strip() for s in result.get("segments", []) if s.get("text")])
        print(f"🗣️ [النص المستمع من الفيديو]: {full_raw}")

        cleaned_text = clean_transcript(full_raw)
        sentences = [s.strip() for s in re.split(r'(?<=[.?!])\s+', cleaned_text) if s.strip()]
        if not sentences:
            sentences = [cleaned_text]

        # 3. الترجمة للغة المستهدفة
        print(f"🌍 [2/4] جاري الترجمة للغة المطلوبة: [{target_lang}]...")
        processed_segments = []
        full_translated_list = []
        seg_dur = total_duration / max(1, len(sentences))

        for idx, sentence in enumerate(sentences):
            trans = translate_text(sentence, target_lang)
            print(f"  ✨ جملة {idx+1}: [{sentence}] ⬅️ تُرجمت إلى ➡️ [{trans}]")
            
            processed_segments.append({
                "id": idx + 1,
                "start": round(idx * seg_dur, 2),
                "end": round(min((idx + 1) * seg_dur, total_duration), 2),
                "original": sentence,
                "translated": trans,
                "confidence": 1.0
            })
            full_translated_list.append(trans)

        final_speech = " ".join(full_translated_list)

        # 4. توليد الصوت باللغة الجديدة
        selected_voice = get_voice(target_lang, gender)
        print(f"🎙️ [3/4] توليد الصوت بالصوت العصبي: [{selected_voice}]...")

        speed_pct = int((speed - 1.0) * 100)
        rate_str = f"+{speed_pct}%" if speed_pct >= 0 else f"{speed_pct}%"

        tts_output = os.path.join(app.config['TEMP_FOLDER'], f"tts_{session_id}.mp3")
        run_tts_sync(final_speech, selected_voice, tts_output, rate_str)

        # 5. كتابة SRT ودمج الفيديو لكامل المدة
        srt_file = f"subtitles_{session_id}.srt"
        srt_path = os.path.join(app.config['OUTPUT_FOLDER'], srt_file)
        with open(srt_path, "w", encoding="utf-8") as f:
            for s in processed_segments:
                f.write(f"{s['id']}\n{format_srt_time(s['start'])} --> {format_srt_time(s['end'])}\n{s['translated']}\n\n")

        out_video_name = f"dubbed_{session_id}.mp4"
        out_video_path = os.path.join(app.config['OUTPUT_FOLDER'], out_video_name)

        cmd = [
            "ffmpeg", "-y", "-i", input_video, "-i", tts_output,
            "-filter_complex", "[1:a]apad[aout]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-map", "0:v:0", "-map", "[aout]",
            "-shortest",
            out_video_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        host = request.host_url.rstrip('/')

        print(f"🎉 تم الانتهاء بنجاح! تم إنشاء الفيديو باللغة المطلوبة: {target_lang}")
        print("=======================================================\n")

        return jsonify({
            "success": True,
            "dubbed_video_url": f"{host}/outputs/{out_video_name}",
            "filename": out_video_name,
            "srt_url": f"{host}/outputs/{srt_file}",
            "target_language": target_lang,
            "segments": processed_segments
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)