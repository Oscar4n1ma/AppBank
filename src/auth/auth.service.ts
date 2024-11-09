import { Injectable } from '@nestjs/common';
import { LoginUserDto } from 'src/auth/dto/auth.dto';
import MongoAuthRepository from './MongoAuthRepository';
import { compare } from 'bcrypt';
import { authUser } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: MongoAuthRepository) {}

  async authenticate(user: LoginUserDto) {
    const credentialsToLogin: LoginUserDto = new authUser(
      user.username,
      user.password,
    );
    const credentialsFound: LoginUserDto =
      await this.authRepository.findCredentials(credentialsToLogin);

    if (!credentialsFound) {
      return 'El usuario no existe';
    }

    const isPasswordValid: boolean = await compare(
      user.password,
      credentialsFound.password,
    );
    if (isPasswordValid) {
      return (
        'La contraseña coincide ' +
        credentialsFound.username +
        credentialsFound.password
      );
    }
    return (
      'La contraseña NO coincide ' +
      user.password +
      '            ' +
      credentialsFound.password
    );
  }

  // estudie jwt o jsonwebtoken
  // const userId: string = await this.userRepository.logIn(user);
}
