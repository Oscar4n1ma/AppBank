import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
config({ path: '.env.development.local' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        throw new BadRequestException({
          error: true,
          msg: errors.map((e) => Object.values(e.constraints)).flat(1),
        });
      },
    }),
  );
  await app.listen(8000);
}
bootstrap();
