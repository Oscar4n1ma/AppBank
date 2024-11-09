import { CreateClientDto } from '../dto/users.dto';

export default interface UserRepository {
  createClient: (user: CreateClientDto) => Promise<string>;
  exist: (username: string, email: string) => Promise<boolean>;
}
