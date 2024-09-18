import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  cc: string;
  @IsString()
  @IsNotEmpty()
  dateBorn: string;
  @IsString()
  @IsNotEmpty()
  genre: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsNumber()
  monthlyIncome: string;
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;
  @IsString()
  @IsNotEmpty()
  currentJob: string;
}

export class CreateBusinessDto {}
