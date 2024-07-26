import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonModal,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { FetchesService } from '../fetches.service';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatNotificationService } from '../chat-notification.service';

@Component({
  selector: 'group-item',
  templateUrl: './chat-group-item.component.html',
  styleUrls: ['./chat-group-item.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonCol,
    IonRow,
    IonGrid,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonModal,
    IonItem,
    IonLabel,
    CommonModule,
    IonThumbnail,
  ],
})
export class ChatItemComponent implements OnInit, AfterViewInit {
  @Input() chat = DefaultChatItem as any;

  public date = new Date(this.chat.lastMessage.date);

  public isNotMessage = false;

  constructor(
    private fetches: FetchesService,
    private load: LoadingService,
    private toast: ToastService,
    private alert: AlertController,
    private router: Router,
    private chatNotification: ChatNotificationService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ trashOutline });
  }

  ngOnInit() {
    console.log('Este es el mensaje inicial');
  }

  ngAfterViewInit() {
    // Forzar una nueva verificación de cambios
    this.cdr.detectChanges();
  }

  getDate() {
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };

    const date = this.date.toLocaleDateString('en-US', optionsDate as any);
    const time = this.date.toLocaleTimeString('en-US', optionsTime as any);

    return { date, time };
  }

  public getLastMessage() {
    const { type, content } = this.chat.lastMessage.message;

    if (type === 'text' && content == 'No hay mensajes') {
      this.isNotMessage = true;
      return;
    }

    return type === 'text'
      ? content.length > 20
        ? `${content.substring(0, 20)}...`
        : content
      : '';
  }

  async deleteChat() {
    try {
      this.load.showLoading('Eliminando chat');
      const result = await this.fetches.deleteGroup(this.chat.id);
      this.load.hideLoading();

      if (result) {
        this.toast.showToast({ message: 'Chat eliminado', type: 'success' });
      } else {
        this.toast.showToast({
          message: 'No se pudo eliminar el chat. No eres el dueño del grupo',
          type: 'error',
        });
      }
    } catch (error) {
      this.load.hideLoading();
      this.toast.showToast({
        message: 'No se pudo eliminar el chat',
        type: 'error',
      });
    }

    this.chatNotification.notifyChatDeletion();
  }

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Si estoy seguro',
      role: 'confirm',
      handler: () => {
        this.deleteChat();
      },
    },
  ];

  async presentAlert(event: MouseEvent) {
    event.stopPropagation();

    const alert = await this.alert.create({
      header: 'Estas seguro?',
      message: 'Cuando borres este chat no podras recuperar los mensajes.',
      buttons: this.alertButtons,
    });

    await alert.present();
  }
}

const DefaultChatItem: GroupData = {
  id: '',
  name: '',
  description: '',
  idOwner: '',
  idUsers: [],
  image: '',
  lastMessage: '',
  userLastMessage: {
    id: '',
    userName: '',
    image: '',
  },
};

interface GroupData {
  id: string;
  name: string;
  description: string;
  idOwner: string;
  idUsers: string[];
  image: string;
  lastMessage: string;
  userLastMessage: {
    id: string;
    userName: string;
    image: string;
  };
}