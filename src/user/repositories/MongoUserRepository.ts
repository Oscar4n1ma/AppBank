/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import UserRepository from '../interfaces/User.repository';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import MongoCardRepository from 'src/product/repositories/MongoCardRepository';

@Injectable()
export default class MongoUserRepository implements UserRepository {
  private readonly userCollection: Collection;
  private readonly cardCollection: Collection;
  private readonly accountCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
    this.cardCollection = this.mongoClientDb.db().collection('Account');
    this.accountCollection = this.mongoClientDb.db().collection('Card');
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
  async get(id: string) {
    const respDb = await this.userCollection.findOne(
      {
        _id: new ObjectId(id),
        deletedAt: null,
      },
      {
        projection: {
          password: 0,
          _id: 0,
          usedPasswords: 0,
          deletedAt: 0,
          permissions: 0,
          roles: 0,
        },
      },
    );
    return respDb;
  }

  async create(user: unknown): Promise<string> {
    const session = this.mongoClientDb.startSession();
    try {
      session.startTransaction();
      const respDb = await this.userCollection.insertOne(user, { session });
      await session.commitTransaction();
      return respDb.insertedId.toString();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } finally {
      await session.endSession();
    }
  }
  async delete(id: string) {
    const session = this.mongoClientDb.startSession();
    try {
      session.startTransaction();
      const deletedAt: Date = new Date();

      const userFound = await this.userCollection.findOneAndUpdate(
        { _id: new ObjectId(id), deletedAt: null },
        { $set: { deletedAt } },
        { projection: { _id: 1 }, session },
      );
      if (!userFound) {
        throw new NotFoundException('El usuario no existe.');
      }
      await this.accountCollection.updateOne(
        { owner: new ObjectId(id) },
        { $set: { deletedAt } },
        { session },
      );

      await this.cardCollection.updateOne(
        { owner: new ObjectId(id) },
        { $set: { deletedAt } },
        { session },
      );
      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
