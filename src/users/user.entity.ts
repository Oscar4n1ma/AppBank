export enum UserStatus{
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO'
}

export class User {
    id: string
    nombre: string
    apellido: string
    fechaNacimiento: Date
    status: UserStatus
    password: string
}