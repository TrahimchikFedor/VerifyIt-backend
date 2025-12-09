import { IsNotEmpty, IsString } from "class-validator"
import { DocumentType } from "prisma/generated/prisma/client"

export class CreateDocumentDto{
    @IsString()
    @IsNotEmpty()
    name: string

    type: DocumentType

    @IsString()
    @IsNotEmpty()
    author: string

    expirationDate: Date
}