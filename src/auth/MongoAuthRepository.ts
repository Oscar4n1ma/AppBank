import { Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import AuthRepository from './interfaces/AuthRepository';
import { AuthUser } from './entities/auth.entity';

@Injectable()
export default class MongoAuthRepository implements AuthRepository {
  private readonly userCollection: Collection;
  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
  }

  async findCredentials(crendentials: AuthUser) {
    const respDb = await this.userCollection.findOne(
      { username: crendentials.username, deletedAt: null },
      {
        projection: {
          username: 1,
          password: 1,
          _id: 1,
          email: 1,
          roles: 1,
          _2fa: 1,
        },
      },
    );
    if (!respDb) {
      return null;
    }
    return respDb;
  }

  async findIdByEmail(email: string) {
    const respDb = await this.userCollection.findOne(
      { email, deletedAt: null },
      { projection: { _id: 1 } },
    );
    if (!respDb) {
      return null;
    }
    return respDb;
  }

  async findByField(
    query: Record<string, any>,
  ): Promise<{ _id: string } | null> {
    const user = await this.userCollection.findOne(query, {
      projection: { _id: 1 },
    });

    return user ? { _id: user._id.toString() } : null;
  }

  async updatePasswordById(userId: string, newPassword: string): Promise<void> {
    const objectId = new ObjectId(userId);
    const result = await this.userCollection.updateOne(
      { _id: objectId },
      { $set: { password: newPassword } },
    );

    if (result.modifiedCount === 0) {
      throw new Error(
        'No se pudo actualizar la contraseña, por favor intente de nuevo.',
      );
    }
  }

  async activateAccount(userId: string): Promise<void> {
    const objectId = new ObjectId(userId);
    const result = await this.userCollection.updateOne(
      { _id: objectId },
      { $set: { status: true } },
    );

    if (result.modifiedCount === 0) {
      throw new Error(
        'No se pudo activar la cuenta, por favor intente de nuevo.',
      );
    }
  }
}
