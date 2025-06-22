import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterSchemaType } from './schemas/register.zod';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
}
