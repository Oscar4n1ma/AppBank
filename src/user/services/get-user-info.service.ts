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
    const promises = await Promise.all([
      this.userRepository.get(id),
      this.accountRepository.get(id),
      this.cardRepository.get(id),
    ]);
    if (!promises[0]) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return {
      user: promises[0],
      products: {
        account: promises[1],
        card: promises[2],
      },
    };
  }
}
