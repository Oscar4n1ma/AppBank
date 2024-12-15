import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import MongoUserRepository from '../repositories/MongoUserRepository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (!Object.keys(updateUserDto).length) {
      throw new NotFoundException(
        'No se proporcionaron datos válidos para actualizar.',
      );
    }
    const updateFields: any = {};
    if (updateUserDto.phoneNumber)
      updateFields['data.phoneNumber'] = updateUserDto.phoneNumber;
    if (updateUserDto.address)
      updateFields['data.address'] = updateUserDto.address;
    if (updateUserDto.genre !== undefined)
      updateFields['data.genre'] = updateUserDto.genre;
    if (updateUserDto.monthlyIncome)
      updateFields['data.monthlyIncome'] = updateUserDto.monthlyIncome;
    if (updateUserDto.maritalStatus !== undefined)
      updateFields['data.maritalStatus'] = updateUserDto.maritalStatus;
    if (updateUserDto.currentJob !== undefined)
      updateFields['data.currentJob'] = updateUserDto.currentJob;

    const updatedUser = await this.userRepository.update(id, updateFields);

    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado o ya eliminado.');
    }
  }
}
