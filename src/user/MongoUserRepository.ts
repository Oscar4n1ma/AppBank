import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import UserRepository from './User.repository';
import { Collection, MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/users.dto';

@Injectable()
export default class MongoUserRepository implements UserRepository {
  private readonly client: MongoClient;
  private readonly userCollection: Collection;
  constructor() {
    this.client = new MongoClient(process.env.URI_MONGO_DB);
    this.userCollection = this.client.db().collection('User');
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

  async create(user: User): Promise<string> {
    const respDb = await this.userCollection.insertOne({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      dateBorn: user.dateBorn,
      createdAt: user.createdAt,
      password: user.password,
    });
    return respDb.insertedId.toString();
  }

  async logIn(user: LoginUserDto): Promise<string> {
    const username = user.username;
    const email = user.email;

    const userFound = await this.userCollection.findOne(
      {
        $or: [{ username }, { email }],
      },
      { projection: { _id: 1, password: 1 } },
    );
    if (!userFound) {
      return 'El usuario no existe';
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      user.password,
      userFound.password,
    );
    if (isPasswordValid) {
      return 'La contraseña coincide ' + userFound._id.toString();
    }
    return 'La contraseña no coincide';
  }
}
