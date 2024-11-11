import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user.controller';
import { CreateUserClientService } from './services/create-client.service';
import { CreateUserEnterpriseService } from './services/create-enterprise.service';
import MongoUserRepository from './repositories/MongoUserRepository';
import { ErrorHandler } from 'src/utils/error-handler';
import { CreateUserEmployeeService } from './services/create-employee.service';
import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import { MongoClientModule } from 'src/config/mongo-client.module';
import MongoCardRepository from 'src/product/repositories/MongoCardRepository';
import { GetUserInfoController } from './controllers/get-user-info.controller';
import { GetUserInfoService } from './services/get-user-info.service';
import { DeleteUserController } from './controllers/delete-user.controller';
import { DeleteUserService } from './services/delete-user.service';

@Module({
  imports: [MongoClientModule],
  controllers: [
    CreateUserController,
    GetUserInfoController,
    DeleteUserController,
  ],
  providers: [
    DeleteUserService,
    MongoUserRepository,
    MongoAccountRepository,
    MongoCardRepository,
    CreateUserClientService,
    CreateUserEmployeeService,
    GetUserInfoService,
    CreateUserEnterpriseService,
    ErrorHandler,
  ],
})
export class UsersModule {}
