import { Product } from '../interfaces/Product';

export class Account<T, K> implements Product<T, K> {
  id: T;
  owner: K;
  state: boolean;
  name: string;
  description: string;
  managementCosts: number;
  transferCost: number;
  amountTransfersLimit: number;
  topBalance: number;
  interestRate: number;
  _4x1000: boolean;
  balance: number;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
