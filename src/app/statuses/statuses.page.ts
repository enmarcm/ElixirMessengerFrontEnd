import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCol,
  IonIcon,
  IonPopover,
  IonItem,
  IonList,
  IonRow,
  IonGrid,
  IonFab,
  IonFabButton, IonText } from '@ionic/angular/standalone';
import { StatusItemComponent } from '../status-item/status-item.component';
import { contactStatusMock } from 'src/mocks/statusesMocks';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { FetchesService } from '../fetches.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.page.html',
  styleUrls: ['./statuses.page.scss'],
  standalone: true,
  imports: [IonText, 
    IonFabButton,
    IonFab,
    IonGrid,
    IonRow,
    IonList,
    IonItem,
    IonPopover,
    IonIcon,
    IonCol,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    StatusItemComponent,
  ],
})
export class StatusesPage implements OnInit {
  public contactStatus = contactStatusMock;

  constructor(
    private router: Router,
    private fetchesServices: FetchesService,
    private toast: ToastService
  ) {
    addIcons({ cameraOutline });
  }

  async ngOnInit() {
    await this.loadStatuses();
  }

  goToNewStatus() {
    this.router.navigate(['/new-status']);
  }

  async loadStatuses() {
    try {
      const newStatuses = await this.fetchesServices.obtainAllContactsStatus() as any;
      
      console.log(newStatuses);
      this.contactStatus = newStatuses.data;
    } catch (error) {
      console.error(error);
      this.toast.showToast({
        message: 'Error al cargar los estados',
        type: 'danger',
      });
    }
  }
}
