import warnings
import whisper

warnings.filterwarnings("ignore", category=UserWarning)

_model = None

def transcribe_audio(audio_path: str):
    global _model
    if _model is None:
        _model = whisper.load_model('base')
    
    # initial_prompt guides Whisper to understand clear Arabic context
    result = _model.transcribe(
        audio_path, 
        fp16=False, 
        language='ar',
        initial_prompt='مرحباً بكم، نتكلم باللغة العربية الفصحى عن المدرسة والدراسة والامتحانات.'
    )
    segments = []
    for seg in result.get('segments', []):
        segments.append({
            'start': seg.get('start', 0.0),
            'end': seg.get('end', 0.0),
            'text': seg.get('text', '').strip()
        })
    return segments
