import { Controller, Get, Param } from '@nestjs/common';
import { GetCardService } from '../services/get-card.service';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('product/card/:id')
export class GetCardController {
  constructor(
    private readonly getCardService: GetCardService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const cardFound = await this.getCardService.use(id);
      return {
        error: false,
        msg: null,
        data: cardFound,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
