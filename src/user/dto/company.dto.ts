import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly nit: string;

  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  @IsString()
  @IsNotEmpty()
  readonly companyAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly companyEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly companyPhoneNumber: string;

  @IsNumber()
  readonly numberOfEmployees: number;
}
