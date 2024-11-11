import { IsOptional, IsEmail, IsString, IsPhoneNumber } from 'class-validator';

export class VerifyFieldDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cc?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  telefono?: string;
}
