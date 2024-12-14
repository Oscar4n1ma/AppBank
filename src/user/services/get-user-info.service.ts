import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import MongoUserRepository from '../repositories/MongoUserRepository';
import { Injectable, NotFoundException } from '@nestjs/common';
import MongoCardRepository from 'src/product/repositories/MongoCardRepository';

@Injectable()
export class GetUserInfoService {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly accountRepository: MongoAccountRepository,
    private readonly cardRepository: MongoCardRepository,
  ) {}

  async use(id: string) {
    const userFound = await this.userRepository.get(id);
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    const promises = await Promise.all([
      this.userRepository.getEnterpriseData(userFound.id),
      this.accountRepository.get(userFound.id),
      this.cardRepository.get(userFound.id),
    ]);

    return {
      user: userFound,
      company: promises[0],
      products: {
        accounts: [promises[1]],
        cards: [promises[2]],
      },
    };
  }
}
