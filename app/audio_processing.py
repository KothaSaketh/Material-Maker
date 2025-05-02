import speech_recognition as sr
import whisper
import tempfile
import os

def record_and_transcribe(duration=30):
    r = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("Recording...")
        audio = r.record(source, duration=duration)
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(audio.get_wav_data())
        temp_path = f.name
    
    # Transcribe with Whisper
    model = whisper.load_model("base")
    result = model.transcribe(temp_path)
    os.unlink(temp_path)
    
    return result["text"]