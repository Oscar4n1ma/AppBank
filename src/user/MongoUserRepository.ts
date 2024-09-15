import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import UserRepository from './User.repository';
import { Collection, MongoClient } from 'mongodb';

@Injectable()
export default class MongoUserRepository implements UserRepository {
  private readonly client: MongoClient;
  private readonly userCollection: Collection;
  constructor() {
    this.client = new MongoClient(process.env.URI_MONGO_DB);
    this.userCollection = this.client.db().collection('User');
  }
  async exist(username: string, email: string): Promise<boolean> {
    const respDb = await this.userCollection.findOne(
      {
        $or: [{ username }, { email }],
      },
      { projection: { _id: 1 } },
    );

    return respDb !== null;
  }

  async create(user: User): Promise<string> {
    const respDb = await this.userCollection.insertOne({
      username: user.username,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      dateBorn: user.dateBorn,
      createdAt: user.createdAt,
    });
    return respDb.insertedId.toString();
  }
}
