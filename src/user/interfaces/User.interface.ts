import { UserStatus } from 'src/enums/user-status.enum';

export default interface User {
  id: string;
  username: string;
  password: string;
  oldPasswords: string[];
  email: string;
  address: string;
  phoneNumber: string;
  roles: string[];
  permissions: number[];
  status: UserStatus;
  updatedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
}
