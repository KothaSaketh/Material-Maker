from flask import Flask, render_template, request, send_file
import os
from datetime import datetime
from app.audio_processing import record_and_transcribe
from app.punctuation_adder import add_punctuation
from app.summarizer import summarize_text
from app.translator import translate_text

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        duration = int(request.form.get('duration', 30))
        raw_text = record_and_transcribe(duration)
        punctuated = add_punctuation(raw_text)
        summary = summarize_text(punctuated)
        
        languages = {
            'english': summary,
            'spanish': translate_text(summary, 'es'),
            'french': translate_text(summary, 'fr')
        }
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        for lang, text in languages.items():
            with open(f'output/{lang}_summary_{timestamp}.txt', 'w') as f:
                f.write(text)
        
        return render_template('results.html', results=languages)
    
    return render_template('index.html')

@app.route('/download/<filename>')
def download(filename):
    return send_file(f'output/{filename}', as_attachment=True)

if __name__ == '__main__':
    os.makedirs('output', exist_ok=True)
    app.run(debug=True)