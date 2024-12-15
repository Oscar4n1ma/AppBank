import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UpdateUserService } from '../services/update-user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ErrorHandler } from 'src/utils/error-handler';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Request } from 'express';

@Controller('user/:id')
export class UpdateUserController {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Patch()
  @Roles(Role.Admin, Role.Client)
  @UseGuards(AccessGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    try {
      const userSession = req.session.user;
      if (!userSession.roles.includes(1) && userSession.userId !== id) {
        throw new UnauthorizedException(
          'El usuario no tiene el rol suficiente para realizar esta accion.',
        );
      }
      await this.updateUserService.updateUser(id, updateUserDto);
      return {
        error: false,
        msg: 'Usuario actualizado exitosamente',
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
