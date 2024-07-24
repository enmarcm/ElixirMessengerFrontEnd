import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, pencilOutline } from 'ionicons/icons';
import { ToastService } from '../toast.service';
import { LoadingService } from '../loading.service';
import { FetchesService } from '../fetches.service';

@Component({
  selector: 'edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, CommonModule, FormsModule],
})
export class EditInputComponent implements OnInit {
  @Input() defaultValue!: string;
  @Input() label!: string;
  @Input() callbackToSend!: any;
  @Input() propName!: string;

  public isEditing = false;

  constructor(
    private toast: ToastService,
    private loading: LoadingService,
    private fetche: FetchesService
  ) {
    addIcons({ pencilOutline, checkmarkDoneOutline });
  }

  ngOnInit() {}

  public edit() {
    this.isEditing = true;
  }

  public async execute() {
    const objSend = {
      [this.propName]: this.defaultValue,
    };

    await this.updateUser(objSend);
    this.isEditing = false;
  }

  async updateUser(data: any) {
    this.loading.showLoading('Actualizando informacion');

    try {
      await this.fetche.updateUser(data);

      if (this.propName === 'password') this.defaultValue = '';
    } catch (error) {
      this.toast.showToast({
        message: 'No se ha podido actualizar la información del usuario',
        duration: 2000,
        type: 'danger',
      });
    } finally {
      this.loading.hideLoading();
    }
  }
}
