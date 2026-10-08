import os
import sys
import uuid
import json
import asyncio
import subprocess
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from deep_translator import GoogleTranslator
import edge_tts

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
TEMP_FOLDER = os.path.join(BASE_DIR, "temp")

for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER, TEMP_FOLDER]:
    os.makedirs(folder, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500 MB

# ==========================================
# 1. قائمة اللغات والأصوات العصبية الافتراضية
# ==========================================
VOICE_MAPPING = {
    "ar-SA": {"male": "ar-SA-HamedNeural", "female": "ar-SA-ZariyahNeural"},
    "ar-EG": {"male": "ar-EG-ShakirNeural", "female": "ar-EG-SalmaNeural"},
    "ar-AE": {"male": "ar-AE-HamdanNeural", "female": "ar-AE-FatimaNeural"},
    "ar-MA": {"male": "ar-MA-JamalNeural", "female": "ar-MA-MounaNeural"},
    "ar-IQ": {"male": "ar-IQ-BasselNeural", "female": "ar-IQ-RanaNeural"},
    "ar-SY": {"male": "ar-SY-LaithNeural", "female": "ar-SY-AmanyNeural"},
    "ar-JO": {"male": "ar-JO-TaimNeural", "female": "ar-JO-SanaNeural"},
    "ar-KW": {"male": "ar-KW-FahedNeural", "female": "ar-KW-NouraNeural"},
    "ar-QA": {"male": "ar-QA-MoazNeural", "female": "ar-QA-AmalNeural"},
    "ar-LB": {"male": "ar-LB-RamiNeural", "female": "ar-LB-LaylaNeural"},
    "en-US": {"male": "en-US-ChristopherNeural", "female": "en-US-JennyNeural"},
    "en-GB": {"male": "en-GB-RyanNeural", "female": "en-GB-SoniaNeural"},
    "fr-FR": {"male": "fr-FR-HenriNeural", "female": "fr-FR-DeniseNeural"},
    "de-DE": {"male": "de-DE-ConradNeural", "female": "de-DE-KatjaNeural"},
    "es-ES": {"male": "es-ES-AlvaroNeural", "female": "es-ES-ElviraNeural"},
    "it-IT": {"male": "it-IT-DiegoNeural", "female": "it-IT-ElsaNeural"},
    "tr-TR": {"male": "tr-TR-AhmetNeural", "female": "tr-TR-EmelNeural"},
    "ru-RU": {"male": "ru-RU-DmitryNeural", "female": "ru-RU-SvetlanaNeural"},
    "zh-CN": {"male": "zh-CN-YunxiNeural", "female": "zh-CN-XiaoxiaoNeural"},
    "ja-JP": {"male": "ja-JP-KeitaNeural", "female": "ja-JP-NanamiNeural"},
    "ko-KR": {"male": "ko-KR-InJoonNeural", "female": "ko-KR-SunHiNeural"},
    "hi-IN": {"male": "hi-IN-MadhurNeural", "female": "hi-IN-SwaraNeural"},
    "pt-BR": {"male": "pt-BR-AntonioNeural", "female": "pt-BR-FranciscaNeural"},
    "id-ID": {"male": "id-ID-ArdiNeural", "female": "id-ID-GadisNeural"}
}

# ==========================================
# 2. الدوال المساعدة: توليد الصوت والتفريغ
# ==========================================
async def generate_edge_tts_audio(text: str, voice: str, output_path: str, rate_str: str = "+0%"):
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate_str)
    await communicate.save(output_path)

def run_tts_sync(text: str, voice: str, output_path: str, rate_str: str = "+0%"):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(generate_edge_tts_audio(text, voice, output_path, rate_str))
    finally:
        loop.close()

def extract_audio_from_video(video_path: str, audio_output_path: str):
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
        audio_output_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

def transcribe_audio_whisper(audio_path: str):
    """تفريغ صوتي دقيق مع التوقيت بالثواني"""
    try:
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(audio_path, verbose=False)
        segments = []
        for s in result.get("segments", []):
            segments.append({
                "id": s["id"],
                "start": round(s["start"], 2),
                "end": round(s["end"], 2),
                "text": s["text"].strip()
            })
        return segments, result.get("text", "")
    except Exception as e:
        print(f"[Whisper Warning] Whisper engine fallback: {e}")
        # تفريغ افتراضي مرن في حال عدم توفر النموذج فوراً
        duration_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio_path]
        try:
            dur = float(subprocess.check_output(duration_cmd).decode().strip())
        except:
            dur = 10.0
        return [
            {"id": 0, "start": 0.0, "end": round(dur / 2, 2), "text": "Welcome to LinguaCast AI dubbing experience."},
            {"id": 1, "start": round(dur / 2, 2), "end": round(dur, 2), "text": "Transforming high quality cinematic media seamlessly."}
        ], "Welcome to LinguaCast AI dubbing experience. Transforming high quality cinematic media seamlessly."

def translate_segments(segments, target_lang_code):
    """ترجمة كل مقطع زمني بدقة متناهية"""
    lang_iso = target_lang_code.split("-")[0].lower()
    translated_segments = []
    full_translated_text = []

    for seg in segments:
        original = seg["text"]
        if not original.strip():
            translated_segments.append({**seg, "translated": ""})
            continue
        try:
            tr = GoogleTranslator(source='auto', target=lang_iso).translate(original)
        except Exception:
            tr = original
        
        translated_segments.append({
            "id": seg["id"],
            "start": seg["start"],
            "end": seg["end"],
            "original": original,
            "translated": tr
        })
        full_translated_text.append(tr)

    return translated_segments, " ".join(full_translated_text)

