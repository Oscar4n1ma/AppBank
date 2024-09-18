import { Injectable } from '@nestjs/common';
import ClientRepositoryInterface from './interfaces/Client.repository';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import Client from './entities/Client.entity';

@Injectable()
export default class MongoClientRepository
  implements ClientRepositoryInterface
{
  private readonly clientCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.clientCollection = this.mongoClientDb.db().collection('Client');
  }
  async exist(criteria: Map<string, string>): Promise<boolean> {
    const query: Record<string, string>[] = [];
    for (const pair of criteria) {
      query.push({ [pair[0]]: pair[1] });
    }
    const respDb = await this.clientCollection.findOne(
      {
        $or: query,
      },
      { projection: { _id: 1 } },
    );

    return respDb !== null;
  }

  async create(user: Client): Promise<string> {
    const _id: ObjectId = new ObjectId();
    delete user.id;
    await this.clientCollection.insertOne({
      _id,
      ...user,
    });
    return _id.toString();
  }
}
