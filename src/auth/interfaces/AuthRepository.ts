import { LoginUserDto } from '../dto/auth.dto';

export default interface AuthRepository {
  findCredentials: (credentials: LoginUserDto) => Promise<LoginUserDto>;
}
