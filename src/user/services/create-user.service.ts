import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import MongoUserRepository from '../repositories/MongoUserRepository';
import { Role } from 'src/enums/roles.enum';
import { UserState } from 'src/enums/user-status.enum';
import { ObjectId } from 'mongodb';
import { Account } from 'src/product/entities/Account';
import { Card } from 'src/product/entities/Card';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { OtpService } from 'src/otp-service/services/otp.service';
import { MailService } from 'src/mail/mail.service';
import { Company } from '../entities/Enterprise';
import { Client } from '../entities/Client.enity';
import { ClientDto } from '../dto/user-client.dto';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly otpRepository: MongoOtpsRepository,
    private readonly otpServices: OtpService,
    private readonly mailService: MailService,
  ) {}

  async use(user: ClientDto) {
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
    const userId = new ObjectId().toString();
    const client: Client = {
      id: userId,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      _2fa: false,
      roles: [Role.Client],
      oldPasswords: [hashedPassword],
      pin: hashedPin,
      permissions: [],
      state: UserState.DEACTIVATE,
      data: {
        documentNumber: user.documentNumber,
        documnentTypeId: user.documentTypeId,
        phoneNumber: user.phoneNumber,
        genre: user.genre,
        firstName: user.firstName,
        lastName: user.lastName,
        monthlyIncome: user.monthlyIncome,
        address: user.address,
        maritalStatus: user.maritalStatus,
        currentJob: user.currentJob,
        dateBorn: user.dateBorn,
      },
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };
    const company: Company | null = user.company
      ? {
          nit: user.company.nit,
          owner: userId,
          description: user.company.description,
          name: user.company.companyName,
          phoneNumber: user.company.companyPhoneNumber,
          numberOfEmployees: user.company.numberOfEmployees,
          address: user.company.companyAddress,
        }
      : null;

    const productAccount: Account = new Account(
      userId,
      100_000_000,
      0,
      50_000_000,
      true,
    );
    const productCard: Card = new Card(userId, productAccount.id);

    await this.userRepository.create(
      client,
      productCard,
      productAccount,
      company,
    );

    const otp: number = this.otpServices.generateOtp();

    await this.otpRepository.create(user.email, otp);

    void this.mailService.sendRegistrationNotification(
      user.email,
      user.username,
    );
    void this.mailService.sendOtpEmail(user.email, String(otp));
    return userId;
  }
}
