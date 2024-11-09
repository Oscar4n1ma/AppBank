import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import MongoClientDb from 'src/config/MongoClientDb';
import AuthRepository from './interfaces/AuthRepository';
import { LoginUserDto } from './dto/auth.dto';
import { authUser } from './entities/auth.entity';

@Injectable()
export default class MongoAuthRepository implements AuthRepository {
  private readonly userCollection: Collection;
  constructor(private readonly mongoClientDb: MongoClientDb) {
    this.userCollection = this.mongoClientDb.db().collection('User');
  }

  async findCredentials(user: LoginUserDto): Promise<LoginUserDto> {
    const credentials = await this.userCollection.findOne(
      { username: user.username },
      { projection: { username: 1, password: 1 } },
    );
    if (!credentials) {
      return null;
    }

    const credentialsFound: LoginUserDto = new authUser(
      credentials.username,
      credentials.password,
    );
    return credentialsFound;
  }
}
