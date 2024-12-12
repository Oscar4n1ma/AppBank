import { Body, Controller, Post } from '@nestjs/common';

import { ClientDto } from '../dto/user-client.dto';
import { ErrorHandler } from 'src/utils/error-handler';
import { CreateUserService } from '../services/create-user.service';

@Controller('user')
export class CreateUserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post('client')
  async createClient(@Body() client: ClientDto) {
    try {
      const userId: string = await this.createUserService.use(client);

      return {
        error: false,
        msg: null,
        data: {
          userId,
        },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
