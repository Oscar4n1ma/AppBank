import { Body, Controller, Headers, HttpException, Post } from '@nestjs/common';
import { ChangePasswordService } from '../services/change-password.service';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Controller('change-password')
export class ChangePasswordController {
  constructor(private changePasswordService: ChangePasswordService) {}

  @Post()
  async use(
    @Headers('Authorization') token: string,
    // @Query('t') token: string,
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
        res,
      };
    } catch (error) {
      throw new HttpException({ error: true, msg: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
