import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp-service/otp.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Configuración para que esté disponible globalmente
    }),
    OtpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
