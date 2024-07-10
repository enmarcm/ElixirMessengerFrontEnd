import { Component, Input, OnInit } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { ChatsPageMock } from 'src/mocks/chatsPageMock';
import { IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'chats-wrapper',
  templateUrl: './chats-wrapper.component.html',
  styleUrls: ['./chats-wrapper.component.scss'],
  standalone: true,
  imports: [IonList, ChatItemComponent],
})
export class ChatsWrapperComponent implements OnInit {
  @Input() chats: Array<ChatInterface> = [];

  constructor() {}

  ngOnInit() {}
}

interface ChatInterface {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}
