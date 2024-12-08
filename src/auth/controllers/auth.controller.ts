import { Body, Controller, Headers, HttpCode, Ip, Post } from '@nestjs/common';
import { LoginUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  @HttpCode(200)
  async authenticate(
    @Body() loginUser: LoginUserDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    try {
      const resp = await this.authService.use(loginUser, { ip, userAgent });
      return {
        error: false,
        data: resp,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
