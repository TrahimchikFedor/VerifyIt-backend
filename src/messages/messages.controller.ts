import { Controller, Sse, Query, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable, map, throwError } from 'rxjs';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';


@Controller('notifications')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);
  
  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService
  ) {}

  @Sse('stream')
  stream(@Query('token') token: string): Observable<MessageEvent> {
    if (!token) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('Token is required');
    }

    // Очистка токена от префикса Bearer и пробелов
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

    try {
      const payload = this.jwtService.verify(cleanToken);
      
      const userId = payload.id;
      
      if (!userId) {
        this.logger.warn('No userId in payload');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      return this.messagesService.getUserNotifications(userId).pipe(
        map((notification) => ({
          data: notification,
        } as MessageEvent))
      );
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}