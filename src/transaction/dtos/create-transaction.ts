import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumberString()
  toProduct: string;

  @IsNumberString()
  fromProduct: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;
}
