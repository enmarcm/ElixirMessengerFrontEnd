import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonItem,
  IonList,
  IonButtons,
  IonBackButton,
  IonThumbnail,
  IonModal,
  IonLabel,
  IonCardContent,
  IonCardTitle,
  IonInput,
  IonImg,
  IonCardHeader,
  IonCard,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../socket.service';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { FetchesService } from '../fetches.service';
import { AudioService } from '../audio.service';
import { addIcons } from 'ionicons';
import { micOutline, send } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonImg,
    IonInput,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonModal,
    IonBackButton,
    IonButtons,
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
  ],
})
export class GroupPage implements OnInit {
  public messages: Array<any> = [];
  public newMessage: string = 'value';
  public groupId = '';
  public chatId = '';
  public isAudioButton = false;
  public groupInfo: any = {};

  pressTimer: any;
  public isPlayingAudio = false;
  @ViewChild(IonContent, { static: false }) content: IonContent = this
    .messages as any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chateService: ChatService,
    private loading: LoadingService,
    private toast: ToastService,
    private fetches: FetchesService,
    private router: Router,
    private audioService: AudioService
  ) {
    this.newMessage = '';
    addIcons({ micOutline, send });
  }

  startPress() {
    this.isAudioButton = true;
    this.startRecording();
  }

  stopPress() {
    this.isAudioButton = false;
    this.stopRecording();
  }

  toggleRecord() {
    this.isAudioButton = !this.isAudioButton;
    if (this.isAudioButton) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.groupId = params['idGroup'];
    });

    await this.loadMessagesGroup();
    this.obtainGroupInfo();

    this.chateService.socket.on('groupMessage', (message: any) => {
      console.log('Nuevo mensaje de grupo', message);
      if (message.message.group !== this.groupId) return;
      if (message.sender === localStorage.getItem('userId')) return;


      const newMessage = {
       typeMessage: message.message.message.type,
       message: {
        content: message.message.message.content,
        type: message.message.message.type,
       },
       senderId: message.sender,
       senderData:{
        userName: message.senderData.userName,
        email: message.senderData.email,
        image: message.senderData.image,
        id: message.sender
       },
       isSendByMe: false
      };

      this.messages.push(newMessage);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    const token = localStorage.getItem('token') as string;
    const decoded = jwtDecode(token) as any;

    if (this.newMessage.trim()) {
      const idUser = localStorage.getItem('userId') as string;

      if (!idUser) {
        return this.toast.showToast({
          message: 'No se ha podido obtener el id del usuario',
          type: 'danger',
          position: 'top',
        });
      }

      const message = {
        typeMessage: 'text',
        message: {
          content: this.newMessage,
          type: 'text',
        },
        senderId: idUser,
        senderData: {
          userName: decoded.userName,
          email: decoded.email,
          image: decoded.image,
          id: decoded.id,
        },
        isSendByMe: true,
      };

      this.addToBDD({
        idGroup: this.groupId,
        typeMessage: 'text',
        messageString: message.message.content,
      });

      this.chateService.sendGroupMessage(this.groupId, this.newMessage);

      this.messages.push(message);
      this.newMessage = '';
      this.scrollToBottom();
    }

    return;
  }

  private async obtainGroupInfo() {
    try {
      const groupInfo = await this.fetches.obtainGroupById(this.groupId);

      this.groupInfo = groupInfo;
    } catch (error) {
      console.error('Error al obtener la información del grupo', error);
      this.toast.showToast({
        message: 'Error al obtener la información del grupo',
        type: 'danger',
        position: 'top',
      });
    }
  }

  private async addToBDD({
    idGroup,
    typeMessage,
    messageString,
  }: {
    idGroup: string;
    typeMessage: string;
    messageString: string;
  }) {
    try {
      await this.fetches.addMessageToGroup({
        idGroup,
        type: typeMessage,
        message: messageString,
      });
    } catch (error) {
      this.toast.showToast({
        message: 'Error al agregar mensaje a la base de datos',
        type: 'danger',
        position: 'top',
      });
    }
  }

  private async loadMessagesGroup() {
    this.loading.showLoading('Obteniendo mensajes');
    try {
      const messages = (await this.fetches.obtainGroupMessages(
        this.groupId
      )) as any[];

      this.messages = messages.map((message) => ({
        ...message,
        isSendByMe: message.senderData.id === localStorage.getItem('userId'),
      }));
      this.scrollToBottom();
    } catch (error) {
      console.error('Error al obtener mensajes', error);
      this.toast.showToast({
        message: 'Error al obtener mensajes',
        type: 'danger',
        position: 'top',
      });
    } finally {
      this.loading.hideLoading();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

  goToGroups(event: any) {
    event.stopPropagation();
    this.router.navigate(['/tabs/chats']);
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
        idGroup: this.groupId,
        typeMessage: 'audio',
        messageString: message.message.content,
      });

      this.chateService.sendGroupMessage(this.groupId, url, 'audio');

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
    const randomCrypt = crypto.randomUUID();
    return `${randomCrypt}_${id}`;
  }

  playAudio(event: any) {
    // Detener todos los audios excepto el que disparó el evento play
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach((audio) => {
      if (audio !== event.target) {
        audio.pause();
      }
    });
  }
}

interface UserInfo {
  userName: string;
  email: string;
  role: string;
  image: string;
  dateOfBirth: string;
  id: string;
}
