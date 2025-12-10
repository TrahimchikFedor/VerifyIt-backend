import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Notification {
  userId: string;
  type: 'EXPIRED' | 'EXPIRING_SOON';
  documentId: string;
  documentName: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class MessagesService {
  private notifications$ = new Subject<Notification>();

  getUserNotifications(userId: string) {
    return this.notifications$.asObservable().pipe(
      filter(notification => notification.userId === userId)
    );
  }

  sendNotification(notification: Notification) {
    console.log(notification);
    this.notifications$.next(notification);
  }
}