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
    console.log(credentialsFound);
    if (!credentialsFound) {
      throw new NotFoundException('El correo no existe');
    }
    const id = credentialsFound._id;
    const jwtSecret = process.env.SECRET_KEY_JWT;
    const token = sign({ id }, jwtSecret);
    this.mailService.sendChangePasswordEmail(email, token);

    return `Correo enviado a ${email}`;
  }
}
