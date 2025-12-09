import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { User } from 'prisma/generated/prisma/client';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Authorization()
  @Get(':id')
  async verifyDocument(@Param('id') id: string){
    return await this.documentsService.verifyDocument(id);
  }

  @Post()
  async create(@Body() dto: CreateDocumentDto){
    return await this.documentsService.create(dto);
  }

  @Authorization()
  @Get('history')
  async getHistory(@Authorized() user: User){
    return await this.documentsService.getHistory(user.id);
  }

  @Authorization()
  @Delete(':id')
  async deleteDocumet(@Param('id') id: string){
    return await this.documentsService.delete(id);
  }
  


}
