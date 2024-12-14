import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ChangePasswordService } from '../services/change-password.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('change-password')
export class ChangePasswordController {
  constructor(
    private changePasswordService: ChangePasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(
    @Headers('Authorization') token: string,
    @Body() changePassword: ChangePasswordDto,
  ) {
    try {
      const tokenSplited = token.split(' ').pop();
      const res = await this.changePasswordService.use(
        changePassword,
        tokenSplited,
      );
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
