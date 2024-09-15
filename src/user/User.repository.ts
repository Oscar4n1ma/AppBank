import { User } from './user.entity';
export default interface UserRepository {
  create: (user: User) => Promise<string>;
  exist: (username: string, email: string) => Promise<boolean>;
}
