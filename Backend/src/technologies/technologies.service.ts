import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechnologiesService {
  constructor(@InjectRepository(Technology) private readonly technologyRepository: Repository<Technology>) {}

  async create(createDto: CreateTechnologyDto): Promise<Technology> {
        const { name } = createDto;
        const existing = await this.technologyRepository.findOne({ where: { name } });
        
        if (existing) {
            throw new ConflictException(`La tecnología '${name}' ya está registrada`);
        }

        const technology = this.technologyRepository.create(createDto);
        return await this.technologyRepository.save(technology);
    }

    async findAll(): Promise<Technology[]> {
        return await this.technologyRepository.find({
            order: { name: 'ASC' }
        });
    }

    async findOne(id: string): Promise<Technology> {
        const technology = await this.technologyRepository.findOne({ where: { id } });
        if (!technology) throw new NotFoundException('Tecnología no encontrada');
        return technology;
    }

  update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    return `This action updates a #${id} technology`;
  }

  async remove(id: string): Promise<void> {
        const technology = await this.findOne(id);
        await this.technologyRepository.remove(technology);
    }
}
