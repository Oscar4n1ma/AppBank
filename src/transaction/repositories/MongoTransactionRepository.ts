import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';

@Injectable()
export default class MongoTransactionRepository {
  private readonly accountCollection: Collection;
  private readonly transactionCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.accountCollection = this.mongoClientDb.db().collection('Account');
    this.transactionCollection = this.mongoClientDb
      .db()
      .collection('Transaction');
  }

  async get(id: string) {
    const respDb = await this.transactionCollection
      .find(
        {
          $and: [
            {
              $or: [{ toProduct: id }, { fromProduct: id }],
            },
            { deletedAt: null },
          ],
        },
        {
          projection: {
            id: '$_id',
            amount: 1,
            toProduct: 1,
            description: 1,
            fromProduct: 1,
            createdAt: 1,
          },
          sort: {
            createdAt: -1,
          },
        },
      )
      .toArray();
    return respDb;
  }

  async amountTransferedPerDay(accountId: string): Promise<number> {
    const millisecondsDate = new Date().setHours(0, 0, 0, 0);
    const respDb = await this.transactionCollection
      .find(
        {
          fromProduct: accountId,
          $nor: [{ toProduct: process.env.ACCOUNT_ID_APP_BANK }],
          deletedAt: null,
          createdAt: { $gt: new Date(millisecondsDate) },
        },
        { projection: { amount: 1 } },
      )
      .toArray();
    return respDb.map((t) => t.amount).reduce((x, y) => x + y, 0);
  }

  async create(
    transactions: Array<{
      amount: number;
      toProduct: string;
      fromProduct: string;
      description: string;
    }>,
  ): Promise<string> {
    const session = this.mongoClientDb.startSession();
    try {
      session.startTransaction({ retryWrites: true });
      const createdAt: Date = new Date();
      const transactionsId: string[] = [];
      const mainTransaction = transactions[0];

      const totaAmountTransaction = transactions
        .map((t) => t.amount)
        .reduce((x, y) => x + y, 0);

      await this.accountCollection.updateOne(
        {
          id: mainTransaction.fromProduct,
        },
        { $inc: { balance: -totaAmountTransaction } },
        {
          session,
        },
      );

      for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        await this.accountCollection.updateOne(
          {
            id: t.toProduct,
          },
          {
            $inc: { balance: t.amount },
          },
          {
            session,
          },
        );
        const respDb = await this.transactionCollection.insertOne(
          {
            ...t,
            createdAt,
            updatedAt: createdAt,
            deletedAt: null,
          },
          { session },
        );
        transactionsId.push(respDb.insertedId.toString());
      }
      await session.commitTransaction();
      return transactionsId[0];
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
