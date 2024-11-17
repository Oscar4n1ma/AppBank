import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import MongoTransactionRepository from 'src/transaction/repositories/MongoTransactionRepository';
import { GetTransactionService } from 'src/transaction/services/get-transactions.service';
import { GetTransactionController } from 'src/transaction/controllers/get-transactions.controller';

describe('Obtener el historial de transacciones', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule],
      controllers: [GetTransactionController],
      providers: [MongoTransactionRepository, GetTransactionService],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Obtener historial de transacciones de una cuenta existente', async () => {
    const response = await request(app.getHttpServer())
      .get('/transaction/history/10000000005')
      .expect(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('Obtener historial de transacciones de una cuenta que no existe', async () => {
    const response = await request(app.getHttpServer())
      .get('/transaction/history/10000002220005')
      .expect(200);

    expect(response.body).toEqual({
      error: false,
      msg: null,
      data: [],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
