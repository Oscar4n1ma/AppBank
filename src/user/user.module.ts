import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { ClientService } from './client.service';
import MongoClientRepository from './MongoClientRepository';
import MongoClientDb from 'src/config/MongoClientDb';

@Module({
  controllers: [UsersController],
  providers: [ClientService, MongoClientRepository, MongoClientDb],
})
export class UsersModule {}
