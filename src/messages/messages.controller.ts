import { Controller, Sse, Req, UseGuards } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MessagesService } from './messages.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Authorization } from 'src/auth/decorators/authorization.decorator';

@Controller('notifications')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Authorization()
  @Sse('stream')
  stream(@Req() req): Observable<MessageEvent> {
    const userId = req.user.id;
    return this.messagesService.getUserNotifications(userId).pipe(
      map((notification) => ({
        data: notification,
      } as MessageEvent))
    );
  }
}