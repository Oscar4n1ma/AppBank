import { Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import AuthRepository from './interfaces/AuthRepository';
import { AuthUser } from './entities/auth.entity';
import { UserState } from 'src/enums/user-status.enum';

@Injectable()
export default class MongoAuthRepository implements AuthRepository {
  private readonly userCollection: Collection;
  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
  }

  async findCredentials({ username }: AuthUser) {
    let query = {};
    if (ObjectId.isValid(username)) {
      query = { _id: new ObjectId(username), deletedAt: null };
    } else {
      query = {
        $and: [
          {
            $or: [
              { username },
              { email: username },
              { 'data.documentNumber': username },
            ],
          },
          { deletedAt: null },
        ],
      };
    }
    const respDb = await this.userCollection.findOne(
      {
        ...query,
        deletedAt: null,
      },
      {
        projection: {
          username: 1,
          password: 1,
          state: 1,
          oldPasswords: 1,
          _id: 1,
          pin: 1,
          email: 1,
          roles: 1,
          _2fa: 1,
        },
      },
    );
    return respDb ?? null;
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
  async setSession(user: string, session: any) {
    await this.userCollection.updateOne(
      { _id: new ObjectId(user) },
      {
        $push: {
          sessions: {
            ...session,
            createdAt: new Date(),
          },
        } as any,
      },
    );
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
      {
        $set: { password: newPassword },
        $push: {
          oldPasswords: newPassword,
        } as any,
      },
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
      { $set: { state: UserState.ACTIVE } },
    );

    if (result.modifiedCount === 0) {
      throw new Error(
        'No se pudo activar la cuenta, por favor intente de nuevo.',
      );
    }
  }
}
