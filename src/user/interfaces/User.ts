export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATE = 'DEACTIVATE',
  SUSPENDED = 'SUSPENDED',
}

export default interface UserInterface {
  id?: string;
  username: string;
  password: string;
  usedPassword: string[];
  email: string;
  phoneNumber: string;
  status: UserStatus;
  permissions: string[];
  address: string;
  createdAt: Date;
}
