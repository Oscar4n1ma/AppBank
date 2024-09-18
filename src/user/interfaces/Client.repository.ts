import UserInterface from './User';
export default interface ClientRepositoryInterface {
  create: (user: UserInterface) => Promise<string>;
  exist: (criteria: Map<string, string>) => Promise<boolean>;
}
