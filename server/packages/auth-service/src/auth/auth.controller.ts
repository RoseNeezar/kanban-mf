import { AuthEvent, IUser } from '@kanban2.0/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: AuthEvent.register })
  register(authCredentialDto: IUser & { password: string }) {
    return this.authService.register(authCredentialDto);
  }

  @MessagePattern({ cmd: AuthEvent.login })
  login(authCredentialDto: Omit<IUser, 'email'> & { password: string }) {
    return this.authService.login(authCredentialDto);
  }

  @MessagePattern({ cmd: AuthEvent.logout })
  logout(data: string) {
    return this.authService.logout(data);
  }

  @MessagePattern({ cmd: AuthEvent.verifyToken })
  verifyToken(token: any) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern({ cmd: AuthEvent.getUserByToken })
  getUserByToken(userId: any) {
    return this.authService.getUserById(userId);
  }
}
