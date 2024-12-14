import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
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
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}
