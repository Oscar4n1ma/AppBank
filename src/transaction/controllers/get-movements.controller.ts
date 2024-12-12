import { Controller, Get, Param } from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetMovementsService } from '../services/get-movements.service';
@Controller('transaction/movements/:id')
export class GetMovementsController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getMovementsService: GetMovementsService,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const res = await this.getMovementsService.use(id);
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
