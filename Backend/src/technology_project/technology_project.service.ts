import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnologyProjectDto } from './dto/create-technology_project.dto';
import { UpdateTechnologyProjectDto } from './dto/update-technology_project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTechnology } from './entities/technology_project.entity';

@Injectable()
export class TechnologyProjectService {
  constructor(@InjectRepository(ProjectTechnology) private readonly ptRepository: Repository<ProjectTechnology>) { }

  async create(dto: CreateTechnologyProjectDto): Promise<ProjectTechnology> {
    const existing = await this.ptRepository.findOne({
      where: { idPublication: dto.idPublication, idTechnology: dto.idTechnology }
    });

    if (existing) {
      throw new ConflictException('Esta tecnología ya está vinculada al proyecto');
    }

    const relation = this.ptRepository.create(dto);
    return await this.ptRepository.save(relation);
  }

  findAll() {
    return `This action returns all technologyProject`;
  }

  async findByOne(idPublication: string) {
    return await this.ptRepository.find({
      where: { idPublication },
      relations: ['technology']
    });
  }

  update(id: string, updateTechnologyProjectDto: UpdateTechnologyProjectDto) {
    return `This action updates a #${id} technologyProject`;
  }

  async remove(idPublication: string, idTechnology: string): Promise<void> {
    const result = await this.ptRepository.delete({ idPublication, idTechnology });
    if (result.affected === 0) {
      throw new NotFoundException('La vinculación no existe');
    }
  }
}

