import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

    const credentialsFound = await this.authRepository.findCredentials({
      username: id,
      password: '',
    });

    if (!credentialsFound) {
      throw new NotFoundException('El usuario no ha sido encontrado');
    }
    const { password, oldPasswords } = credentialsFound;
    const validation: boolean = await compare(currentPass, password);
    if (!validation) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
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
