import { UserState } from 'src/enums/user-status.enum';
import User from '../interfaces/User.interface';

export class Client implements User {
  id: string;
  username: string;
  password: string;
  _2fa: boolean;
  oldPasswords: string[];
  email: string;
  pin: string;
  permissions: number[];
  roles: number[];
  state: UserState;
  data: {
    firstName: string;
    lastName: string;
    documentNumber: string;
    documentTypeId: number;
    phoneNumber: string;
    address: string;
    monthlyIncome: string;
    genre: number;
    currentJob: number;
    maritalStatus: number;
    dateBorn: string;
  };
  updatedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
}
