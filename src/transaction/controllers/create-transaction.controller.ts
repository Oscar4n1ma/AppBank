import {
  Body,
  Controller,
  Ip,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction';
import { ErrorHandler } from 'src/utils/error-handler';
import { CreateTransactionService } from '../services/create-transaction.service';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Request } from 'express';

@Controller('transaction/init')
export class CreateTransactionController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly createTransactionService: CreateTransactionService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Client)
  @UseGuards(AccessGuard, RolesGuard)
  async use(
    @Req() req: Request,
    @Body() transaction: CreateTransactionDto,
    @Ip() ip: string,
  ) {
    try {
      const userSession = req.session.user;
      if (
        !userSession.roles.includes(1) &&
        userSession.userId !== transaction.userId
      ) {
        throw new UnauthorizedException(
          'El usuario no tiene el rol suficiente para realizar esta accion.',
        );
      }
      const res = await this.createTransactionService.use(ip, transaction);
      return {
        error: false,
        msg: null,
        data: res,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
