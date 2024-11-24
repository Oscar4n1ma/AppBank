import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateUserClientDto {
  @IsString()
  @IsNotEmpty()
  @Transform((args) => args.value.trim())
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly dateBorn: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly cardPin: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly cc: string;

  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly monthlyIncome: string;

  @IsString()
  @IsNotEmpty()
  readonly maritalStatus: string;

  @IsString()
  @IsNotEmpty()
  readonly currentJob: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
