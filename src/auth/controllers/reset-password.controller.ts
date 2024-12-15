import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset-password.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(
    private resetPasswordService: ResetPasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(
    @Headers('Authorization') token: string,
    @Body() changePassword: ChangePasswordDto,
  ) {
    try {
      const tokenSplited = token.split(' ').pop();
      await this.resetPasswordService.use(changePassword, tokenSplited);
      return {
        error: false,
        msg: null,
        data: 'Contraseña cambiada.',
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
