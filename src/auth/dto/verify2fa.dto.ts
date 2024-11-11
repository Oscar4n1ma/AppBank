import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Verify2FaDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
