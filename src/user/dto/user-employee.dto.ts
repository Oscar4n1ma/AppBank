import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateUserEmployeeDto {
  @IsString()
  @IsNotEmpty()
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
  readonly cc: string;
  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @IsNumber()
  readonly roleId: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
