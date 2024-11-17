import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import { CreateUserClientDto } from '../dto/user-client.dto';
import MongoUserRepository from '../repositories/MongoUserRepository';
import { UserStatus } from 'src/enums/user-status.enum';
import { Roles } from 'src/enums/roles.enum';
import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import MongoCardRepository from 'src/product/repositories/MongoCardRepository';
import { Account } from 'src/product/entities/Account';
import { ObjectId } from 'mongodb';
import { Card } from 'src/product/entities/Card';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp-service/services/otp.service';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';

@Injectable()
export class CreateUserClientService {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly accountRepository: MongoAccountRepository,
    private readonly cardRepository: MongoCardRepository,
    private readonly otpRepository: MongoOtpsRepository,
    private readonly otpServices: OtpService,
    private readonly mailService: MailService,
  ) {}

  async use(user: CreateUserClientDto) {
    const existUser: boolean = await this.userRepository.exist(
      user.email,
      user.username,
    );
    if (existUser) {
      throw new BadRequestException('El username o el correo ya existe');
    }
    //se crea el usuario
    const hashedPassword: string = await hash(user.password, await genSalt());
    const hashedPin: string = await hash(user.cardPin, await genSalt());
    const createdAt: Date = new Date();
    const userClient = {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      _2fa: false,
      usedPasswords: [hashedPassword],
      roles: [Roles.Client],
      permissions: [],
      state: UserStatus.DEACTIVATE,
      type: 'client',
      data: {
        cc: user.cc,
        genre: user.genre,
        firstName: user.firstName,
        lastName: user.lastName,
        monthlyIncome: user.monthlyIncome,
        address: user.address,
        maritalStatus: user.maritalStatus,
        currentJob: user.currentJob,
        dateBorn: user.dateBorn,
      },
      updatedAt: createdAt,
      createdAt,
      deletedAt: null,
    };
    const userId: string = await this.userRepository.create(userClient);
    //se crea su cuenta
    const accountId: string = Math.round(Math.random() * 1e11).toString();
    const cardId: string = Math.round(Math.random() * 1e16).toString();

    const productAccount: Account<string, ObjectId> = {
      id: accountId,
      owner: new ObjectId(userId),
      state: true,
      name: 'account',
      description: 'Producto bancario appbank.',
      managementCosts: 0,
      transferCost: 0,
      amountTransfersLimit: 3000000,
      topBalance: 100000000,
      interestRate: 0.001,
      _4x1000: true,
      balance: 0,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };

    //se crea su tarjeta
    const expiredAt: Date = new Date(createdAt.getTime() + 126230400000);
    const productCard: Card<string, ObjectId> = {
      id: cardId,
      accountAssociatedId: accountId,
      owner: new ObjectId(userId),
      description: 'Producto bancario de AppBank.',
      cardType: 'debit',
      amountCreditLimit: 0,
      currentDebt: 0,
      cvc: 233,
      pin: hashedPin,
      name: 'card',
      state: true,
      createdAt,
      expiredAt,
      deletedAt: null,
      updatedAt: createdAt,
    };

    const otp: number = this.otpServices.generateOtp();
    await Promise.all([
      this.accountRepository.create(productAccount),
      this.cardRepository.create(productCard),
      this.otpRepository.create(user.email, otp),
    ]);
    //envia correos
    void this.mailService.sendRegistrationNotification(
      user.email,
      user.username,
    );
    void this.mailService.sendOtpEmail(user.email, String(otp));

    return userId;
  }
}
