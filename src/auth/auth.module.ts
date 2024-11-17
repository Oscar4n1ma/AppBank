import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import MongoAuthRepository from './MongoAuthRepository';
import { AuthController } from './controllers/auth.controller';
import { MailService } from 'src/mail/mail.service';
import MongoOtpsRepository from 'src/otp-service/repositories/MongoOtpsRepository';
import { OtpService } from 'src/otp-service/services/otp.service';
import { Verify2FaController } from './controllers/verify2fa.controller';
import { Verify2FaService } from './services/verify2fa.service';
import { VerifyFieldService } from './services/verify-field.service';
import { VerifyFieldController } from './controllers/verify-field.controller';
import { RecoveryPasswordController } from './controllers/recovery-password.controller';
import { RecoveryPasswordService } from './services/recovery-password.service';
import { ChangePasswordController } from './controllers/change-password.controller';
import { ChangePasswordService } from './services/change-password.service';
import { ConfirmAccountController } from './controllers/confirm-account.controller';
import { ConfirmAccountService } from './services/confirm-account.service';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { UtilsModule } from 'src/utils/utils.module';
import { OtpModule } from 'src/otp-service/otp.module';

@Module({
  imports: [MongoClientModule, UtilsModule, OtpModule],
  controllers: [
    AuthController,
    Verify2FaController,
    VerifyFieldController,
    RecoveryPasswordController,
    ChangePasswordController,
    ConfirmAccountController,
  ],
  providers: [
    AuthService,
    Verify2FaService,
    VerifyFieldService,
    MongoAuthRepository,
    MailService,
    OtpService,
    MongoOtpsRepository,
    RecoveryPasswordService,
    ChangePasswordService,
    ConfirmAccountService,
  ],
})
export class AuthModule {}
