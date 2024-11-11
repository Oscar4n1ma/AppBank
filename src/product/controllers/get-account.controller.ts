import { Controller, Get, Param } from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetAccountService } from '../services/get-account.service';

@Controller('product/account/:id')
export class GetAccountrController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getAccountService: GetAccountService,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const accountFound = await this.getAccountService.use(id);
      return {
        error: false,
        msg: null,
        data: accountFound,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
