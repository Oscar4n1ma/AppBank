import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import MongoOtpsRepository from './repositories/MongoOtpsRepository';
import MongoClientDb from 'src/config/MongoClientDb';

@Module({
  providers: [OtpService, MongoOtpsRepository, MongoClientDb],
  exports: [OtpService, MongoOtpsRepository],
})
export class OtpModule {}
