import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnicalAreaDto } from './dto/create-technical-area.dto';
import { UpdateTechnicalAreaDto } from './dto/update-technical-area.dto';
import { TechnicalArea } from './entities/technical-area.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TechnicalAreaService {
  constructor(@InjectRepository(TechnicalArea) private readonly technicalAreaRepository: Repository<TechnicalArea>) { }

  async create(createDto: CreateTechnicalAreaDto): Promise<TechnicalArea> {
    const existingArea = await this.technicalAreaRepository.findOne({
      where: { name: createDto.name }
    });

    if (existingArea) {
      throw new ConflictException(`El área '${createDto.name}' ya existe`);
    }

    const newArea = this.technicalAreaRepository.create(createDto);
    return await this.technicalAreaRepository.save(newArea);
  }

  async findAll(): Promise<TechnicalArea[]> {
    return await this.technicalAreaRepository.find({
      relations: ['courses'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<TechnicalArea> {
    const area = await this.technicalAreaRepository.findOne({
      where: { id },
      relations: ['courses']
    });

    if (!area) throw new NotFoundException(`Área técnica con ID ${id} no encontrada`);
    return area;
  }

  update(id: string, updateTechnicalAreaDto: UpdateTechnicalAreaDto) {
    return `This action updates a #${id} technicalArea`;
  }

  async remove(id: string): Promise<void> {
    const area = await this.findOne(id);
    await this.technicalAreaRepository.remove(area);
  }
}