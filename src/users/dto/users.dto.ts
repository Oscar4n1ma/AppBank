import { UserStatus } from "../user.entity";
import { IsNotEmpty, IsString, isString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    apellido: string

    fechaNacimiento:Date

    @IsString()
    password:string
}