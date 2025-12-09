import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Document } from 'prisma/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentResponseDto } from './dto/document-response.dto';
import { AllLogger } from 'src/common/log/logger.log';

@Injectable()
export class DocumentsService {

    private readonly name = DocumentsService.name;
    private readonly logger = new AllLogger();
    constructor(
        private prismaService: PrismaService
    ){}


    async verifyDocument(id: string): Promise<DocumentResponseDto> {
        this.logger.log("Try to verify document", this.name)
        const document = await this.prismaService.document.findUnique({
            where: { id }
        });

        if (!document) {
            this.logger.warn("Документ не найден", this.name);
            throw new NotFoundException("Документ не найден");
        }

        const response = this.getDocumentInfo(document);

        this.logger.log("Successful", this.name)
        return response;
    }

    async getHistory(id: string){
        this.logger.log("Try get history", this.name)
        const history = await this.prismaService.history.findMany({
            where:{
                userId: id
            },
            orderBy:{
                createdAt: 'desc'
            },
            select:{
                document: true
            }
        });

        if(!history.length){
            this.logger.warn("История пуста", this.name);
            throw new NotFoundException("История пуста");
        }

        history.map(entry => this.getDocumentInfo(entry.document));

    }

    private getDocumentInfo(document: Document):DocumentResponseDto{
        
        const now = new Date();
        const expiration = new Date(document.expirationDate);

        
        const isExpired = expiration < now;
        const diffMs = now.getTime() - expiration.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const response: DocumentResponseDto = {
            ...document,
            valid: isExpired,
            expiresSoon: diffDays <= 14 ? true : false
        };

        return response;
    }
}
