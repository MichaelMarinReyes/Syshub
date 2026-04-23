import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Role } from '@/roles/entities/role.entity';
import { Status } from '@/statuses/entities/status.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Status) private statusRepository: Repository<Status>
  ) { }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.status', 'status')
      .getOne();
  }

  async create(createUserDto: CreateUserDto) {
    const { password, roleId, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const targetStatus = (roleId === 'Estudiante') ? 'Activo' : 'Inactivo';
    const [role, status] = await Promise.all([
      this.roleRepository.findOneBy({ name: roleId }),
      this.statusRepository.findOneBy({ name: targetStatus })
    ])

    if (!role || !status) {
      throw new InternalServerErrorException('Error al registrarse.');
    }

    const newUser = this.userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: role,
      status: status,
      createdAt: new Date()
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['role', 'status'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        role: { name: true },
        status: { name: true }
      }
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'status'],
    });
    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}