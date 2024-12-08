import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import { CreateTransactionDto } from '../dtos/create-transaction';
import MongoTransactionRepository from '../repositories/MongoTransactionRepository';

import { UserStatus } from 'src/enums/user-status.enum';
import { MailService } from 'src/mail/mail.service';
import { compare } from 'bcrypt';
import MongoAuthRepository from 'src/auth/MongoAuthRepository';

@Injectable()
export class CreateTransactionService {
  constructor(
    private readonly accountRepository: MongoAccountRepository,
    protected readonly authRepository: MongoAuthRepository,
    private readonly transactionRepository: MongoTransactionRepository,
    private readonly mailService: MailService,
  ) {}

  async use(ip: string, transactionData: CreateTransactionDto) {
    const { toProduct, fromProduct, amount, description, userId, pin } =
      transactionData;

    const jobs = await Promise.all([
      this.accountRepository.get(fromProduct),
      this.accountRepository.get(toProduct),
      this.transactionRepository.amountTransferedPerDay(fromProduct),
      this.authRepository.findCredentials({ username: userId, password: '' }),
    ]);

    // verificaciones de las cuentas
    if (!jobs[0]) {
      throw new NotFoundException('La cuenta de origin no existe.');
    }
    const userOwner = jobs[3];

    if (!userOwner) {
      throw new BadRequestException(
        'El usuario especificado como propietario no existe.',
      );
    }
    if (userOwner.state !== UserStatus.ACTIVE) {
      throw new BadRequestException('El usuario no se encuentra activo');
    }

    if (userId !== jobs[0].owner.toString()) {
      throw new BadRequestException(
        'El usuario especificado no le pertenece el producto.',
      );
    }

    if (!jobs[0].state) {
      throw new BadRequestException(
        'La cuenta de origen se encuentra desactivada.',
      );
    }
    if (!jobs[1]) {
      throw new NotFoundException('La cuenta destino no existe.');
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

    const validationPind = await compare(pin, userOwner.pin);
    if (!validationPind) {
      throw new UnauthorizedException('El pin es incorrecto.');
    }

    const transactionId: string =
      await this.transactionRepository.create(transaction);

    void this.mailService.notifyTransaction(
      jobs[3].email,
      amount,
      `${transaction.fromProduct.toString().slice(5)}****`,
      `${transaction.toProduct.toString().slice(5)}****`,
      new Date(),
    );
    return {
      transactionId,
    };
  }
}
