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
      .get('/product/account/14953792358')
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: null,
      data: {
        id: '14953792358',
        owner: '673b4bcfe4da126f8b97830a',
        state: true,
        name: 'account',
        description: 'Producto bancario appbank.',
        managementCosts: 0,
        transferCost: 0,
        amountTransfersLimit: 3000000,
        topBalance: 100000000,
        interestRate: 0.001,
        _4x1000: false,
        balance: 100000000000000000000,
        createdAt: '2024-11-18T14:14:39.287Z',
        updatedAt: '2024-11-18T14:14:39.287Z',
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
      .get('/product/card/8800483229902363')
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: null,
      data: {
        id: '8800483229902363',
        accountAssociatedId: '83423352527',
        owner: '673b4ca7e4da126f8b97831a',
        description: 'Producto bancario de AppBank.',
        cardType: 'debit',
        amountCreditLimit: 0,
        currentDebt: 0,
        cvc: 233,
        name: 'card',
        state: true,
        createdAt: '2024-11-18T14:18:15.044Z',
        expiredAt: '2028-11-18T14:18:15.044Z',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
