import { Injectable } from '@nestjs/common';

import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import { Card } from '../entities/Card';

@Injectable()
export default class MongoCardRepository {
  private readonly cardCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.cardCollection = this.mongoClientDb.db().collection('Card');
  }

  async get(id: string) {
    const respDb = await this.cardCollection.findOne(
      {
        $and: [
          {
            $or: [
              { id },
              { owner: ObjectId.isValid(id) ? new ObjectId(id) : undefined },
            ],
          },
          { deletedAt: null },
        ],
      },
      { projection: { _id: 0, deletedAt: 0, updatedAt: 0, pin: 0 } },
    );
    return respDb;
  }

  async create(card: Card<string, ObjectId>): Promise<string> {
    const respDb = await this.cardCollection.insertOne(card);
    return respDb.insertedId.toString();
  }
}
