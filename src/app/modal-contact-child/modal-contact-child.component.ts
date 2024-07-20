import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonToolbar, IonHeader, IonTitle, IonButton, IonButtons, IonContent, IonList, IonCheckbox, IonNote, IonModal, CheckboxCustomEvent, IonItem } from "@ionic/angular/standalone";


@Component({
  selector: 'modal-contact',
  templateUrl: './modal-contact-child.component.html',
  styleUrls: ['./modal-contact-child.component.scss'],
  standalone: true,
  imports: [IonItem, IonNote, IonCheckbox, IonList, IonContent, IonButtons, IonButton, IonTitle, IonHeader, IonToolbar, IonModal]
})
export class ModalContactChildComponent  implements OnInit {

  @Input() modal!: IonModal;
  @Output() dismissChange = new EventEmitter<boolean>()

  checkboxChanged(event: any) {
    const ev = event as CheckboxCustomEvent;
    const checked = ev.detail.checked;

    this.dismissChange.emit(checked);
  }

  ngOnInit() {}

}
