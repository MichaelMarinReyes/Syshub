import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusesService {
  constructor(@InjectRepository(Status) private readonly statusRepository: Repository<Status>) {}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const existingStatus = await this.statusRepository.findOne({ 
      where: { name: createStatusDto.name } 
    });
    
    if (existingStatus) {
      throw new ConflictException(`El estado '${createStatusDto.name}' ya existe`);
    }

    const newStatus = this.statusRepository.create(createStatusDto);
    return await this.statusRepository.save(newStatus);
  }

  async findAll(): Promise<Status[]> {
    return await this.statusRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Status> {
    const status = await this.statusRepository.findOne({ 
      where: { id },
      relations: ['users']
    });

    if (!status) throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    return status;
  }

  update(id: string, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  async remove(id: string): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
  }
}