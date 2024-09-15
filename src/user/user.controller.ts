import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    try {
      const userId: string = await this.usersService.createUser(newUser);
      return {
        userId,
      };
    } catch (error) {
      throw new HttpException({ status: 400, error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}