import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllLogger } from 'src/common/log/logger.log';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class DocumentExpirationService {
  private readonly logger = new AllLogger();
  private readonly name = DocumentExpirationService.name;

  constructor(
    private prismaService: PrismaService,
    private messagesService: MessagesService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredDocuments() {
    this.logger.log('Запуск проверки истекших документов', this.name);

    const now = new Date();
    const expiredDocs = await this.prismaService.document.findMany({
      where: { expirationDate: { lt: now } },
      include: { history: { include: { user: true } } }
    });

    expiredDocs.forEach(doc => {
      const uniqueUsers = [...new Set(doc.history.map(h => h.userId))];
      uniqueUsers.forEach(userId => {
        this.messagesService.sendNotification({
          userId,
          type: 'EXPIRED',
          documentId: doc.id,
          documentName: doc.name,
          message: `Документ "${doc.name}" истек`,
          timestamp: new Date()
        });
      });
    });

    this.logger.log(`Обработано ${expiredDocs.length} истекших документов`, this.name);
  }

  // @Cron(CronExpression.EVERY_DAY_AT_9AM)
  @Cron('* 5 * * * *')
  async checkExpiringSoon() {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 14);

    const expiringSoon = await this.prismaService.document.findMany({
      where: {
        expirationDate: { gte: now, lte: futureDate }
      },
      include: { history: { include: { user: true } } }
    });

    expiringSoon.forEach(doc => {
      const uniqueUsers = [...new Set(doc.history.map(h => h.userId))];
      uniqueUsers.forEach(userId => {
        this.messagesService.sendNotification({
          userId,
          type: 'EXPIRING_SOON',
          documentId: doc.id,
          documentName: doc.name,
          message: `Документ "${doc.name}" истекает в ближайшие 14 дней`,
          timestamp: new Date()
        });
      });
    });
  }
}