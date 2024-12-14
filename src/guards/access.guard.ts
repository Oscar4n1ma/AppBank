import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ErrorHandler } from 'src/utils/error-handler';

const getCookies = (s: string): Record<string, string> => {
  const output = {};
  const cookies = s.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i];
    const k = c.split('=');
    if (k.length !== 2) {
      throw new Error('Cookie string malformed.');
    }
    output[k[0].trim()] = k[1].trim();
  }
  return output;
};

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly errorHandler: ErrorHandler) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      // Verifico que tenga una sesion iniciada.
      if (!req.session.user) {
        throw new UnauthorizedException(
          'Debes tener una sesion iniciada para continuar.',
        );
      }
      // Obtengo y verifico que exista el token
      const auth = req.headers.authorization;
      const cookies = getCookies(req.headers.cookie);
      const token = cookies.tk ?? auth?.split(' ').pop();

      if (!token) {
        throw new BadRequestException(
          'Debes proporcionar un token para poder continuar.',
        );
      }
      // Verifico la validez del token y lo comparo con el de la session.
      verify(token, process.env.SECRET_KEY_JWT ?? '');
      if (req.session.user.accessToken !== token) {
        throw new UnauthorizedException(
          'El token proporcionado no es correcto para esta sesion.',
        );
      }
      return true;
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
