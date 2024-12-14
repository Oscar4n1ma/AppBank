import {
  IsNumber,
  IsNumberString,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNumberString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly genre?: number;

  @IsOptional()
  @IsNumberString()
  readonly monthlyIncome?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly maritalStatus?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly currentJob?: number;
}
