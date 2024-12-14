/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import UserRepository from '../interfaces/User.repository';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import { Client } from '../entities/Client.enity';
import { Company } from '../entities/Enterprise';
import { Card } from 'src/product/entities/Card';
import { Account } from 'src/product/entities/Account';

@Injectable()
export default class MongoUserRepository implements UserRepository {
  private readonly userCollection: Collection;
  private readonly cardCollection: Collection;
  private readonly accountCollection: Collection;
  private readonly companyCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
    this.cardCollection = this.mongoClientDb.db().collection('Card');
    this.accountCollection = this.mongoClientDb.db().collection('Account');
    this.companyCollection = this.mongoClientDb.db().collection('Company');
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
    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), deletedAt: null };
    } else {
      query = {
        $and: [
          {
            $or: [
              { username: id },
              { email: id },
              { 'data.documentNumber': id },
            ],
          },
          { deletedAt: null },
        ],
      };
    }
    const respDb = await this.userCollection.findOne(query, {
      projection: {
        password: 0,
        _id: 0,
        pin: 0,
        oldPasswords: 0,
        deletedAt: 0,
        permissions: 0,
        roles: 0,
      },
    });
    return respDb;
  }

  async getEnterpriseData(id: string) {
    const respDb = await this.companyCollection.findOne({
      owner: new ObjectId(id),
      deletedAt: null,
    });
    return respDb;
  }

  async create(
    user: Client,
    card: Card,
    account: Account,
    company: Company | null,
  ): Promise<string> {
    const session = this.mongoClientDb.startSession();
    try {
      session.startTransaction();
      const respDb = await this.userCollection.insertOne(
        { _id: new ObjectId(user.id), ...user },
        { session },
      );
      await this.cardCollection.insertOne(
        { ...card, ['owner']: respDb.insertedId },
        { session },
      );
      await this.accountCollection.insertOne(
        { ...account, ['owner']: respDb.insertedId },
        { session },
      );
      if (company) {
        await this.companyCollection.insertOne({
          ...company,
          ['owner']: respDb.insertedId,
        });
      }
      await session.commitTransaction();
      return respDb.insertedId.toString();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
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

  async update(id: string, updateFields: any) {
    const result = await this.userCollection.findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateFields },
      { returnDocument: 'after' },
    );

    return result;
  }
}
