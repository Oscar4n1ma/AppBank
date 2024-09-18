import { Injectable } from '@nestjs/common';
import { UserStatus } from './interfaces/User';
import { hash, genSalt } from 'bcrypt';
import { CreateClientDto } from './dto/users.dto';
import MongoUserRepository from './MongoClientRepository';
import Client from './entities/Client.entity';

@Injectable()
export class ClientService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async create(user: CreateClientDto) {
    const existUser: boolean = await this.userRepository.exist(
      new Map<string, string>([
        ['username', user.username],
        ['email', user.email],
      ]),
    );

    if (existUser) {
      throw new Error('El usuario o el corre ya existe');
    }

    const hashedPassword: string = await hash(user.password, await genSalt());

    const client: Client = new Client(
      user.username,
      user.email,
      UserStatus.INACTIVE,
      hashedPassword,
      user.phoneNumber,
      [hashedPassword],
      [],
      user.address,
      user.cc,
      new Date(user.dateBorn),
      user.genre,
      user.firstName,
      user.lastName,
      user.monthlyIncome,
      user.maritalStatus,
      user.currentJob,
      new Date(),
    );

    const userId: string = await this.userRepository.create(client);

    return userId;
  }
}
