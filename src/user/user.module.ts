import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user.controller';
import { CreateUserClientService } from './services/create-client.service';
import { CreateUserEnterpriseService } from './services/create-enterprise.service';
import MongoUserRepository from './repositories/MongoUserRepository';
import { CreateUserEmployeeService } from './services/create-employee.service';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { GetUserInfoController } from './controllers/get-user-info.controller';
import { GetUserInfoService } from './services/get-user-info.service';
import { DeleteUserController } from './controllers/delete-user.controller';
import { DeleteUserService } from './services/delete-user.service';
import { MailModule } from 'src/mail/mail.module';
import { OtpModule } from 'src/otp-service/otp.module';
import { ProductModule } from 'src/product/product.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    MongoClientModule,
    MailModule,
    OtpModule,
    ProductModule,
    UtilsModule,
  ],
  controllers: [
    CreateUserController,
    GetUserInfoController,
    DeleteUserController,
  ],
  exports: [MongoUserRepository],
  providers: [
    DeleteUserService,
    MongoUserRepository,
    CreateUserClientService,
    CreateUserEmployeeService,
    GetUserInfoService,
    CreateUserEnterpriseService,
  ],
})
export class UsersModule {}
