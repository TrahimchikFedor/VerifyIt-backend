import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Document } from 'prisma/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentResponseDto } from './dto/document-response.dto';

@Injectable()
export class DocumentsService {

    constructor(
        private prismaService: PrismaService
    ){}


    async verifyDocument(id: string): Promise<DocumentResponseDto> {
        const document = await this.prismaService.document.findUnique({
            where: { id }
        });

        if (!document) {
            throw new NotFoundException("Документ не найден");
        }

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

    async getHistory(id: string){
        const history = await this.prismaService.history.findMany({
            where:{
                userId: id
            },
            orderBy:{
                createdAt: 'desc'
            }
        });

    }
}
