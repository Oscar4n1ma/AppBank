import { UserStatus } from 'src/enums/user-status.enum';
import User from '../interfaces/User.interface';

export class Enterprise implements User {
  id: string;
  username: string;
  password: string;
  oldPasswords: string[];
  email: string;
  address: string;
  phoneNumber: string;
  permissions: number[];
  roles: string[];
  nit: string;
  name: string;
  type: string;
  ownerCc: string;
  status: UserStatus;
  deletedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}
