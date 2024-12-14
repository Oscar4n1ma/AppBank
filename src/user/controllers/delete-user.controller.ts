import {
  Controller,
  Delete,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { DeleteUserService } from '../services/delete-user.service';
import { Roles } from 'src/guards/roles.decorator';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from 'src/enums/roles.enum';
import { Request } from 'express';

@Controller('user/:id')
export class DeleteUserController {
  constructor(
    private readonly deleteUserService: DeleteUserService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Delete()
  @Roles(Role.Admin, Role.Client)
  @UseGuards(AccessGuard, RolesGuard)
  async use(@Req() req: Request, @Param('id') id: string) {
    try {
      const userSession = req.session.user;
      if (!userSession.roles.includes(1) && userSession.userId !== id) {
        throw new UnauthorizedException(
          'El usuario no tiene el rol suficiente para realizar esta accion.',
        );
      }
      await this.deleteUserService.use(id);
      return {
        error: false,
        msg: null,
        data: { userId: id },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
