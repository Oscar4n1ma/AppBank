export default interface OtpsRepository {
  create: (email: string, otp: number) => Promise<string>;
  get: (email: string, expirationDate: Date) => Promise<unknown>;
  delete: (id: string) => Promise<unknown>;
}
