import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateClientDto } from './dto/users.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/client')
  async create(@Body() newUser: CreateClientDto) {
    try {
      const userId: string = await this.usersService.createClient(newUser);
      return {
        state: 'ok',
        data: {
          userId,
        },
      };
    } catch (error) {
      throw new HttpException(
        { state: 'error', error: { message: error.message } },
        400,
        {
          cause: error.message,
        },
      );
    }
  }
}
