import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { GetMovementsService } from '../services/get-movements.service';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('transaction/movements/:id')
export class GetMovementsController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getMovementsService: GetMovementsService,
  ) {}

  @Get()
  @Roles(Role.Admin, Role.Client)
  @UseGuards(AccessGuard, RolesGuard)
  async use(@Param('id') id: string) {
    try {
      const res = await this.getMovementsService.use(id);
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
