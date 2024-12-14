import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetAccountService } from '../services/get-account.service';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('product/account/:id')
export class GetAccountrController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly getAccountService: GetAccountService,
  ) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AccessGuard, RolesGuard)
  async use(@Param('id') id: string) {
    try {
      const accountFound = await this.getAccountService.use(id);
      return {
        error: false,
        msg: null,
        data: accountFound,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
