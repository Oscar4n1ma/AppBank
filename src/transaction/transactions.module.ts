import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { CreateTransactionService } from './services/create-transaction.service';
import MongoAccountRepository from 'src/product/repositories/MongoAccountRepository';
import { ErrorHandler } from 'src/utils/error-handler';
import MongoTransactionRepository from './repositories/MongoTransactionRepository';
import { GetTransactionController } from './controllers/get-transactions.controller';
import { GetTransactionService } from './services/get-transactions.service';
import { MongoClientModule } from 'src/config/mongo-client.module';

@Module({
  imports: [MongoClientModule],
  controllers: [CreateTransactionController, GetTransactionController],
  providers: [
    CreateTransactionService,
    MongoAccountRepository,
    MongoTransactionRepository,
    GetTransactionService,
    ErrorHandler,
  ],
})
export class TransactionsModule {}
