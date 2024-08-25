import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import IUser from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private repo: UserRepository) {}

  @Post('login')
  async login(@Body() user: IUser) {
    try {
      if (!user.email || !user.password) {
        throw new Error('Need email and password');
      }

      const isUser = await this.repo.login(user);

      if (!isUser) {
        throw new Error('User not found');
      }

      const verifyPass = await bcrypt.compare(user.password, isUser.password);

      if (!verifyPass) {
        throw new Error('Invalid password or email');
      }

      const token = jwt.sign({ id: isUser.id }, process.env.JWT_PASS ?? '', {
        expiresIn: '24h',
      });
      const { password: _, ...userLogin } = user;

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User logged successfully',
        data: userLogin,
        token: token,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User login failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
