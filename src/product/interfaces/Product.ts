export interface Product {
  id: string;
  owner: string;
  state: boolean;
  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
}
