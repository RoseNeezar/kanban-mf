import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcryptjs';
import * as cookie from 'cookie';
import { Response } from 'express';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'src/models/user.model';
import { AuthCredentialDto, TokenPayload } from './auth.dto';
import * as jwt from 'jsonwebtoken';
import { asyncHandler, AuthEventResponse, IUser } from '@kanban2.0/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userRepo: ReturnModelType<typeof User>,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialDto: IUser & { password: string }) {
    let result: AuthEventResponse;
    const { email, password, username } = authCredentialDto;

    const emailUser = await this.userRepo.findOne({ email });
    const usernameUser = await this.userRepo.findOne({ username });

    if (emailUser) {
      return (result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Email already exists',
        error: {
          message: 'Email already exists',
        },
      });
    }
    if (usernameUser) {
      return (result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Username already exists',
        error: {
          message: 'Username already exists',
        },
      });
    }

    try {
      const user: Partial<User> = {
        username,
        email,
        password,
      };

      const newUser = await this.userRepo.create(user);

      const cookie = this.getCookieWithJwtToken(newUser._id);
      newUser.password = undefined;

      result = {
        data: newUser,
        extraData: cookie,
        status: HttpStatus.OK,
      };
      return result;
    } catch (error) {
      console.log('ERRRoo--', error);
      throw new BadRequestException();
    }
  }

  async login(authCredentialDto: Omit<AuthCredentialDto, 'email'>) {
    try {
      let result: AuthEventResponse;

      const { username, password } = authCredentialDto;

      const user = await this.userRepo.findOne({ username }).select('-__v');

      if (!user) {
        return (result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'user not exist',
          error: {
            message: 'user not exist',
          },
        });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return (result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'user not exist',
          error: {
            message: 'user not exist',
          },
        });
      }
      const cookie = this.getCookieWithJwtToken(user.id);

      user.password = undefined;

      return (result = {
        data: user,
        extraData: cookie,
        status: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async logout(data: string) {
    const logoutCookie = this.getCookieForLogOut();
    return { data, logoutCookie };
  }

  public getCookieForLogOut() {
    return cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      path: '/',
    });
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload);
    return cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: +process.env.JWT_EXPIRATION_TIME,
      path: '/',
    });
  }

  public verifyToken(token: any) {
    const { userId }: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      return false;
    }
    return userId;
  }

  public async getUserById(userId: any) {
    const user = await this.userRepo.findOne({ _id: userId }).select('-__v');
    if (user) {
      return user;
    }
    return false;
  }
}
