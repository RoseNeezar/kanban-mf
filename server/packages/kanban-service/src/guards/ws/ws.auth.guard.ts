import { AuthEvent } from '@kanban2.0/shared';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Socket = context.switchToWs().getClient();

    if (!request.handshake.headers.cookie) {
      throw new BadRequestException('no token');
    }
    const tempToken = request.handshake.headers.cookie
      .split(' ')
      .find((s: string) => s.includes('token'));

    const token = tempToken.substring(
      tempToken.indexOf('=') + 1,
      tempToken.length,
    );

    if (!token) {
      return false;
    }

    const userTokenInfo = await firstValueFrom(
      this.authServiceClient.send({ cmd: AuthEvent.verifyToken }, token),
    );

    if (!userTokenInfo) {
      return false;
    }

    return true;
  }
}
