import { Controller, Delete, Param } from '@nestjs/common';
import { ErrorHandler } from 'src/utils/error-handler';
import { DeleteUserService } from '../services/delete-user.service';

@Controller('user/:id')
export class DeleteUserController {
  constructor(
    private readonly deleteUserService: DeleteUserService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Delete()
  async use(@Param('id') id: string) {
    try {
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
