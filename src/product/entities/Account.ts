import { Product } from '../interfaces/Product';

export class Account implements Product {
  id: string;
  owner: string;
  state: boolean;
  name: string;
  description: string;
  transferCost: number;
  amountTransfersLimit: number;
  topBalance: number;
  interestRate: number;
  _4x1000: boolean;
  balance: number;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    owner: string,
    topBalance: number,
    transferCost: number,
    amountTransfersLimit: number,
    _4x1000: boolean,
  ) {
    const createdAt: Date = new Date();
    const id: string = Math.round(Math.random() * 1e11).toString();
    this.id = id;
    this.owner = owner;
    this.state = true;
    this.name = 'Account';
    this.description = 'Producto bancario de AppBank';
    this.balance = 0;
    this.createdAt = createdAt;
    this.topBalance = topBalance;
    this.transferCost = transferCost;
    this.interestRate = 0.0002;
    this.amountTransfersLimit = amountTransfersLimit;
    this._4x1000 = _4x1000;
  }
}
