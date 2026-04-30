import { Injectable } from '@nestjs/common';
import { CreateTechnologyProjectDto } from './dto/create-technology_project.dto';
import { UpdateTechnologyProjectDto } from './dto/update-technology_project.dto';

@Injectable()
export class TechnologyProjectService {
  create(createTechnologyProjectDto: CreateTechnologyProjectDto) {
    return 'This action adds a new technologyProject';
  }

  findAll() {
    return `This action returns all technologyProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} technologyProject`;
  }

  update(id: number, updateTechnologyProjectDto: UpdateTechnologyProjectDto) {
    return `This action updates a #${id} technologyProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyProject`;
  }
}
