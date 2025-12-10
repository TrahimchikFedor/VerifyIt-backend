import { Controller, Sse, Req, UseGuards } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MessagesService } from './messages.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { User } from 'prisma/generated/prisma/client';

@Controller('notifications')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Authorization()
  @Sse('stream')
  stream(@Authorized() user: User): Observable<MessageEvent> {
    const userId = user.id;
    return this.messagesService.getUserNotifications(userId).pipe(
      map((notification) => ({
        data: notification,
      } as MessageEvent))
    );
  }
}