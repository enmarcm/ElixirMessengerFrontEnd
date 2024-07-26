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
  IonCol,
  IonGrid,
  IonImg,
  IonButton,
  IonIcon,
  IonInput,
  IonModal,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UploadService } from '../upload.service';
import { LoadingService } from '../loading.service';
import { FetchesService } from '../fetches.service';
import { ToastService } from '../toast.service';
import { ViewChild } from '@angular/core';
import { TypeaheadComponent } from '../typeahead/typeahead.component';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonModal,
    IonInput,
    IonIcon,
    IonButton,
    IonImg,
    IonGrid,
    IonCol,
    IonRow,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TypeaheadComponent,
  ],
})
export class NewGroupPage implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;
  public selectedContactsText = '0 contactos';
  public selectedContacts: Array<any> = [];

  constructor(
    private router: Router,
    private upload: UploadService,
    private loading: LoadingService,
    private fetche: FetchesService,
    private toast: ToastService
  ) {}
  public selectedFileImage: File | null = null;
  public urlImage = 'https://cdn-icons-png.flaticon.com/512/4406/4406177.png';
  public dataInputs = {
    name: '',
    description: '',
  };
  public data: any = null;

  async ngOnInit() {
    await this.getContactsInfo();
  }

  goToGroups() {
    this.router.navigate(['/groups']);
  }

  async createGroup() {
    this.loading.showLoading('Creando grupo');
    try {
      const result = await this.fetche.createGroup({
        name: this.dataInputs.name,
        description: this.dataInputs.description,
        image: this.urlImage,
        users: this.selectedContacts,
      });
      console.log(result);
      this.toast.showToast({
        message: 'Grupo creado',
        duration: 1000,
        type: 'success',
        position: 'top',
      });
      this.router.navigate(['/groups']);
    } catch (error) {
      console.error(error);
      this.toast.showToast({
        message: 'Error al crear el grupo',
        duration: 1000,
        type: 'danger',
        position: 'top',
      });
    } finally {
      this.loading.hideLoading();
    }
  }

  async getContactsInfo() {
    try {
      const result = (await this.fetche.obtainSimpleContacts()) as any;
      console.log(result);
      this.data = result;
    } catch (error) {
      console.error(error);
      this.toast.showToast({
        message: 'Error al obtener los contactos',
        duration: 1000,
        type: 'danger',
        position: 'top',
      });
    }
  }

  async verifyContacts() {
    if (this.data !== null) return;
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
          this.loading.hideLoading();
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

  private formatData(data: string[]) {
    if (!Array.isArray(this.data)) return;

    if (data.length === 1) {
      const item = this.data.find((it) => it.id === data[0]);
      return item.text;
    }

    return `${data.length} items`;
  }

  contactSelectionChanged(fruits: string[]) {
    this.selectedContacts = fruits;
    this.selectedContactsText = this.formatData(this.selectedContacts);
    this.modal.dismiss();
  }
}
