import { Types } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  role: Role;
  status: UserStatus;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
