import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select({
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      status: 1,
      role: 1,
      isEmailVerified: 1,
    });

    if (!user || !user.isEmailVerified)
      throw new NotFoundException('User not found or email not verified.');

    return {
      message: 'User retrieved successfully.',
      statusCode: 200,
      data: {
        user,
      },
    };
  }
}
