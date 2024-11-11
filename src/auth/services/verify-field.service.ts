import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { VerifyFieldDto } from '../dto/verify-field.dto';
import MongoAuthRepository from '../MongoAuthRepository';

@Injectable()
export class VerifyFieldService {
  constructor(private readonly authRepository: MongoAuthRepository) {}

  async verifyField(verifyFieldDto: VerifyFieldDto) {
    // Validar que solo uno de los campos esté presente
    const { email, cc, telefono } = verifyFieldDto;
    if ((email ? 1 : 0) + (cc ? 1 : 0) + (telefono ? 1 : 0) !== 1) {
      throw new BadRequestException(
        'Debe enviar solo un campo: email, cedula o telefono',
      );
    }

    // Crear el campo de búsqueda en función del DTO recibido
    const fieldToVerify = email
      ? { email }
      : cc
        ? { 'data.cc': cc }
        : { 'data.phone': telefono };

    // Llamar al repositorio para verificar si el campo ya existe
    const user = await this.authRepository.findByField(fieldToVerify);

    if (!user) {
      throw new NotFoundException('El dato ingresado no existe');
    }

    // Devolver el id del usuario encontrado
    return { exists: true, id: user._id.toString() };
  }
}
