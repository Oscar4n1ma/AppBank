import { Injectable, NotFoundException } from '@nestjs/common';
import MongoCardRepository from '../repositories/MongoCardRepository';

@Injectable()
export class GetCardService {
  constructor(private readonly cardRepository: MongoCardRepository) {}

  async use(id: string) {
    const cardFound = await this.cardRepository.get(id);
    if (!cardFound) {
      throw new NotFoundException('La tarjeta no fue encontrada.');
    }
    return cardFound;
  }
}
