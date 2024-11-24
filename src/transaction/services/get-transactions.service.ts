import { Injectable } from '@nestjs/common';
import MongoTransactionRepository from '../repositories/MongoTransactionRepository';

@Injectable()
export class GetTransactionService {
  constructor(
    private readonly transactionRepository: MongoTransactionRepository,
  ) {}

  async use(accountId: string) {
    const transactions = this.transactionRepository.getMovements(accountId);
    return transactions;
  }
}
