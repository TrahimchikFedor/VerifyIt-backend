import { Controller, Sse, Query, UnauthorizedException } from '@nestjs/common';
import { Observable, map, throwError } from 'rxjs';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';


@Controller('notifications')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService
  ) {}

  @Sse('stream')
  stream(@Query('token') token: string): Observable<MessageEvent> {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub || payload.userId || payload.id;
      
      return this.messagesService.getUserNotifications(userId).pipe(
        map((notification) => ({
          data: notification,
        } as MessageEvent))
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}