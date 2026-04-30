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

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(newComment);
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
}
