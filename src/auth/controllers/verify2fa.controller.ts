import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { Verify2FaService } from '../services/verify2fa.service';
import { Verify2FaDto } from '../dto/verify2fa.dto';

@Controller('verify2fa')
export class Verify2FaController {
  constructor(private verify2FaService: Verify2FaService) {}

  @Post()
  async use(@Body() verify2Fa: Verify2FaDto) {
    try {
      const token = await this.verify2FaService.use(verify2Fa);
      return {
        error: true,
        msg: null,
        token: token,
      };
    } catch (error) {
      throw new HttpException({ status: 400, error: error.message }, 400, {
        cause: error.message,
      });
    }
  }
}
