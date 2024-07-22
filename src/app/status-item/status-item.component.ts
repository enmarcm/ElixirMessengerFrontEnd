import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-status-item',
  templateUrl: './status-item.component.html',
  styleUrls: ['./status-item.component.scss'],
  standalone: true,
  imports: [IonImg, 
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    CommonModule
  ],
})
export class StatusItemComponent implements OnInit {
  public status: StatusItem = {
    contact: {
      idUser: '1',
      name: 'John Doe',
      image: "https://ionicframework.com/docs/img/demos/card-media.png"
    },
    status: [
      {
        id: '1',
        description: 'Hello World',
        date: '2021-01-01',
        seen: ['2'],
        image: 'https://via.placeholder.com/150',
      },
    ],
  };

  constructor() {}

  ngOnInit() {}


  calculateTimeAgo(dateStatus: string): string {
    const timeUnits = [
      { limit: 60, div: 1, text: 'segundos' },
      { limit: 3600, div: 60, text: 'minutos' },
      { limit: 86400, div: 3600, text: 'horas' },
      { limit: 2592000, div: 86400, text: 'días' },
      { limit: 31104000, div: 2592000, text: 'meses' },
      { div: 31104000, text: 'años' }
    ];
  
    const secondsAgo = (new Date().getTime() - new Date(dateStatus).getTime()) / 1000;
    const unit = timeUnits.find(u => !u.limit || secondsAgo < u.limit);

    if(!unit) return "Hace un tiempo"

    return `${Math.floor(secondsAgo / unit.div)} ${unit.text} atrás`;
  }
}

interface StatusItem {
  contact: {
    idUser: string;
    name: string;
    image: string
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
