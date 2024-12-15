import { Module } from '@nestjs/common';
import { GetAccountrController } from './controllers/get-account.controller';
import { GetAccountService } from './services/get-account.service';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { GetCardService } from './services/get-card.service';
import { GetCardController } from './controllers/get-card.controller';
import MongoCardRepository from './repositories/MongoCardRepository';
import MongoAccountRepository from './repositories/MongoAccountRepository';
import { GenerateExtractController } from './controllers/generate-extract.controller';
import { GenerateExtractService } from './services/generate-extract.service';
import { UtilsModule } from 'src/utils/utils.module';
import MongoTransactionRepository from 'src/transaction/repositories/MongoTransactionRepository';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';

@Module({
  imports: [MongoClientModule, UtilsModule],
  controllers: [
    GetAccountrController,
    GetCardController,
    GenerateExtractController,
  ],
  exports: [MongoAccountRepository, MongoCardRepository],
  providers: [
    GetAccountService,
    GetCardService,
    GenerateExtractService,
    MongoCardRepository,
    MongoTransactionRepository,
    MongoAccountRepository,
    MongoUserRepository,
  ],
})
export class ProductModule {}
