import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import MongoUserRepository from './MongoUserRepository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MongoUserRepository],
})
export class UsersModule {}
