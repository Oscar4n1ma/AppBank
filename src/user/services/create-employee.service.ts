import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import MongoUserRepository from '../repositories/MongoUserRepository';
import { UserStatus } from 'src/enums/user-status.enum';
import { CreateUserEmployeeDto } from '../dto/user-employee.dto';
import { Roles } from 'src/enums/roles.enum';

@Injectable()
export class CreateUserEmployeeService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async use(user: CreateUserEmployeeDto) {
    if (!Roles[user.roleId]) {
      throw new BadRequestException('El rol no existe');
    }
    const existUser: boolean = await this.userRepository.exist(
      user.email,
      user.username,
    );
    if (existUser) {
      throw new BadRequestException('El username o el correo ya existe.');
    }
    const hashedPassword: string = await hash(user.password, await genSalt());
    const userId: string = await this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
      _2fa: false,
      usedPasswords: [hashedPassword],
      roles: [user.roleId],
      permissions: [],
      state: UserStatus.DEACTIVATE,
      type: 'employee',
      data: {
        cc: user.cc,
        genre: user.genre,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        dateBorn: user.dateBorn,
      },
    });
    return userId;
  }
}