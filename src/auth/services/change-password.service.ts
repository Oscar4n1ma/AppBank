import { BadRequestException, Injectable } from '@nestjs/common';
import MongoAuthRepository from '../MongoAuthRepository';
import { verify } from 'jsonwebtoken';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class ChangePasswordService {
  constructor(private readonly authRepository: MongoAuthRepository) {}
  async use(changePassword: ChangePasswordDto, t: string) {
    const { newPassword, confirmNewPassword } = changePassword;
    const jwtSecret = process.env.SECRET_KEY_JWT;

    if (newPassword != confirmNewPassword) {
      throw new BadRequestException('Las contraseñas no son iguales.');
    }
    const { id: extractedId } = verify(t, jwtSecret) as { id: string };
    const { oldPasswords } = await this.authRepository.findCredentials({
      username: extractedId,
      password: '',
    });

    for (let i = 0; i < oldPasswords.length; i++) {
      const hashPass: string = oldPasswords[i];
      const validation = await compare(newPassword, hashPass);
      if (validation) {
        throw new BadRequestException('La contraseña ya ha sido usada.');
      }
    }

    const hashedPassword = await hash(newPassword, await genSalt());
    await this.authRepository.updatePasswordById(extractedId, hashedPassword);
    return 'Contraseña actualizada exitosamente';
  }
}
