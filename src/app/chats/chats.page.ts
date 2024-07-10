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
  IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ChatsPageMock } from 'src/mocks/chatsPageMock';
import { ChatsWrapperComponent } from '../chats-wrapper/chats-wrapper.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, 
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

  constructor() {}

  ngOnInit() {}
}
