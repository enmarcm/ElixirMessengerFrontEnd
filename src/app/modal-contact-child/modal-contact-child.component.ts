import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButton,
  IonButtons,
  IonContent,
  IonList,
  IonCheckbox,
  IonNote,
  IonModal,
  CheckboxCustomEvent,
  IonItem,
  IonIcon,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'modal-contact',
  templateUrl: './modal-contact-child.component.html',
  styleUrls: ['./modal-contact-child.component.scss'],
  standalone: true,
  imports: [IonImg, 
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonInput,
    IonIcon,
    IonItem,
    IonNote,
    IonCheckbox,
    IonList,
    IonContent,
    IonButtons,
    IonButton,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonModal,
    FormsModule,
  ],
})
export class ModalContactChildComponent implements OnInit {
  @Input() modal!: IonModal;
  @Output() dismissChange = new EventEmitter<boolean>();

  public userName = '';
  public urlImage =
    'https://www.researchgate.net/profile/Maria-Monreal/publication/315108532/figure/fig1/AS:472492935520261@1489662502634/Figura-2-Avatar-que-aparece-por-defecto-en-Facebook.png';

  public inputData = {
    value: '',
    contactName: '',
  };

  checkboxChanged(event: any) {
    const ev = event as CheckboxCustomEvent;
    const checked = ev.detail.checked;

    this.dismissChange.emit(checked);
  }

  constructor() {
    addIcons({ closeCircleOutline });
  }
  ngOnInit() {}

  searchUser(event: any) {
    console.log(event);
  }
}
