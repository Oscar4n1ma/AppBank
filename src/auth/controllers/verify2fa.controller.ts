import { Body, Controller, Post, Req } from '@nestjs/common';
import { Verify2FaService } from '../services/verify2fa.service';
import { Verify2FaDto } from '../dto/verify2fa.dto';
import { ErrorHandler } from 'src/utils/error-handler';
import { Request } from 'express';

@Controller('verify2fa')
export class Verify2FaController {
  constructor(
    private verify2FaService: Verify2FaService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(@Body() verify2Fa: Verify2FaDto, @Req() req: Request) {
    try {
      const token = await this.verify2FaService.use(verify2Fa);
      req.session.user.accessToken = token.accessToken;
      return {
        error: true,
        msg: null,
        data: token,
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
