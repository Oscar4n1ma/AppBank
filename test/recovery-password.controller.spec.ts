import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { OtpService } from 'src/otp-service/services/otp.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { RecoveryPasswordController } from 'src/auth/controllers/recovery-password.controller';
import { RecoveryPasswordService } from 'src/auth/services/recovery-password.service';
import MongoAuthRepository from 'src/auth/MongoAuthRepository';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';

describe('Solicita correo para reestablecimiento de contraseña', () => {
  let app: INestApplication;
  let mailServiceMock: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule],
      controllers: [RecoveryPasswordController],
      providers: [
        MailService,
        AuthService,
        ConfigService,
        OtpService,
        RecoveryPasswordService,
        MongoAuthRepository,
        MongoOtpsRepository,
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

  it('Enviar correo de recuperacion', async () => {
    const email = 'oscar4n1ma997@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/recovery-password')
      .send({
        email,
      })
      .expect(201);
    expect(response.body).toEqual({
      error: false,
      res: `Correo enviado a ${email}`,
    });
  });

  it('Deberia devolver un error por correo inexistente', async () => {
    const email = 'noexiste@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/recovery-password')
      .send({
        email,
      })
      .expect(404);
    expect(response.body).toEqual({
      error: true,
      msg: 'El correo no existe',
    });
  });

  afterAll(async () => {
    await app.close();
    mailServiceMock.mockRestore();
    jest.clearAllTimers();
  });
});
