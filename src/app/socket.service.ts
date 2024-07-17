import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public socket: any;
  public readonly serverUrl = 'http://localhost:9090';
  public outgoingMessages = new Subject<any>();

  constructor() {
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
    });

    this.socket.on('registered', (message: string) => {
      console.log(message); // Confirmación de registro
    });

    this.socket.on('error', (errorMessage: string) => {
      console.error('Socket error:', errorMessage); // Manejo de errores
    });
  }

  sendMessage(receiverId: string, message: string) {
    console.log(`Enviando mensaje a ${receiverId}: ${message}`);
    const senderId = localStorage.getItem('userId');

    const messageObj = {
      sender: senderId,
      receiver: receiverId,
      message,
    };

    this.socket.emit('privateMessage', messageObj);

    // Notificar a los observadores sobre el mensaje saliente
    this.outgoingMessages.next(messageObj);
  }

  listenForIncomingMessages(): Observable<any> {
    return new Observable(observer => {
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}