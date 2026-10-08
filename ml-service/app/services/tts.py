import edge_tts
import io

VOICE_MAP = {
    "en": {"female": "en-US-AvaNeural", "male": "en-US-AndrewNeural"},
    "ar": {"female": "ar-EG-SalmaNeural", "male": "ar-EG-ShakirNeural"},
    "fr": {"female": "fr-FR-DeniseNeural", "male": "fr-FR-HenriNeural"},
    "es": {"female": "es-ES-ElviraNeural", "male": "es-ES-AlvaroNeural"},
    "de": {"female": "de-DE-KatjaNeural", "male": "de-DE-KillianNeural"},
    "it": {"female": "it-IT-ElsaNeural", "male": "it-IT-DiegoNeural"},
    "tr": {"female": "tr-TR-EmelNeural", "male": "tr-TR-AhmetNeural"},
    "ru": {"female": "ru-RU-SvetlanaNeural", "male": "ru-RU-DmitryNeural"}
}

async def generate_speech_stream(text: str, target_lang: str = "en", gender: str = "female", output_path: str = None):
    voices = VOICE_MAP.get(target_lang, VOICE_MAP["en"])
    voice = voices.get(gender, voices["female"])
    
    communicate = edge_tts.Communicate(text, voice)
    if output_path:
        await communicate.save(output_path)
        return output_path

    audio_bytes = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
            
    return io.BytesIO(audio_bytes)
