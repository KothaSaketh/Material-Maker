class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recording = false;
        this.maxDuration = 300; // 5 minutes
        this.startTime = null;
        this.timerInterval = null;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = event => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.onRecordingComplete(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            this.mediaRecorder.start();
            this.recording = true;
            this.startTime = Date.now();
            
            // Start timer
            this.timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.updateTimerDisplay(elapsed);
                
                // Auto-stop if max duration reached
                if (elapsed >= this.maxDuration) {
                    this.stopRecording();
                }
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            return false;
        }
    }

    stopRecording() {
        if (this.recording && this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.recording = false;
            clearInterval(this.timerInterval);
            return true;
        }
        return false;
    }

    updateTimerDisplay(seconds) {
        const timerElement = document.getElementById('recording-timer');
        if (timerElement) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    onRecordingComplete(blob) {
        // Handle the completed recording blob
        const audioURL = URL.createObjectURL(blob);
        const audioPreview = document.getElementById('audio-preview');
        
        if (audioPreview) {
            audioPreview.src = audioURL;
            audioPreview.controls = true;
        }
        
        // Create download link
        const downloadLink = document.getElementById('download-audio');
        if (downloadLink) {
            downloadLink.href = audioURL;
            downloadLink.download = `recording_${new Date().toISOString()}.wav`;
            downloadLink.style.display = 'inline-block';
        }
        
        // Prepare for upload
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');
        
        // You can either:
        // 1. Store the FormData for later use
        this.audioFormData = formData;
        
        // OR 2. Immediately upload to server
        // this.uploadRecording(formData);
    }

    async uploadRecording(formData) {
        try {
            const response = await fetch('/upload-audio', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const result = await response.json();
            console.log('Upload successful:', result);
            return result;
        } catch (error) {
            console.error('Error uploading recording:', error);
            throw error;
        }
    }
}

// Initialize recorder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const recorder = new AudioRecorder();
    
    // Expose to window for button controls
    window.audioRecorder = recorder;
    
    // Button event listeners
    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (recorder.startRecording()) {
                startBtn.disabled = true;
                stopBtn.disabled = false;
            }
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (recorder.stopRecording()) {
                startBtn.disabled = false;
                stopBtn.disabled = true;
            }
        });
    }
});