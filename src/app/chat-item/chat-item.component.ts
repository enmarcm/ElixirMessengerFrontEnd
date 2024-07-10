import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonThumbnail, IonModal, IonTitle, IonHeader, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonToolbar, IonHeader, IonTitle, IonModal, IonItem, IonLabel, CommonModule, IonThumbnail],
})
export class ChatItemComponent implements OnInit {
  @Input() chat = DefaultChatItem;


  constructor() {}
  ngOnInit() {}

}

const DefaultChatItem: ChatItem = {
  id: 'Chat 2',
  avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
  name: 'Chat 2',
  lastMessage: 'Último mensaje del chat 2',
  lastMessageDate: new Date(),
  unreadCount: 0,
};

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageDate: Date;
  avatar: string;
  unreadCount: number;
}