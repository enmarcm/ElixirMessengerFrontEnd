import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFabButton,
  IonFabList,
  IonFab,
} from '@ionic/angular/standalone';
import { FetchesService } from '../fetches.service';
import { LoadingService } from '../loading.service';
import { ToastService } from '../toast.service';
import { NavigationEnd, Router } from '@angular/router';
import { ChatItemComponent } from '../chat-group-item/chat-group-item.component';
import { BehaviorSubject, filter } from 'rxjs';
import { ChatNotificationService } from '../chat-notification.service';
import { ChatService } from '../socket.service';
import { idCard } from 'ionicons/icons';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonFabList,
    IonFabButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ChatItemComponent,
  ],
})
export class GroupsPage implements OnInit {
  private _groups = new BehaviorSubject<any[]>([]);
  public groups$ = this._groups.asObservable();
  
  constructor(
    private fetch: FetchesService,
    private load: LoadingService,
    private toast: ToastService,
    private router: Router,
    private chatNotificationService: ChatNotificationService,
    private chatService: ChatService
  ) {
    this.groups$.subscribe(groups => {
      if (groups.length > 0) {
        this.joinGroups(groups);
      }
    });
  }

  set groups(groups: any[]) {
    this._groups.next(groups);
  }

  get groups(): any[] {
    return this._groups.getValue();
  }

  private joinGroups(groups: any[]) {
    groups.forEach((group: any) => {
      this.chatService.joinGroup(group?.id);
    });
  }

  public messageSubscription: any;
  
  async ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/tabs/groups') {
          this.obtainAllGroups();
        }
      });

    this.chatNotificationService.chatDeleted$.subscribe(() => {
      this.obtainAllGroups();
    });

    this.chatService.connect();
    
    this.messageSubscription = this.chatService
      .listenForGroupMessages()
      .subscribe((message: any) => {
        const chatIndex = this.groups.findIndex(
          (chat) => chat.id === message.idGroup
        );

        if (chatIndex !== -1) {
          this.groups[chatIndex].lastMessage = {
            idUserSender: message.idUserSender,
            message: message.message,
            date: message.date,
            id: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
          };
        } else {
          this.obtainAllGroups(false);
        }
        return;
      });
  }

  async obtainAllGroups(trueLoading = true) {
    if (trueLoading) {
      this.load.showLoading('Obteniendo grupos');
    }
    try {
      const groups = (await this.fetch.obtainAllGroups()) as GroupData[];
      this.groups = groups;
    } catch (error) {
      this.toast.showToast({
        message: 'Error al obtener los grupos',
        type: 'danger',
        position: 'top',
      });
      console.error(`Existe un error al obtener los grupos: ${error}`);
    } finally {
      this.load.hideLoading();
    }
  }

  goToGroup(id: string) {
    this.router.navigate([`/group/${id}`]);
  }

  goToNewGroup() {
    this.router.navigate(['/new-group']);
  }
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  idOwner: string;
  idUsers: string[];
  image: string;
  lastMessage: any;
}