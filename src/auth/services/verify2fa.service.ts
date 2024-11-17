import { Injectable } from '@nestjs/common';
import { Verify2FaDto } from '../dto/verify2fa.dto';
import { sign } from 'jsonwebtoken';
import { VerifyOtpService } from '../../otp-service/services/verify-otp.service';

@Injectable()
export class Verify2FaService {
  constructor(private readonly verifyOtpService: VerifyOtpService) {}
  async use(verify2Fa: Verify2FaDto) {
    await this.verifyOtpService.use({
      otp: verify2Fa.otp,
      email: verify2Fa.email,
    });
    const payload = { id: verify2Fa.email };
    const jwtSecret = process.env.SECRET_KEY_JWT;
    return { access_token: sign(payload, jwtSecret) };
  }
}
