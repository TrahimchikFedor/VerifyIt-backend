import { DocumentBuilder } from "@nestjs/swagger";

export function getSwaggerConfig(){
    return new DocumentBuilder()
    .setTitle('VerifyIt Backend API')
    .setDescription('API, предназначенное для работы мобильного приложения VerifyIt')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
}