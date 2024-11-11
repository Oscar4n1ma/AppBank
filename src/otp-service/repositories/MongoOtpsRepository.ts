import { Injectable, NotFoundException } from '@nestjs/common';
import OtpsRepository from '../interfaces/Otps.repository';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';

@Injectable()
export default class MongoOtpsRepository implements OtpsRepository {
  private readonly otpsCollection: Collection;

  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.otpsCollection = this.mongoClientDb.db().collection('Otps');
  }

  async create(email: string, otp: number): Promise<string> {
    const createdAt: Date = new Date();
    const expiredAt: Date = new Date(createdAt.getTime() + 300000); //2 minutos
    const respDb = await this.otpsCollection.insertOne({
      email,
      otp,
      expiredAt,
      createdAt,
      deletedAt: null,
    });
    return respDb.insertedId.toString();
  }

  async get(email: string): Promise<any> {
    const respDb = await this.otpsCollection
      .find(
        {
          email,
        },
        { sort: { createdAt: -1 } },
      )
      .toArray();

    return respDb;
  }

  async delete(id: string): Promise<void> {
    const objectId = new ObjectId(id);
    const result = await this.otpsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        'No se encontró un registro para el correo especificado',
      );
    }
  }
}
