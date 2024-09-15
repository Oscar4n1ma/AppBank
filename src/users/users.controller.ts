import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    getAllUsers(){
        return this.usersService.getAllUsers()
    }

    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        return this.usersService.createUser(newUser.nombre, newUser.apellido, newUser.fechaNacimiento)
    }



}
