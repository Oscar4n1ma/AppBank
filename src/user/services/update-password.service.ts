import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash, genSalt } from 'bcrypt';
import MongoAuthRepository from 'src/auth/MongoAuthRepository';
import { ChangePassDto } from '../dto/change-password.dto';

@Injectable()
export class UpdatePasswordService {
  constructor(private readonly authRepository: MongoAuthRepository) {}
  async use(id: string, changePass: ChangePassDto) {
    const { currentPass, newPass } = changePass;
    const { password, oldPasswords } =
      await this.authRepository.findCredentials({
        username: id,
        password: '',
      });
    const validation: boolean = await compare(currentPass, password);
    if (!validation) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    for (let i = 0; i < oldPasswords.length; i++) {
      const hashPass: string = oldPasswords[i];
      const hasBeenUsed = await compare(newPass, hashPass);
      if (hasBeenUsed) {
        throw new BadRequestException('La contraseña ya ha sido usada.');
      }
    }

    const hashedPassword = await hash(newPass, await genSalt());
    await this.authRepository.updatePasswordById(id, hashedPassword);
  }
}
