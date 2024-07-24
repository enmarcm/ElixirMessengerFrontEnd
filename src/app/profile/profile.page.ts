import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonRow,
  IonGrid,
  IonCol,
  IonImg,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { pencilOutline } from 'ionicons/icons';
import { EditInputComponent } from '../edit-input/edit-input.component';
import { AlertController } from '@ionic/angular';
import { FetchesService } from '../fetches.service';
import { ToastService } from '../toast.service';
import { LoadingService } from '../loading.service';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonImg,
    IonCol,
    IonGrid,
    IonRow,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    EditInputComponent,
  ],
})
export class ProfilePage implements OnInit {
  public profileData = {
    userName: '',
    email: '',
    image: '',
  };

  public selectedFileImage: File | null = null;
  public urlImage = '';

  constructor(
    private router: Router,
    private alert: AlertController,
    private fetche: FetchesService,
    private toast: ToastService,
    private loading: LoadingService,
    private upload: UploadService
  ) {
    addIcons({ pencilOutline });
  }

  async ngOnInit() {
    await this.obtainUserInfo();
  }

  goToChats() {
    this.router.navigate(['/tabs/chats']);
  }

  async obtainUserInfo() {
    this.loading.showLoading('Cargando información de usuario');
    try {
      const idUser = localStorage.getItem('userId');

      if (!idUser) {
        this.toast.showToast({
          message: 'No se ha podido obtener la información del usuario',
          duration: 2000,
          type: 'danger',
        });
        return;
      }

      const result = (await this.fetche.obtainUserInfo(idUser)) as any;

      const { email, userName, image, dateOfBirth } = result;

      this.profileData = {
        email,
        userName,
        image,
      };
    } catch (error) {
      this.toast.showToast({
        message: 'No se ha podido obtener la información del usuario',
        duration: 2000,
        type: 'danger',
      });
    } finally {
      this.loading.hideLoading();
    }
  }

  async obtainUserInfoWithout() {
    try {
      const idUser = localStorage.getItem('userId');

      if (!idUser) {
        this.toast.showToast({
          message: 'No se ha podido obtener la información del usuario',
          duration: 2000,
          type: 'danger',
        });
        return;
      }

      const result = (await this.fetche.obtainUserInfo(idUser)) as any;

      const { email, userName, image, dateOfBirth } = result;

      this.profileData = {
        email,
        userName,
        image,
      };
    } catch (error) {
      this.toast.showToast({
        message: 'No se ha podido obtener la información del usuario',
        duration: 2000,
        type: 'danger',
      });
    }
  }

  async updateImage() {
    if (!this.urlImage || this.urlImage == '') return;

    const data = {
      image: this.urlImage,
    };

    try {
      await this.fetche.updateUser(data);
    } catch (error) {
      this.toast.showToast({
        message: 'No se ha podido actualizar la información del usuario',
        duration: 2000,
        type: 'danger',
      });
    }
  }

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Estoy seguro',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        //Aqui llamar al metodo de eliminar cuenta
      },
    },
  ];
  async alertDelete() {
    const alert = await this.alert.create({
      header: 'Estas seguro?',
      message:
        'Al hacer esto eliminaras la cuenta por completo, perdiendo toda tu información.',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  async uploadFileImage(): Promise<void> {
    this.loading.showLoading('Subiendo imagen');
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
            await this.updateImage();
            this.loading.hideLoading();

          this.obtainUserInfoWithout();
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  onFileSelectedImage(event: any): void {
    this.selectedFileImage = event.target.files[0];

    if (this.selectedFileImage) {
      this.uploadFileImage();
    }
  }
}
