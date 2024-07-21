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
  IonInput, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { contactsToChatMock } from 'src/mocks/contactsToChatMock';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FetchesService } from '../fetches.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, 
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
  private pageContacts = 1;

  constructor(
    private fetchesService: FetchesService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.loadingService.showLoading('Obteniendo contactos');
    try {
      this.contacts =
        (await this.fetchesService.obtainContacts()) as ContactInterface[];
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hideLoading();
    }
  }

  async onIonInfinite(event: any) {
    this.pageContacts++;
    const newContacts = (await this.fetchesService.obtainContacts(
      this.pageContacts
    )) as ContactInterface[];

    if (newContacts.length === 0 || !newContacts) {
      (event as InfiniteScrollCustomEvent).target.disabled = true;
      return;
    }

    this.contacts.push(...newContacts);

    (event as InfiniteScrollCustomEvent).target.complete();
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
  idUserContact: string;
  idUserOwner: string;
  name: string;
  userContactData: {
    userName: string;
    email: string;
    image: string;
    id: string;
  };
}
