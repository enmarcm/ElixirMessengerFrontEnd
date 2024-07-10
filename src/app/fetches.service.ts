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
}
