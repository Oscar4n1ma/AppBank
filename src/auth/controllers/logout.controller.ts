import {
  Controller,
  Session,
  Post,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ChangePasswordService } from '../services/change-password.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Session as s_ } from 'express-session';

@Controller('logout')
export class LogoutController {
  constructor(
    private changePasswordService: ChangePasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  @HttpCode(200)
  async use(@Session() session: s_) {
    try {
      console.log(session);
      session?.destroy((err) => {
        if (err) {
          throw new BadRequestException(
            'No se puedo cerrar sesion debido a un error inesperado.',
          );
        }
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
