import { Controller, Get, Param } from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { GetUserInfoService } from '../services/get-user-info.service';

@Controller('user/:id')
export class GetUserInfoController {
  constructor(
    private readonly getUserInfoService: GetUserInfoService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  async use(@Param('id') id: string) {
    try {
      const userData = await this.getUserInfoService.use(id);

      return {
        error: false,
        msg: null,
        data: userData,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
