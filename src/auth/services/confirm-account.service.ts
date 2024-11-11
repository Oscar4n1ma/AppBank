import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import MongoAuthRepository from '../MongoAuthRepository';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';

@Injectable()
export class ConfirmAccountService {
  constructor(
    private readonly authRepository: MongoAuthRepository,
    private readonly otpRepository: MongoOtpsRepository,
  ) {}
  async use(confirmAccount: ConfirmAccountDto) {
    const promises = await Promise.all([
      this.otpRepository.get(confirmAccount.email),
      this.authRepository.findIdByEmail(confirmAccount.email),
    ]);
    const userFound = promises[1];
    const otps = promises[0];

    if (!userFound) {
      throw new NotFoundException('El usuario no existe.');
    }
    if (otps.length === 0) {
      throw new NotFoundException('El codigo no existe.');
    }
    const lastOtp = otps.shift();
    if (lastOtp.deletedAt !== null) {
      throw new NotFoundException('El codigo no existe.');
    }
    if (confirmAccount.otp != lastOtp.otp) {
      throw new UnauthorizedException('El código es incorrecto.');
    }
    if (lastOtp.expiredAt.getTime() < Date.now()) {
      throw new UnauthorizedException('El código ya expiro.');
    }

    await this.otpRepository.delete(lastOtp._id.toString());
    await this.authRepository.activateAccount(userFound._id.toString());

    return 'Su cuenta fue activada con exito';
  }
}
