import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otp: number;
}
