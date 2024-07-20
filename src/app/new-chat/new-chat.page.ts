import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonAvatar,
  IonItem,
  IonList,
  IonLabel,
  IonImg,
  IonInput,
} from '@ionic/angular/standalone';
import { contactsToChatMock } from 'src/mocks/contactsToChatMock';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FetchesService } from '../fetches.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonImg,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class NewChatPage implements OnInit {
  public contacts: ContactInterface[] = contactsToChatMock;

  constructor(private fetchesService: FetchesService) {}

  ngOnInit() {}

  onIonIfinite(event: any) {
    const newContacts = contactsToChatMock.slice(0, 10);
    this.contacts.push(...newContacts);
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async clickContact(contact: ContactInterface) {
    //Verificar si ya el chat existe, si existe redirigir,
    const isChat = await this.fetchesService.verifyChatExist(contact.id);

    console.log(isChat);

    //Si no existe, crear el chat y redirigir
  }
}

interface ContactInterface {
  id: string;
  name: string;
  image: string;
  email: string;
}
