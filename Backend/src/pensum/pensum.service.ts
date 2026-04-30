import { Injectable } from '@nestjs/common';
import { CreatePensumDto } from './dto/create-pensum.dto';
import { UpdatePensumDto } from './dto/update-pensum.dto';

@Injectable()
export class PensumService {
  create(createPensumDto: CreatePensumDto) {
    return 'This action adds a new pensum';
  }

  findAll() {
    return `This action returns all pensum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pensum`;
  }

  update(id: number, updatePensumDto: UpdatePensumDto) {
    return `This action updates a #${id} pensum`;
  }

  remove(id: number) {
    return `This action removes a #${id} pensum`;
  }
}
