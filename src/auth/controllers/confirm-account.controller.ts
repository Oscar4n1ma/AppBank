import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { ConfirmAccountService } from '../services/confirm-account.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Response } from 'express';

@Controller('confirm-account')
export class ConfirmAccountController {
  constructor(
    private readonly confirmAccountService: ConfirmAccountService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(@Body() confirmAccount: ConfirmAccountDto, @Res() res: Response) {
    try {
      await this.confirmAccountService.use(confirmAccount);
      return res.status(200).json({
        error: false,
        msg: 'Su cuenta fue activada con exito',
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
