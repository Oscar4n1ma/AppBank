import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import MongoUserRepository from '../repositories/MongoUserRepository';
import { CreateUserEnterprisetDto } from '../dto/user-enterprise.dto';
import { Roles } from 'src/enums/roles.enum';
import { UserStatus } from 'src/enums/user-status.enum';
import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import MongoCardRepository from 'src/product/repositories/MongoCardRepository';
import { ObjectId } from 'mongodb';
import { Account } from 'src/product/entities/Account';
import { Card } from 'src/product/entities/Card';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { OtpService } from 'src/otp-service/services/otp.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CreateUserEnterpriseService {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly accountRepository: MongoAccountRepository,
    private readonly cardRepository: MongoCardRepository,
    private readonly otpRepository: MongoOtpsRepository,
    private readonly otpServices: OtpService,
    private readonly mailService: MailService,
  ) {}

  async use(user: CreateUserEnterprisetDto) {
    const jobs = await Promise.all([
      this.userRepository.exist(user.email, user.username),
      hash(user.password, await genSalt()),
      hash(user.cardPin, await genSalt()),
    ]);
    if (jobs[0]) {
      throw new BadRequestException('El username o el correo ya existe.');
    }

    const hashedPassword: string = jobs[1];
    const hashedPin: string = jobs[2];
    const createdAt: Date = new Date();
    const userId: ObjectId = new ObjectId();
    const userEnterprise = {
      _id: userId,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      _2fa: false,
      roles: [Roles.Client],
      usedPasswords: [hashedPassword],
      pin: hashedPin,
      permissions: [],
      state: UserStatus.DEACTIVATE,
      type: 'enterprise',
      data: {
        phoneNumber: user.phoneNumber,
        ownerCc: user.ownerCc,
        address: user.address,
        name: user.name,
        description: user.description,
      },
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };

    // se crea su cuenta
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

    // se crea su tarjeta
    const expiredAt: Date = new Date(createdAt.getTime() + 126230400000);

    const productCard: Card<string, ObjectId> = {
      id: cardId,
      owner: new ObjectId(userId),
      description: 'Producto bancario de AppBank.',
      accountAssociatedId: accountId,
      cardType: 'debit',
      amountCreditLimit: 0,
      currentDebt: 0,
      cvc: 233,
      name: 'card',
      state: true,
      createdAt,
      expiredAt,
      deletedAt: null,
      updatedAt: createdAt,
    };
    const otp: number = this.otpServices.generateOtp();
    await Promise.all([
      this.userRepository.create(userEnterprise),
      this.accountRepository.create(productAccount),
      this.cardRepository.create(productCard),
      this.otpRepository.create(user.email, otp),
    ]);
    //envia correos
    // void this.mailService.sendRegistrationNotification(
    //   user.email,
    //   user.username,
    // );
    // void this.mailService.sendOtpEmail(user.email, String(otp));
    return userId;
  }
}
