import { Body, Controller, Ip, Post } from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction';
import { ErrorHandler } from 'src/utils/error-handler';
import { CreateTransactionService } from '../services/create-transaction.service';
@Controller('transaction/init')
export class CreateTransactionController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly createTransactionService: CreateTransactionService,
  ) {}

  @Post()
  async use(@Body() transaction: CreateTransactionDto, @Ip() ip: string) {
    try {
      const res = await this.createTransactionService.use(ip, transaction);
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
