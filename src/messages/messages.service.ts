import { Injectable } from '@nestjs/common';
import { Subject, Observable, interval } from 'rxjs';
import { filter, map, merge, startWith } from 'rxjs/operators';

export interface Notification {
  userId: string;
  type: 'EXPIRED' | 'EXPIRING_SOON' | 'KEEP_ALIVE';
  documentId?: string;
  documentName?: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class MessagesService {
  private notifications$ = new Subject<Notification>();

  getUserNotifications(userId: string): Observable<Notification> {
    return this.notifications$.asObservable().pipe(
      filter(notification => notification.userId === userId)
    );
  }

  sendNotification(notification: Notification) {
    console.log('Sending notification:', notification);
    this.notifications$.next(notification);
  }
}