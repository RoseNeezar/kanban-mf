import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AuthEvent } from '@kanban2.0/shared';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.cookie) {
      throw new BadRequestException('no token');
    }

    const token = request.cookies.token;

    if (!token) {
      throw new BadRequestException('no token');
    }

    const userTokenInfo = await firstValueFrom(
      this.authServiceClient.send({ cmd: AuthEvent.verifyToken }, token),
    );

    if (!userTokenInfo) {
      throw new BadRequestException('token expired');
    }

    const userInfo = await firstValueFrom(
      this.authServiceClient.send(
        { cmd: AuthEvent.getUserByToken },
        userTokenInfo,
      ),
    );

    if (!userInfo) {
      return false;
    }

    userInfo.password = undefined;
    request.user = userInfo;

    return true;
  }
}
