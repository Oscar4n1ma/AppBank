import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { ConfirmAccountService } from '../services/confirm-account.service';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('confirm-account')
export class ConfirmAccountController {
  constructor(
    private readonly confirmAccountService: ConfirmAccountService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(@Body() confirmAccount: ConfirmAccountDto) {
    try {
      await this.confirmAccountService.use(confirmAccount);
      return {
        error: true,
        msg: 'Su cuenta fue activada con exito',
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
