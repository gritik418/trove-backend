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
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { ENV_KEYS } from 'src/common/constants/env.keys';
import { VerifyEmailSchemaType } from './schemas/verify-email.zod';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: RegisterSchemaType) {
    if (data.password !== data.confirmPassword)
      throw new BadRequestException('Confirm Password must match Password.');

    const existingUser = await this.userModel.findOne({
      email: data.email,
    });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new BadRequestException('Email already exists.');
      }
      await this.userModel.findByIdAndDelete(existingUser._id);
    }

    try {
      const hashedPassword: string = await bcrypt.hash(data.password, 10);
      const emailVerificationToken: string = uuidv4();
      const hashedVerificationToken: string = await bcrypt.hash(
        emailVerificationToken,
        8,
      );

      const user = await this.userModel.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        emailVerificationToken: hashedVerificationToken,
        emailVerificationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
      });

      const emailVerificationLink: string = `${process.env[ENV_KEYS.CLIENT_URL]}/verify-email/${user._id}/${emailVerificationToken}`;

      await this.mailService.sendVerificationEmail(
        data.email,
        emailVerificationLink,
        'Your Trove Adventure Awaits — Verify to Begin 🛍️',
      );

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
      throw new InternalServerErrorException('Something went wrong.');
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

    const payload: JwtPayload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    };

    const authToken = this.jwtService.sign(payload);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, authToken, cookieOptions);

    return {
      statusCode: 200,
      message: 'Logged In successfully.',
    };
  }

  async verifyEmail(data: VerifyEmailSchemaType) {
    const user = await this.userModel.findById(data.userId);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified.');
    }

    if (!user.emailVerificationToken || !user.emailVerificationTokenExpiry) {
      throw new BadRequestException('No verification token found.');
    }

    if (user.emailVerificationTokenExpiry < new Date()) {
      throw new BadRequestException(
        'Verification link expired. You can request a new one.',
      );
    }

    const isVerificationTokenValid = await bcrypt.compare(
      data.token,
      user.emailVerificationToken,
    );
    if (!isVerificationTokenValid) {
      throw new BadRequestException('Invalid verification link.');
    }

    try {
      await this.userModel.findByIdAndUpdate(data.userId, {
        $set: {
          isEmailVerified: true,
        },
        $unset: {
          emailVerificationToken: 1,
          emailVerificationTokenExpiry: 1,
        },
      });

      await this.mailService.sendVerificationSuccessEmail(
        user.email,
        user.name,
      );

      return {
        statusCode: 200,
        message: 'Email verified successfully. Please log in to continue.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified.');
    }

    try {
      const emailVerificationToken: string = uuidv4();
      const hashedVerificationToken: string = await bcrypt.hash(
        emailVerificationToken,
        8,
      );

      await this.userModel.findByIdAndUpdate(user._id, {
        $set: {
          emailVerificationToken: hashedVerificationToken,
          emailVerificationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      const emailVerificationLink: string = `${process.env[ENV_KEYS.CLIENT_URL]}/verify-email/${user._id}/${emailVerificationToken}`;

      await this.mailService.sendVerificationEmail(
        user.email,
        emailVerificationLink,
        'Here’s Your New Trove Verification Link 🛍️',
      );

      return {
        statusCode: 200,
        message:
          'A new verification email has been sent. Please check your inbox.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
