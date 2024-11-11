import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { LoginUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticate(@Body() loginUser: LoginUserDto) {
    try {
      const res = await this.authService.use(loginUser);
      return {
        error: false,
        data: res,
      };
    } catch (error) {
      throw new HttpException({ error: true, msg: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
