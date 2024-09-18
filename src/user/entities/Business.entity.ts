import { UserStatus } from '../interfaces/User';
import UserInterface from '../interfaces/User';
export default class Business implements UserInterface {
  constructor(
    readonly username: string,
    readonly email: string,
    readonly status: UserStatus,
    readonly password: string,
    readonly phoneNumber: string,
    readonly usedPassword: string[],
    readonly permissions: string[],
    readonly name: string,
    readonly address: string,
    readonly nit: string,
    readonly type: string,
    readonly description: string,
    readonly ownerCc: string,
    readonly createdAt: Date,
    public id?: string,
  ) {}
}
