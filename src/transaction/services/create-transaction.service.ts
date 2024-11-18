import { BadRequestException, Injectable } from '@nestjs/common';

import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import { CreateTransactionDto } from '../dtos/create-transaction';
import MongoTransactionRepository from '../repositories/MongoTransactionRepository';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';
import { UserStatus } from 'src/enums/user-status.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CreateTransactionService {
  constructor(
    private readonly accountRepository: MongoAccountRepository,
    protected readonly userRepository: MongoUserRepository,
    private readonly transactionRepository: MongoTransactionRepository,
    private readonly mailService: MailService,
  ) {}

  async use(transaction: CreateTransactionDto) {
    const { toProduct, fromProduct, amount, description } = transaction;

    const accounts = await Promise.all([
      this.accountRepository.get(fromProduct),
      this.accountRepository.get(toProduct),
      this.transactionRepository.amountTransferedPerDay(fromProduct),
      this.userRepository.get(transaction.userId),
    ]);
    // verificaciones de las cuentas
    if (!accounts[0]) {
      throw new BadRequestException('La cuenta de origin no existe.');
    }
    if (accounts[0].owner.toString() !== transaction.userId) {
      throw new BadRequestException('Esta cuenta no le pertence al usuario.');
    }

    if (accounts[3].state !== UserStatus.ACTIVE) {
      throw new BadRequestException('El usuario no se encuentra activo');
    }
    if (!accounts[0].state) {
      throw new BadRequestException(
        'La cuenta de origin se encuentra desactivada.',
      );
    }
    if (!accounts[1]) {
      throw new BadRequestException('La cuenta destino no existe.');
    }
    if (!accounts[1].state) {
      throw new BadRequestException(
        'La cuenta de destino no se encuentra activa.',
      );
    }

    //verificacione para realizar la transaccion
    if (accounts[2] + amount > accounts[0].amountTransfersLimit) {
      throw new BadRequestException(
        'El limite de transferencias por dia ya ha sido superado.',
      );
    }
    const transactions = [
      {
        toProduct,
        fromProduct,
        amount,
        description: `Pago en ${accounts[1].description} ${toProduct.toString().slice(5)}****`,
      },
    ];

    if (accounts[0]._4x1000) {
      transactions.push({
        toProduct: process.env.ACCOUNT_ID_APP_BANK,
        fromProduct,
        description: 'Pago impuesto 4x1000',
        amount: transaction.amount * 0.004,
      });
    }
    if (accounts[0].managementCosts > 0) {
      transactions.push({
        toProduct: process.env.ACCOUNT_ID_APP_BANK,
        fromProduct,
        description: 'Costos operacionales.',
        amount: accounts[0].managementCosts,
      });
    }
    if (accounts[0].transferCost > 0) {
      transactions.push({
        toProduct: process.env.ACCOUNT_ID_APP_BANK,
        fromProduct,
        description: 'Costos por transferencia.',
        amount: accounts[0].transferCost,
      });
    }
    const totaAmountTransaction = transactions
      .map((t) => t.amount)
      .reduce((x, y) => x + y, 0);

    if (accounts[0].balance < totaAmountTransaction) {
      throw new BadRequestException('No tiene fondos.');
    }

    const transactionId: string =
      await this.transactionRepository.create(transactions);

    void this.mailService.notifyTransaction(
      accounts[3].email,
      totaAmountTransaction,
      `${transaction.fromProduct.toString().slice(5)}****`,
      `${transaction.toProduct.toString().slice(5)}****`,
      new Date(),
    );
    return {
      transactionId,
    };
  }
}
