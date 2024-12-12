import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import helmet from 'helmet';
import {
  CONFIG_CORS,
  CONFIG_HELMET,
  CONFIG_SESSION,
  CONFIG_VALIDATION_PIPE,
  CONFIG_VERSIONING,
} from './config/configs';
config({ path: '.env.development.local' });

declare module 'express-session' {
  interface SessionData {
    user: {
      email: string;
      userId: string;
      accessToken: string;
      roles: Array<{ id: number }>;
      userAgent: string;
    };
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CONFIG_CORS);
  app.useGlobalPipes(new ValidationPipe(CONFIG_VALIDATION_PIPE));
  app.setGlobalPrefix('api');
  app.enableVersioning(CONFIG_VERSIONING);
  app.use(session(CONFIG_SESSION));
  app.use(helmet(CONFIG_HELMET));
  app.use(session({ secret: 'ljasklfhaklfhkashfkj' }));
  await app.listen(8000);
}
bootstrap();
