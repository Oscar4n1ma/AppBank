import { Module } from '@nestjs/common';
import { GetAccountrController } from './controllers/get-account.controller';
import { GetAccountService } from './services/get-account.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { GetCardService } from './services/get-card.service';
import { GetCardController } from './controllers/get-card.controller';
import MongoCardRepository from './repositories/MongoCardRepository';
import MongoAccountRepository from './repositories/MongoAccountRepository';

@Module({
  imports: [MongoClientModule],
  controllers: [GetAccountrController, GetCardController],
  exports: [MongoAccountRepository, MongoCardRepository],
  providers: [
    GetAccountService,
    GetCardService,
    ErrorHandler,
    MongoCardRepository,
    MongoAccountRepository,
  ],
})
export class ProductModule {}
