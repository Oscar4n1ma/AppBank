import { UtilsModule } from 'src/utils/utils.module';
import { GetUserInfoController } from 'src/user/controllers/get-user-info.controller';
import { GetUserInfoService } from 'src/user/services/get-user-info.service';
import { Test } from '@nestjs/testing';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';

describe('Get user info', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule, ProductModule],
      controllers: [GetUserInfoController],
      providers: [GetUserInfoService, MongoUserRepository],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Obtener informacion del usuario con id incorrecto', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/65466')
      .expect(500);
    expect(response.body).toEqual({
      error: true,
      msg: 'Internal server error.',
    });
  });

  it('Obtener informacion del usuario con id correcto y que no exista', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/673234157dca70cd358b0340')
      .expect(404);
    expect(response.body).toEqual({
      error: true,
      msg: 'Usuario no encontrado.',
    });
  });

  it('Obtener informacion del usuario con id correcto y que si exista', async () => {
    await request(app.getHttpServer())
      .get('/user/673b4b65e4da126f8b9782fe')
      .expect(200);
  });
  afterAll(async () => {
    await app.close();
  });
});
