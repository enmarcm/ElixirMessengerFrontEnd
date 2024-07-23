import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonList,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonCardContent,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonIcon,
  IonAlert,
  IonModal,
  IonButton,
} from '@ionic/angular/standalone';
import { NavigationEnd, Router } from '@angular/router';
import { FetchesService } from '../fetches.service';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { addIcons } from 'ionicons';
import { closeCircle, trashOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.page.html',
  styleUrls: ['./edit-status.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonModal,
    IonAlert,
    IonIcon,
    IonItemOptions,
    IonItemOption,
    IonItemSliding,
    IonCardContent,
    IonLabel,
    IonItem,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
  ],
})
export class EditStatusPage implements OnInit {
  constructor(
    private router: Router,
    private fetches: FetchesService,
    private loading: LoadingService,
    private toast: ToastService,
    private alert: AlertController
  ) {
    addIcons({ trashOutline, closeCircle });
  }

  public dateSelected = '';
  public descriptionSelected = '';
  public imageSelected = '';
  public isModalOpen = false;
  public idErase = '';
  public statuses: Array<any> = [];
  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Si',
      role: 'confirm',
      handler: () => {
        this.deleteStatus(this.idErase);
      },
    },
  ];

  openModal(image: string, description: string, date: string) {
    this.imageSelected = image;
    this.descriptionSelected = description;
    this.dateSelected = this.calculateTimeAgo(date);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.imageSelected = '';
    this.descriptionSelected = '';
    this.dateSelected = '';
  }

  async ngOnInit() {
    await this.obtainMyStatuses();
  }

  goToStatus() {
    this.router.navigate(['/statuses']);
  }

  async presentAlert(id: string) {
    this.idErase = id;
    const alert = await this.alert.create({
      header: 'Seguro de borrar este estado?',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  async obtainMyStatuses() {
    try {
      this.loading.showLoading('Obteniendo estados');
      const result = await this.fetches.obtainMyStatuses();
      const { status, contact } = result as any;

      console.log('este es el resultado de los estados');
      console.log(result);

      this.statuses = status;
    } catch (error) {
      this.toast.showToast({
        type: 'danger',
        message: 'Error al obtener los estados',
      });
    } finally {
      this.loading.hideLoading();
    }
  }

  async obtainMyStatusesWithoutLoading() {
    try {
      const result = await this.fetches.obtainMyStatuses();
      const { status, contact } = result as any;

      this.statuses = status;
    } catch (error) {
      this.toast.showToast({
        type: 'danger',
        message: 'Error al obtener los estados',
      });
    }
  }

  async deleteStatus(idStatus: string) {
    try {
      await this.fetches.deleteStatus(idStatus);
      // this.loading.hideLoading();

      this.toast.showToast({
        type: 'success',
        message: 'Estado eliminado',
      });
      this.statuses = [];

      await this.obtainMyStatuses();

      if (this.statuses.length === 0) {
        this.router.navigate(['/statuses']);
      }
    } catch (error) {
      this.toast.showToast({
        type: 'danger',
        message: 'Error al eliminar el estado',
      });
      // this.loading.hideLoading();
    } finally {
    }
  }

  calculateTimeAgo(date: string): any {
    try {
      const dateStatus = new Date(date);

      const timeUnits = [
        { limit: 60, div: 1, text: 'segundos' },
        { limit: 3600, div: 60, text: 'minutos' },
        { limit: 86400, div: 3600, text: 'horas' },
        { limit: 2592000, div: 86400, text: 'días' },
        { limit: 31104000, div: 2592000, text: 'meses' },
        { div: 31104000, text: 'años' },
      ];

      const secondsAgo =
        (new Date().getTime() - new Date(dateStatus).getTime()) / 1000;
      const unit = timeUnits.find((u) => !u.limit || secondsAgo < u.limit);

      if (!unit) return 'Hace un tiempo';

      return `${Math.floor(secondsAgo / unit.div)} ${unit.text} atrás`;
    } catch (error) {
      return 'Hace un tiempo';
    }
  }
}
