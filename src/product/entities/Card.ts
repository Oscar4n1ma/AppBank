import { Product } from 'src/product/interfaces/Product';

export class Card<T, K> implements Product<T, K> {
  id: T;
  accountAssociatedId: T;
  owner: K;
  state: boolean;
  name: string;
  description: string;
  cardType: string;
  cvc: number;
  currentDebt: number;
  amountCreditLimit: number;
  expiredAt: Date;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
