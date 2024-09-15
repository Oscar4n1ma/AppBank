export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class User {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly email: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly status: UserStatus,
    readonly password: string,
    readonly dateBorn: Date,
    readonly createdAt: Date,
  ) {}
}
