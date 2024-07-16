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
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { ChatService } from '../socket.service';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonButton,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ChatPage implements OnInit {
  messages: any[] = [];
  public newMessage: string = 'value';
  receiverId = '';

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    this.newMessage = '';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.receiverId = params['idUser'];
    });

    this.chatService.disconnect();
    this.chatService.connect();

    this.chatService.socket.on('privateMessage', (message: any) => {
      const newMessage = {
        ...message,
        isSendByMe: false,
      };
      this.messages.push(newMessage);
    });
  }

  sendMessage() {
    const token = localStorage.getItem('token') as string;
    const decoded = jwtDecode(token) as any;

    if (this.newMessage.trim()) {
      const message = {
        message: this.newMessage,
        senderId: localStorage.getItem('userId'),
        isSendByMe: true,
        senderData: {
          userName: decoded.userName,
          email: decoded.email,
          role: decoded.role,
        },
      };

      this.chatService.sendMessage(this.receiverId, this.newMessage);

      this.messages.push(message);
      this.newMessage = '';
    }
  }
  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
