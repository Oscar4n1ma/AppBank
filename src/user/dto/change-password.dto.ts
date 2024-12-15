import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePassDto {
  @IsString()
  @IsNotEmpty()
  readonly currentPass: string;

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
  readonly newPass: string;
}
