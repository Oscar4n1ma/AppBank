import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { OtpService } from 'src/otp-service/services/otp.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthController } from 'src/auth/controllers/auth.controller';
import MongoAuthRepository from 'src/auth/MongoAuthRepository';

describe('Autentificacion de usuarios', () => {
  let app: INestApplication;
  let mailServiceMock: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule],
      controllers: [AuthController],
      providers: [
        MailService,
        AuthService,
        ConfigService,
        OtpService,
        MongoOtpsRepository,
        MongoAuthRepository,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Mockear el servicio de envío de correos
    mailServiceMock = jest
      .spyOn(MailService.prototype, 'sendOtpEmail')
      .mockImplementation(async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {}); // Evitar logs
        return Promise.resolve();
      });
  });

  it('Iniciar sesion con datos que no existen', async () => {
    const user = 'OscarTest';
    const password = '1';
    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({
        user,
        password,
      })
      .expect(401);
    expect(response.body).toEqual({
      error: true,
      msg: 'Credenciales incorrectas',
    });
  });

  it('Iniciar sesión con datos correctos', async () => {
    const user = 'Oscar';
    const password = '123';

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({
        user,
        password,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: false,
        data: expect.objectContaining({
          userId: expect.any(String),
          accessToken: expect.any(String),
          _2fa: false,
        }),
      }),
    );
  });

  it('Iniciar sesión con datos correctos pero requiere 2FA', async () => {
    const user = 'OscarFlag';
    const password = '12345';

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({
        user,
        password,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: false,
        data: expect.objectContaining({
          userId: expect.any(String),
          accessToken: null,
          _2fa: true,
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.close();
    mailServiceMock.mockRestore();
    jest.clearAllTimers();
  });
});
