import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LabelsService {
  constructor(@InjectRepository(Label) private readonly labelRepository: Repository<Label>) { }

  async create(createLabelDto: CreateLabelDto): Promise<Label> {
    const { nameTag } = createLabelDto;
    const existingLabel = await this.labelRepository.findOne({ where: { nameTag } });

    if (existingLabel) {
      throw new ConflictException(`La etiqueta '${nameTag}' ya existe`);
    }

    const newLabel = this.labelRepository.create(createLabelDto);
    return await this.labelRepository.save(newLabel);
  }

  async findAll(): Promise<Label[]> {
    return await this.labelRepository.find({
      order: { nameTag: 'ASC'}
    });
  }

  async findOne(id: string): Promise<Label> {
    const label = await this.labelRepository.findOne({ where: { idLabel: id }});

    if (!label) throw new NotFoundException('Etiqueta no encontrada');
    return label;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    return `This action updates a #${id} label`;
  }

  async remove(id: string): Promise<void> {
    const label = await this.findOne(id);
    await this.labelRepository.remove(label);
  }
}
