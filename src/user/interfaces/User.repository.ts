import { Card } from 'src/product/entities/Card';
import { Client } from '../entities/Client.enity';
import { Account } from 'src/product/entities/Account';
import { Company } from '../entities/Enterprise';

export default interface UserRepository {
  create: (
    user: Client,
    card: Card,
    account: Account,
    company: Company | null,
  ) => Promise<string>;
  exist: (username: string, email: string) => Promise<boolean>;
}
