import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { CreateTransactionService } from './services/create-transaction.service';
import { GetTransactionController } from './controllers/get-transactions.controller';
import { GetTransactionService } from './services/get-transactions.service';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { ProductModule } from 'src/product/product.module';
import MongoTransactionRepository from './repositories/MongoTransactionRepository';
import { UsersModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongoClientModule,
    AuthModule,
    ProductModule,
    UsersModule,
    UtilsModule,
    MailModule,
  ],
  controllers: [CreateTransactionController, GetTransactionController],
  providers: [
    CreateTransactionService,
    GetTransactionService,
    MongoTransactionRepository,
  ],
})
export class TransactionsModule {}
