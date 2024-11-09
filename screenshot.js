class ScreenshotCapture {
    constructor() {
        console.log('ScreenshotCapture initialized');
        this.modal = document.getElementById('screenshotModal');
        this.captureBtn = document.getElementById('captureBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.preview = document.getElementById('preview');
        this.previewContainer = document.getElementById('previewContainer');
        this.selectedStream = null;
        
        console.log('Elements found:', {
            modal: !!this.modal,
            captureBtn: !!this.captureBtn,
            cancelBtn: !!this.cancelBtn,
            shareBtn: !!this.shareBtn
        });

        this.init();
    }

    init() {
        this.captureBtn.addEventListener('click', () => {
            console.log('Capture button clicked');
            this.showModal();
        });

        this.cancelBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            this.hideModal();
            if (this.selectedStream) {
                this.selectedStream.getTracks().forEach(track => track.stop());
            }
        });

        this.shareBtn.addEventListener('click', async () => {
            console.log('Share button clicked');
            if (this.selectedStream) {
                await this.captureAndProcess(this.selectedStream);
                this.hideModal();
            } else {
                console.error('No stream selected');
            }
        });
        
        document.querySelectorAll('.tab-option').forEach(button => {
            button.addEventListener('click', async (e) => {
                console.log('Tab clicked:', e.target.dataset.type);
                document.querySelectorAll('.tab-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                await this.startScreenCapture(e.target.dataset.type);
            });
        });
    }

    async startScreenCapture(type) {
        console.log('Starting screen capture for type:', type);
        try {
            if (this.selectedStream) {
                this.selectedStream.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: type,
                    cursor: 'always'
                },
                audio: false,
                preferCurrentTab: type === 'tab'
            });

            this.selectedStream = stream;
            console.log('Stream obtained:', !!stream);
        } catch (err) {
            console.error('Error starting screen capture:', err);
        }
    }

    async captureAndProcess(stream) {
        try {
            const videoTrack = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);
            const bitmap = await imageCapture.grabFrame();
            
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            
            const context = canvas.getContext('2d');
            context.drawImage(bitmap, 0, 0);
            
            const imageData = canvas.toDataURL('image/png');
            this.preview.src = imageData;
            
            // Stop the stream after capture
            stream.getTracks().forEach(track => track.stop());
            
            // Send to backend
            await this.sendToBackend(imageData);
            
            return imageData;
        } catch (err) {
            console.error('Error capturing screenshot:', err);
            return null;
        }
    }

    async sendToBackend(imageData) {
        try {
            console.log('Sending to backend...');
            const response = await fetch('http://127.0.0.1:8000/analyze-screenshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }
            
            console.log('Analysis result:', result);
            
            // Create or update result display
            let resultDiv = document.getElementById('analysis-result');
            if (!resultDiv) {
                resultDiv = document.createElement('div');
                resultDiv.id = 'analysis-result';
                resultDiv.style.cssText = `
                    margin-top: 20px;
                    padding: 15px;
                    border: 1px solid #dadce0;
                    border-radius: 8px;
                    max-width: 800px;
                `;
                document.body.appendChild(resultDiv);
            }
            
            resultDiv.innerHTML = `
                <h3 style="margin-top: 0;">Analysis Result:</h3>
                <p style="white-space: pre-wrap;">${result.analysis}</p>
            `;
            
        } catch (err) {
            console.error("Error sending to backend:", err);
            
            // Show error message to user
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                border: 1px solid #dc3545;
                border-radius: 8px;
                color: #dc3545;
                background-color: #f8d7da;
            `;
            errorDiv.textContent = `Error: ${err.message}`;
            document.body.appendChild(errorDiv);
            
            // Remove error message after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    showModal() {
        console.log('Showing modal');
        if (this.modal) {
            this.modal.style.display = 'block';
        }
    }

    hideModal() {
        console.log('Hiding modal');
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ScreenshotCapture');
    new ScreenshotCapture();
}); 