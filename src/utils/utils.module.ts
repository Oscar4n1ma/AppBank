import { Module } from '@nestjs/common';
import { ErrorHandler } from './error-handler';

@Module({
  exports: [ErrorHandler],
  providers: [ErrorHandler],
})
export class UtilsModule {}
