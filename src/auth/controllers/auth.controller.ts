import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  @HttpCode(200)
  async authenticate(
    @Headers('user-agent') userAgent: string,
    @Body() loginUser: LoginUserDto,
    @Ip() ip: string,
    @Req() req: Request,
    @Res() res: Response,
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

      res.cookie('tk', accessToken, {
        httpOnly: true,
        secure: false, //Solo desarrollo
        priority: 'high',
        sameSite: 'strict',
        maxAge: 3600000, // Expira en 1 horas si no hay interaccion
      });

      return res.status(200).json({
        error: false,
        data: {
          accessToken,
          userId,
          roles,
          _2fa,
        },
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
