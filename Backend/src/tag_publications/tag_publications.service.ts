import { ConflictException, Injectable } from '@nestjs/common';

import { UpdateTagPublicationDto } from './dto/update-tag_publication.dto';
import { CreatePublicationTagDto } from './dto/create-tag_publication.dto';
import { PublicationTag } from './entities/tag_publication.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagPublicationsService {
  constructor(
    @InjectRepository(PublicationTag)
    private readonly tagPubRepository: Repository<PublicationTag>,
  ) {}

  async create(createDto: CreatePublicationTagDto) {
    try {
      const newTagPub = this.tagPubRepository.create(createDto);
      return await this.tagPubRepository.save(newTagPub);
    } catch (error) {
      if (error) {
        throw new ConflictException('Esta etiqueta ya está asignada a la publicación');
      }
      throw error;
    }
  }

  async findByPublication(id_publicacion: string) {
    return await this.tagPubRepository.find({
      where: { idPublication: id_publicacion },
      relations: ['tag'],
    });
  }

  async remove(idPublication: string, idLabel: string) {
    return await this.tagPubRepository.delete({ idPublication, idLabel });
  }
}