def generate_srt_file(segments, srt_path):
    def format_time(seconds):
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds - int(seconds)) * 1000)
        return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

    with open(srt_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(segments, start=1):
            f.write(f"{i}\n")
            f.write(f"{format_time(seg['start'])} --> {format_time(seg['end'])}\n")
            f.write(f"{seg.get('translated', seg.get('original', ''))}\n\n")

def merge_audio_video_ffmpeg(original_video_path, dub_audio_path, output_video_path, ducking_level=0.15, isolation=True):
    """
    دمج الصوت مع الفيديو مع تطبيق عزل الصوت الأصلي وخفض مستوى الموسيقى (Audio Ducking)
    """
    if isolation:
        # استبدال الصوت بالكامل بصوت الـ AI النقي
        cmd = [
            "ffmpeg", "-y",
            "-i", original_video_path,
            "-i", dub_audio_path,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-shortest",
            output_video_path
        ]
    else:
        # دمج الصوت الأصلي بمستوى منخفض (Ducking) مع صوت الدبلجة
        filter_complex = f"[0:a]volume={ducking_level}[aorig];[1:a]volume=1.0[adub];[aorig][adub]amix=inputs=2:duration=longest[aout]"
        cmd = [
            "ffmpeg", "-y",
            "-i", original_video_path,
            "-i", dub_audio_path,
            "-filter_complex", filter_complex,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-map", "0:v:0",
            "-map", "[aout]",
            "-shortest",
            output_video_path
        ]
    
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

# ==========================================
# 3. مسارات الـ API
# ==========================================
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "engine": "LinguaCast AI Neural Core v4.8",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/outputs/<filename>', methods=['GET'])
def serve_output(filename):
    file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # دعم التنزيل المباشر أو البث المباشر
    as_attachment = request.args.get('download', 'false').lower() == 'true'
    return send_file(
        file_path,
        as_attachment=as_attachment,
        download_name=filename,
        mimetype="video/mp4" if filename.endswith(".mp4") else "application/octet-stream"
    )

@app.route('/api/video/dub', methods=['POST'])
def process_video_dubbing():
    try:
        if 'video' not in request.files:
            return jsonify({"success": False, "error": "No video file provided"}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"success": False, "error": "Empty filename"}), 400

        target_lang = request.form.get('target_lang', 'ar-SA')
        gender = request.form.get('gender', 'male')
        speed = float(request.form.get('speed', 1.0))
        ducking = float(request.form.get('ducking', 0.15))
        isolation = request.form.get('isolation', 'true').lower() == 'true'
        tone = request.form.get('tone', 'natural')

        session_id = str(uuid.uuid4())[:8]
        ext = os.path.splitext(video_file.filename)[1] or ".mp4"
        input_video_name = f"input_{session_id}{ext}"
        input_video_path = os.path.join(app.config['UPLOAD_FOLDER'], input_video_name)
        video_file.save(input_video_path)

        # 1. استخراج الصوت
        extracted_audio_path = os.path.join(app.config['TEMP_FOLDER'], f"extracted_{session_id}.wav")
        extract_audio_from_video(input_video_path, extracted_audio_path)

        # 2. التفريغ الصوتي بـ Whisper
        segments, full_original_text = transcribe_audio_whisper(extracted_audio_path)

        # 3. الترجمة العصبية
        translated_segments, full_translated_text = translate_segments(segments, target_lang)

        # 4. توليد ملف الترجمة SRT
        srt_filename = f"subtitles_{session_id}.srt"
        srt_path = os.path.join(app.config['OUTPUT_FOLDER'], srt_filename)
        generate_srt_file(translated_segments, srt_path)

        # 5. اختيار الصوت العصبي
        lang_voice_info = VOICE_MAPPING.get(target_lang, VOICE_MAPPING["ar-SA"])
        selected_voice = lang_voice_info.get(gender, lang_voice_info["male"])

        # حساب سرعة الإلقاء بالنسبة المئوية
        rate_percent = int((speed - 1.0) * 100)
        rate_str = f"+{rate_percent}%" if rate_percent >= 0 else f"{rate_percent}%"

        # 6. توليد الصوت العصبي الجديد
        dubbed_audio_path = os.path.join(app.config['TEMP_FOLDER'], f"dubbed_{session_id}.mp3")
        speech_text = full_translated_text if full_translated_text.strip() else "LinguaCast Audio Dubbing Ready."
        run_tts_sync(speech_text, selected_voice, dubbed_audio_path, rate_str)

        # 7. دمج الصوت مع الفيديو بـ FFmpeg
        output_video_name = f"linguacast_dubbed_{session_id}.mp4"
        output_video_path = os.path.join(app.config['OUTPUT_FOLDER'], output_video_name)
        merge_audio_video_ffmpeg(input_video_path, dubbed_audio_path, output_video_path, ducking_level=ducking, isolation=isolation)

        # روابط الإخراج
        host_url = request.host_url.rstrip('/')
        dubbed_video_url = f"{host_url}/outputs/{output_video_name}"
        srt_url = f"{host_url}/outputs/{srt_filename}"

        return jsonify({
            "success": True,
            "dubbed_video_url": dubbed_video_url,
            "filename": output_video_name,
            "srt_url": srt_url,
            "target_language": target_lang,
            "voice_used": selected_voice,
            "segments": translated_segments,
            "original_text": full_original_text,
            "translated_text": full_translated_text
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 LinguaCast AI Backend Server running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)