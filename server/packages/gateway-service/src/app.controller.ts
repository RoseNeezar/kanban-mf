import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('KANBAN_SERVICE') private readonly firstClient: ClientProxy,
    @Inject('CALENDAR_SERVICE') private readonly secondClient: ClientProxy,
  ) {}

  @Get('/first')
  async testFirstService(): Promise<string> {
    const tasksResponse: any = await firstValueFrom(
      this.firstClient.send({ cmd: 'ping' }, 'onto todo service'),
    );

    console.log(tasksResponse, 'sec');
    return tasksResponse;
  }

  @Get('/second')
  async testSecondService(): Promise<string> {
    const tasksResponse: any = await firstValueFrom(
      this.secondClient.send({ cmd: 'pong' }, 'auth-some'),
    );

    console.log(tasksResponse);
    return 'second dsds';
  }
}
