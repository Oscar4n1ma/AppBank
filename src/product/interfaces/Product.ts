export interface Product<T, K> {
  id: T;
  owner: K;
  state: boolean;
  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
}
