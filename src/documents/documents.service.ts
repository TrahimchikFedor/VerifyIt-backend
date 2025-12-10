import { CreateDocumentDto } from './dto/create-document.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Document, User } from 'prisma/generated/prisma/client';
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


    async verifyDocument(id: string, user: User) {
        this.logger.log("Try to verify document", this.name)
        const document = await this.prismaService.document.findUnique({
            where: { id }
        });

        if (!document) {
            this.logger.warn("Документ не найден", this.name);
            throw new NotFoundException("Документ не найден");
        }
        const anyObject = {document}
        const response = this.getDocumentInfo(anyObject, "one");

            const newHist = await this.prismaService.history.create(
            {
            data:{
                userId: user.id,
                documentId: id,
            }
        });
        
        if(!newHist){
            this.logger.warn("Не удалось сохранить историю", this.name);
        }

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
                id: true,
                document: true,
                createdAt: true,
            }
        });

        if(!history.length){
            this.logger.warn("История пуста", this.name);
            throw new NotFoundException("История пуста");
        }

        const norm = history.map(entry => this.getDocumentInfo(entry, "history"));
        return norm
    }

    private getDocumentInfo(entry: any, choose: string){
        const document = entry.document
        const now = new Date();
        const expiration = new Date(document.expirationDate);

        const isHistory = choose == "history"
        const isExpired = expiration < now;
        const diffMs = expiration.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const response = {
            ...document,
            valid: !isExpired,
            expiresSoon: isExpired ? null : diffDays <= 14 ? true : false,
            createdHistory: isHistory ? entry.createdAt : null,
            historyId: isHistory ? entry.id : null
        };

        
        return response;
    }

    async create(dto: CreateDocumentDto){
        const {name, type, author, expirationDate} = dto;
        const newDoc = await this.prismaService.document.create({
            data: {
                name,
                type,
                author,
                expirationDate
            }
        });
        return newDoc
    }

    async delete(id: string){
        const document = await this.prismaService.history.findUnique({
            where:{
                id
            }
        });

        if(!document){
            console.log("delete")
            this.logger.warn("Документ не найден", this.name);
            throw new NotFoundException("Документ не найден");
        }

        await this.prismaService.history.delete({
            where: {id}
        });

        return true;
    }

}
