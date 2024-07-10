import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: any;

  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = 'Loading...') {
    this.loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent', 
      cssClass: 'custom-loading', 
    });

    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}