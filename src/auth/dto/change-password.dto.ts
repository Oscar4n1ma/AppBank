import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}
