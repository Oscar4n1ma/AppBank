import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './entities/user.entity';
import { hash, genSalt } from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto/users.dto';
import MongoUserRepository from './MongoUserRepository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async createUser(user: CreateUserDto) {
    const existUser: boolean = await this.userRepository.exist(
      user.username,
      user.email,
    );

    if (existUser) {
      throw new Error('El usuario o el corre ya existe');
    }

    const hashedPassword: string = await hash(user.password, await genSalt());

    const newUser: User = new User(
      '',
      user.username,
      user.email,
      user.firstName,
      user.lastName,
      UserStatus.INACTIVE,
      hashedPassword,
      new Date(user.dateBorn),
      new Date(),
    );

    const userId: string = await this.userRepository.create(newUser);

    return userId;
  }

  async loginUser(user: LoginUserDto) {
    const userId: string = await this.userRepository.logIn(user);
    return userId;
  }
}
