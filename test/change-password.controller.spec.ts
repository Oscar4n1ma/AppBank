import { Test } from '@nestjs/testing';
import { ChangePasswordController } from 'src/auth/controllers/reset-password.controller';
import { ChangePasswordService } from 'src/auth/services/reset-password.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import MongoAuthRepository from 'src/auth/MongoAuthRepository';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { sign } from 'jsonwebtoken';

describe('ChangePasswordController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: 'secret' }),
        ConfigModule,
        MongoClientModule,
      ],
      controllers: [ChangePasswordController],
      providers: [ChangePasswordService, MongoAuthRepository, ErrorHandler],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Debería cambiar la contraseña exitosamente', async () => {
    const jwtSecret = process.env.SECRET_KEY_JWT;
    const token = sign({ id: '673b4b65e4da126f8b9782fe' }, jwtSecret);
    const PasswordDto = {
      newPassword: '123456789',
      confirmNewPassword: '123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(PasswordDto)
      .expect(201);

    expect(response.body).toEqual({
      error: false,
      data: 'Contraseña actualizada exitosamente',
    });
  });

  it('Debería devolver un error si las contraseñas no coinciden', async () => {
    const mockToken = 'tokenEjemplo';
    const PasswordDto = {
      newPassword: 'newPassword123',
      confirmNewPassword: 'newPassword321', // Contraseña no coincide
    };

    const response = await request(app.getHttpServer())
      .post('/change-password')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(PasswordDto)
      .expect(400);

    expect(response.body).toEqual({
      error: true,
      msg: 'Las contraseñas no son iguales',
    });
  });

  it('Debería devolver un error si el token es inválido', async () => {
    const invalidToken = 'invalidToken';
    const mockPasswordDto = {
      newPassword: '123',
      confirmNewPassword: '123',
    };

    const response = await request(app.getHttpServer())
      .post('/change-password')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(mockPasswordDto)
      .expect(401);

    expect(response.body).toEqual({
      error: true,
      msg: 'El token es invalido o ya expiro.',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
