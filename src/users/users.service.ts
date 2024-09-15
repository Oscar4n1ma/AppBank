import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './user.entity';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    private users: User[] =[
        {
            id: v4(),
            nombre: 'Oscar',
            apellido:'Rivera',
            fechaNacimiento: new Date('2002-01-28'),
            status: UserStatus.ACTIVO,
            password: "hola123"
        },
    ];

    getAllUsers(){
        return this.users;
    }


    async createUser(nombre: string, apellido: string, fechaNacimiento:Date, password:string) {
        const hashedPassword = await bcrypt.hash(password,5)
        const user = {
            id: v4(),
            nombre,
            apellido,
            fechaNacimiento,
            status: UserStatus.ACTIVO,
            password: hashedPassword
        }
        this.users.push(user)
        return user;

    }



}
