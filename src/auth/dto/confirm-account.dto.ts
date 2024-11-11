import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
