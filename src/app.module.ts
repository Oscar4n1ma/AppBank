import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp-service/otp.module';
import { TransactionsModule } from './transaction/transactions.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TransactionsModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true, // Configuración para que esté disponible globalmente
    }),
    OtpModule,
    MailModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
