import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '@/common/dtos';
import { handleDBErrors } from '@/common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      handleDBErrors(error, 'UsersService');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.usersRepository.find({
      take: limit,
      skip: offset,
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with id ${id}, not found`);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        roles: true,
        isActive: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with email ${email}, not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      handleDBErrors(error, 'UsersService');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const result = await this.usersRepository.softDelete(id);
      if (result.affected === 1)
        return { message: `User with id ${id} has been successfully removed` };
    } catch (error) {
      handleDBErrors(error, 'UsersService');
    }
  }
}
