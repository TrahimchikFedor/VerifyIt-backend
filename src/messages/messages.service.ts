import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable, interval } from 'rxjs';
import { filter, map, merge, startWith, takeUntil } from 'rxjs/operators';

export interface Notification {
  userId: string;
  type: 'EXPIRED' | 'EXPIRING_SOON' | 'KEEP_ALIVE';
  documentId?: string;
  documentName?: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  private notifications$ = new Subject<Notification>();
  private destroy$ = new Subject<void>();

  getUserNotifications(userId: string): Observable<Notification> {
    const userNotifications$ = this.notifications$.asObservable().pipe(
      filter(notification => notification.userId === userId)
    );

    const keepAlive$ = interval(30000).pipe(
      takeUntil(this.destroy$),
      map(() => ({
        userId,
        type: 'KEEP_ALIVE' as const,
        message: '',
        timestamp: new Date().toISOString()
      }))
    );

    return userNotifications$.pipe(
      merge(keepAlive$),
      startWith({
        userId,
        type: 'KEEP_ALIVE' as const,
        message: '',
        timestamp: new Date().toISOString()
      })
    );
  }

  sendNotification(notification: Notification) {
    this.logger.log(`Sending notification to user ${notification.userId}: ${notification.message}`);
    this.notifications$.next(notification);
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}