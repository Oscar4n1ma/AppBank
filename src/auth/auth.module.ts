import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import MongoAuthRepository from './MongoAuthRepository';
import MongoClientDb from 'src/config/MongoClientDb';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MongoAuthRepository, MongoClientDb],
})
export class AuthModule {}
