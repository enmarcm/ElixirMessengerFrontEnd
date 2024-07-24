import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatNotificationService {
  private chatDeletedSource = new Subject<void>();
  chatDeleted$ = this.chatDeletedSource.asObservable();

  notifyChatDeletion() {
    this.chatDeletedSource.next();
  }
}