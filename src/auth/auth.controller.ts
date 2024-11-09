import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticate(@Body() loginUser: LoginUserDto) {
    try {
      const answer: string = await this.authService.authenticate(loginUser);
      return {
        answer,
      };
    } catch (error) {
      throw new HttpException({ status: 400, error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
