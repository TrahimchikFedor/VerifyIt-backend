import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentExpirationService } from './documentsExpiration.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentExpirationService],
})
export class DocumentsModule {}
