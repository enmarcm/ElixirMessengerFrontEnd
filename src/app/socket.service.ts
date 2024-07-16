import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public socket: any;
  private readonly serverUrl = 'http://localhost:9090';

  constructor() {
    this.connect();
  }

  connect() {
    this.socket = io(this.serverUrl, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      // Enviar el token justo después de conectarse
      const token = `Bearer ${localStorage.getItem('token')}`;
      this.socket.emit('register', token);
    });

    this.socket.on('registered', (message: string) => {
      console.log(message); // Confirmación de registro
    });

    this.socket.on('error', (errorMessage: string) => {
      console.error('Socket error:', errorMessage); // Manejo de errores
    });

    this.socket.on('privateMessage', (message: any) => {
      console.log('New message', message);
     
    });
  }

  sendMessage(receiverId: string, message: string) {

    console.log(`Enviando mensaje a ${receiverId}: ${message}`);
    const senderId = localStorage.getItem('userId');

    this.socket.emit('privateMessage', {
      sender: senderId,
      receiver: receiverId,
      message,
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
