import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { ConfigService } from './config/config.service';
import { KanbanController } from './kanban.controller';
import { ListController } from './list.controller';
import { AuthGuard } from './services/guards/authorization.guard';
import { TaskController } from './task.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    AppController,
    KanbanController,
    AuthController,
    ListController,
    TaskController,
  ],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('authService'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'CALENDAR_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('calendarService'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'KANBAN_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('taskService'));
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
