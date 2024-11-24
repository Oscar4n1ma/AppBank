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

  async use(ip: string, transactionData: CreateTransactionDto) {
    const { toProduct, fromProduct, amount, description, userId } =
      transactionData;

    const jobs = await Promise.all([
      this.accountRepository.get(fromProduct),
      this.accountRepository.get(toProduct),
      this.transactionRepository.amountTransferedPerDay(fromProduct),
      this.userRepository.get(userId),
    ]);
    // verificaciones de las cuentas
    if (!jobs[0]) {
      throw new BadRequestException('La cuenta de origin no existe.');
    }
    if (jobs[0].owner.toString() !== userId) {
      throw new BadRequestException('Esta cuenta no le pertence al usuario.');
    }

    if (jobs[3].state !== UserStatus.ACTIVE) {
      throw new BadRequestException('El usuario no se encuentra activo');
    }
    if (!jobs[0].state) {
      throw new BadRequestException(
        'La cuenta de origin se encuentra desactivada.',
      );
    }
    if (!jobs[1]) {
      throw new BadRequestException('La cuenta destino no existe.');
    }
    if (!jobs[1].state) {
      throw new BadRequestException(
        'La cuenta de destino no se encuentra activa.',
      );
    }

    //verificacione para realizar la transaccion
    if (jobs[2] + amount > jobs[0].amountTransfersLimit) {
      throw new BadRequestException(
        'El limite de transferencias por dia ya ha sido superado.',
      );
    }
    const _4x1000: number = jobs[0]._4x1000 ? amount * 0.004 : 0;
    const managementCosts: number = jobs[0].managementCosts;
    const transferCost: number = jobs[0].transferCost;
    const createdAt: Date = new Date();

    const transaction = {
      toProduct,
      fromProduct,
      amount,
      totalAmount: amount + _4x1000 + managementCosts + transferCost,
      title: `Pago en ${jobs[1].description} ${toProduct.toString().slice(5)}****`,
      description,
      _4x1000,
      managementCosts,
      transferCost,
      reference1: ip,
      reference2: '',
      createdAt,
    };

    const totalAmountTransaction =
      transaction.amount +
      transaction._4x1000 +
      transaction.managementCosts +
      transaction.transferCost;

    if (jobs[0].balance < totalAmountTransaction) {
      throw new BadRequestException(
        'No tiene fondos suficientes para realizar esta transaccion.',
      );
    }

    const transactionId: string =
      await this.transactionRepository.create(transaction);

    // void this.mailService.notifyTransaction(
    //   jobs[3].email,
    //   amount,
    //   `${transaction.fromProduct.toString().slice(5)}****`,
    //   `${transaction.toProduct.toString().slice(5)}****`,
    //   new Date(),
    // );
    return {
      transactionId,
    };
  }
}
