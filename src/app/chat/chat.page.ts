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
  IonIcon,
  IonAvatar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { ChatService } from '../socket.service';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { FetchesService } from '../fetches.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonAvatar,
    IonIcon,
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
  public messages: any[] = [];
  public newMessage: string = 'value';
  public receiverId = '';
  public chatId = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private toast: ToastService,
    private fetches: FetchesService
  ) {
    this.newMessage = '';
  }

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.receiverId = params['idUser'];
      this.chatId = params['idChat'];
    });

    await this.obtainMessages();

    this.chatService.socket.on('privateMessage', (message: any) => {
      const newMessage = {
        ...message,
        isSendByMe: false,
      };

      console.log('newMessage', newMessage);
      this.messages.push(newMessage);
    });
  }

  sendMessage() {
    const token = localStorage.getItem('token') as string;
    const decoded = jwtDecode(token) as any;

    if (this.newMessage.trim()) {
      const idUser = localStorage.getItem('userId');

      if (!idUser)
        return this.toast.showToast({
          message: 'Error al enviar mensaje',
          type: 'danger',
        });

      const message = {
        typeMessage: 'text',
        message: {
          type: 'text',
          content: this.newMessage,
        },
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

      this.addToBDD({
        idReceiver: this.receiverId,
        typeMessage: 'text',
        messageString: message.message.content,
      });
    }
    return;
  }

  private async addToBDD({
    idReceiver,
    typeMessage,
    messageString,
  }: {
    idReceiver: string;
    typeMessage: typeMessage;
    messageString: string;
  }) {
    try {
      await this.fetches.addMessage({
        idReceiver,
        typeMessage,
        messageString,
      });
    } catch (error) {
      this.toast.showToast({
        message: 'Error al enviar mensaje',
        type: 'danger',
      });
    }
  }

  private async obtainMessages() {
    try {
      const messages = (await this.fetches.obtainMessagesByChatId({
        idChat: this.chatId,
      })) as Array<any>;

      this.messages = messages;
    } catch (error) {
      this.toast.showToast({
        message: 'Error al obtener mensajes',
        type: 'danger',
      });
    }
  }
}

type typeMessage = 'text' | 'image' | 'audio';
