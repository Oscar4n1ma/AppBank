import { Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';

@Injectable()
export default class MongoTransactionRepository {
  private readonly accountCollection: Collection;
  private readonly transactionCollection: Collection;
  private readonly movementsCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.accountCollection = this.mongoClientDb.db().collection('Account');
    this.movementsCollection = this.mongoClientDb.db().collection('Movements');
    this.transactionCollection = this.mongoClientDb
      .db()
      .collection('Transaction');
  }

  async getMovements(id: string) {
    const respDb = await this.movementsCollection
      .find(
        { productId: id, deletedAt: null },
        {
          projection: {
            _id: 0,
          },
          sort: {
            createdAt: -1,
          },
          limit: 30,
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
          deletedAt: null,
          createdAt: { $gt: new Date(millisecondsDate) },
        },
        { projection: { amount: 1 } },
      )
      .toArray();
    return respDb.map((t) => t.amount).reduce((x, y) => x + y, 0);
  }

  async getTransaction(id: string) {
    const respDb = await this.transactionCollection.findOne({
      _id: new ObjectId(id),
    });
    return respDb;
  }

  async create(transaction: any): Promise<string> {
    const session = this.mongoClientDb.startSession();
    try {
      const {
        fromProduct,
        toProduct,
        totalAmount,
        amount,
        createdAt,
        _4x1000,
        managementCosts,
        transferCost,
      } = transaction;
      session.startTransaction({ retryWrites: true });

      await this.accountCollection.bulkWrite(
        [
          {
            updateOne: {
              filter: { id: toProduct },
              update: {
                $inc: {
                  balance: amount,
                },
              },
            },
          },
          {
            updateOne: {
              filter: { id: fromProduct },
              update: {
                $inc: {
                  balance: -totalAmount,
                },
              },
            },
          },
        ],
        { session, retryWrites: true },
      );

      const respDb = await this.transactionCollection.insertOne(transaction, {
        session,
      });

      const movements = [
        {
          title: `Recibiste desde **${fromProduct.toString().slice(7)}.`,
          productId: toProduct,
          amount: amount,
          transactionId: respDb.insertedId,
          createdAt,
        },
        {
          title: `Trasferencia bancaria a **${toProduct.toString().slice(7)}.`,
          productId: fromProduct,
          amount: -amount,
          transactionId: respDb.insertedId,
          createdAt,
        },
      ];

      if (_4x1000 > 0) {
        movements.push({
          title: `Pago impuesto 4x1000.`,
          productId: fromProduct,
          amount: -_4x1000,
          transactionId: respDb.insertedId,
          createdAt,
        });
      }
      if (managementCosts > 0) {
        movements.push({
          title: `Pago costo de gestion.`,
          productId: fromProduct,
          amount: -managementCosts,
          transactionId: respDb.insertedId,
          createdAt,
        });
      }
      if (transferCost > 0) {
        movements.push({
          title: `Pago costo de transferencia.`,
          productId: fromProduct,
          amount: -transferCost,
          transactionId: respDb.insertedId,
          createdAt,
        });
      }
      await this.movementsCollection.insertMany(movements);

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
}
