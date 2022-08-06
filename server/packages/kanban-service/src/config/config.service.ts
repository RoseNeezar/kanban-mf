import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      url: process.env.TASK_MICROSERVICE_URL,
      host: process.env.TASK_MICROSERVICE_HOST,
    };
    this.envConfig.authService = {
      options: {
        url: process.env.AUTH_MICROSERVICE_URL,
      },
      transport: Transport.REDIS,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
