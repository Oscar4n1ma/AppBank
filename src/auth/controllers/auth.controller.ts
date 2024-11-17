import { Body, Controller, Post } from '@nestjs/common';
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
  async authenticate(@Body() loginUser: LoginUserDto) {
    try {
      const res = await this.authService.use(loginUser);
      return {
        error: false,
        data: res,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
