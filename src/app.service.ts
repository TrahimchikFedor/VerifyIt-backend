import { PrismaService } from './prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AllLogger } from './common/log/logger.log';
import { AuthService } from './auth/auth.service';
import { User } from 'prisma/generated/prisma/client';

@Injectable()
export class AppService {
  private readonly name = AppService.name;
  private readonly logger = new AllLogger();
  constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService){};
  
  getHello(){
    this.logger.log("Successful getHello request", this.name)
    return {
      "text":"Hello World!"
    }
  }
}
