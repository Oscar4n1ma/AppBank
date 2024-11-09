export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATE = 'DEACTIVATE',
}

export default interface User {
  id: string;
  username: string;
  password: string;
  usedPasswords: string[];
  email: string;
  address: string;
  phoneNumber: string;
  permissions: number[];
  status: UserStatus;
  createdAt: Date;
}
