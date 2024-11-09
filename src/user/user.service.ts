import { Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import { CreateClientDto } from './dto/users.dto';
import MongoUserRepository from './repositories/MongoUserRepository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async createClient(user: CreateClientDto) {
    const existUser: boolean = await this.userRepository.exist(
      user.email,
      user.username,
    );
    if (existUser) {
      throw new Error('El username o el correo ya existe');
    }
    const hashedPassword: string = await hash(user.password, await genSalt());
    user.password = hashedPassword;
    const userId: string = await this.userRepository.createClient(user);

    return userId;
  }
}
