import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetCardService } from '../services/get-card.service';
import { ErrorHandler } from 'src/utils/error-handler';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AccessGuard } from 'src/guards/access.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('product/card/:id')
export class GetCardController {
  constructor(
    private readonly getCardService: GetCardService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AccessGuard, RolesGuard)
  async use(@Param('id') id: string) {
    try {
      const cardFound = await this.getCardService.use(id);
      return {
        error: false,
        msg: null,
        data: cardFound,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
