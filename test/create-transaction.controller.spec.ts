import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { INestApplication } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { ProductModule } from 'src/product/product.module';
import { ConfigService } from '@nestjs/config';
import { CreateTransactionController } from 'src/transaction/controllers/create-transaction.controller';
import { CreateTransactionService } from 'src/transaction/services/create-transaction.service';
import * as request from 'supertest';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';
import MongoTransactionRepository from 'src/transaction/repositories/MongoTransactionRepository';

describe('Creacion de usuarios', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule, ProductModule],
      controllers: [CreateTransactionController],
      providers: [
        MailService,
        ConfigService,
        CreateTransactionService,
        MongoTransactionRepository,
        MongoUserRepository,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Crear transaccion con saldo insuficiente', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/init')
      .send({
        userId: '673b64cc2c45fe6818168088',
        fromProduct: '12971436983',
        toProduct: '10000000005',
        description: 'Pago en comercio electronico snapwire',
        amount: 200000,
      })
      .expect(400);
    expect(response.body).toEqual({
      error: true,
      msg: 'No tiene fondos.',
    });
  });

  it('Crear transaccion con saldo suficiente', async () => {
    await request(app.getHttpServer())
      .post('/transaction/init')
      .send({
        userId: '673b64d02c45fe681816808d',
        fromProduct: '26617236509',
        toProduct: '10000000005',
        description: 'Pago en comercio electronico snapwire',
        amount: 50,
      })
      .expect(201);
  });

  it('Crear transaccion con datos incorrectos', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/init')
      .send({
        userId: '4732642c2c3454374f79677e',
        fromProduct: '14953792358',
        toProduct: '10000000005',
        description: 'Pago en comercio electronico snapwire',
        amount: 60,
      })
      .expect(400);
    expect(response.body).toEqual({
      error: true,
      msg: 'Esta cuenta no le pertence al usuario.',
    });
  });

  it('Crear transaccion con una cuenta origin que no existe', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/init')
      .send({
        userId: '6732642c2c3454374f79677e',
        fromProduct: '149537923',
        toProduct: '24878213',
        description: 'Pago en comercio electronico snapwire',
        amount: 60,
      })
      .expect(400);

    expect(response.body).toEqual({
      error: true,
      msg: 'La cuenta de origin no existe.',
    });
  });

  it('Crear transaccion con una cuenta destino que no existe', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/init')
      .send({
        userId: '673b4bcfe4da126f8b97830a',
        fromProduct: '14953792358',
        toProduct: '248782344313',
        description: 'Pago en comercio electronico snapwire',
        amount: 80,
      })
      .expect(400);

    expect(response.body).toEqual({
      error: true,
      msg: 'La cuenta destino no existe.',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
