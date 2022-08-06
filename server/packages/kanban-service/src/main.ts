import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './adapters/socket-io.adapter';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: new ConfigService().get('url'),
      host: new ConfigService().get('host'),
    },
  });
  app.enableCors();
  // app.useWebSocketAdapter(new SocketIoAdapter(app, corsOrigins));

  await app.startAllMicroservices();
  await app.listen(4011);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
