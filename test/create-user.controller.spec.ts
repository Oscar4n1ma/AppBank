import { UtilsModule } from 'src/utils/utils.module';
import { Test } from '@nestjs/testing';
import MongoUserRepository from 'src/user/repositories/MongoUserRepository';
import { MongoClientModule } from 'src/config/mongo-client.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CreateUserController } from 'src/user/controllers/create-user.controller';
import { CreateUserClientService } from 'src/user/services/create-client.service';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { OtpService } from 'src/otp-service/services/otp.service';
import { MailService } from 'src/mail/mail.service';
import { ProductModule } from 'src/product/product.module';
import { CreateUserEnterpriseService } from 'src/user/services/create-enterprise.service';
import { CreateUserEmployeeService } from 'src/user/services/create-employee.service';
import { ConfigService } from '@nestjs/config';

describe('Creacion de usuarios', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, MongoClientModule, ProductModule],
      controllers: [CreateUserController],
      providers: [
        MailService,
        CreateUserClientService,
        ConfigService,
        OtpService,
        CreateUserEnterpriseService,
        CreateUserEmployeeService,
        MongoOtpsRepository,
        MongoUserRepository,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Creat usuario cliente con datos que no existe', async () => {
    const username = Math.round(Math.random() * 1e10).toString();
    const email = Math.round(Math.random() * 1e5).toString();
    const cc = Math.round(Math.random() * 1e10).toString();
    await request(app.getHttpServer())
      .post('/user/client')
      .send({
        username,
        firstName: 'Test',
        lastName: 'Test',
        email: `${email}@test.test`,
        cc,
        address: 'carrera 18#23a20',
        phoneNumber: '321321312412',
        password: '12345',
        genre: 'male',
        monthlyIncome: '1000',
        currentJob: 'desarrollador backend',
        maritalStatus: 'single',
        dateBorn: '2024-09-15T17:56:57.943Z',
        cardPin: '4424',
      })
      .expect(201);
  });

  it('Creat usuario cliente con datos que existen', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/client')
      .send({
        username: 'davilez43',
        firstName: 'jose david',
        lastName: 'saurez cardona',
        email: 'josedavid4227@test.com',
        cc: '1006432255',
        address: 'carrera 18#23a20',
        phoneNumber: '321321312412',
        password: '12345',
        genre: 'male',
        monthlyIncome: '1000',
        currentJob: 'desarrollador backend',
        maritalStatus: 'single',
        dateBorn: '2024-09-15T17:56:57.943Z',
        cardPin: '4424',
      })
      .expect(400);
    expect(response.body).toEqual({
      error: true,
      msg: 'El username o el correo ya existe.',
    });
  });

  it('Creat usuario empleado', async () => {
    const username = Math.round(Math.random() * 1e10).toString();
    const email = Math.round(Math.random() * 1e5).toString();
    const cc = Math.round(Math.random() * 1e10).toString();
    const phoneNumber = Math.floor(Math.random() * 1e10);
    await request(app.getHttpServer())
      .post('/user/employee')
      .send({
        username,
        firstName: 'prueba',
        lastName: 'pardo',
        email,
        cc,
        address: 'carrera 18#23a20',
        phoneNumber,
        password: '12345',
        genre: 'male',
        roleId: 2,
        dateBorn: '2024-09-15T17:56:57.943Z',
      })
      .expect(201);
  });

  it('Crear usuario enterprise', async () => {
    const username = Math.round(Math.random() * 1e10).toString();
    const email = Math.round(Math.random() * 1e5).toString();
    const nit = Math.round(Math.random() * 1e10).toString();
    const phoneNumber = Math.floor(Math.random() * 1e10);
    await request(app.getHttpServer())
      .post('/user/enterprise')
      .send({
        username,
        email,
        nit,
        ownerCc: '23424344',
        description: 'empresa de putas',
        name: 'la quemona',
        address: 'carrera 18#23a20',
        phoneNumber,
        password: '12345',
        cardPin: '4424',
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
