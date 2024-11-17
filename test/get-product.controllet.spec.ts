import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { GetAccountrController } from 'src/product/controllers/get-account.controller';
import { GetAccountService } from 'src/product/services/get-account.service';

describe('Obtener informacion de productos', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule, ProductModule],
      controllers: [GetAccountrController],
      providers: [GetAccountService],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Obtener informacion de una cuenta que no existe', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/account/4534555')
      .expect(404);
    expect(response.body).toEqual({
      error: true,
      msg: 'La cuenta no existe.',
    });
  });

  it('Obtener informacion de una cuenta', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/account/43402448815')
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: null,
      data: {
        id: '43402448815',
        owner: '673234157dca70cd358b0350',
        state: true,
        name: 'account',
        description: 'Producto bancario appbank.',
        managementCosts: 0,
        transferCost: 0,
        amountTransfersLimit: 3000000,
        topBalance: 100000000,
        interestRate: 0.001,
        _4x1000: true,
        balance: 3543384.043999998,
        createdAt: '2024-11-11T16:43:01.476Z',
        updatedAt: '2024-11-11T16:43:01.476Z',
      },
    });
  });

  it('Obtener informacion de una tarjeta que no existe', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/card/9372722951912')
      .expect(404);
    expect(response.body).toEqual({
      error: true,
      msg: 'La tarjeta no fue encontrada.',
    });
  });

  it('Obtener informacion de una tarjeta ', async () => {
    const response = await request(app.getHttpServer())
      .get('/product/card/9372728532951912')
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: null,
      data: {
        id: '9372728532951912',
        accountAssociatedId: '43402448815',
        owner: '673234157dca70cd358b0350',
        description: 'Producto bancario de AppBank.',
        cardType: 'debit',
        amountCreditLimit: 0,
        currentDebt: 0,
        cvc: 233,
        name: 'card',
        state: true,
        createdAt: '2024-11-11T16:43:01.476Z',
        expiredAt: '2028-11-11T16:43:01.476Z',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
