import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  dateBorn: string;
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNumberString()
  @IsNotEmpty()
  cc: string;
  @IsString()
  @IsNotEmpty()
  genre: string;
  @IsNumberString()
  @IsNotEmpty()
  monthlyIncome: string;
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;
  @IsString()
  @IsNotEmpty()
  currentJob: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
