import { Controller, Post, Body } from '@nestjs/common';
import { VerifyFieldService } from '../services/verify-field.service';
import { VerifyFieldDto } from '../dto/verify-field.dto';

@Controller('verify-field')
export class VerifyFieldController {
  constructor(private readonly verifyFieldService: VerifyFieldService) {}

  @Post()
  async use(@Body() verifyFieldDto: VerifyFieldDto) {
    const res = await this.verifyFieldService.verifyField(verifyFieldDto);
    return {
      error: false,
      msg: 'El dato ingresado fue encontrado en este id',
      data: res,
    };
  }
}
