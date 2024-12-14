import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { ErrorHandler } from '../utils/error-handler';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly errorHandler: ErrorHandler,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles =
        this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
          //obtengo los roles requeridos de la ruta
          context.getHandler(),
          context.getClass(),
        ]) ?? [];
      const req = context.switchToHttp().getRequest();
      const userRoles = req.session.user.roles ?? [];
      // verifico que el usuario tenga los roles requeridos

      for (let i = 0; i < requiredRoles.length; i++) {
        const rol = requiredRoles[i];
        if (userRoles.some((r) => r === rol)) return true;
      }
      throw new UnauthorizedException(
        `El usuario no cuenta con los roles suficientes para realizar esta accion, Se requieren los siguientes roles: ${requiredRoles.map((roleId) => Role[roleId]).join(' , ')}`,
      );
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
