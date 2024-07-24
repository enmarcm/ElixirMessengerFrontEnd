import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { UploadService } from './upload.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];

  constructor(
    private toast: ToastService,
    private loading: LoadingService,
    private upload: UploadService
  ) {}

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
        this.audioChunks.push(event.data);
      });

      this.toast.showToast({
        message: 'Grabación iniciada',
        type: 'warning',
        position: 'top',
        duration: 400,
      });
    } catch (error) {
      this.toast.showToast({
        message: 'Error al iniciar grabación: ' + error,
        type: 'danger',
      });
    }
  }

  async stopRecording(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.mediaRecorder.addEventListener('stop', async () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const randomName = new Date().getTime();
            const audioFile = new File([audioBlob], `${randomName}.wav`, {
              type: 'audio/wav',
            });

            this.loading.showLoading('Subiendo audio');
            this.upload.uploadFile(audioFile).subscribe({
              next: (url) => {
                this.loading.hideLoading();
                this.audioChunks = [];
                resolve(url);
              },
              error: (err) => {
                this.loading.hideLoading();
                this.toast.showToast({
                  message: 'Error al subir audio: ' + err,
                  type: 'danger',
                  position: 'top',
                });
                this.audioChunks = [];
                reject(err);
              },
            });
          });
        } else {
          throw new Error('mediaRecorder no está inicializado');
        }
      } catch (error) {
        this.toast.showToast({
          message: 'Error al detener grabación: ' + error,
          type: 'danger',
        });
        this.audioChunks = [];
        reject(error);
      }
    });
  }
}
