import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user.controller';
import { CreateUserService } from './services/create-user.service';
import MongoUserRepository from './repositories/MongoUserRepository';
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
    CreateUserService,

    GetUserInfoService,
  ],
})
export class UsersModule {}
