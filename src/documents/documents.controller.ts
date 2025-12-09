import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';

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
}
