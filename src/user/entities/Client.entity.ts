import { UserStatus } from '../interfaces/User';
import UserInterface from '../interfaces/User';
export default class Client implements UserInterface {
  constructor(
    readonly username: string,
    readonly email: string,
    readonly status: UserStatus,
    readonly password: string,
    readonly phoneNumber: string,
    readonly usedPassword: string[],
    readonly permissions: string[],
    readonly address: string,
    readonly cc: string,
    readonly dateBorn: Date,
    readonly genre: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly monthlyIncome: string,
    readonly maritalStatus: string,
    readonly currentJob: string,
    readonly createdAt: Date,
    public id?: string,
  ) {}
}
