import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonButton,
  IonInputPasswordToggle,
  IonModal,
  IonDatetimeButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UploadService } from '../upload.service';
import { ToastService } from '../toast.service';
import { LoadingService } from '../loading.service';
import { AlertController } from '@ionic/angular';
import { FetchesService } from '../fetches.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonDatetimeButton,
    IonModal,
    IonButton,
    IonImg,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInputPasswordToggle,
  ],
})
export class RegisterPage implements OnInit {
  public registerData = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: new Date().toISOString(),
  };

  public selectedFileImage: File | null = null;
  public urlImage: string | null = null;

  public isValidRegister = false;

  constructor(
    private router: Router,
    private upload: UploadService,
    private toast: ToastService,
    private load: LoadingService,
    private alert: AlertController,
    private fetch: FetchesService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) this.router.navigate(['/chats']);
  }

  async register() {
    if (!this.verifyData())
      return this.toast.showToast({
        message: 'Por favor, verifica los datos',
        type: 'danger',
      });

    const dataParsed = {
      userName: this.registerData.userName,
      email: this.registerData.email,
      password: this.registerData.password,
      dateOfBirth: this.registerData.dateOfBirth,
      image:
        this.urlImage ||
        'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png',
    } as any;

    console.log(dataParsed)

    this.load.showLoading('Registrando');
    try {

      const dataToSend = await this.fetch.register(dataParsed);
      console.log('Data received:', dataToSend);

      await this.presentAlert();

      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 5000);
    } catch (error) {
      console.error('Error registering:', error);
      this.toast.showToast({
        message: 'Error al registrar, intenta de nuevo',
        type: 'danger',
      });
    }finally{
      this.load.hideLoading();
    }
  }

  verifyData() {
    if (this.registerData.userName === '') {
      this.toast.showToast({
        message: 'El nombre de usuario es requerido.',
        type: 'danger',
      });
      return false;
    }
    if (this.registerData.email === '') {
      this.toast.showToast({
        message: 'El correo electrónico es requerido.',
        type: 'danger',
      });
      return false;
    }
    if (this.registerData.password === '') {
      this.toast.showToast({
        message: 'La contraseña es requerida.',
        type: 'danger',
      });
      return false;
    }
    if (this.registerData.confirmPassword === '') {
      this.toast.showToast({
        message: 'La confirmación de la contraseña es requerida.',
        type: 'danger',
      });
      return false;
    }
    if (this.registerData.dateOfBirth === '') {
      this.toast.showToast({
        message: 'La fecha de nacimiento es requerida.',
        type: 'danger',
      });
      return false;
    }

    // Verifica que las contraseñas coincidan
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toast.showToast({
        message: 'Las contraseñas no coinciden.',
        type: 'danger',
      });
      return false;
    }

    // Verifica el formato del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerData.email)) {
      this.toast.showToast({
        message: 'El formato del correo electrónico es inválido.',
        type: 'danger',
      });
      return false;
    }

    if (
      !/^(?=.*[/.@$!%*#?&])[A-Za-z\d/.@$!%*#?&]{6,20}$/i.test(
        this.registerData.password
      )
    ) {
      this.toast.showToast({
        message:
          'La contraseña debe tener al menos 6 caracteres, un número y un caracter especial',
        type: 'danger',
      });
      return false;
    }

    // Verifica que la fecha de nacimiento sea válida y no futura
    const birthDate = new Date(this.registerData.dateOfBirth);
    const currentDate = new Date();
    if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
      this.toast.showToast({
        message: 'La fecha de nacimiento es inválida o futura.',
        type: 'danger',
      });
      return false;
    }

    // Si todas las validaciones pasan, retorna true
    this.isValidRegister = true;
    return true;
  }

  async uploadFileImage(): Promise<void> {
    this.load.showLoading('Subiendo imagen');
    try {
      if (this.selectedFileImage) {
        try {
          const url = await this.upload
            .uploadFile(this.selectedFileImage)
            .toPromise();
          console.log('File uploaded! URL:', url);
          if (!url) throw new Error('Error uploading file');
          console.log('URL:', url);
          this.urlImage = url;
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      this.load.hideLoading();
    }
  }

  onFileSelectedImage(event: any): void {
    this.selectedFileImage = event.target.files[0];

    if (this.selectedFileImage) {
      this.uploadFileImage();
    }
  }

  public alertButtons = [
    {
      text: 'Ok',
      role: 'confirm',
      handler: () => {
        this.router.navigate(['/auth/login']);
      },
    },
  ];

  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Casi estamos listos',
      message: 'Dirigete a tu correo electrónico para confirmar tu cuenta',
      buttons: this.alertButtons,
    });

    await alert.present();
  }
}
