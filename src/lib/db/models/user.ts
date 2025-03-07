import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
}

export const UserCollection = 'users';