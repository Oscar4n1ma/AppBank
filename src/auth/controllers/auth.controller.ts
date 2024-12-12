import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { LoginUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Request } from 'express';

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
    @Req() req: Request,
  ) {
    try {
      const { accessToken, userId, roles, _2fa, email } =
        await this.authService.use(loginUser, { ip, userAgent });
      req.session.user = {
        accessToken,
        email,
        roles,
        userId: userId.toString(),
        userAgent,
      };
      return {
        error: false,
        data: {
          accessToken,
          userId,
          roles,
          _2fa,
        },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
