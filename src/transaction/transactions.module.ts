import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { CreateTransactionService } from './services/create-transaction.service';
import { GetMovementsController } from './controllers/get-movements.controller';
import { GetMovementsService } from './services/get-movements.service';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { ProductModule } from 'src/product/product.module';
import MongoTransactionRepository from './repositories/MongoTransactionRepository';
import { UsersModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { GetReceiptController } from './controllers/get-receipt.controller';
import { GetReceiptService } from './services/get-receipt.service';

@Module({
  imports: [
    MongoClientModule,
    AuthModule,
    ProductModule,
    UsersModule,
    UtilsModule,
    MailModule,
  ],
  exports: [MongoTransactionRepository],
  controllers: [
    CreateTransactionController,
    GetMovementsController,
    GetReceiptController,
  ],
  providers: [
    CreateTransactionService,
    GetMovementsService,
    GetReceiptService,
    MongoTransactionRepository,
  ],
})
export class TransactionsModule {}
