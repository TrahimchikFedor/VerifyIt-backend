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
  createdAt?: string;
  expirationDate?: string;
  [key: string]: any; // для дополнительных полей
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

  sendNotification(notification: any) {
    this.logger.log(`Sending notification to user ${notification.userId}: ${notification.message}`);
    
    // Сериализуем все поля, преобразуя Date в строки
    const cleanNotification = this.serializeNotification(notification);
    
    this.notifications$.next(cleanNotification);
  }

  private serializeNotification(obj: any): Notification {
    const serialized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        // Проверяем, что дата валидна
        if (isNaN(value.getTime())) {
          this.logger.warn(`Invalid date found for key ${key}, skipping`);
          continue; // Пропускаем невалидные даты
        }
        serialized[key] = value.toISOString();
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        serialized[key] = this.serializeNotification(value);
      } else {
        serialized[key] = value;
      }
    }
    
    return serialized;
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}