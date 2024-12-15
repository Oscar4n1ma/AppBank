import { Controller, Post, Param, Body } from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { UpdatePasswordService } from '../services/update-password.service';
import { ChangePassDto } from '../dto/change-password.dto';

@Controller('update-password/:id')
export class UpdatePasswordController {
  constructor(
    private readonly checkOldPasswordsService: UpdatePasswordService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async update(@Param('id') id: string, @Body() changePass: ChangePassDto) {
    try {
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
