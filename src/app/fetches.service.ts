import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { finalize, firstValueFrom } from 'rxjs';
import { URL_REQUEST } from './constants';

@Injectable({
  providedIn: 'root',
})
export class FetchesService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  sendLoginRequest({
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }) {
    this.loadingService.showLoading('Iniciando sesion');

    return firstValueFrom(
      this.httpClient.post(URL_REQUEST.LOGIN, { userName, password }).pipe(
        finalize(() => {
          this.loadingService.hideLoading();
        })
      )
    );
  }

  obtainChats(page = 1, loading = true) {
    const token = localStorage.getItem('token');

    if (loading) this.loadingService.showLoading('Obteniendo chats');

    return firstValueFrom(
      this.httpClient
        .get(`${URL_REQUEST.CHATS}/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          finalize(() => {
            if (loading) this.loadingService.hideLoading();
          })
        )
    );
  }

  addMessage({
    idReceiver,
    typeMessage,
    messageString,
  }: {
    idReceiver: string;
    typeMessage: typeMessage;
    messageString: string;
  }) {
    const token = localStorage.getItem('token');
    const bodySend = {
      idReceiver,
      content: {
        type: typeMessage,
        message: messageString,
      },
    };

    return firstValueFrom(
      this.httpClient.post(URL_REQUEST.ADD_MESSAGE, bodySend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }

  obtainMessagesByChatId({
    idChat,
    page = 1,
  }: {
    idChat: string;
    page?: number;
  }) {
    const token = localStorage.getItem('token');

    this.loadingService.showLoading();

    return firstValueFrom(
      this.httpClient
        .get(`${URL_REQUEST.GET_MESSAGES_CHAT}/${idChat}/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          })
        )
    );
  }
}

type typeMessage = 'text' | 'image' | 'audio';
