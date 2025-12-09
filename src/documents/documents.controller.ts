import { Controller, Get, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Authorization()
  @Get('/:id')
  async verifyDocument(@Param('id') id: string){
    return await this.documentsService.verifyDocument(id);
  }

}
