import {
  Body,
  Controller,
  HttpException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { RecoveryPasswordService } from '../services/recovery-password.service';

@Controller('recovery-password')
export class RecoveryPasswordController {
  constructor(private recoveryPasswordService: RecoveryPasswordService) {}

  @Post()
  async use(@Body('email') email: string) {
    try {
      const res = await this.recoveryPasswordService.use(email);
      return {
        error: false,
        res,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException({ error: true, msg: error.message }, 404);
      }
      throw new HttpException({ error: true, msg: error.message }, 400);
    }
  }
}
