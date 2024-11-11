import { AuthUser } from '../entities/auth.entity';

export default interface AuthRepository {
  findCredentials: (credentials: AuthUser) => Promise<unknown>;
}
