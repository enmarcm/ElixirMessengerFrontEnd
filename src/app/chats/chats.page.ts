import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonPopover,
  IonButton,
  IonIcon, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { ChatsPageMock } from 'src/mocks/chatsPageMock';
import { ChatsWrapperComponent } from '../chats-wrapper/chats-wrapper.component';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, createOutline, ellipsisVerticalOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, 
    IonIcon,
    IonButton,
    IonPopover,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
    ChatsWrapperComponent,
  ],
})
export class ChatsPage implements OnInit {
  public chats = ChatsPageMock;

  constructor(private router: Router) {
    addIcons({ searchOutline, ellipsisVerticalOutline , add, createOutline});
  }

  

  ngOnInit() {}

  openSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/main']);
  }
}
