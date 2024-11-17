import { Injectable } from '@nestjs/common';
import MongoAuthRepository from '../MongoAuthRepository';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { VerifyOtpService } from '../../otp-service/services/verify-otp.service';

@Injectable()
export class ConfirmAccountService {
  constructor(
    private readonly authRepository: MongoAuthRepository,
    private readonly verifyOtpServide: VerifyOtpService,
  ) {}
  async use(confirmAccount: ConfirmAccountDto) {
    const promises = await Promise.all([
      this.authRepository.findIdByEmail(confirmAccount.email),
      this.verifyOtpServide.use({
        otp: confirmAccount.otp,
        email: confirmAccount.email,
      }),
    ]);
    await this.authRepository.activateAccount(promises[0]._id.toString());
  }
}
