import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import MongoOtpsRepository from './repositories/MongoOtpsRepository';
import { MongoClientModule } from 'src/config/mongo-client.module';
import { VerifyOtpService } from './services/verify-otp.service';

@Module({
  imports: [MongoClientModule],
  providers: [OtpService, MongoOtpsRepository, VerifyOtpService],
  exports: [OtpService, MongoOtpsRepository, VerifyOtpService],
})
export class OtpModule {}
