export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      url: process.env.AUTH_MICROSERVICE_URL,
      host: '0.0.0.0',
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
