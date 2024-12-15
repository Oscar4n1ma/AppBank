import {
  Controller,
  flatten,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ErrorHandler } from 'src/utils/error-handler';
import { GetAccountService } from '../services/get-account.service';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Response } from 'express';
import { GenerateExtractService } from '../services/generate-extract.service';

@Controller('product/account/:id/extract')
export class GenerateExtractController {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly generateExtractService: GenerateExtractService,
  ) {}

  @Get()
  //   @Roles(Role.Admin, Role.Client)
  //   @UseGuards(AccessGuard, RolesGuard)
  async use(@Param('id') id: string, @Res() res: Response) {
    try {
      return this.generateExtractService.use(id, res);
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
