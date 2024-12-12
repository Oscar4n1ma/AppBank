import { UserState } from 'src/enums/user-status.enum';

export default interface User {
  id: string;
  username: string;
  password: string;
  oldPasswords: string[];
  email: string;
  roles: number[];
  permissions: number[];
  state: UserState;
  updatedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
}
