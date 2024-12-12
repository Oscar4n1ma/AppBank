import { UserState } from 'src/enums/user-status.enum';
import User from '../interfaces/User.interface';

export class Employee implements User {
  id: string;
  username: string;
  password: string;
  oldPasswords: string[];
  email: string;
  address: string;
  phoneNumber: string;
  permissions: number[];
  roles: number[];
  state: UserState;
  dateBorn: string;
  deletedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}
