import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async authenticate(@Body() loginUser: LoginUserDto, @Res() res: Response) {
    try {
      const resp = await this.authService.use(loginUser);
      return res.status(200).json({
        error: false,
        data: resp,
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
