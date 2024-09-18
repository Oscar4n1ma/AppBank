import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, CreateBusinessDto } from './dto/users.dto';

@Controller('user')
export class UsersController {
  constructor(private clientService: ClientService) {}

  @Post('/client')
  async createClient(@Body() client: CreateClientDto) {
    try {
      const userId: string = await this.clientService.create(client);
      return {
        state: 'ok',
        data: { userId },
      };
    } catch (error) {
      throw new HttpException({ state: 'error', error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
  @Post('/business')
  async createBusiness(@Body() business: CreateBusinessDto) {
    try {
      return {
        business,
      };
    } catch (error) {
      throw new HttpException({ status: 400, error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
