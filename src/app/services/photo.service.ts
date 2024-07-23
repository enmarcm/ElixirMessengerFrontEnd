import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: any[] = [];

  constructor() {}

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    return savedImageFile;
  }

  private async savePicture(cameraPhoto: any) {
    const photoBlob = await this.readAsBlob(cameraPhoto);

    const randomName = crypto.getRandomValues(new Uint32Array(1))[0];

    const fileName = randomName + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: photoBlob,
      directory: Directory.Data,
    });

    // Crear un File a partir del Blob
    const file = new File([photoBlob], fileName, { type: 'image/jpeg' });

    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
      file: file, // Retornar el File
    };
  }

  private async readAsBlob(cameraPhoto: any) {
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();
    return blob;
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
