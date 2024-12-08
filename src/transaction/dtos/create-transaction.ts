import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  userId: string;

  @IsNumberString()
  toProduct: string;

  @IsNumberString()
  fromProduct: string;

  @IsString()
  description: string;

  @IsString()
  pin: string;

  @IsNumber()
  amount: number;
}
