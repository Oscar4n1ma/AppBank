import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CompanyDto } from './company.dto';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  @Transform((args) => args.value.trim().split(' ').join(''))
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
  @Length(4, 4)
  readonly cardPin: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly documentNumber: string;

  @IsNumber()
  @Min(1)
  readonly documentTypeId: number;

  @IsNumber()
  @Min(0)
  readonly genre: number;

  @IsNumberString()
  @IsNotEmpty()
  readonly monthlyIncome: string;

  @IsNumber()
  @Min(0)
  readonly maritalStatus: number;

  @IsNumber()
  @Min(0)
  readonly currentJob: number;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'La contraseña debe tener almenos un simbolo o una letra mayuscula',
    },
  )
  readonly password: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly company?: CompanyDto;
}
