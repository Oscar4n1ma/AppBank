import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class ErrorHandler {
  constructor() {}
  use(error: Error) {
    console.log(error); //!solo para debuguear, ELIMINAR EN PRODUCCION
    if (error instanceof HttpException) {
      const messages = (error.getResponse() as Record<string, unknown>).message;
      const msg: string[] | string =
        Array.isArray(messages) && messages.length === 1
          ? messages[0]
          : messages;
      throw new HttpException(
        {
          error: true,
          msg,
        },
        error.getStatus(),
      );
    }
    if (error instanceof JsonWebTokenError)
      throw new UnauthorizedException({
        error: true,
        msg: 'El token es invalido o ya expiro.',
      });
    throw new InternalServerErrorException({
      error: true,
      msg: 'Internal server error.',
    });
  }
}
