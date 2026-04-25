import { Injectable } from '@nestjs/common';
import { CreateTagPublicationDto } from './dto/create-tag_publication.dto';
import { UpdateTagPublicationDto } from './dto/update-tag_publication.dto';

@Injectable()
export class TagPublicationsService {
  create(createTagPublicationDto: CreateTagPublicationDto) {
    return 'This action adds a new tagPublication';
  }

  findAll() {
    return `This action returns all tagPublications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagPublication`;
  }

  update(id: number, updateTagPublicationDto: UpdateTagPublicationDto) {
    return `This action updates a #${id} tagPublication`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagPublication`;
  }
}
