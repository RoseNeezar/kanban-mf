import { AuthEvent, AuthEventResponse, IUser } from '@kanban2.0/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Authorization } from './decorators/authorization.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('CALENDAR_SERVICE') private readonly calendarService: ClientProxy,
  ) {}

  @Post('/register')
  async register(
    @Res() res: Response,
    @Body() authCredentialDto: IUser & { password: string },
  ) {
    console.log('Register-0', authCredentialDto);

    const registerData: AuthEventResponse = await firstValueFrom(
      this.authService.send({ cmd: AuthEvent.register }, authCredentialDto),
    );
    if (registerData.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: registerData.message,
          data: null,
          errors: registerData.error,
        },
        registerData.status,
      );
    }
    const { data, extraData } = registerData;
    res.setHeader('Set-Cookie', extraData);
    data.password = undefined;
    return res.send(data);
  }

  @Post('/login')
  async login(
    @Res() res: Response,
    @Body() authCredentialDto: Omit<IUser, 'email'>,
  ) {
    const loginData: AuthEventResponse = await firstValueFrom(
      this.authService.send({ cmd: AuthEvent.login }, authCredentialDto),
    );

    const { data: user, extraData } = loginData;

    if (loginData.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: loginData.message,
          data: null,
          errors: loginData.error,
        },
        loginData.status,
      );
    }

    res.setHeader('Set-Cookie', extraData);
    user.password = undefined;
    return res.send(user);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      const loginData = await firstValueFrom(
        this.authService.send({ cmd: AuthEvent.logout }, 'success'),
      );

      const { data, logoutCookie } = loginData;
      res.setHeader('Set-Cookie', logoutCookie);

      return {
        success: data,
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('/me')
  @Authorization(true)
  me(@GetUser() user: IUser) {
    return user;
  }

  @Get('/')
  async go() {
    console.log('hello go');
    return this.calendarService.send('send-user-data', {
      Name: 'hi nestjs',
      Email: 'me@g.com',
    });
  }
}
