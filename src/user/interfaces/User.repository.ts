export default interface UserRepository {
  create: (user) => Promise<string>;
  exist: (username: string, email: string) => Promise<boolean>;
}
