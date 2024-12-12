import { Product } from 'src/product/interfaces/Product';

export class Card implements Product {
  id: string;
  owner: string;
  accountAssociatedId: string;
  state: boolean;
  name: string;
  description: string;
  cardType: string;
  cvc: string;
  currentDebt: number;
  amountCreditLimit: number;
  expiredAt: Date;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;

  constructor(owner: string, accountAssociatedId: string) {
    const createdAt: Date = new Date();
    const expiredAt: Date = new Date(createdAt.getTime() + 126230400000);
    const id: string = Math.round(Math.random() * 1e16).toString();
    const cvc: string = Math.round(Math.random() * 1e10)
      .toString()
      .slice(0, 3);
    this.owner = owner;
    this.id = id;
    this.state = true;
    this.cvc = cvc;
    this.accountAssociatedId = accountAssociatedId;
    this.name = 'Card';
    this.description = 'Producto bancario de AppBank';
    this.currentDebt = 0;
    this.amountCreditLimit = 0;
    this.expiredAt = expiredAt;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
    this.deletedAt = null;
  }
}
