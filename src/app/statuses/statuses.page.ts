import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCol, IonIcon, IonPopover, IonItem, IonList, IonRow, IonGrid } from '@ionic/angular/standalone';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.page.html',
  styleUrls: ['./statuses.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonList, IonItem, IonPopover, IonIcon, IonCol, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StatusesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
