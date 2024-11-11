import { Injectable } from '@nestjs/common';

import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import { Account } from '../entities/Account';

@Injectable()
export default class MongoAccountRepository {
  private readonly accountCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.accountCollection = this.mongoClientDb.db().collection('Account');
  }

  async get(id: string) {
    const respDb = await this.accountCollection.findOne(
      {
        $and: [
          {
            $or: [
              {
                owner: ObjectId.isValid(id) ? new ObjectId(id) : undefined,
              },
              {
                id,
              },
            ],
          },
          {
            deletedAt: null,
          },
        ],
      },
      { projection: { _id: 0, deletedAt: 0 } },
    );
    return respDb;
  }

  async create(account: Account<string, ObjectId>): Promise<string> {
    const respDb = await this.accountCollection.insertOne(account);
    return respDb.insertedId.toString();
  }
}
