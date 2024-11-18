import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import MongoAuthRepository from 'src/auth/MongoAuthRepository';
import { VerifyFieldController } from 'src/auth/controllers/verify-field.controller';
import { VerifyFieldService } from 'src/auth/services/verify-field.service';
import { ErrorHandler } from 'src/utils/error-handler';

describe('Verifica si existe el correo/cedula/telefono', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule],
      controllers: [VerifyFieldController],
      providers: [MongoAuthRepository, VerifyFieldService, ErrorHandler],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Se verifica si existe el correo ingresado', async () => {
    const email = 'oscar4n1ma997@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/verify-field')
      .send({
        email,
      })
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: 'El dato ingresado fue encontrado en este id',
      data: {
        exists: true,
        id: expect.any(String),
      },
    });
  });

  it('Se verifica si existe la cedula ingresada', async () => {
    const cc = '100643344';
    const response = await request(app.getHttpServer())
      .post('/verify-field')
      .send({
        cc,
      })
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: 'El dato ingresado fue encontrado en este id',
      data: {
        exists: true,
        id: expect.any(String),
      },
    });
  });

  it('Se verifica si existe el telefono ingresado', async () => {
    const phoneNumber = '5732112218';
    const response = await request(app.getHttpServer())
      .post('/verify-field')
      .send({
        phoneNumber,
      })
      .expect(200);
    expect(response.body).toEqual({
      error: false,
      msg: 'El dato ingresado fue encontrado en este id',
      data: {
        exists: true,
        id: expect.any(String),
      },
    });
  });

  it('Deberia devolver un error al no existir el dato ingresado', async () => {
    const cc = '111353555535';
    const response = await request(app.getHttpServer())
      .post('/verify-field')
      .send({
        cc,
      })
      .expect(404);
    expect(response.body).toEqual({
      error: true,
      msg: 'El dato ingresado no existe',
    });
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllTimers();
  });
});
