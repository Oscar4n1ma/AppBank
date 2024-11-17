import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';

@Injectable()
export class VerifyOtpService {
  constructor(private readonly otpRepository: MongoOtpsRepository) {}
  async use(data: { otp: number; email: string }) {
    const otpsFound = await this.otpRepository.get(data.email);
    if (otpsFound.length === 0) {
      throw new NotFoundException('El usuario no ha solicitado un codigo.');
    }
    const lastOtp = otpsFound.shift();
    if (lastOtp.deletedAt !== null) {
      throw new NotFoundException('El usuario no ha solicitado un codigo.');
    }
    if (data.otp != lastOtp.otp) {
      throw new UnauthorizedException('El código es incorrecto.');
    }
    if (lastOtp.expiredAt.getTime() < Date.now()) {
      throw new UnauthorizedException('El código ya expiro.');
    }
    await this.otpRepository.delete(lastOtp._id.toString());
  }
}
