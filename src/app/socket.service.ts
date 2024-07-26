import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { LoadingService } from './loading.service';
import { BASE_URL } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public socket: any;
  public serverUrl = BASE_URL;
  public outgoingMessages = new Subject<any>();
  public outgoingMessagesGroup = new Subject<any>();
  private joinedGroups: Set<string> = new Set();

  constructor(private loadingService: LoadingService) {
    this.connect();
  }

  public connect() {
    this.socket = io(this.serverUrl, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      const token = `Bearer ${localStorage.getItem('token')}`;
      this.socket.emit('register', token);
      this.rejoinGroups();
    });

    this.socket.on('registered', (message: string) => {
      console.log(message);
    });

    this.socket.on('error', (errorMessage: string) => {
      console.error('Socket error:', errorMessage);
    });
  }

  private rejoinGroups() {
    this.joinedGroups.forEach((group) => {
      this.socket.emit('joinGroup', group);
    });
  }

  sendMessage(receiverId: string, message: string, type = 'text') {
    console.log(`Enviando mensaje a ${receiverId}: ${message}`);
    const senderId = localStorage.getItem('userId');

    const messageObj = {
      sender: senderId,
      receiver: receiverId,
      message: {
        type,
        content: message,
      },
    };

    // Notificar a los observadores sobre el mensaje saliente
    this.outgoingMessages.next(messageObj);

    this.socket.emit('privateMessage', messageObj);
  }

  listenForIncomingMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('privateMessage', (message: any) => {
        observer.next(message);
      });

      // Cuando el observable se destruye, desconectar el listener específico
      return () => this.socket.off('privateMessage');
    });
  }

  listenForOutgoingMessages(): Observable<any> {
    return this.outgoingMessages.asObservable();
  }

  joinGroup(group: string) {
    if (!this.joinedGroups.has(group)) {
      this.joinedGroups.add(group);
      this.socket.emit('joinGroup', group);
    }
  }

  sendGroupMessage(group: string, message: string, type = 'text') {
    const senderId = localStorage.getItem('userId');

    const messageObj = {
      group,
      sender: senderId,
      message: {
        type,
        content: message,
      },
    };

    const objEnviar = {
      group,
      sender: senderId,
      message: messageObj,
    };
    this.socket.emit('groupMessage', objEnviar);
  }

  listenForGroupMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('groupMessage', (message: any) => {
        observer.next(message);
      });

      // Cuando el observable se destruye, desconectar el listener específico
      return () => this.socket.off('groupMessage');
    });
  }

  listenForGroupMessagesOutgoing(): Observable<any> {
    return this.outgoingMessagesGroup.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}