import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  console.log('EJS----', process.env.ORIGIN);
  app.enableCors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', '*'],
  });
  await app.listen(4010);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
