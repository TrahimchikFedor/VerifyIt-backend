import { DocumentType } from "prisma/generated/prisma/client"


export class DocumentResponseDto{
    id: String
    name: String
    valid: boolean
    expiresSoon: boolean
    type: DocumentType
    author: String
    expirationDate: Date
    createdAt: Date
}