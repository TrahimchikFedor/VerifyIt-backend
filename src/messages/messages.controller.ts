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
    this.logger.log(`SSE connection attempt with token: ${token ? 'present' : 'missing'}`);
    
    if (!token) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('Token is required');
    }

    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(`Token verified, payload: ${JSON.stringify(payload)}`);
      
      const userId = payload.id;
      
      if (!userId) {
        this.logger.warn('No userId in payload');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      this.logger.log(`Starting SSE stream for user: ${userId}`);
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