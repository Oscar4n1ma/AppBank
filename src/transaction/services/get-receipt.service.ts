import { Injectable, NotFoundException } from '@nestjs/common';
import MongoTransactionRepository from '../repositories/MongoTransactionRepository';

@Injectable()
export class GetReceiptService {
  constructor(
    private readonly transactionRepository: MongoTransactionRepository,
  ) {}

  async use(id: string) {
    const transaction = await this.transactionRepository.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('La transaccion no fue encontrada.');
    }
    const {
      createdAt,
      amount,
      reference1,
      reference2,
      reference3,
      description,
    } = transaction;
    return {
      id,
      amount,
      description,
      reference1,
      reference2,
      reference3,
      createdAt,
    };
  }
}
