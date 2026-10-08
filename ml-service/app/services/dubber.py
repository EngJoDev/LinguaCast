import os
import re
import asyncio
import subprocess
from typing import Dict, Any
from faster_whisper import WhisperModel
import edge_tts
from google import genai

# Create storage directory
os.makedirs("storage", exist_ok=True)

# Actual Gemini API Key
GEMINI_API_KEY = "AQ.Ab8RN6I6Z4siWVOy2057wkGfEMJOtg9QfwGEvOeG4K1BxosmAg"

# Initialize Official New Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", GEMINI_API_KEY))

# 1. Load Whisper Model
print("[INFO] Loading Whisper Model...")
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")

def clean_text_for_tts(text: str) -> str:
    """Clean Arabic text before sending to TTS"""
    clean = re.sub(r'\s+', ' ', text)
    clean = re.sub(r'[^\w\s\u0600-\u06FF\.\,\!\?]', '', clean)
    return clean.strip()

def get_audio_duration(file_path: str) -> float:
    """Calculate audio duration using ffprobe"""
    try:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", file_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=True, text=True)
        return float(result.stdout.strip())
    except Exception as e:
        print(f"[WARNING] ffprobe error: {e}")
        return 0.0

def translate_and_correct_with_gemini(raw_english_text: str) -> str:
    """Dynamically try available models and skip deprecated ones"""
    prompt = (
        "You are an expert video dubbing translator and speech-to-text corrector.\n"
        "The text below was transcribed from audio and contains speech-to-text transcription errors "
        "(e.g., 'top of motion' instead of 'top of the mountain', 'sink a lot' instead of 'see the city').\n\n"
        "Task:\n"
        "1. Correct any transcription mistakes based on natural context.\n"
        "2. Translate the corrected meaning into high-quality, natural Arabic for dubbing.\n"
        "3. Output ONLY the Arabic translation. No English text, no quotes, no explanations.\n\n"
        f'Source Text: "{raw_english_text}"'
    )

    try:
        available_models = list(client.models.list())
    except Exception as e:
        print(f"[ERROR] Could not list models: {e}")
        available_models = []

    # Iterate over available models and test generation
    for m in available_models:
        name = m.name.replace("models/", "")
        
        # Skip non-text models
        if "embed" in name or "imagen" in name:
            continue
            
        try:
            print(f"[INFO] Trying active model: {name}...")
            response = client.models.generate_content(
                model=name,
                contents=prompt,
            )
            translated = response.text.strip()
            print(f"[SUCCESS] Gemini Translation Completed using {name}!")
            return translated
        except Exception as err:
            print(f"[WARNING] Model {name} failed or deprecated: {err}")
            continue

    raise Exception("No active Gemini model supported content generation for this API key.")

async def generate_edge_tts_audio(arabic_text: str, output_path: str, gender: str = "male"):
    """Generate human-like Arabic voice using Edge TTS"""
    clean_arabic = clean_text_for_tts(arabic_text)
    if not clean_arabic:
        clean_arabic = "مرحبا بك"
        
    voice = "ar-EG-ShakirNeural" if gender.lower() == "male" else "ar-EG-SalmaNeural"
    
    communicate = edge_tts.Communicate(clean_arabic, voice)
    await communicate.save(output_path)

async def run_dubbing_pipeline(video_path: str, target_lang: str = "ar", gender: str = "male", **kwargs) -> Dict[str, Any]:
    try:
        output_video_path = kwargs.get("output_video_path", f"storage/dubbed_result_{os.path.basename(video_path)}")
        
        # 1. Transcribe original English audio
        print("[INFO] Transcribing audio with Whisper...")
        segments, _ = whisper_model.transcribe(video_path, language="en", beam_size=5, condition_on_previous_text=False)
        original_text = " ".join([seg.text for seg in segments]).strip()
        print(f"[INFO] Raw English Text: {original_text}")

        # 2. Correct & Translate via Gemini SDK
        print("[INFO] Translating & Correcting with Gemini...")
        translated_text = translate_and_correct_with_gemini(original_text)

        # 3. Generate Natural Arabic Voice
        print(f"[INFO] Generating Edge-TTS Arabic Voice ({gender})...")
        raw_tts_path = "storage/temp_raw_tts.mp3"
        await generate_edge_tts_audio(translated_text, raw_tts_path, gender=gender)

        # 4. Sync Audio Duration
        orig_duration = get_audio_duration(video_path)
        tts_duration = get_audio_duration(raw_tts_path)
        adjusted_tts_path = "storage/temp_adjusted_tts.wav"

        if orig_duration > 0 and tts_duration > 0:
            speed_ratio = tts_duration / orig_duration
            speed_ratio = max(0.8, min(1.35, speed_ratio))
            
            cmd_stretch = [
                "ffmpeg", "-y", "-i", raw_tts_path,
                "-filter:a", f"atempo={speed_ratio}", adjusted_tts_path
            ]
            subprocess.run(cmd_stretch, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            adjusted_tts_path = raw_tts_path

        # 5. Merge Dubbed Audio with Original Video
        print("[INFO] Merging Dubbed Audio into Video...")
        cmd_merge = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", adjusted_tts_path,
            "-filter_complex", "[1:a]apad[a]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-map", "0:v:0",
            "-map", "[a]",
            "-shortest", output_video_path
        ]
        subprocess.run(cmd_merge, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        print("[SUCCESS] Dubbing Completed Successfully!")
        return {
            "status": "success",
            "message": "Dubbing successful",
            "original_text": original_text,
            "translated_text": translated_text,
            "video_path": output_video_path
        }

    except Exception as e:
        print(f"[ERROR] Pipeline Error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "original_text": "",
            "translated_text": "",
            "video_path": ""
        }
