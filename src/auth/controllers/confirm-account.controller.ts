import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { ConfirmAccountService } from '../services/confirm-account.service';

@Controller('confirm-account')
export class ConfirmAccountController {
  constructor(private confirmAccountService: ConfirmAccountService) {}

  @Post()
  async use(@Body() confirmAccount: ConfirmAccountDto) {
    try {
      const confirmed = await this.confirmAccountService.use(confirmAccount);
      return {
        error: true,
        msg: confirmed,
      };
    } catch (error) {
      throw new HttpException({ status: 400, error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
