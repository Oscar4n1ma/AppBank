import { Injectable, NotFoundException } from '@nestjs/common';
import MongoAuthRepository from '../MongoAuthRepository';
import { MailService } from 'src/mail/mail.service';
import { sign } from 'jsonwebtoken';

@Injectable()
export class RecoveryPasswordService {
  constructor(
    private readonly authRepository: MongoAuthRepository,
    private readonly mailService: MailService,
  ) {}
  async use(email: string) {
    const credentialsFound = await this.authRepository.findIdByEmail(email);
    if (!credentialsFound) {
      throw new NotFoundException('El correo no existe.');
    }
    const id = credentialsFound._id;
    const jwtSecret = process.env.SECRET_KEY_RESET_PASS_JWT;
    const token = sign({ id }, jwtSecret, { expiresIn: 160 });
    this.mailService.sendChangePasswordEmail(email, token);
    return `Correo enviado a ${email}`;
  }
}
