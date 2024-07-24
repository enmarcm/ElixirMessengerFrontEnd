import { Component, OnInit, ViewChild } from '@angular/core';
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
  IonThumbnail,
} from '@ionic/angular/standalone';
import { ChatService } from '../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { FetchesService } from '../fetches.service';
import { addIcons } from 'ionicons';
import { micOutline, send } from 'ionicons/icons';
import { AudioService } from '../audio.service';

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
    IonThumbnail,
  ],
})
export class ChatPage implements OnInit {
  public messages: any[] = [];
  public newMessage: string = 'value';
  public receiverId = '';
  public chatId = '';
  public isAudioButton = false;
  public userReceiverInfo = {
    image:
      'https://st2.depositphotos.com/47577860/46269/v/450/depositphotos_462698004-stock-illustration-account-avatar-interface-icon-flat.jpg',
  } as UserInfo;
  pressTimer: any;
  public isPlayingAudio = false;

  @ViewChild(IonContent, { static: false }) content: IonContent = this
    .messages as any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private toast: ToastService,
    private fetches: FetchesService,
    private router: Router,
    private audioService: AudioService
  ) {
    this.newMessage = '';
    addIcons({ send, micOutline });
  }

  startPress() {
    this.isAudioButton = true;
    this.startRecording();
  }

  stopPress() {
    this.isAudioButton = false;
    this.stopRecording();
  }

  onSwipe(event: any) {
    if (event.direction === 2) {
      this.isAudioButton = !this.isAudioButton;
    }
  }

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.receiverId = params['idUser'];
      this.chatId = params['idChat'];
    });

    await this.obtainMessages();
    this.obtainUserInfo();

    this.chatService.socket.on('privateMessage', (message: any) => {
      const newMessage = {
        ...message,
        isSendByMe: false,
      };

      console.log('newMessage', newMessage);
      this.messages.push(newMessage);
      this.scrollToBottom();
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

      this.addToBDD({
        idReceiver: this.receiverId,
        typeMessage: 'text',
        messageString: message.message.content,
      });

      this.chatService.sendMessage(this.receiverId, this.newMessage);

      this.messages.push(message);
      this.newMessage = '';
      this.scrollToBottom();
    }
    return;
  }

  private async obtainUserInfo() {
    try {
      const userInfo = (await this.fetches.obtainUserInfo(
        this.receiverId
      )) as UserInfo;

      this.userReceiverInfo = userInfo;
    } catch (error) {
      this.toast.showToast({
        message: 'Error al obtener información del usuario',
        type: 'danger',
      });
      return;
    } finally {
      this.loading.hideLoading();
    }
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
      this.loading.showLoading('Obteniendo los mensajes');
      const messages = (await this.fetches.obtainMessagesByChatId({
        idChat: this.chatId,
      })) as Array<any>;
      this.loading.hideLoading();

      this.messages = messages;
      this.scrollToBottom();
    } catch (error) {
      this.toast.showToast({
        message: 'Error al obtener mensajes',
        type: 'danger',
      });
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

  goToChats() {
    this.router.navigate(['/tabs/chats']);
  }

  toggleRecord() {
    if (this.isAudioButton) {
      this.stopPress();
    } else {
      this.startPress();
    }
  }

  sendMessageAudio(url: string) {
    const token = localStorage.getItem('token') as string;
    const decoded = jwtDecode(token) as any;

    if (url) {
      const idUser = localStorage.getItem('userId');

      if (!idUser)
        return this.toast.showToast({
          message: 'Error al enviar mensaje',
          type: 'danger',
        });

      const message = {
        typeMessage: 'audio',
        message: {
          type: 'audio',
          content: url,
        },
        senderId: localStorage.getItem('userId'),
        isSendByMe: true,
        senderData: {
          userName: decoded.userName,
          email: decoded.email,
          role: decoded.role,
        },
      };

      this.addToBDD({
        idReceiver: this.receiverId,
        typeMessage: 'audio',
        messageString: message.message.content,
      });

      this.chatService.sendMessage(this.receiverId, url, 'audio');

      this.messages.push(message);
      this.newMessage = '';
      this.scrollToBottom();
    }
    return;
  }

  startRecording() {
    this.audioService.startRecording();
  }

  async stopRecording() {
    try {
      const audioUrl = await this.audioService.stopRecording();

      await this.sendMessageAudio(audioUrl);
    } catch (error) {
      this.toast.showToast({
        message: 'Error al enviar audio',
        type: 'danger',
      });
    }
  }

  trackByFn(id: string) {
    const randomCrypt = crypto.getRandomValues(new Uint32Array(1))[0] & 0x3f;
    return `${randomCrypt}_${id}`;
  }

  playAudio(event: any) {
    // Detener todos los audios excepto el que disparó el evento play
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
      if (audio !== event.target) {
        audio.pause();
      }
    });
  }
}

type typeMessage = 'text' | 'image' | 'audio';

interface UserInfo {
  userName: string;
  email: string;
  role: string;
  image: string;
  dateOfBirth: string;
  id: string;
}
