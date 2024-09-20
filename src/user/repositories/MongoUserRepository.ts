import { Injectable } from '@nestjs/common';
import UserRepository from '../interfaces/User.repository';
import { Collection } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import { CreateClientDto } from '../dto/users.dto';
import { UserStatus } from '../interfaces/User';

@Injectable()
export default class MongoUserRepository implements UserRepository {
  private readonly userCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
  }
  async exist(email: string, username: string): Promise<boolean> {
    const respDb = await this.userCollection.findOne(
      {
        $or: [{ username }, { email }],
      },
      { projection: { _id: 1 } },
    );

    return respDb !== null;
  }

  async createClient(user: CreateClientDto): Promise<string> {
    const respDb = await this.userCollection.insertOne({
      username: user.username,
      email: user.email,
      password: user.password,
      usedPasswords: [user.password],
      permissions: [],
      state: UserStatus.DEACTIVATE,
      type: 'client',
      data: {
        cc: user.cc,
        firstName: user.firstName,
        lastName: user.lastName,
        genre: user.genre,
        monthlyIncome: user.monthlyIncome,
        address: user.address,
        maritalStatus: user.maritalStatus,
        currentJob: user.currentJob,
        dateBorn: user.dateBorn,
      },
    });
    return respDb.insertedId.toString();
  }
}
