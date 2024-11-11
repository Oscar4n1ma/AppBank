import MongoUserRepository from '../repositories/MongoUserRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async use(id: string) {
    await this.userRepository.delete(id);
  }
}
