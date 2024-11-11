import { UserStatus } from 'src/enums/user-status.enum';
import User from '../interfaces/User.interface';

export class Client implements User {
  id: string;
  username: string;
  password: string;
  oldPasswords: string[];
  email: string;
  address: string;
  phoneNumber: string;
  permissions: number[];
  roles: string[];
  status: UserStatus;
  monthlyIncome: string;
  currentJob: string;
  maritalStatus: string;
  dateBorn: string;
  updatedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
}
