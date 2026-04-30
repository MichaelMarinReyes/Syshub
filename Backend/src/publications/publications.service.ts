import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publication } from './entities/publication.entity';
import { In, Repository } from 'typeorm';
import { Label } from '@/labels/entities/label.entity';
import { VotePublicationDto } from './dto/vote-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(@InjectRepository(Publication)
  private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>
  ) { }

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const { tagIds, ...publicationData } = createPublicationDto;
    const newPublication = this.publicationRepository.create(publicationData);

    if (tagIds && tagIds.length > 0) {
      const labels = await this.labelRepository.findBy({
        idLabel: In(tagIds)
      });

      if (labels.length != tagIds.length) {
        throw new NotFoundException('No se encontró la etiquta');
      }
      newPublication.tags = labels;
    }
    return await this.publicationRepository.save(newPublication);
  }

  async findAll() {
    return await this.publicationRepository.find({
      relations: ['tags', 'user']
    });
  }

  async findOne(id: string): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id: id as any },
      relations: [
        'user',
        'user.role',
        'course',
        'tags',
        'comments',
        'comments.user',
        'comments.user.role'
      ]
    });

    if (!publication) {
      throw new NotFoundException(`La publicación con ID ${id} no existe`);
    }

    return publication;
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    const { tagIds, ...updateData } = updatePublicationDto;
    const publication = await this.findOne(id);

    this.publicationRepository.merge(publication, updateData);

    if (tagIds) {
      const labels = await this.labelRepository.findBy({
        idLabel: In(tagIds),
      });

      if (labels.length !== tagIds.length) {
        throw new NotFoundException('Una o más etiquetas nuevas no existen');
      }

      publication.tags = labels;
    }

    return await this.publicationRepository.save(publication);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const publication = await this.findOne(id);

    await this.publicationRepository.remove(publication);

    return { deleted: true };
  }

  async vote(id: string, voteDto: VotePublicationDto): Promise<{ message: string; currentVotes: number }> {
    const publication = await this.publicationRepository.findOne({ where: { id } });

    if (!publication) {
      throw new NotFoundException(`No se encontró la publicación para puntuar`);
    }

    // Cambiar el votes por el nombre de la columna
    await this.publicationRepository.increment({ id }, 'votes', voteDto.stars);
/*
    const updatedPublication = await this.publicationRepository.findOne({
      where: { id },
      select: ['id', 'votes']
    });*/

    return {
      message: `Has puntuado con ${voteDto.stars} estrellas`,
      //currentVotes: updatedPublication.votes,
      currentVotes: 0
    };
  }
}
