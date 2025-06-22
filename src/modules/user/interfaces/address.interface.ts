import { Types } from 'mongoose';

export interface IAddress {
  userId: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}
