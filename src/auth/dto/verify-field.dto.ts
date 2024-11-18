import { IsOptional, IsEmail, IsString } from 'class-validator';

export class VerifyFieldDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cc?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
