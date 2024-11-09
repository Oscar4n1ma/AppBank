import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import MongoUserRepository from './repositories/MongoUserRepository';
import MongoClientDb from 'src/config/MongoClientDb';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MongoUserRepository, MongoClientDb],
})
export class UsersModule {}
