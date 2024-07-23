import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchesService } from '../fetches.service';
import { ToastService } from '../toast.service';
import { addIcons } from 'ionicons';
import { sendOutline } from 'ionicons/icons';
import ChatManager from '../utils/chat';
import { ChatService } from '../socket.service';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.page.html',
  styleUrls: ['./view-status.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewStatusPage implements OnInit {
  public contentAnswer!: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private fetcheService: FetchesService,
    private toast: ToastService,
    private chatService: ChatService,
    private router: Router
  ) {
    addIcons({ sendOutline });
  }

  public idUser = '';
  public status: Array<any> = [];

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      const id = params['idUser'];
      console.log(id);
      this.idUser = id;
    });

    this.obtainStatusUser();
  }

  //Obtain status of the user
  async obtainStatusUser() {
    try {
      const result = (await this.fetcheService.getStatusUser(
        this.idUser
      )) as any;
      console.log(`Los estados de esta pagina son:`);
      console.log(result);

      this.status = result;
    } catch (error) {
      this.toast.showToast({
        message: 'Error al obtener los estados',
        type: 'danger',
      });
    }
  }

  answerStatus() {
    ChatManager.sendMessage({
      newMessage: this.contentAnswer,
      receiverId: this.idUser,
      fetches: this.fetcheService,
      toast: this.toast,
      chatService: this.chatService,
    });
    this.contentAnswer = '';
  }

  goToStatuses() {
    this.router.navigate(['/statuses']);
  }
}
