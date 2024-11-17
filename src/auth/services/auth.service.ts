import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from 'src/auth/dto/auth.dto';
import MongoAuthRepository from '../MongoAuthRepository';
import { compare } from 'bcrypt';
import { AuthUser } from '../entities/auth.entity';
import { OtpService } from 'src/otp-service/services/otp.service';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { sign } from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: MongoAuthRepository,
    private readonly otpRepository: MongoOtpsRepository,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async use(user: LoginUserDto) {
    const credentialsToLogin: AuthUser = new AuthUser(user.user, user.password);

    const credentialsFound =
      await this.authRepository.findCredentials(credentialsToLogin);

    if (!credentialsFound) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const validation: boolean = await compare(
      user.password,
      credentialsFound.password,
    );

    if (!validation) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
    const { email, _id, _2fa } = credentialsFound;
    let accessToken: string = null;

    if (_2fa) {
      const otp: number = this.otpService.generateOtp();
      await this.otpRepository.create(email, otp);
      void this.mailService.sendOtpEmail(email, String(otp));
    } else {
      const jwtSecret = process.env.SECRET_KEY_JWT;
      accessToken = sign({ userId: _id }, jwtSecret);
    }
    return { userId: _id, accessToken, _2fa };
  }
}
