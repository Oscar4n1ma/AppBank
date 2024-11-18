import { Controller, Post, Body, Res } from '@nestjs/common';
import { VerifyFieldService } from '../services/verify-field.service';
import { VerifyFieldDto } from '../dto/verify-field.dto';
import { ErrorHandler } from 'src/utils/error-handler';
import { Response } from 'express';

@Controller('verify-field')
export class VerifyFieldController {
  constructor(
    private readonly verifyFieldService: VerifyFieldService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post()
  async use(@Body() verifyFieldDto: VerifyFieldDto, @Res() res: Response) {
    try {
      const resp = await this.verifyFieldService.verifyField(verifyFieldDto);
      return res.status(200).json({
        error: false,
        msg: 'El dato ingresado fue encontrado en este id',
        data: resp,
      });
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
