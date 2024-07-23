import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: any[] = [];

  constructor(private toast: ToastService) {}

  public async addNewToGallery() {
    try {
      // Solicitar permisos de lectura y escritura
      await this.requestPermissions();

      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      const savedImageFile = await this.savePicture(capturedPhoto);
      this.photos.unshift(savedImageFile);

      return savedImageFile;
    } catch (error) {
      throw new Error('Error al tomar la foto: ' + error);
    }
  }

  private async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        const cameraPermission = await Camera.requestPermissions();
        const filesystemPermission = await Filesystem.requestPermissions();

        if (
          cameraPermission.camera !== 'granted' ||
          filesystemPermission.publicStorage !== 'granted'
        ) {
          throw new Error('Permisos no concedidos');
        }
      }
    } catch (error) {
      throw new Error('Error al solicitar permisos: ' + error);
    }
  }

  private async savePicture(cameraPhoto: any) {
    try {
      const base64Data = await this.readAsBase64(cameraPhoto);

      const randomName = crypto.getRandomValues(new Uint32Array(1))[0];
      const fileName = randomName + '.jpeg';

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });

      // Crear un File a partir del Blob
      const blob = await this.readAsBlob(cameraPhoto);
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
        file: file, // Retornar el File
      };
    } catch (error) {
      throw new Error('Error al guardar la imagen en el dispositivo: ' + error);
    }
  }

  private async readAsBase64(cameraPhoto: any) {
    try {
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    } catch (error) {
      throw new Error('Error al leer la imagen: ' + error);
    }
  }

  private async readAsBlob(cameraPhoto: any) {
    try {
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw new Error('Error al leer la imagen: ' + error);
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
