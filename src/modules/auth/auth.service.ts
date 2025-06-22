import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterSchemaType } from './schemas/register.zod';
import { LoginSchemaType } from './schemas/login.zod';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  cookieOptions,
} from 'src/common/constants/cookie-options';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterSchemaType) {
    if (data.password !== data.confirmPassword)
      throw new BadRequestException('Confirm Password must match Password.');

    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) throw new BadRequestException('Email already exists.');

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userModel.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      return {
        statusCode: 201,
        message: 'User registered successfully.',
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(data: LoginSchemaType, res: Response) {
    const user = await this.userModel.findOne({
      email: data.email,
      isEmailVerified: true,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user._id };

    const authToken = this.jwtService.sign(payload);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, authToken, cookieOptions);

    return {
      statusCode: 200,
      message: 'Logged In successfully.',
    };
  }
}
