import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './user.entity';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {

    private users: User[] =[
        {
            id: v4(),
            nombre: 'Oscar',
            apellido:'Rivera',
            fechaNacimiento: new Date('2002-01-28'),
            status: UserStatus.ACTIVO
        },
    ];

    getAllUsers(){
        return this.users;
    }


    createUser(nombre: string, apellido: string, fechaNacimiento:Date) {
        const user = {
            id: v4(),
            nombre,
            apellido,
            fechaNacimiento,
            status: UserStatus.ACTIVO
        }
        this.users.push(user)
        return user;

    }



}
