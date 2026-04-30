import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pensum } from './entities/pensum.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PensumService {
  constructor(@InjectRepository(Pensum) private readonly pensumRepository: Repository<Pensum>) { }

  async create(createPensumDto: CreatePensumDto): Promise<Pensum> {
    const newPensum = this.pensumRepository.create(createPensumDto);
    return await this.pensumRepository.save(newPensum);
  }

  async findAll(): Promise<Pensum[]> {
    return await this.pensumRepository.find({
      relations: ['courses'],
      order: { effectiveYear: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Pensum> {
    const pensum = await this.pensumRepository.findOne({
      where: { id },
      relations: ['courses']
    });

    if (!pensum) {
      throw new NotFoundException(`Pensum con ID ${id} no encontrado`);
    }
    return pensum;
  }

  update(id: string, updatePensumDto: UpdatePensumDto) {
    return `This action updates a #${id} pensum`;
  }

  async remove(id: string): Promise<void> {
    const pensum = await this.findOne(id);
    await this.pensumRepository.remove(pensum);
  }
}
