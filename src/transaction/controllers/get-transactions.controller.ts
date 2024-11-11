import { Controller, Get, Param } from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetTransactionService } from '../services/get-transactions.service';
@Controller('transaction/history/:id')
export class GetTransactionController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getTransactionService: GetTransactionService,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const res = await this.getTransactionService.use(id);
      return {
        error: false,
        msg: null,
        data: res,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
