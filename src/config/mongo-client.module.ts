import { Module } from '@nestjs/common';
import MongoClientDb from './MongoClientDb';

@Module({
  exports: [MongoClientDb],
  providers: [MongoClientDb],
})
export class MongoClientModule {}
