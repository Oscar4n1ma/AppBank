import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import MongoAuthRepository from '../MongoAuthRepository';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { Verify2FaDto } from '../dto/verify2fa.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class Verify2FaService {
  constructor(
    private readonly authRepository: MongoAuthRepository,
    private readonly otpRepository: MongoOtpsRepository,
  ) {}
  async use(verify2Fa: Verify2FaDto) {
    const promises = await Promise.all([
      this.otpRepository.get(verify2Fa.email),
      this.authRepository.findIdByEmail(verify2Fa.email),
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
    if (verify2Fa.otp != lastOtp.otp) {
      throw new UnauthorizedException('El código es incorrecto.');
    }
    if (lastOtp.expiredAt.getTime() < Date.now()) {
      throw new UnauthorizedException('El código ya expiro.');
    }

    await this.otpRepository.delete(lastOtp._id.toString());
    const payload = { id: userFound._id.toString() };
    const jwtSecret = process.env.SECRET_KEY_JWT;
    return { access_token: sign(payload, jwtSecret) };
  }
}
