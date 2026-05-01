import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  async create(createCommentDto: CreateCommentDto) {
    try {
      const result = await this.commentRepository.insert({
        content: createCommentDto.content,
        qualityScore: 0,
        publication: { id: createCommentDto.idPublication } as any,
        user: { id: createCommentDto.idUser } as any,
      });

      return {
        idComment: result.identifiers[0].idComment,
        ...createCommentDto,
        qualityScore: 0
      };
    } catch (error) {
      console.error("Error al persistir el comentario en la DB:", error);
      throw error;
    }
  }

  async findAll() {
    return await this.commentRepository.find({
      relations: ['user'],
      order: { qualityScore: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { idComment: id },
      relations: ['user', 'publication'],
    });

    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);

    if (Object.keys(updateCommentDto).length === 0) {
      return comment;
    }

    this.commentRepository.merge(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
    return { deleted: true };
  }

  async findByPublication(idPublication: string) {
    return await this.commentRepository.find({
      where: {
        publication: { id: idPublication }
      },
      relations: ['user'],
      order: { qualityScore: 'DESC' },
    });
  }

  async rate(id: string, score: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.qualityScore = score;

    return await this.commentRepository.save(comment);
  }
}
