import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { UpdatePasswordService } from '../services/update-password.service';
import { ChangePassDto } from '../dto/change-password.dto';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Request } from 'express';

@Controller('user/update-password/:id')
export class UpdatePasswordController {
  constructor(
    private readonly checkOldPasswordsService: UpdatePasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Client)
  @UseGuards(AccessGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() changePass: ChangePassDto,
    @Req() req: Request,
  ) {
    try {
      const userSession = req.session.user;
      if (!userSession.roles.includes(1) && userSession.userId !== id) {
        throw new UnauthorizedException(
          'El usuario no tiene el rol suficiente para realizar esta accion.',
        );
      }
      await this.checkOldPasswordsService.use(id, changePass);
      return {
        error: false,
        msg: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
