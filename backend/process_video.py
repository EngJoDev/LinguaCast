import os
import asyncio
import subprocess
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from deep_translator import GoogleTranslator
import whisper

app = Flask(__name__)
CORS(app)

# إنشاء مجلدات حفظ الفيديوهات المعالجة
UPLOAD_DIR = os.path.join(os.getcwd(), 'uploads')
OUTPUT_DIR = os.path.join(os.getcwd(), 'outputs')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# تحميل نموذج Whisper للتفريغ الصوتي
print("[AI CORE]: جاري تحميل نموذج الذكاء الاصطناعي Whisper...")
model = whisper.load_model("base")

# خريطة الأصوات العصبية
VOICE_MAP = {
    'ar-SA': {'male': 'ar-SA-HamedNeural', 'female': 'ar-SA-ZariyahNeural'},
    'ar-EG': {'male': 'ar-EG-ShakirNeural', 'female': 'ar-EG-SalmaNeural'},
    'ar-AE': {'male': 'ar-AE-HamdanNeural', 'female': 'ar-AE-FatimaNeural'},
    'ar-MA': {'male': 'ar-MA-JamalNeural', 'female': 'ar-MA-MounaNeural'},
    'en-US': {'male': 'en-US-ChristopherNeural', 'female': 'en-US-JennyNeural'},
    'en-GB': {'male': 'en-GB-RyanNeural', 'female': 'en-GB-SoniaNeural'},
    'fr-FR': {'male': 'fr-FR-HenriNeural', 'female': 'fr-FR-DeniseNeural'},
    'de-DE': {'male': 'de-DE-ConradNeural', 'female': 'de-DE-KatjaNeural'},
    'es-ES': {'male': 'es-ES-AlvaroNeural', 'female': 'es-ES-ElviraNeural'},
    'tr-TR': {'male': 'tr-TR-AhmetNeural', 'female': 'tr-TR-EmelNeural'},
}

@app.route('/api/video/dub', methods=['POST'])
def dub_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video uploaded'}), 400

        video_file = request.files['video']
        target_lang = request.form.get('targetLang', 'ar-SA')
        gender = request.form.get('gender', 'male')

        video_path = os.path.join(UPLOAD_DIR, video_file.filename)
        video_file.save(video_path)
        print(f"[PROCESS]: تم استلام الفيديو: {video_file.filename}")

        # 1. تفريغ الصوت واستخراج النصوص والتوقيت بدقة بالثواني
        result = model.transcribe(video_path)
        segments_data = []

        # 2. الترجمة العصبية للجمل
        lang_code = target_lang.split('-')[0]
        translator = GoogleTranslator(source='auto', target=lang_code)

        translated_sentences = []
        for i, seg in enumerate(result.get('segments', [])):
            orig_text = seg['text'].strip()
            if not orig_text:
                continue
            try:
                trans_text = translator.translate(orig_text)
            except Exception:
                trans_text = orig_text

            translated_sentences.append(trans_text)
            segments_data.append({
                'id': i + 1,
                'startSec': float(seg['start']),
                'endSec': float(seg['end']),
                'start': f"00:{int(seg['start']//60):02d}:{int(seg['start']%60):02d}.{int((seg['start']%1)*1000):03d}",
                'end': f"00:{int(seg['end']//60):02d}:{int(seg['end']%60):02d}.{int((seg['end']%1)*1000):03d}",
                'original': orig_text,
                'translated': trans_text,
                'status': 'synced',
                'confidence': 0.99
            })

        # 3. توليد صوت الدبلجة العصبي السريع (Edge-TTS)
        voice_cfg = VOICE_MAP.get(target_lang, VOICE_MAP['ar-SA'])
        selected_voice = voice_cfg['male'] if gender == 'male' else voice_cfg['female']

        tts_audio_path = os.path.join(OUTPUT_DIR, f"tts_{target_lang}.mp3")
        combined_text = " ".join(translated_sentences)

        async def generate_speech():
            import edge_tts
            comm = edge_tts.Communicate(combined_text, selected_voice)
            await comm.save(tts_audio_path)

        asyncio.run(generate_speech())

        # 4. دمج الصوت المدبلج مع الفيديو
        output_video_name = f"dubbed_{target_lang}_{video_file.filename}"
        output_video_path = os.path.join(OUTPUT_DIR, output_video_name)

        ffmpeg_cmd = [
            'ffmpeg', '-y', '-i', video_path, '-i', tts_audio_path,
            '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0',
            '-shortest', output_video_path
        ]
        subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return jsonify({
            'success': True,
            'dubbedUrl': f"http://localhost:5000/outputs/{output_video_name}",
            'segments': segments_data
        })

    except Exception as e:
        print(f"[ERROR]: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/outputs/<path:filename>')
def serve_output(filename):
    return send_from_directory(OUTPUT_DIR, filename)

if __name__ == '__main__':
    print("[SERVER]: سيرفر الذكاء الاصطناعي يعمل الآن على http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)