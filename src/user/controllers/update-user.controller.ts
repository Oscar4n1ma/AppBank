import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UpdateUserService } from '../services/update-user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ErrorHandler } from 'src/utils/error-handler';

@Controller('user')
export class UpdateUserController {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.updateUserService.updateUser(
        id,
        updateUserDto,
      );
      return {
        error: false,
        msg: 'Usuario actualizado exitosamente',
        data: updatedUser,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
