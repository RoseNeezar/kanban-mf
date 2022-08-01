import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'ping' })
  pong(data: string): string {
    return data + ' - pong from todo service tosi is a joke';
  }
  @Get('kanban/chat')
  async testFirstService(): Promise<string> {
    return 'chat task';
  }
}
