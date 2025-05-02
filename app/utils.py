import os
import logging
from datetime import datetime

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

def clean_temp_files(directory='temp_audio'):
    """Remove temporary audio files"""
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            logging.error(f"Error deleting {file_path}: {e}")

def format_timestamp(seconds):
    """Convert seconds to HH:MM:SS format"""
    return str(datetime.utcfromtimestamp(seconds).strftime('%H:%M:%S')

def validate_audio(file_path):
    """Validate audio file properties"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")
    
    if os.path.getsize(file_path) == 0:
        raise ValueError("Audio file is empty")
    
    return True

def get_available_languages():
    """Return supported translation languages"""
    return {
        'english': 'en',
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'italian': 'it'
    }

def sanitize_text(text):
    """Clean and sanitize input text"""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    return text.strip()