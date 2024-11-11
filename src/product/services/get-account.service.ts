import { Injectable, NotFoundException } from '@nestjs/common';
import MongoAccountRepository from '../repositories/MongoAccountRepository';

@Injectable()
export class GetAccountService {
  constructor(private readonly accountRepository: MongoAccountRepository) {}
  async use(id: string) {
    const account = await this.accountRepository.get(id);
    if (!account) {
      throw new NotFoundException('La cuenta no existe.');
    }
    return account;
  }
}
