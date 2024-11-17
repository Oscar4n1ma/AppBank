import { Body, Controller, Post } from '@nestjs/common';
import { RecoveryPasswordService } from '../services/recovery-password.service';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('recovery-password')
export class RecoveryPasswordController {
  constructor(
    private recoveryPasswordService: RecoveryPasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(@Body('email') email: string) {
    try {
      const res = await this.recoveryPasswordService.use(email);
      return {
        error: false,
        res,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
