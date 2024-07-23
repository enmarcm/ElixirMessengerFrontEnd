import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-status-item',
  templateUrl: './status-item.component.html',
  styleUrls: ['./status-item.component.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    CommonModule,
  ],
})
export class StatusItemComponent implements OnInit {
  @Input() status!: StatusItem;

  constructor() {}

  ngOnInit() {
    console.log(this.status);
  }

  calculateTimeAgo(): any {
    if (!this.status.status.length || this.status.status.length === 0)
      return 'Crea un nuevo estado';

    try {
      const dateStatus =
        this.status.status[this.status.status.length - 1]?.date;

      if (!dateStatus) return;

      const timeUnits = [
        { limit: 60, div: 1, text: 'segundos' },
        { limit: 3600, div: 60, text: 'minutos' },
        { limit: 86400, div: 3600, text: 'horas' },
        { limit: 2592000, div: 86400, text: 'días' },
        { limit: 31104000, div: 2592000, text: 'meses' },
        { div: 31104000, text: 'años' },
      ];

      const secondsAgo =
        (new Date().getTime() - new Date(dateStatus).getTime()) / 1000;
      const unit = timeUnits.find((u) => !u.limit || secondsAgo < u.limit);

      if (!unit) return 'Hace un tiempo';

      return `${Math.floor(secondsAgo / unit.div)} ${unit.text} atrás`;
    } catch (error) {
      return 'Hace un tiempo';
    }
  }

  getDashArray() {
    const count = this.status.status.length;

    if (count === 0)
      return { 'stroke-dasharray': `0 0`, 'stroke-dashoffset': `0 0` ,
        'stroke': "transparent"
      };

    const numberOfDots = (2 * 3.14 * 48) / count;

    return {
      'stroke-dasharray': `${numberOfDots} 2`,
      'stroke-dashoffset': `${numberOfDots}`,
      'stroke': "green"
    };
  }
}

interface StatusItem {
  contact: {
    id: string;
    name: string;
    image: string;
  };
  status: Array<StatusContent>;
}

interface StatusContent {
  id: string;
  description: string;
  date: string;
  seen: Array<string>;
  image: string;
}
