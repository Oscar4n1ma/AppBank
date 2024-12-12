import { Controller, Get, Param } from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetReceiptService } from '../services/get-receipt.service';

@Controller('transaction/receipt/:id')
export class GetReceiptController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getReceiptService: GetReceiptService,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const res = await this.getReceiptService.use(id);
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
