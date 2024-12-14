import {
  Controller,
  Session,
  Post,
  BadRequestException,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { Session as s_ } from 'express-session';
import { Response } from 'express';

@Controller('logout/:id')
export class LogoutController {
  constructor(private readonly errorHandler: ErrorHandler) {}

  @Post()
  @HttpCode(200)
  async use(@Session() session: s_, @Res() res: Response) {
    try {
      session?.destroy((err) => {
        if (err) {
          throw new BadRequestException(
            'No se pudo cerrar sesion debido a un error inesperado.',
          );
        }
        res.clearCookie('tk');
        res.clearCookie('s.id');
        return res.sendStatus(200);
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
